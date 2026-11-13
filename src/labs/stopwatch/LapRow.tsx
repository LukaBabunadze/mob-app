import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { formatTime } from './format-time';

type LapRowProps = {
  index: number;
  time: number;
  isBest: boolean;
  isWorst: boolean;
};

function LapRowComponent({ index, time, isBest, isWorst }: LapRowProps) {
  console.log('LapRow render', index);
  const color = isBest ? '#1B8A4A' : isWorst ? '#D92D20' : '#1C1C1E';

  return (
    <View style={styles.row}>
      <Text style={[styles.cell, { color }]}>წრე {index}</Text>
      <Text style={[styles.cell, styles.time, { color }]}>{formatTime(time)}</Text>
    </View>
  );
}

export const LapRow = memo(LapRowComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEBF8',
  },
  cell: {
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    fontVariant: ['tabular-nums'],
  },
});
