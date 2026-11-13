import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import * as Contacts from 'expo-contacts';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type ContactRow = {
  id: string;
  name: string;
  phone: string;
};

type Capture = {
  uri: string;
  kind: 'photo' | 'video';
};

export function DeviceScreen() {
  const [tab, setTab] = useState<'contacts' | 'camera'>('contacts');

  return (
    <View style={styles.screen}>
      <View style={styles.tabs}>
        <Pressable accessibilityRole="button" onPress={() => setTab('contacts')} style={[styles.tab, tab === 'contacts' && styles.tabActive]}>
          <Text style={[styles.tabText, tab === 'contacts' && styles.tabTextActive]}>კონტაქტები</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => setTab('camera')} style={[styles.tab, tab === 'camera' && styles.tabActive]}>
          <Text style={[styles.tabText, tab === 'camera' && styles.tabTextActive]}>კამერა</Text>
        </Pressable>
      </View>
      {tab === 'contacts' ? <ContactsPane /> : <CameraPane />}
    </View>
  );
}

function ContactsPane() {
  const [permission, setPermission] = useState<Awaited<ReturnType<typeof Contacts.getPermissionsAsync>> | null>(null);
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    Contacts.getPermissionsAsync().then(setPermission);
  }, []);

  async function requestAccess() {
    const response = await Contacts.requestPermissionsAsync();
    setPermission(response);
    if (response.granted) {
      await loadContacts();
    }
  }

  async function loadContacts() {
    const result = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
    });
    setContacts(
      result.data.map((contact) => ({
        id: contact.id ?? contact.name ?? Math.random().toString(),
        name: contact.name || 'უსახელო',
        phone: contact.phoneNumbers?.[0]?.number || '',
      })),
    );
  }

  useEffect(() => {
    if (permission?.granted) {
      loadContacts();
    }
  }, [permission?.granted]);

  if (!permission || permission.status === 'undetermined') {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>კონტაქტების სანახავად საჭიროა ნებართვა.</Text>
        <Pressable accessibilityRole="button" onPress={requestAccess} style={styles.primary}>
          <Text style={styles.primaryText}>ნებართვის მოთხოვნა</Text>
        </Pressable>
      </View>
    );
  }

  if (!permission.granted) {
    return <Denied message="კონტაქტებზე წვდომა უარყოფილია. სიის სანახავად ჩართეთ ნებართვა პარამეტრებში." />;
  }

  const needle = query.trim().toLowerCase();
  const visible = contacts.filter(
    (contact) => contact.name.toLowerCase().includes(needle) || contact.phone.toLowerCase().includes(needle),
  );

  return (
    <View style={styles.flex}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="ძიება სახელით ან ნომრით"
        style={styles.search}
      />
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.contact}>
            <View style={styles.avatar}>
              <Text style={styles.initials}>{initials(item.name)}</Text>
            </View>
            <View style={styles.flex}>
              <Highlight text={item.name} query={query} />
              <Highlight text={item.phone || 'ნომერი არ არის'} query={query} muted />
            </View>
          </View>
        )}
      />
    </View>
  );
}

