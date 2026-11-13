import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Controls } from './Controls';
import { LapList } from './LapList';
import { LapStats } from './LapStats';
import { TimeDisplay } from './TimeDisplay';

export function StopwatchScreen() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const accumulatedRef = useRef(0);
  const lastLapTotalRef = useRef(0);

  useEffect(() => {
    if (!running) {
      return;
    }

    startTimeRef.current = Date.now() - accumulatedRef.current;
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 10);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running]);

  const onStart = useCallback(() => {
    accumulatedRef.current = 0;
    lastLapTotalRef.current = 0;
    startTimeRef.current = Date.now();
    setElapsed(0);
    setLaps([]);
    setRunning(true);
  }, []);

  const onPause = useCallback(() => {
    accumulatedRef.current = Date.now() - startTimeRef.current;
    setElapsed(accumulatedRef.current);
    setRunning(false);
  }, []);

  const onResume = useCallback(() => {
    setRunning(true);
  }, []);

  const onLap = useCallback(() => {
    const total = Date.now() - startTimeRef.current;
    const split = total - lastLapTotalRef.current;
    lastLapTotalRef.current = total;
    setLaps((current) => [split, ...current]);
  }, []);

  const onReset = useCallback(() => {
    accumulatedRef.current = 0;
    lastLapTotalRef.current = 0;
    startTimeRef.current = 0;
    setElapsed(0);
    setLaps([]);
    setRunning(false);
  }, []);

  const stats = useMemo(() => {
    if (laps.length === 0) {
      return { best: null, worst: null, average: null };
    }
    const best = Math.min(...laps);
    const worst = Math.max(...laps);
    const average = laps.reduce((sum, lap) => sum + lap, 0) / laps.length;
    return { best, worst, average };
  }, [laps]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>სტოპწამზომი</Text>
        <TimeDisplay elapsed={elapsed} />
        <Controls
          running={running}
          hasTime={elapsed > 0 || laps.length > 0}
          onStart={onStart}
          onPause={onPause}
          onResume={onResume}
          onLap={onLap}
          onReset={onReset}
        />
        <LapStats best={stats.best} worst={stats.worst} average={stats.average} />
        <LapList laps={laps} best={stats.best} worst={stats.worst} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
  },
});
