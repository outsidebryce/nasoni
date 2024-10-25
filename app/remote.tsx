import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PanResponder, GestureResponderEvent, PanResponderGestureState, FlatList, SafeAreaView, Dimensions, Image, ScrollView } from 'react-native';
import Svg, { G, Line, Circle } from 'react-native-svg';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedProps, useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { SvgUri } from 'react-native-svg';
import FountainIcon from '../assets/icons/fountain.svg';
import SprayIcon from '../assets/icons/spray.svg';
import StreamIcon from '../assets/icons/stream.svg';
import UserOverlay from '../components/UserOverlay';
import { useTheme } from './context/ThemeContext';
import { lightTheme, darkTheme } from './styles/themes';
import BathroomFaucetOverlay from '../components/BathroomFaucetOverlay';


const RADIUS = 150;
const STROKE_WIDTH = 30;
const NOTCH_LENGTH = 15;
const NOTCH_WIDTH = 2;
const NOTCH_COUNT = 60;
const PRESET_ITEM_WIDTH = 140;
const PRESET_ITEM_MARGIN = 10;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

const PRESET_ITEM_HEIGHT = 187; // Increased by 30% from 144

const COOL_BLUE = "#76CCEB";
const WARM_ORANGE = "#FB923C";
const HOT_RED = "#F03338";
const LIGHT_GREY = "#E0E0E0";
const INACTIVE_NOTCH_COLOR = '#D1D5DB';

const ModeIcons = {
  fountain: FountainIcon,
  spray: SprayIcon,
  stream: StreamIcon,
};

const IconSizes = {
  fountain: { width: 100, height: 50 },
  spray: { width: 89, height: 50 },
  stream: { width: 56, height: 60 },
  // Add more modes and sizes as needed
};

const DEFAULT_TEMPERATURE = 65;

const CountdownTimer = ({ time, totalTime, isRunning, onTogglePause, colors }) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const progress = totalTime > 0 ? (totalTime - time) / totalTime : 0;
  const circumference = 2 * Math.PI * 135;

  const styles = StyleSheet.create({
    timerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    timerTextContainer: {
      position: 'absolute',
      alignItems: 'center',
      top: 90,
    },
    timerText: {
      fontSize: 64,
      fontWeight: 'normal',
      fontFamily: 'Inter-Regular',
      color: colors.text,
    },
    timerLabel: {
      fontSize: 14,
      color: colors.text,
    },
    pauseButton: {
      position: 'absolute',
      bottom: 58,
      backgroundColor: colors.text,
      borderRadius: 30,
      padding: 10,
      height: 52,
    },
  });

  return (
    <View style={styles.timerContainer}>
      <Svg width="300" height="300" viewBox="0 0 300 300">
        <Circle
          cx="150"
          cy="150"
          r="135"
          stroke={LIGHT_GREY}
          strokeWidth="10"
          fill="none"
        />
        <Circle
          cx="150"
          cy="150"
          r="135"
          stroke={COOL_BLUE}
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          strokeLinecap="round"
          transform="rotate(-90 150 150)"
        />
      </Svg>
      <View style={styles.timerTextContainer}>
        <Text style={styles.timerText}>
          {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
        </Text>
        <Text style={styles.timerLabel}>MIN        SEC</Text>
      </View>
      <TouchableOpacity style={styles.pauseButton} onPress={onTogglePause}>
        <Ionicons name={isRunning ? "pause" : "play"} size={32} color={colors.background} />
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    fontFamily: 'Inter-Regular',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Inter-Regular',
  },
  gaugeContainer: {
    position: 'relative',
    width: '100%',
    height: RADIUS * 1.5 + STROKE_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 30,
    fontFamily: 'Inter-Regular',
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
    fontSize: 92,
    fontFamily: 'Inter-Regular',
    color: colors.text,
    marginTop: 40,
  },
  controls: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Inter-Regular',
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    fontFamily: 'Inter-Regular',
  },
  buttonText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  presetContainer: {
    maxHeight: 187,
    marginBottom: 0,
    fontFamily: 'Inter-Regular',
    
  },
  presetList: {
    alignItems: 'flex-start',
    paddingLeft: 20,
    height: 207,
    paddingRight: SCREEN_WIDTH - PRESET_ITEM_WIDTH - 20,
    fontFamily: 'Inter-Regular',
  },
  presetItem: {
    width: PRESET_ITEM_WIDTH,
    marginRight: PRESET_ITEM_MARGIN,
    height: 177,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 15,
    justifyContent: 'flex-end',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    borderWidth: 2,  // Add this line
    borderColor: 'transparent',  // Add this line
  },
  selectedPresetItem: {
    // Remove any existing border styles from here
    // The border color will be set dynamically in the renderPresetItem function
  },
  presetContent: {
    alignItems: 'flex-start',
  },
  presetIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // Remove fixed width and height from here
    // ... any other styles you have for this container
  },
  presetTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 10,
    color: colors.text,
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
    fontFamily: 'Inter-Regular',
    marginLeft: 5,
  },
  presetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 40,
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
  editButton: {
    fontFamily: 'Inter-Regular',
  },
  controlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: colors.card,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  controlButton: {
    alignItems: 'center',
  },
  iconContainer: {
    borderWidth: 1,
    borderColor: '#D4D4D4',  // Updated border color
    borderRadius: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,  // Assuming you want to keep the fixed width
    height: 44, // Assuming you want to keep the fixed height
  },
  iconContainerOn: {
    backgroundColor: 'black',
    borderColor: 'black',
  },
  controlLabel: {
    marginTop: 5,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  faucetNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  faucetName: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    marginRight: 10,
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
  },
  faucetImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  timerContainer: {
    position: 'relative',
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 64,
    fontWeight: 'normal',
    fontFamily: 'Inter-Regular',
  },
  timerLabel: {
    fontSize: 16,
    color: 'gray',
    fontFamily: 'Inter-Regular',
    marginTop: 8,
  },
  pauseButton: {
    position: 'absolute',
    bottom: 30, // Adjusted from 20 to 30 to account for thinner gauge
    padding: 16,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#4B5563',
  },
  addMinuteButton: {
    position: 'absolute',
    top: 30,
    right: 30,
    padding: 10,
  },
  themeToggle: {
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
    marginTop: 10,
  },
  themeToggleText: {
    color: colors.text,
    fontFamily: 'Inter-Regular',
  },
});

