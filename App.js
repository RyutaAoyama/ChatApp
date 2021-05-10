import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
import ChatScreen from './src/screens/ChatScreen';
import ChatScreen3 from './src/screens/ChatScreen3';

export default function App() {
  return (
    <ChatScreen3 />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
