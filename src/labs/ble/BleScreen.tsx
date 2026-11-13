import { useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BleManager, type Characteristic, type Device, type State } from 'react-native-ble-plx';

type ListedDevice = {
  id: string;
  name: string;
  rssi: number;
};

type ListedCharacteristic = {
  uuid: string;
  properties: string[];
  value: string | null;
};

type ListedService = {
  uuid: string;
  characteristics: ListedCharacteristic[];
};

const BATTERY_SERVICE = '0000180f-0000-1000-8000-00805f9b34fb';
const BATTERY_CHARACTERISTIC = '00002a19-0000-1000-8000-00805f9b34fb';

export function BleScreen() {
  const managerRef = useRef<BleManager | null>(null);
  const [nativeReady, setNativeReady] = useState(true);
  const [bluetoothState, setBluetoothState] = useState<State | 'unknown'>('unknown');
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState<ListedDevice[]>([]);
  const [status, setStatus] = useState('გათიშულია');
  const [services, setServices] = useState<ListedService[]>([]);
  const [connectedId, setConnectedId] = useState<string | null>(null);

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    try {
      const manager = new BleManager();
      managerRef.current = manager;
      subscription = manager.onStateChange((next) => setBluetoothState(next), true);
    } catch {
      setNativeReady(false);
    }
    return () => {
      subscription?.remove();
      managerRef.current?.stopDeviceScan();
      managerRef.current?.destroy();
    };
  }, []);

  async function askPermissions() {
    if (Platform.OS !== 'android') {
      setPermissionGranted(true);
      return true;
    }
    const version = typeof Platform.Version === 'number' ? Platform.Version : 0;
    if (version >= 31) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      const granted = Object.values(result).every((value) => value === PermissionsAndroid.RESULTS.GRANTED);
      setPermissionGranted(granted);
      return granted;
    }
    const fine = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    const granted = fine === PermissionsAndroid.RESULTS.GRANTED;
    setPermissionGranted(granted);
    return granted;
  }

  function stopScan() {
    managerRef.current?.stopDeviceScan();
    setScanning(false);
  }

  async function startScan() {
    const manager = managerRef.current;
    if (!manager) {
      return;
    }
    const allowed = permissionGranted ?? (await askPermissions());
    if (!allowed) {
      return;
    }
    setDevices([]);
    setScanning(true);
    manager.startDeviceScan(null, null, (error, device) => {
      if (error || !device) {
        return;
      }
      setDevices((current) => {
        const next = current.filter((item) => item.id !== device.id);
        next.push({
          id: device.id,
          name: device.name || device.localName || 'უცნობი მოწყობილობა',
          rssi: device.rssi ?? -100,
        });
        return next.sort((a, b) => b.rssi - a.rssi);
      });
    });
    setTimeout(stopScan, 10000);
  }

  async function connect(deviceId: string) {
    const manager = managerRef.current;
    if (!manager) {
      return;
    }
    stopScan();
    setStatus('უკავშირდება');
    setServices([]);
    try {
      const device = await manager.connectToDevice(deviceId);
      setConnectedId(device.id);
      setStatus('დაკავშირებულია');
      const discovered = await device.discoverAllServicesAndCharacteristics();
      setServices(await readServices(discovered));
    } catch {
      setStatus('გაითიშა');
      setConnectedId(null);
    }
  }

  async function disconnect() {
    if (!managerRef.current || !connectedId) {
      return;
    }
    await managerRef.current.cancelDeviceConnection(connectedId);
    setConnectedId(null);
    setServices([]);
    setStatus('გაითიშა');
  }

  if (!nativeReady) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Bluetooth</Text>
        <Text style={styles.body}>
          BLE მუშაობს მხოლოდ development build-ში. Expo Go-ში ეს მოდული არ არის.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>Bluetooth</Text>
      <Text style={styles.body}>მდგომარეობა: {bluetoothState}</Text>
      <Text style={styles.body}>ნებართვა: {permissionGranted == null ? 'შეუმოწმებელია' : permissionGranted ? 'ჩართულია' : 'უარყოფილია'}</Text>
      <Text style={styles.body}>კავშირი: {status}</Text>
      <View style={styles.row}>
        <Pressable accessibilityRole="button" onPress={askPermissions} style={styles.secondary}>
          <Text style={styles.secondaryText}>ნებართვა</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={scanning ? stopScan : startScan} style={styles.primary}>
          <Text style={styles.primaryText}>{scanning ? 'გაჩერება' : 'სკანირება'}</Text>
        </Pressable>
      </View>
      {devices.map((device) => (
        <Pressable key={device.id} onPress={() => connect(device.id)} style={styles.card}>
          <Text style={styles.cardTitle}>{device.name}</Text>
          <Text style={styles.meta}>{device.id}</Text>
          <Text style={styles.meta}>
            {device.rssi} dBm · {signalLabel(device.rssi)}
          </Text>
        </Pressable>
      ))}
      {connectedId ? (
        <Pressable accessibilityRole="button" onPress={disconnect} style={styles.secondary}>
          <Text style={styles.secondaryText}>გათიშვა</Text>
        </Pressable>
      ) : null}
      {services.map((service) => (
        <View key={service.uuid} style={styles.card}>
          <Text style={styles.cardTitle}>{service.uuid}</Text>
          {service.characteristics.map((characteristic) => (
            <Text key={characteristic.uuid} style={styles.meta}>
              {characteristic.uuid} · {characteristic.properties.join(', ') || '—'}
              {characteristic.value ? ` · ${characteristic.value}` : ''}
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

async function readServices(device: Device) {
  const services = await device.services();
  const listed: ListedService[] = [];
  for (const service of services) {
    const characteristics = await service.characteristics();
    listed.push({
      uuid: service.uuid,
      characteristics: await Promise.all(characteristics.map((characteristic) => describeCharacteristic(device, characteristic))),
    });
  }
  return listed;
}

async function describeCharacteristic(device: Device, characteristic: Characteristic): Promise<ListedCharacteristic> {
  const properties = [
    characteristic.isReadable ? 'READ' : '',
    characteristic.isWritableWithResponse || characteristic.isWritableWithoutResponse ? 'WRITE' : '',
    characteristic.isNotifiable || characteristic.isIndicatable ? 'NOTIFY' : '',
  ].filter(Boolean);
  let value: string | null = null;
  const isBattery = characteristic.uuid.toLowerCase() === BATTERY_CHARACTERISTIC && characteristic.serviceUUID.toLowerCase() === BATTERY_SERVICE;
  if (characteristic.isReadable && isBattery) {
    const read = await device.readCharacteristicForService(characteristic.serviceUUID, characteristic.uuid);
    const level = read.value ? firstByte(read.value) : null;
    value = level == null ? null : `${level}%`;
  }
  return { uuid: characteristic.uuid, properties, value };
}

function firstByte(base64: string) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const clean = base64.replace(/=+$/, '');
  let bits = 0;
  let count = 0;
  const bytes: number[] = [];
  for (const character of clean) {
    const value = alphabet.indexOf(character);
    if (value < 0) {
      continue;
    }
    bits = (bits << 6) | value;
    count += 6;
    if (count >= 8) {
      count -= 8;
      bytes.push((bits >> count) & 255);
    }
  }
  return bytes[0] ?? null;
}

function signalLabel(rssi: number) {
  if (rssi > -60) {
    return 'ძლიერი';
  }
  if (rssi > -80) {
    return 'საშუალო';
  }
  return 'სუსტი';
}

const styles = StyleSheet.create({
  screen: {
    padding: 16,
    gap: 10,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  body: {
    fontSize: 15,
    color: '#3A3550',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  card: {
    borderRadius: 16,
    backgroundColor: '#F6F3FC',
    padding: 14,
    gap: 4,
  },
  cardTitle: {
    fontWeight: '700',
    color: '#1C1C1E',
  },
  meta: {
    color: '#6F6888',
    fontSize: 12,
  },
  primary: {
    flex: 1,
    backgroundColor: '#6B2FD6',
    borderRadius: 12,
    paddingVertical: 12,
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
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#3C178C',
    fontWeight: '700',
  },
});
