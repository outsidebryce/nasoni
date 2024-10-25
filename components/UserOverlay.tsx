import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Switch, Animated, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../app/context/ThemeContext'; // Adjust the path if needed
import { lightTheme, darkTheme } from '../app/styles/themes';

const { width, height } = Dimensions.get('window');

const UserItem = ({ name, role, isSelected }) => (
  <View style={[styles.userItem, isSelected && styles.selectedUserItem]}>
    <View style={styles.userInfo}>
      {role === 'Patient' ? (
        <View style={styles.initialsContainer}>
          <Text style={styles.initials}>{name.split(' ').map(n => n[0]).join('')}</Text>
        </View>
      ) : (
        <Image
          source={{uri: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ft4.ftcdn.net%2Fjpg%2F03%2F30%2F25%2F97%2F360_F_330259751_tGPEAq5F5bjxkkliGrb97X2HhtXBDc9x.jpg&f=1&nofb=1'}}
          style={styles.userImage}
        />
      )}
      <Text style={styles.userName}>{name}</Text>
    </View>
    <View style={styles.roleContainer}>
      <Text style={styles.roleText}>{role}</Text>
    </View>
  </View>
);

const UserOverlay = ({ isVisible, onClose }) => {
  const { theme, toggleTheme } = useTheme(); // Extract both theme and toggleTheme
  const [cooperativeMode, setCooperativeMode] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const colors = theme === 'light' ? lightTheme : darkTheme;
  const dynamicStyles = getDynamicStyles(colors);

  console.log('Current theme:', theme); // Debug log

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim]);

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <Animated.View 
          style={[
            styles.content,
            {
              transform: [{ translateY: slideAnim }],
            },
            dynamicStyles.content,
          ]}
        >
          <TouchableOpacity 
            style={styles.themeToggle} 
            onPress={toggleTheme} // Use toggleTheme here
          >
            <Ionicons 
              name={theme === 'light' ? 'moon' : 'sunny'} 
              size={24} 
              color={colors.text} 
            />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            <Image
              source={{uri: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ft4.ftcdn.net%2Fjpg%2F03%2F30%2F25%2F97%2F360_F_330259751_tGPEAq5F5bjxkkliGrb97X2HhtXBDc9x.jpg&f=1&nofb=1'}}
              style={styles.mainUserImage}
            />
          </View>
          <View style={styles.header}>
            <Text style={[styles.title, dynamicStyles.contentText]}>Users</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={[styles.addButtonText, dynamicStyles.addButtonText]}>Add +</Text>
            </TouchableOpacity> 
          </View>
          <UserItem name="Kelly Davis" role="Patient" isSelected={false} />
          <UserItem name="Rebecca Davis" role="Caregiver" isSelected={true} />
          <View style={styles.cooperativeModeContainer}>
            <Text style={[styles.cooperativeModeText, dynamicStyles.contentText]}>Cooperative mode</Text>
            <Switch
              value={cooperativeMode}
              onValueChange={setCooperativeMode}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={cooperativeMode ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>
          
        </Animated.View>
      </View>
    </View>
  );
};

const getStyles = (colors: any) => ({
  content: {
    backgroundColor: colors.text,
  } as ViewStyle,
  // Add any other dynamic styles here
});

const getDynamicStyles = (colors: any) => ({
  content: {
    backgroundColor: colors.background,
  } as ViewStyle,
  addButtonText: {
    color: colors.primary, // or any other color from your theme
  } as TextStyle,
  contentText: {
    color: colors.text,
  } as TextStyle,
  // Add any other color-related styles here
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  content: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: width,
    maxHeight: height * 0.7,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainUserImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 5,
  },
  addButtonText: {
    fontSize: 16,
    color: '#007AFF', // iOS blue color, adjust as needed
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedUserItem: {
    backgroundColor: '#f0f0f0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  initialsContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  initials: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
  },
  roleContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  roleText: {
    fontSize: 12,
  },
  cooperativeModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  cooperativeModeText: {
    fontSize: 16,
  },
  themeToggle: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  themeToggleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UserOverlay;