function CameraPane() {
  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCamera] = useCameraPermissions();
  const [microphonePermission, requestMicrophone] = useMicrophonePermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [mode, setMode] = useState<'picture' | 'video'>('picture');
  const [recording, setRecording] = useState(false);
  const [capture, setCapture] = useState<Capture | null>(null);

  if (!cameraPermission || !microphonePermission) {
    return null;
  }

  if (!cameraPermission.granted || (mode === 'video' && !microphonePermission.granted && microphonePermission.status === 'denied')) {
    if (cameraPermission.status === 'denied' || microphonePermission.status === 'denied') {
      return <Denied message="კამერაზე ან მიკროფონზე წვდომა უარყოფილია. გადაღებისთვის ჩართეთ ნებართვა პარამეტრებში." />;
    }
    return (
      <View style={styles.center}>
        <Text style={styles.message}>კამერის გამოსაყენებლად საჭიროა ნებართვა.</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            requestCamera();
            requestMicrophone();
          }}
          style={styles.primary}>
          <Text style={styles.primaryText}>ნებართვის მოთხოვნა</Text>
        </Pressable>
      </View>
    );
  }

  if (capture) {
    return (
      <View style={styles.flex}>
        {capture.kind === 'photo' ? (
          <Image source={{ uri: capture.uri }} style={styles.preview} />
        ) : (
          <View style={styles.preview}>
            <Text style={styles.previewLabel}>ვიდეო მზადაა შესანახად</Text>
          </View>
        )}
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" onPress={() => setCapture(null)} style={styles.secondary}>
            <Text style={styles.secondaryText}>თავიდან</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => saveCapture(capture)} style={styles.primary}>
            <Text style={styles.primaryText}>შენახვა გალერეაში</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <CameraView ref={cameraRef} style={styles.flex} facing={facing} mode={mode} />
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" onPress={() => setMode(mode === 'picture' ? 'video' : 'picture')} style={styles.secondary}>
          <Text style={styles.secondaryText}>{mode === 'picture' ? 'ფოტო' : 'ვიდეო'}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => setFacing(facing === 'back' ? 'front' : 'back')} style={styles.secondary}>
          <Text style={styles.secondaryText}>გადართვა</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            if (recording) {
              cameraRef.current?.stopRecording();
              return;
            }
            captureMedia(cameraRef.current, mode, setRecording, setCapture);
          }}
          style={styles.primary}>
          <Text style={styles.primaryText}>{recording ? 'გაჩერება' : mode === 'picture' ? 'გადაღება' : 'ჩაწერა'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

async function captureMedia(
  camera: CameraView | null,
  mode: 'picture' | 'video',
  setRecording: (value: boolean) => void,
  setCapture: (value: Capture) => void,
) {
  if (!camera) {
    return;
  }
  if (mode === 'picture') {
    const picture = await camera.takePictureAsync();
    if (picture?.uri) {
      setCapture({ uri: picture.uri, kind: 'photo' });
    }
    return;
  }
  setRecording(true);
  const video = await camera.recordAsync({ maxDuration: 8 });
  setRecording(false);
  if (video?.uri) {
    setCapture({ uri: video.uri, kind: 'video' });
  }
}

async function saveCapture(capture: Capture) {
  const permission = await MediaLibrary.requestPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('ნებართვა', 'გალერეაში შესანახად ჩართეთ ფოტოების ნებართვა.');
    return;
  }
  await MediaLibrary.saveToLibraryAsync(capture.uri);
  Alert.alert('შენახულია', 'ფაილი გალერეაში დაემატა.');
}

function Denied({ message }: { message: string }) {
  return (
    <View style={styles.center}>
      <Text style={styles.message}>{message}</Text>
      <Pressable accessibilityRole="button" onPress={() => Linking.openSettings()} style={styles.primary}>
        <Text style={styles.primaryText}>პარამეტრების გახსნა</Text>
      </Pressable>
    </View>
  );
}

function Highlight({ text, query, muted }: { text: string; query: string; muted?: boolean }) {
  const needle = query.trim();
  const index = needle ? text.toLowerCase().indexOf(needle.toLowerCase()) : -1;
  if (index < 0) {
    return <Text style={muted ? styles.phone : styles.name}>{text}</Text>;
  }
  return (
    <Text style={muted ? styles.phone : styles.name}>
      {text.slice(0, index)}
      <Text style={styles.hit}>{text.slice(index, index + needle.length)}</Text>
      {text.slice(index + needle.length)}
    </Text>
  );
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
  },
  tab: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F4F2F8',
  },
  tabActive: {
    backgroundColor: '#6B2FD6',
  },
  tabText: {
    fontWeight: '700',
    color: '#1C1C1E',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  message: {
    fontSize: 16,
    color: '#3A3550',
    textAlign: 'center',
  },
  search: {
    margin: 12,
    borderWidth: 1,
    borderColor: '#E6E6EA',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  contact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E9E1FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#3C178C',
    fontWeight: '700',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  phone: {
    fontSize: 14,
    color: '#6F6888',
  },
  hit: {
    backgroundColor: '#E9E1FB',
    color: '#6B2FD6',
  },
  preview: {
    flex: 1,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
  },
  primary: {
    flex: 1,
    backgroundColor: '#6B2FD6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  secondary: {
    flex: 1,
    backgroundColor: '#E9E1FB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#3C178C',
    fontWeight: '700',
  },
});
