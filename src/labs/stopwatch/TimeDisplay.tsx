import { StyleSheet, Text, View } from 'react-native';

import { formatTime } from './format-time';

type TimeDisplayProps = {
  elapsed: number;
};

export function TimeDisplay({ elapsed }: TimeDisplayProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.time}>{formatTime(elapsed)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  time: {
    fontSize: 64,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: '#1C1C1E',
  },
});
