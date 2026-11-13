import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CourseCard } from '@/components/course-card';
import { theme } from '@/constants/catalog-theme';
import { COURSES, FILTERS, type FilterName } from '@/data/courses';

function columnCount(width: number) {
  if (width < 600) {
    return 2;
  }
  if (width < 1000) {
    return 3;
  }
  return 4;
}

export default function CatalogScreen() {
  const { width } = useWindowDimensions();
  const columns = columnCount(width);
  const wide = width >= 600;
  const [filter, setFilter] = useState<FilterName>('ყველა');
  const [search, setSearch] = useState('');

  const query = search.trim().toLowerCase();
  const visible = COURSES.filter((course) => {
    const matchesFilter = filter === 'ყველა' || course.category === filter;
    const matchesSearch =
      query.length === 0 ||
      course.title.toLowerCase().includes(query) ||
      course.lecturer.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  const cardWidthStyle =
    columns === 2 ? styles.cardWidth2 : columns === 3 ? styles.cardWidth3 : styles.cardWidth4;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={wide ? styles.headerWide : styles.headerNarrow}>
          <View style={styles.titleBlock}>
            <Text style={styles.screenTitle}>კურსების კატალოგი</Text>
            <Text style={styles.subtitle}>შემოდგომის სემესტრი · {visible.length} კურსი</Text>
          </View>
          <View style={[styles.search, wide ? styles.searchWide : styles.searchNarrow]}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="ძიება კურსებში"
              placeholderTextColor={theme.color.muted}
              style={styles.searchInput}
              testID="search-input"
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}>
          {FILTERS.map((name) => {
            const selected = filter === name;
            return (
              <Pressable
                key={name}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setFilter(name)}
                style={selected ? styles.filterSelected : styles.filterIdle}>
                <Text style={selected ? styles.filterTextSelected : styles.filterText}>{name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.grid}>
          {visible.map((course) => (
            <CourseCard key={course.id} course={course} widthStyle={cardWidthStyle} />
          ))}
        </View>
        {visible.length === 0 ? <Text style={styles.empty}>კურსი ვერ მოიძებნა</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.color.background,
  },
  content: {
    padding: theme.space.screen,
    gap: theme.space.gap,
    paddingBottom: 32,
  },
  headerNarrow: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    gap: theme.space.gap,
  },
  headerWide: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.space.gap,
  },
  titleBlock: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 2,
    flexShrink: 1,
  },
  screenTitle: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
    color: theme.color.text,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.color.muted,
  },
  search: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: theme.radius.search,
    paddingHorizontal: 12,
    backgroundColor: theme.color.background,
    minHeight: 44,
  },
  searchNarrow: {
    alignSelf: 'stretch',
  },
  searchWide: {
    flexGrow: 1,
    flexShrink: 1,
    maxWidth: 360,
  },
  searchIcon: {
    color: theme.color.muted,
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: theme.color.text,
    paddingVertical: 8,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.space.gap,
    paddingRight: theme.space.screen,
  },
  filterIdle: {
    backgroundColor: theme.color.chip,
    borderRadius: theme.radius.chip,
    paddingHorizontal: theme.space.chipX,
    paddingVertical: theme.space.chipY,
  },
  filterSelected: {
    backgroundColor: theme.color.active,
    borderRadius: theme.radius.chip,
    paddingHorizontal: theme.space.chipX,
    paddingVertical: theme.space.chipY,
  },
  filterText: {
    color: theme.color.text,
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextSelected: {
    color: theme.color.white,
    fontSize: 14,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: theme.space.gap,
  },
  cardWidth2: {
    width: '48%',
  },
  cardWidth3: {
    width: '31%',
  },
  cardWidth4: {
    width: '23%',
  },
  empty: {
    color: theme.color.muted,
    fontSize: 15,
  },
});
