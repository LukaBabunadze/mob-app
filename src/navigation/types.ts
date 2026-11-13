import type { NavigatorScreenParams } from '@react-navigation/native';

export type CourseStackParamList = {
  CourseList: undefined;
  CourseDetail: {
    id: string;
    title: string;
  };
};

export type TabParamList = {
  Home: undefined;
  Courses: NavigatorScreenParams<CourseStackParamList>;
  Profile: undefined;
};

export type DrawerParamList = {
  Main: NavigatorScreenParams<TabParamList>;
  Settings: undefined;
  About: undefined;
  Logout: undefined;
};