export default function Remote() {
  const { theme } = useTheme();
  const colors = theme === 'light' ? lightTheme : darkTheme;
  const styles = createStyles(colors);

  const [isPowerOn, setIsPowerOn] = useState(false);
  const [temperature, setTemperature] = useState(DEFAULT_TEMPERATURE);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  const displayedTemperature = useSharedValue(DEFAULT_TEMPERATURE);

  const centerX = useRef(RADIUS + STROKE_WIDTH / 2);
  const centerY = useRef(RADIUS + STROKE_WIDTH / 2);
  
  const flatListRef = useRef<FlatList>(null);

  const minTemp = 60;
  const maxTemp = 90;
  const startAngle = -120;
  const endAngle = 120;

  const [visiblePresetIndex, setVisiblePresetIndex] = useState(0);

  const temperatureToAngle = (temp: number) => {
    const percentage = (temp - minTemp) / (maxTemp - minTemp);
    return startAngle + percentage * (endAngle - startAngle);
  };

  const angleToTemperature = (angle: number) => {
    const percentage = (angle - startAngle) / (endAngle - startAngle);
    return Math.round(minTemp + percentage * (maxTemp - minTemp));
  };

  const getColor = (temp: number) => {
    if (temp > 95) return HOT_RED;
    if (temp >= 70) return WARM_ORANGE;
    return COOL_BLUE;
  };

  const createNotches = () => {
    const notches = [];
    const angleStep = (endAngle - startAngle) / (NOTCH_COUNT - 1);
    for (let i = 0; i < NOTCH_COUNT; i++) {
      const angle = startAngle + i * angleStep;
      const start = polarToCartesian(centerX.current, centerY.current, RADIUS - STROKE_WIDTH / 2, angle);
      const end = polarToCartesian(centerX.current, centerY.current, RADIUS - STROKE_WIDTH / 2 + NOTCH_LENGTH, angle);
      const wouldBeActive = angle <= temperatureToAngle(temperature);
      
      let notchColor;
      if (!isPowerOn) {
        notchColor = LIGHT_GREY;
      } else if (wouldBeActive) {
        notchColor = getColor(temperature);
      } else {
        notchColor = INACTIVE_NOTCH_COLOR;
      }

      notches.push(
        <Line
          key={i}
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke={notchColor}
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

  const animateTemperatureChange = useCallback((targetTemp: number) => {
    setTemperature(targetTemp);
    displayedTemperature.value = withTiming(targetTemp, { duration: 500 });
  }, []);

  const togglePower = useCallback(() => {
    setIsPowerOn(prevState => {
      if (!prevState) {
        // If we're turning on, set temperature to default
        animateTemperatureChange(DEFAULT_TEMPERATURE);
        return true;
      } else {
        // If we're turning off, reset everything
        setSelectedPresetId(null);
        animateTemperatureChange(DEFAULT_TEMPERATURE);
        setShowTimer(false);
        setTime(0);
        setTotalTime(0);
        setIsTimerRunning(false);
        
        // Slide to temperature view when turning off
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ x: 0, animated: true });
        }
        
        return false;
      }
    });
  }, [animateTemperatureChange]);

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

  const slidePresets = useCallback((direction: 'left' | 'right') => {
    setVisiblePresetIndex((currentIndex) => {
      const newIndex = direction === 'left' 
        ? (currentIndex - 1 + presets.length) % presets.length 
        : (currentIndex + 1) % presets.length;
      
      // Scroll to the new index
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
      
      return newIndex;
    });
  }, [presets.length]);

  const handlePresetSelect = useCallback((preset: PresetItem, index: number) => {
    if (selectedPresetId === preset.id) {
      // If the tapped preset is already selected, turn off the power and reset
      setIsPowerOn(false);
      setSelectedPresetId(null);
      animateTemperatureChange(DEFAULT_TEMPERATURE);
      // Reset slider to original position
      flatListRef.current?.scrollToIndex({ index: 0, animated: true });
    } else {
      // If a different preset is tapped, turn on the power and select it
      setIsPowerOn(true);
      setSelectedPresetId(preset.id);
      animateTemperatureChange(preset.temperature);
      // Scroll to the selected preset
      flatListRef.current?.scrollToIndex({ index, animated: true });
    }
  }, [selectedPresetId, animateTemperatureChange]);

  const renderPresetItem = useCallback(({ item, index }) => {
    const IconComponent = ModeIcons[item.mode];
    
    return (
      <TouchableOpacity 
        style={[
          styles.presetItem, 
          selectedPresetId === item.id && styles.selectedPresetItem,
          selectedPresetId === item.id && { borderColor: getColor(item.temperature) }
        ]} 
        onPress={() => handlePresetSelect(item, index)}
      >
        <View style={styles.presetContent}>
          <View style={styles.presetIconContainer}>
            <IconComponent width={48} height={48} fill="black" />
          </View>
          <Text style={styles.presetTitle}>{item.title}</Text>
          <View style={[styles.temperatureChip, { backgroundColor: getColor(item.temperature) }]}>
            <Ionicons name="thermometer-outline" size={16} color="white" />
            <Text style={styles.temperatureText}>{item.temperature}°</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [selectedPresetId, handlePresetSelect]);

  const getModeIcon = (mode: 'fountain' | 'spray' | 'stream') => {
    switch (mode) {
      case 'fountain':
        return 'water-outline';
      case 'spray':
        return 'sparkles-outline';
      case 'stream':
        return 'arrow-forward-outline';
      default:
        return 'water-outline';
    }
  };

  const ControlButton = ({ icon, label, onPress, color = "#000", isOn = false }) => (
    <TouchableOpacity style={styles.controlButton} onPress={onPress}>
      <View style={[
        styles.iconContainer, 
        isOn && styles.iconContainerOn,
        !isOn && { borderColor: '#D4D4D4' }  // Apply new border color only when not on
      ]}>
        <Ionicons name={icon} size={24} color={isOn ? "#22C55E" : color} />
      </View>
      <Text style={styles.controlLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const renderControls = () => {
    return (
      <View style={styles.controlContainer}>
        <ControlButton icon="chevron-back" label="Previous" onPress={() => slidePresets('left')} />
        <ControlButton 
          icon="power" 
          label={isPowerOn ? "On" : "Off"} 
          onPress={togglePower} 
          color="black"
          isOn={isPowerOn}
        />
        <ControlButton 
          icon="alarm-outline" 
          label="+1min" 
          onPress={addMinute}
          color="black"
        />
        <ControlButton icon="chevron-forward" label="Next" onPress={() => slidePresets('right')} />
      </View>
    );
  };

  const [isUserOverlayVisible, setIsUserOverlayVisible] = useState(false);

  const [timerDuration, setTimerDuration] = useState(0);
  const [showTimer, setShowTimer] = useState(false);
  const [time, setTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const addMinute = useCallback(() => {
    setTime(prevTime => prevTime + 60);
    setTotalTime(prevTotal => prevTotal + 60);
    setShowTimer(true);
    setIsTimerRunning(true);
    setIsPowerOn(true);
    slideToTimer();
  }, []);

  const handleTimerEnd = useCallback(() => {
    setShowTimer(false);
    setTime(0);
    setTotalTime(0);
    setIsTimerRunning(false);
    setIsPowerOn(false);
    // Add any additional logic for when the timer ends
  }, []);

  const toggleTimerPause = useCallback(() => {
    setIsTimerRunning(prev => !prev);
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            handleTimerEnd();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, time, handleTimerEnd]);

  const slideToTimer = () => {
    scrollViewRef.current?.scrollTo({ x: SCREEN_WIDTH, animated: true });
    setCurrentPage(1);
  };

  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef(null);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentPage(page);
  };

  const [isBathroomFaucetOverlayVisible, setIsBathroomFaucetOverlayVisible] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Faucet Title and User Avatar */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.faucetNameContainer}
            onPress={() => setIsBathroomFaucetOverlayVisible(true)}
          >
            <Text style={[styles.faucetName, { color: colors.text }]}>Bathroom Faucet</Text>
            <View style={styles.onlineIndicator} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setIsUserOverlayVisible(true)}>
            <Image 
              source={{uri: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ft4.ftcdn.net%2Fjpg%2F03%2F30%2F25%2F97%2F360_F_330259751_tGPEAq5F5bjxkkliGrb97X2HhtXBDc9x.jpg&f=1&nofb=1'}}
              style={styles.faucetImage}
            />
          </TouchableOpacity>
        </View>

        {/* Swipeable area for Temperature and Timer */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Temperature Dial */}
          <View style={[styles.gaugeContainer, { width: SCREEN_WIDTH }]}>
            <Svg width={RADIUS * 2 + STROKE_WIDTH} height={RADIUS * 2 + STROKE_WIDTH}>
              <G>
                {createNotches()}
              </G>
            </Svg>
            <View style={styles.temperatureContainer}>
              <Text style={styles.temperature}>
                {isPowerOn ? `${temperature}°` : 'OFF'}
              </Text>
            </View>
          </View>

          {/* Countdown Timer */}
          <View style={[styles.gaugeContainer, { width: SCREEN_WIDTH }]}>
            <CountdownTimer 
              time={time}
              totalTime={totalTime}
              isRunning={isTimerRunning}
              onTogglePause={toggleTimerPause}
              colors={colors}
            />
          </View>
        </ScrollView>

        {/* Page Indicator */}
        <View style={styles.pageIndicator}>
          <View style={[styles.dot, currentPage === 0 && styles.activeDot]} />
          <View style={[styles.dot, currentPage === 1 && styles.activeDot]} />
        </View>

        {/* Presets Header */}
        <View style={styles.presetHeader}>
          <Text style={styles.presetTitle}>Presets</Text>
          <TouchableOpacity onPress={() => {/* Edit functionality */}} style={styles.editButton}>
            <Text>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Presets Slider */}
        <View style={styles.presetContainer}>
          <FlatList
            ref={flatListRef}
            data={presets}
            renderItem={renderPresetItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.presetList}
            getItemLayout={(data, index) => ({
              length: PRESET_ITEM_WIDTH + PRESET_ITEM_MARGIN,
              offset: (PRESET_ITEM_WIDTH + PRESET_ITEM_MARGIN) * index,
              index,
            })}
          />
        </View>

        {/* Controls */}
        {renderControls()}
      </ScrollView>

      <UserOverlay 
        isVisible={isUserOverlayVisible} 
        onClose={() => setIsUserOverlayVisible(false)}
      />
      <BathroomFaucetOverlay 
        isVisible={isBathroomFaucetOverlayVisible} 
        onClose={() => setIsBathroomFaucetOverlayVisible(false)} 
      />
    </SafeAreaView>
  );
}