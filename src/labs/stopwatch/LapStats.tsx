import { StyleSheet, Text, View } from 'react-native';

import { formatTime } from './format-time';

type LapStatsProps = {
  best: number | null;
  worst: number | null;
  average: number | null;
};

export function LapStats({ best, worst, average }: LapStatsProps) {
  return (
    <View style={styles.row}>
      <Stat label="საუკეთესო" value={best} color="#1B8A4A" />
      <Stat label="საშუალო" value={average} color="#6F6888" />
      <Stat label="ყველაზე ნელი" value={worst} color="#D92D20" />
    </View>
  );
}

function Stat({ label, value, color }: { label: string; value: number | null; color: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color }]}>{value == null ? '—' : formatTime(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 28,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: '#6F6888',
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
