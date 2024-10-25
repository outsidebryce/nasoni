import React, { useState } from 'react';
import { View, Text, Image, SafeAreaView, KeyboardAvoidingView, FlatList, TouchableOpacity, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import UserOverlay from '../components/UserOverlay'; // Add this line

// Import the SVG icons
import FountainIcon from '../assets/icons/fountain.svg';
import SprayIcon from '../assets/icons/spray.svg';
import StreamIcon from '../assets/icons/stream.svg';

type PresetItem = {
  id: string;
  title: string;
  temperature: number;
  mode: 'fountain' | 'spray' | 'stream';
};

const presets: PresetItem[] = [
  { id: '1', title: 'Hot Water', temperature: 105, mode: 'stream' },
  { id: '2', title: 'Cold Water', temperature: 65, mode: 'spray' },
  { id: '3', title: 'Brushing Teeth', temperature: 80, mode: 'fountain' },
  { id: '4', title: 'Washing Hands', temperature: 95, mode: 'stream' },
  { id: '5', title: 'Grooming', temperature: 100, mode: 'spray' },
  { id: '6', title: 'Cleaning', temperature: 85, mode: 'fountain' },
];

const ModeIcons = {
  fountain: FountainIcon,
  spray: SprayIcon,
  stream: StreamIcon,
};

const getColor = (temp: number) => {
  if (temp > 95) return '#F03338'; // HOT_RED
  if (temp >= 70) return '#FB923C'; // WARM_ORANGE
  return '#76CCEB'; // COOL_BLUE
};

export default function Home() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const tabBarHeight = 60;
  const headerHeight = 60;
  const contentPadding = 20;

  const availableHeight = height - insets.top - insets.bottom - tabBarHeight - headerHeight;
  const itemWidth = (width - contentPadding * 3) / 2;
  const itemHeight = (availableHeight - contentPadding * 4) / 3;

  const handlePresetSelect = (preset: PresetItem) => {
    setSelectedPresetId(preset.id);
    // Navigate to the Remote screen and pass the selected preset
    router.push({
      pathname: '/remote',
      params: { selectedPreset: JSON.stringify(preset) }
    });
    console.log('Navigating with preset:', preset);
  };

  const renderItem = ({ item }: { item: PresetItem }) => {
    const IconComponent = ModeIcons[item.mode];
    const isSelected = selectedPresetId === item.id;
    const temperatureColor = getColor(item.temperature);

    return (
      <TouchableOpacity 
        style={[
          styles.item, 
          { width: itemWidth, height: itemHeight },
          isSelected && styles.selectedItem,
          isSelected && { borderColor: temperatureColor }
        ]}
        onPress={() => handlePresetSelect(item)}
      >
        <View style={styles.itemContent}>
          <View style={styles.bottomLeftContainer}>
            <View style={styles.iconContainer}>
              <IconComponent width={48} height={48} fill="black" />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <View style={[styles.temperatureChip, { backgroundColor: temperatureColor }]}>
              <Ionicons name="thermometer-outline" size={16} color="white" />
              <Text style={styles.temperatureText}>{item.temperature}°</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <TouchableOpacity onPress={() => setIsOverlayVisible(true)}>
          <View style={[styles.userSection, { height: headerHeight }]}>
            <Text style={styles.greeting}>Hello Rebecca</Text>
            <Image 
              source={{uri: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ft4.ftcdn.net%2Fjpg%2F03%2F30%2F25%2F97%2F360_F_330259751_tGPEAq5F5bjxkkliGrb97X2HhtXBDc9x.jpg&f=1&nofb=1'}}
              style={styles.avatar}
            />
          </View>
        </TouchableOpacity>
        <View style={[styles.presetsContainer, { height: availableHeight }]}>
          <FlatList
            data={presets}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
          />
        </View>
      </KeyboardAvoidingView>
      <UserOverlay 
        isVisible={isOverlayVisible} 
        onClose={() => setIsOverlayVisible(false)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'normal',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  presetsContainer: {
    padding: 20,
  },
  listContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  item: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedItem: {
    borderWidth: 2,
  },
  itemContent: {
    flex: 1,
    justifyContent: 'flex-end', // Aligns content to the bottom
    alignItems: 'flex-start', // Aligns content to the left
  },
  bottomLeftContainer: {
    alignItems: 'flex-start', // Ensures all items are left-aligned
  },
  iconContainer: {
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'normal',
    marginBottom: 5,
  },
  temperatureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderRadius: 12,
  },
  temperatureText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  },
});
