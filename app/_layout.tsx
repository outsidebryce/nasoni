import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

function TabBarIcon({ name, color, label }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={name} size={24} color={color} />
      <Text style={{ color, fontSize: 12, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          let label;

          switch (route.name) {
            case 'index':
              iconName = focused ? 'home' : 'home-outline';
              label = 'Home';
              break;
            case 'statistics':
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
              label = 'Statistics';
              break;
            case 'remote':
              iconName = focused ? 'radio' : 'radio-outline';
              label = 'Remote';
              break;
            case 'devices':
              iconName = focused ? 'hardware-chip' : 'hardware-chip-outline';
              label = 'Devices';
              break;
            case 'settings':
              iconName = focused ? 'settings' : 'settings-outline';
              label = 'Settings';
              break;
            default:
              return null;
          }

          return <TabBarIcon name={iconName} color={color} label={label} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { height: 60 },
        tabBarItemStyle: { paddingVertical: 5 },
        tabBarLabel: () => null,
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', headerShown: false }} />
      <Tabs.Screen name="statistics" options={{ title: 'Statistics' }} />
      <Tabs.Screen name="remote" options={{ title: 'Remote' }} />
      <Tabs.Screen name="devices" options={{ title: 'Devices' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}