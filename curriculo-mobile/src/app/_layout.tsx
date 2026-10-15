import { DarkTheme, ThemeProvider } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui';
import type { IconName } from '@/components/ui';
import { palette } from '@/constants/palette';
import { PortfolioProvider } from '@/contexts/PortfolioContext';

const theme = { ...DarkTheme, colors: { ...DarkTheme.colors, primary: palette.blue, background: palette.background, card: palette.surface, text: palette.text, border: palette.border } };
const routes: { name: string; title: string; icon: IconName; activeIcon: IconName }[] = [
  { name: 'index', title: 'Início', icon: 'home-outline', activeIcon: 'home' },
  { name: 'sobre', title: 'Sobre', icon: 'person-outline', activeIcon: 'person' },
  { name: 'formacao', title: 'Formação', icon: 'school-outline', activeIcon: 'school' },
  { name: 'experiencias', title: 'Experiências', icon: 'briefcase-outline', activeIcon: 'briefcase' },
  { name: 'projetos', title: 'Projetos', icon: 'layers-outline', activeIcon: 'layers' },
];

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  return (
    <ThemeProvider value={theme}>
      <PortfolioProvider>
        <StatusBar style="light" />
        <Tabs screenOptions={{
          headerShown: false,
          sceneStyle: styles.scene,
          tabBarActiveTintColor: palette.blue,
          tabBarInactiveTintColor: palette.subtle,
          tabBarLabelPosition: 'below-icon',
          tabBarLabelStyle: styles.tabLabel,
          tabBarStyle: [styles.tabBar, { height: 66 + Math.max(insets.bottom, 10), paddingBottom: Math.max(insets.bottom, 10) }],
          tabBarItemStyle: styles.tabItem,
          tabBarHideOnKeyboard: true,
        }}>
          {routes.map((route) => <Tabs.Screen key={route.name} name={route.name} options={{ title: route.title, tabBarAccessibilityLabel: route.title, tabBarIcon: ({ color, focused }) => <Icon name={focused ? route.activeIcon : route.icon} color={color} size={21} /> }} />)}
        </Tabs>
      </PortfolioProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  scene: { backgroundColor: palette.background },
  tabBar: { backgroundColor: '#0D1321', borderTopColor: palette.border, paddingTop: 9, elevation: 0 },
  tabLabel: { fontSize: 10, fontWeight: '600', marginTop: 3 },
  tabItem: { paddingHorizontal: 0 },
});
