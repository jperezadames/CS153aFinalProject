import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SearchScreen from './SearchScreen';
import ProfileScreen from './ProfileScreen';

function HomeTab() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centered}>
        <Text style={styles.welcome}>Welcome to GameLog!</Text>
      </View>
    </SafeAreaView>
  );
}

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#1a225a' },
        tabBarActiveTintColor: '#4fc3f7',
        tabBarInactiveTintColor: '#fff',
      }}
    >
      <Tab.Screen name="Home" component={HomeTab} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a143d',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
}); 