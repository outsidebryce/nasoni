import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, useWindowDimensions, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type PresetItem = {
  id: string;
  title: string;
  status: string;
  icon: string;
};

const presets: PresetItem[] = [
  { id: '1', title: 'Cold', status: 'Active', icon: 'snow-outline' },
  { id: '2', title: 'Hot', status: 'Inactive', icon: 'flame-outline' },
  { id: '3', title: 'Medication', status: 'Inactive', icon: 'medical-outline' },
  { id: '4', title: 'Grooming', status: 'Inactive', icon: 'cut-outline' },
  { id: '5', title: 'Cleaning', status: 'Inactive', icon: 'water-outline' },
  { id: '6', title: 'Brushing teeth', status: 'Inactive', icon: 'brush-outline' },
];

export default function Home() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60; // Adjust this value to match your tab bar height

  const containerHeight = height - insets.top - insets.bottom - tabBarHeight;
  const contentPadding = 20;
  const itemWidth = (width - contentPadding * 3) / 2;
  const itemHeight = (containerHeight - contentPadding * 5 - 60) / 3; // 60 is for the user section height

  const renderItem = ({ item }: { item: PresetItem }) => (
    <TouchableOpacity 
      style={[styles.item, { width: itemWidth, height: itemHeight }]}
      onPress={() => console.log(`Pressed ${item.title}`)}
    >
      <View style={styles.itemContent}>
        <Ionicons name={item.icon} size={32} color="#007AFF" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.status}>{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userSection}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ft4.ftcdn.net%2Fjpg%2F03%2F30%2F25%2F97%2F360_F_330259751_tGPEAq5F5bjxkkliGrb97X2HhtXBDc9x.jpg&f=1&nofb=1&ipt=d2f87438fb8344ee037121598fc2f144964136032e88b2275fea56ff66f2b355&ipo=images' }} // Replace with actual avatar URL
            style={styles.avatar}
          />
          <Text style={styles.greeting}>Hello Rebecca</Text>
        </View>
        <TouchableOpacity 
          style={styles.moonButton}
          onPress={() => console.log('Moon button pressed')}
        >
          <Ionicons name="moon-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <View style={[styles.presetsContainer, { height: containerHeight - 60 }]}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  moonButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4, // for Android
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
  },
  itemContent: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  icon: {
    marginBottom: 10,
  },
  textContainer: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  status: {
    fontSize: 12,
    color: 'gray',
  },
});