import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Devices() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Devices Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d9d9d9',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
