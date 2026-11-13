import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type ControlsProps = {
  running: boolean;
  hasTime: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onLap: () => void;
  onReset: () => void;
};

function ControlsComponent({
  running,
  hasTime,
  onStart,
  onPause,
  onResume,
  onLap,
  onReset,
}: ControlsProps) {
  const secondaryLabel = running ? 'წრე' : 'განულება';
  const primaryLabel = running ? 'პაუზა' : hasTime ? 'გაგრძელება' : 'დაწყება';

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        disabled={!running && !hasTime}
        onPress={running ? onLap : onReset}
        style={[styles.button, styles.secondary, !running && !hasTime && styles.disabled]}>
        <Text style={styles.secondaryText}>{secondaryLabel}</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={running ? onPause : hasTime ? onResume : onStart}
        style={[styles.button, running ? styles.pause : styles.primary]}>
        <Text style={styles.primaryText}>{primaryLabel}</Text>
      </Pressable>
    </View>
  );
}

export const Controls = memo(ControlsComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingHorizontal: 24,
  },
  button: {
    flex: 1,
    minHeight: 64,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#6B2FD6',
  },
  pause: {
    backgroundColor: '#2E1466',
  },
  secondary: {
    backgroundColor: '#E9E1FB',
  },
  disabled: {
    opacity: 0.4,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryText: {
    color: '#3C178C',
    fontSize: 18,
    fontWeight: '700',
  },
});
