import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fontsLoaded] = useFonts({
    'PressStart2P': require('./assets/fonts/PressStart2P-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleLogin = async () => {
    try {
      const usersJson = await AsyncStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        setError('');
        navigation.navigate('Home');
      } else {
        setError('Incorrect login credentials');
      }
    } catch (e) {
      setError('Something went wrong');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🎮</Text>
        <Text style={[styles.title, { fontFamily: 'PressStart2P' }]}>GameLog</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={{backgroundColor: '#4fc3f7', padding: 12, borderRadius: 6, marginVertical: 10, alignItems: 'center'}}
          onPress={handleLogin}
        >
          <Text style={{color: '#0a143d', fontWeight: 'bold'}}>Log In</Text>
        </TouchableOpacity>
        {error ? <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text> : null}
      </View>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>New to GameLog? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupLink}>Sign Up.</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a143d',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 64,
  },
  title: {
    fontSize: 24,
    color: '#fff',
  },
  form: {
    alignItems: 'center',
  },
  inputGroup: {
    width: 250,
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    width: '100%',
    height: 44,
    backgroundColor: '#1a225a',
    borderRadius: 6,
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 12,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  signupText: {
    color: '#fff',
    fontSize: 14,
  },
  signupLink: {
    color: '#4fc3f7',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
}); 