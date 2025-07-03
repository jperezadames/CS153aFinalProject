import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChangePasswordScreen({ navigation }) {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async () => {
    if (!newPassword) {
      setError('Please enter a new password');
      return;
    }
    const usersJson = await AsyncStorage.getItem('users');
    let users = usersJson ? JSON.parse(usersJson) : [];
    if (users.length > 0) {
      users[0].password = newPassword;
      await AsyncStorage.setItem('users', JSON.stringify(users));
      navigation.goBack();
    } else {
      setError('No user found');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Change Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Submit</Text>
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