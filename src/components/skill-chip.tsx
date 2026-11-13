import { StyleSheet, Text, View } from 'react-native';

type SkillChipProps = {
  label: string;
  level: string;
};

export function SkillChip({ label, level }: SkillChipProps) {
  return (
    <View style={styles.chip}>
      <Text style={styles.text}>
        {label} · {level}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: '#E9E1FB',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  text: {
    color: '#4C348C',
    fontSize: 13,
    fontWeight: '600',
  },
});
