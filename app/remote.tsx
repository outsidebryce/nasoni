import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Remote() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Remote Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d6d6d6',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
