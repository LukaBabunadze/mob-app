import { StyleSheet, View } from 'react-native';

import { LapRow } from './LapRow';

type LapListProps = {
  laps: number[];
  best: number | null;
  worst: number | null;
};

export function LapList({ laps, best, worst }: LapListProps) {
  const highlight = laps.length > 1;

  return (
    <View style={styles.list}>
      {laps.map((time, position) => {
        const index = laps.length - position;
        return (
          <LapRow
            key={`${index}-${time}`}
            index={index}
            time={time}
            isBest={highlight && time === best}
            isWorst={highlight && time === worst}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 12,
  },
});
