import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import RemoteIcon from '../assets/icons/remote-icon.svg';
import DevicesIcon from '../assets/icons/devices-icon.svg';
import { ThemeProvider } from './context/ThemeContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function TabBarIcon({ name, color, label }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={name} size={24} color={color} />
      <Text style={{ color, fontSize: 12, marginTop: 2, fontFamily: 'Inter-Regular' }}>{label}</Text>
    </View>
  );
}

export default function AppLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
        'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded) {
      // This tells the splash screen to hide immediately
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ThemeProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#000',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: styles.tabBar,
            tabBarShowLabel: false,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              headerShown: false,
              tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} label="Home" />,
            }}
          />
          <Tabs.Screen
            name="statistics"
            options={{
              title: 'Statistics',
              headerShown: false,
              tabBarIcon: ({ color }) => <TabBarIcon name="stats-chart" color={color} label="Statistics" />,
            }}
          />
          <Tabs.Screen
            name="remote"
            options={{
              title: 'Remote',
              headerShown: false,
              tabBarIcon: ({ color }) => (
                <View style={styles.centerTabItem}>
                  <RemoteIcon width={24} height={24} fill={color} />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="devices"
            options={{
              title: 'Devices',
              headerShown: false,
              tabBarIcon: ({ color }) => (
                <View style={{ alignItems: 'center' }}>
                  <DevicesIcon width={24} height={24} fill={color} />
                  <Text style={{ color, fontSize: 12, marginTop: 2 }}>Devices</Text>
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              headerShown: false,
              tabBarIcon: ({ color }) => <TabBarIcon name="settings" color={color} label="Settings" />,
            }}
          />
        </Tabs>
      </ThemeProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  centerTabItem: {
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
});
