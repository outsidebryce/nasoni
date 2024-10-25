import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

export default function Settings() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>
        
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal info</Text>
          <TextInput style={styles.input} placeholder="Rebecca" />
          <TextInput style={styles.input} placeholder="Davis" />
          <TextInput style={styles.input} placeholder="rebecca.davis@gmail.com" />
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Password</Text>
          <TextInput style={styles.input} placeholder="*******" secureTextEntry />
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'normal',
    fontFamily: 'Inter-Regular',
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d6d6d6',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#d6d6d6',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#000000',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
