import React, { useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const BathroomFaucetOverlay = ({ isVisible, onClose }) => {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const overlayHeight = height - insets.bottom;

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Animated.View 
        style={[
          styles.overlay, 
          { 
            height: overlayHeight,
            transform: [{ translateX: slideAnim }]
          }
        ]}
      >
        <Image 
          source={require('../assets/images/Device-Faucet.png')} 
          style={styles.backgroundImage}
        />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Bathroom Faucet</Text>
            <View style={styles.statusDot} />
            <Image 
              source={{uri: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ft4.ftcdn.net%2Fjpg%2F03%2F30%2F25%2F97%2F360_F_330259751_tGPEAq5F5bjxkkliGrb97X2HhtXBDc9x.jpg&f=1&nofb=1'}}
              style={styles.avatar}
            />
          </View>
          
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton} onPress={onClose}>
              <Ionicons name="arrow-back" size={24} color="white" />
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="options" size={24} color="white" />
              <Text style={styles.buttonText}>Calibrate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="water" size={24} color="white" />
              <Text style={styles.buttonText}>Clean</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="bluetooth" size={24} color="white" />
              <Text style={styles.buttonText}>Connect</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  controlButton: {
    alignItems: 'center',
  },
  buttonText: {
    marginTop: 5,
    color: 'white',
  },
});

export default BathroomFaucetOverlay;
