import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { COURSES } from '@/data/courses';
import type { CourseStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<CourseStackParamList, 'CourseList'>;

export function CourseListScreen({ navigation }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      {COURSES.map((course) => (
        <Pressable
          key={course.id}
          accessibilityRole="button"
          onPress={() => navigation.navigate('CourseDetail', { id: course.id, title: course.title })}
          style={styles.card}>
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.meta}>
            {course.lecturer} · {course.ects} ECTS
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F6F3FC',
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  meta: {
    fontSize: 13,
    color: '#6F6888',
  },
});
