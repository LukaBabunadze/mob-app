import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import CatalogScreen from '@/app/catalog';
import { NotesScreen } from '@/labs/notes/NotesScreen';
import { StopwatchScreen } from '@/labs/stopwatch/StopwatchScreen';

export function HomeScreen() {
  const [showStopwatch, setShowStopwatch] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  if (showStopwatch || showCatalog || showNotes) {
    return (
      <View style={styles.flex}>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setShowStopwatch(false);
            setShowCatalog(false);
            setShowNotes(false);
          }}
          style={styles.back}>
          <Text style={styles.backText}>უკან</Text>
        </Pressable>
        {showStopwatch ? <StopwatchScreen /> : showCatalog ? <CatalogScreen /> : <NotesScreen />}
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>მთავარი</Text>
      <Text style={styles.body}>კურსები, პროფილი და ლაბორატორიული ეკრანები ერთ აპშია.</Text>
      <Pressable accessibilityRole="button" onPress={() => setShowNotes(true)} style={styles.button}>
        <Text style={styles.buttonText}>ჩანაწერები</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => setShowCatalog(true)} style={styles.button}>
        <Text style={styles.buttonText}>კურსების კატალოგი</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => setShowStopwatch(true)} style={styles.button}>
        <Text style={styles.buttonText}>სტოპწამზომი</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  body: {
    fontSize: 16,
    color: '#6F6888',
  },
  button: {
    backgroundColor: '#6B2FD6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  back: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  backText: {
    color: '#6B2FD6',
    fontWeight: '700',
  },
});
