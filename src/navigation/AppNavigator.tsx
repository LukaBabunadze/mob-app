import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerToggleButton } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CourseDetailScreen } from '@/labs/courses/CourseDetailScreen';
import { useAppTheme } from '@/labs/theme/ThemeProvider';
import { CourseListScreen } from '@/labs/courses/CourseListScreen';
import { AboutScreen, LogoutScreen, SettingsScreen } from '@/labs/shell/SimpleScreen';
import { HomeScreen } from '@/labs/shell/HomeScreen';
import { ProfileScreen } from '@/labs/shell/ProfileScreen';
import type { CourseStackParamList, DrawerParamList, TabParamList } from '@/navigation/types';

const Drawer = createDrawerNavigator<DrawerParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<CourseStackParamList>();

function navigationTheme(mode: 'light' | 'dark') {
  const dark = mode === 'dark';
  return {
    ...DefaultTheme,
    dark,
    colors: {
      ...DefaultTheme.colors,
      background: dark ? '#111111' : '#FFFFFF',
      card: dark ? '#1C1C1E' : '#FFFFFF',
      text: dark ? '#FFFFFF' : '#1C1C1E',
      border: dark ? '#2C2C2E' : '#E6E6EA',
      primary: '#6B2FD6',
    },
  };
}

function CourseStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: '#6B2FD6' }}>
      <Stack.Screen
        name="CourseList"
        component={CourseListScreen}
        options={{
          title: 'კურსები',
          headerLeft: () => <DrawerToggleButton tintColor="#6B2FD6" />,
        }}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={({ route }) => ({ title: route.params.id })}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6B2FD6',
        tabBarInactiveTintColor: '#8E8E93',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'მთავარი',
          headerShown: true,
          headerLeft: () => <DrawerToggleButton tintColor="#6B2FD6" />,
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Courses"
        component={CourseStack}
        options={{
          title: 'კურსები',
          tabBarIcon: ({ color, size }) => <Ionicons name="book" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'პროფილი',
          headerShown: true,
          headerLeft: () => <DrawerToggleButton tintColor="#6B2FD6" />,
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { mode } = useAppTheme();

  return (
    <NavigationContainer theme={navigationTheme(mode)}>
      <Drawer.Navigator
        screenOptions={{
          headerTintColor: '#6B2FD6',
          drawerActiveTintColor: '#6B2FD6',
          swipeEnabled: true,
        }}>
        <Drawer.Screen name="Main" component={MainTabs} options={{ title: 'მთავარი', headerShown: false }} />
        <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: 'პარამეტრები' }} />
        <Drawer.Screen name="About" component={AboutScreen} options={{ title: 'შესახებ' }} />
        <Drawer.Screen name="Logout" component={LogoutScreen} options={{ title: 'გასვლა' }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
