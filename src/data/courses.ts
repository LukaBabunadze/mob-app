export type CourseCategory = 'პროგრამირება' | 'დიზაინი' | 'ბიზნესი' | 'მონაცემები';

export type CoverName = 'violet' | 'deep' | 'soft' | 'mid';

export type Course = {
  id: string;
  title: string;
  lecturer: string;
  ects: number;
  rating: number;
  weeks: number;
  category: CourseCategory;
  icon: string;
  cover: CoverName;
};

export const FILTERS = ['ყველა', 'პროგრამირება', 'დიზაინი', 'ბიზნესი', 'მონაცემები'] as const;

export type FilterName = (typeof FILTERS)[number];

export const COURSES: Course[] = [
  {
    id: 'mobile',
    title: 'მობილური აპლიკაციების დაპროგრამება',
    lecturer: 'დ. გელაშვილი',
    ects: 6,
    rating: 4.9,
    weeks: 15,
    category: 'პროგრამირება',
    icon: '</>',
    cover: 'violet',
  },
  {
    id: 'devops',
    title: 'DevOps ტექნოლოგიები და ავტომატიზაცია',
    lecturer: 'ნ. კაპანაძე',
    ects: 6,
    rating: 4.7,
    weeks: 15,
    category: 'პროგრამირება',
    icon: '{ }',
    cover: 'deep',
  },
  {
    id: 'patterns',
    title: 'დიზაინის პატერნები',
    lecturer: 'თ. ბერიძე',
    ects: 6,
    rating: 4.8,
    weeks: 15,
    category: 'დიზაინი',
    icon: '◇',
    cover: 'soft',
  },
  {
    id: 'ux',
    title: 'UX კვლევის მეთოდები',
    lecturer: 'ა. ჯაფარიძე',
    ects: 5,
    rating: 4.6,
    weeks: 15,
    category: 'დიზაინი',
    icon: '○',
    cover: 'mid',
  },
  {
    id: 'marketing',
    title: 'ციფრული მარკეტინგი',
    lecturer: 'ბ. ხარაძე',
    ects: 5,
    rating: 4.5,
    weeks: 15,
    category: 'ბიზნესი',
    icon: '%',
    cover: 'violet',
  },
  {
    id: 'sql',
    title: 'მონაცემთა ბაზები',
    lecturer: 'ა. მელიძე',
    ects: 6,
    rating: 4.8,
    weeks: 15,
    category: 'მონაცემები',
    icon: 'SQL',
    cover: 'deep',
  },
  {
    id: 'algorithms',
    title: 'ალგორითმები და მონაცემთა სტრუქტურები',
    lecturer: 'გ. ნოზაძე',
    ects: 6,
    rating: 4.6,
    weeks: 15,
    category: 'პროგრამირება',
    icon: '</>',
    cover: 'mid',
  },
  {
    id: 'ui',
    title: 'ინტერფეისის დიზაინი',
    lecturer: 'მ. ხარაიშვილი',
    ects: 5,
    rating: 4.7,
    weeks: 15,
    category: 'დიზაინი',
    icon: '◇',
    cover: 'soft',
  },
  {
    id: 'projects',
    title: 'პროექტების მართვა',
    lecturer: 'ნ. ლომიძე',
    ects: 5,
    rating: 4.4,
    weeks: 15,
    category: 'ბიზნესი',
    icon: '%',
    cover: 'violet',
  },
  {
    id: 'analysis',
    title: 'მონაცემთა ანალიზი',
    lecturer: 'ს. კაპანაძე',
    ects: 6,
    rating: 4.5,
    weeks: 15,
    category: 'მონაცემები',
    icon: 'SQL',
    cover: 'soft',
  },
  {
    id: 'web-design',
    title: 'ვებ დიზაინი',
    lecturer: 'თ. მაისურაძე',
    ects: 5,
    rating: 4.3,
    weeks: 15,
    category: 'დიზაინი',
    icon: '○',
    cover: 'mid',
  },
  {
    id: 'digital-business',
    title: 'ციფრული ბიზნესი',
    lecturer: 'ლ. ბერიძე',
    ects: 6,
    rating: 4.2,
    weeks: 15,
    category: 'ბიზნესი',
    icon: '%',
    cover: 'deep',
  },
];
