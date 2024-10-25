import React, { useState } from 'react';
import { Text, View } from 'react-native';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const loadFonts = async () => {
    await Font.loadAsync({
      'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
      'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    });
    setFontsLoaded(true);
  };

  if (!fontsLoaded) {
    console.log('Fonts are not loaded yet');
    return <AppLoading startAsync={loadFonts} onFinish={() => setFontsLoaded(true)} onError={console.warn} />;
  }

  console.log('Fonts loaded successfully');
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontFamily: 'Inter-Regular', fontSize: 20 }}>Inter Regular Font Loaded</Text>
      <Text style={{ fontFamily: 'Inter-Bold', fontSize: 20 }}>Inter Bold Font Loaded</Text>
    </View>
  );
}