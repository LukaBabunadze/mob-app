import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { theme } from '@/constants/catalog-theme';
import type { Course } from '@/data/courses';

type CourseCardProps = {
  course: Course;
  widthStyle: StyleProp<ViewStyle>;
};

export function CourseCard({ course, widthStyle }: CourseCardProps) {
  return (
    <View style={[styles.card, widthStyle]}>
      <View style={[styles.cover, coverStyles[course.cover]]}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{course.ects} ECTS</Text>
        </View>
        <Text style={styles.icon}>{course.icon}</Text>
      </View>
      <View style={styles.body}>
        <Text numberOfLines={2} style={styles.title}>
          {course.title}
        </Text>
        <Text style={styles.lecturer}>{course.lecturer}</Text>
        <View style={styles.meta}>
          <Text style={styles.rating}>★ {course.rating.toFixed(1)}</Text>
          <Text style={styles.weeks}>{course.weeks} კვირა</Text>
        </View>
      </View>
    </View>
  );
}

const coverStyles = StyleSheet.create({
  violet: { backgroundColor: theme.color.coverViolet },
  deep: { backgroundColor: theme.color.coverDeep },
  soft: { backgroundColor: theme.color.coverSoft },
  mid: { backgroundColor: theme.color.coverMid },
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.color.background,
    borderRadius: theme.radius.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.color.border,
  },
  cover: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: theme.radius.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: theme.color.badge,
    borderRadius: theme.radius.chip,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: theme.color.white,
    fontSize: 11,
    fontWeight: '700',
  },
  icon: {
    color: theme.color.white,
    fontSize: 32,
    fontWeight: '700',
  },
  body: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 4,
  },
  title: {
    fontSize: theme.font.cardTitle,
    lineHeight: 18,
    minHeight: 36,
    fontWeight: '700',
    color: theme.color.text,
  },
  lecturer: {
    fontSize: theme.font.lecturer,
    lineHeight: 16,
    color: theme.color.muted,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  rating: {
    color: theme.color.star,
    fontSize: 12,
    fontWeight: '700',
  },
  weeks: {
    color: theme.color.muted,
    fontSize: 12,
  },
});
