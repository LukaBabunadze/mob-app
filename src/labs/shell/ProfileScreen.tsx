import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { TabParamList } from '@/navigation/types';

type Props = BottomTabScreenProps<TabParamList, 'Profile'>;

const MAIN_COURSE = {
  id: 'mobile',
  title: 'მობილური აპლიკაციების დაპროგრამება',
};

export function ProfileScreen({ navigation }: Props) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>პროფილი</Text>
      <Text style={styles.name}>ლუკა ბაბუნაძე</Text>
      <Text style={styles.meta}>სტუდენტი · შემოდგომის სემესტრი</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() =>
          navigation.navigate('Courses', {
            screen: 'CourseDetail',
            params: MAIN_COURSE,
          })
        }
        style={styles.button}>
        <Text style={styles.buttonText}>ჩემი მთავარი კურსი</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  name: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '700',
  },
  meta: {
    color: '#6F6888',
    fontSize: 15,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#6B2FD6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
