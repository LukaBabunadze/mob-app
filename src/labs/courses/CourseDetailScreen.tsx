import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { COURSES } from '@/data/courses';
import type { CourseStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<CourseStackParamList, 'CourseDetail'>;

export function CourseDetailScreen({ route }: Props) {
  const { id, title } = route.params;
  const course = COURSES.find((item) => item.id === id);

  return (
    <View style={styles.screen}>
      <Text style={styles.kicker}>ID: {id}</Text>
      <Text style={styles.title}>{course?.title ?? title}</Text>
      <Text style={styles.line}>ლექტორი: {course?.lecturer ?? '—'}</Text>
      <Text style={styles.line}>კრედიტი: {course ? `${course.ects} ECTS` : '—'}</Text>
      <Text style={styles.line}>შეფასება: {course ? course.rating.toFixed(1) : '—'}</Text>
      <Text style={styles.line}>ხანგრძლივობა: {course ? `${course.weeks} კვირა` : '—'}</Text>
      <Text style={styles.line}>კატეგორია: {course?.category ?? '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    gap: 10,
  },
  kicker: {
    color: '#6B2FD6',
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  line: {
    fontSize: 16,
    color: '#3A3550',
  },
});
