import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PanResponder, GestureResponderEvent, PanResponderGestureState, FlatList, SafeAreaView, Dimensions } from 'react-native';
import Svg, { G, Line } from 'react-native-svg';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const RADIUS = 150;
const STROKE_WIDTH = 30;
const NOTCH_LENGTH = 15;
const NOTCH_WIDTH = 2;
const NOTCH_COUNT = 60;

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PRESET_ITEM_WIDTH = 144;
const PRESET_ITEM_HEIGHT = 187; // Increased by 30% from 144

export default function Remote() {
  const [temperature, setTemperature] = useState(70);
  const [isPowerOn, setIsPowerOn] = useState(true);
  const centerX = useRef(RADIUS + STROKE_WIDTH / 2);
  const centerY = useRef(RADIUS + STROKE_WIDTH / 2);

  const minTemp = 60;
  const maxTemp = 90;
  const startAngle = -120;
  const endAngle = 120;

  const temperatureToAngle = (temp: number) => {
    const percentage = (temp - minTemp) / (maxTemp - minTemp);
    return startAngle + percentage * (endAngle - startAngle);
  };

  const angleToTemperature = (angle: number) => {
    const percentage = (angle - startAngle) / (endAngle - startAngle);
    return Math.round(minTemp + percentage * (maxTemp - minTemp));
  };

  const getColor = (temp: number) => {
    if (temp < 75) return "#007AFF";  // Blue
    if (temp < 90) return "#FFA500";  // Orange
    return "#FF0000";  // Red
  };

  const createNotches = () => {
    const notches = [];
    const angleStep = (endAngle - startAngle) / (NOTCH_COUNT - 1);
    for (let i = 0; i < NOTCH_COUNT; i++) {
      const angle = startAngle + i * angleStep;
      const start = polarToCartesian(centerX.current, centerY.current, RADIUS - STROKE_WIDTH / 2, angle);
      const end = polarToCartesian(centerX.current, centerY.current, RADIUS - STROKE_WIDTH / 2 + NOTCH_LENGTH, angle);
      const isActive = angle <= temperatureToAngle(temperature);
      notches.push(
        <Line
          key={i}
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke={isActive ? getColor(temperature) : "#E0E0E0"}
          strokeWidth={NOTCH_WIDTH}
          strokeLinecap="round"
        />
      );
    }
    return notches;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const { moveX, moveY } = gestureState;
        const dx = moveX - centerX.current;
        const dy = moveY - centerY.current;
        let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
        if (angle < 0) angle += 360;
        
        if (angle >= startAngle + 360 && angle <= endAngle + 360) {
          const newTemp = angleToTemperature(angle - 360);
          setTemperature(newTemp);
        } else if (angle >= startAngle && angle <= endAngle) {
          const newTemp = angleToTemperature(angle);
          setTemperature(newTemp);
        }
      },
    })
  ).current;

  const togglePower = () => {
    setIsPowerOn(!isPowerOn);
  };

  type PresetItem = {
    id: string;
    title: string;
    temperature: number;
    icon: string;
  };

  const presets: PresetItem[] = [
    { id: '1', title: 'Hot Water', temperature: 105, icon: 'flame-outline' },
    { id: '2', title: 'Cold Water', temperature: 65, icon: 'snow-outline' },
    { id: '3', title: 'Brushing Teeth', temperature: 80, icon: 'brush-outline' },
    { id: '4', title: 'Washing Hands', temperature: 95, icon: 'hand-left-outline' },
    { id: '5', title: 'Grooming', temperature: 100, icon: 'cut-outline' },
    { id: '6', title: 'Cleaning', temperature: 85, icon: 'water-outline' },
  ];

  const renderPresetItem = ({ item }: { item: PresetItem }) => (
    <TouchableOpacity 
      style={styles.presetItem} 
      onPress={() => setTemperature(item.temperature)}
    >
      <View style={styles.presetContent}>
        <Ionicons name={item.icon as any} size={36} color={getColor(item.temperature)} />
        <Text style={styles.presetTitle}>{item.title}</Text>
        <Text style={styles.presetTemperature}>{item.temperature}°F</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.content}>
        <View style={styles.gaugeContainer} {...panResponder.panHandlers}>
          <Svg width={RADIUS * 2 + STROKE_WIDTH} height={RADIUS * 2 + STROKE_WIDTH}>
            <G>
              {createNotches()}
            </G>
          </Svg>
          <View style={styles.temperatureContainer}>
            <Text style={[styles.temperature, { color: getColor(temperature) }]}>{isPowerOn ? `${temperature}°F` : 'OFF'}</Text>
          </View>
          <View style={styles.controls}>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: getColor(temperature) }]} 
              onPress={() => setTemperature(prev => Math.max(prev - 1, minTemp))}
              disabled={!isPowerOn}
            >
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: isPowerOn ? getColor(temperature) : '#ccc' }]} 
              onPress={togglePower}
            >
              <Ionicons name="power" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: getColor(temperature) }]} 
              onPress={() => setTemperature(prev => Math.min(prev + 1, maxTemp))}
              disabled={!isPowerOn}
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.presetContainer}>
        <FlatList
          data={presets}
          renderItem={renderPresetItem}
          keyExtractor={item => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.presetList}
          snapToInterval={PRESET_ITEM_WIDTH + 20}
          decelerationRate="fast"
          snapToAlignment="start"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gaugeContainer: {
    position: 'relative',
    width: RADIUS * 2 + STROKE_WIDTH,
    height: RADIUS * 2 + STROKE_WIDTH,
    alignItems: 'center',
  },
  temperatureContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  temperature: {
    fontSize: 72,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  presetContainer: {
    height: PRESET_ITEM_HEIGHT + 40,
    marginBottom: 20,
  },
  presetList: {
    paddingHorizontal: 10,
  },
  presetItem: {
    width: PRESET_ITEM_WIDTH,
    height: PRESET_ITEM_HEIGHT,
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    padding: 14,
  },
  presetContent: {
    alignItems: 'flex-start',
  },
  presetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  presetTemperature: {
    fontSize: 16,
    color: 'gray',
    marginTop: 6,
  },
});