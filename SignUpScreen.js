import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!username || !password) {
      setError('Please enter a username and password');
      return;
    }
    try {
      const usersJson = await AsyncStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];
      const userExists = users.some(u => u.username === username);
      if (userExists) {
        setError('Username already exists');
        return;
      }
      users.push({ username, password });
      await AsyncStorage.setItem('users', JSON.stringify(users));
      navigation.goBack();
    } catch (e) {
      setError('Something went wrong');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        {error ? <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text> : null}
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
  form: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: 250,
    height: 44,
    backgroundColor: '#1a225a',
    borderRadius: 6,
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4fc3f7',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    width: 250,
  },
  buttonText: {
    color: '#0a143d',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 