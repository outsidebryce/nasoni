import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StatusBar } from 'react-native';

// Import the local images
import DeviceFaucet from '../assets/images/Device-Faucet.png';
import DeviceAlexa from '../assets/images/Device-Alexa.png';
import DeviceRemote from '../assets/images/Device-Remote.png';

type DeviceItem = {
  id: string;
  name: string;
  image: number;
  connected: boolean;
};

const devices: DeviceItem[] = [
  { id: '1', name: 'Nasoni Faucet', image: DeviceFaucet, connected: true },
  { id: '2', name: 'Alexa Smart Home', image: DeviceAlexa, connected: true },
  { id: '3', name: 'Physical Remote', image: DeviceRemote, connected: true },
];

const DeviceItem = ({ name, image, connected }: DeviceItem) => (
  <View style={styles.deviceItem}>
    <Image source={image} style={styles.deviceImage} />
    <View style={styles.deviceInfo}>
      <Text style={styles.deviceName}>{name}</Text>
      <View style={styles.connectedBadge}>
        <Text style={styles.connectedText}>{connected ? 'Connected' : 'Disconnected'}</Text>
      </View>
    </View>
  </View>
);

export default function Devices() {
  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Devices</Text>
        <TouchableOpacity>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={devices}
        renderItem={({ item }) => <DeviceItem {...item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.deviceList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    fontFamily: 'Inter-Regular',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'normal',
    fontFamily: 'Inter-Regular',
  },
  editButton: {
    color: 'blue',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  deviceList: {
    paddingHorizontal: 20,
  },
  deviceItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
  },
  deviceImage: {
    width: 100,
    height: 100,
  },
  deviceInfo: {
    flex: 1,
    padding: 15,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'normal',
    fontFamily: 'Inter-Regular',
    paddingBottom: 10,
  },
  connectedBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  connectedText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});
