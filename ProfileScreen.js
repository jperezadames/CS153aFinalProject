import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Image, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const loadProfile = async () => {
      // Get current user (for demo, just get the first user)
      const usersJson = await AsyncStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];
      if (users.length > 0) {
        setUsername(users[0].username);
      }
      // Get profile image
      const img = await AsyncStorage.getItem('profileImage');
      setProfileImage(img);
    };
    loadProfile();
  }, []);

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.5 });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setProfileImage(uri);
        await AsyncStorage.setItem('profileImage', uri);
      }
      return;
    }
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    let mediaPermissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.status !== 'granted' || mediaPermissionResult.status !== 'granted') {
      Alert.alert('Permission required', 'Camera and media library permissions are required.');
      return;
    }
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            let result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.5 });
            if (!result.canceled && result.assets && result.assets.length > 0) {
              const uri = result.assets[0].uri;
              setProfileImage(uri);
              await AsyncStorage.setItem('profileImage', uri);
            }
          },
        },
        {
          text: 'Choose from Library',
          onPress: async () => {
            let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.5 });
            if (!result.canceled && result.assets && result.assets.length > 0) {
              const uri = result.assets[0].uri;
              setProfileImage(uri);
              await AsyncStorage.setItem('profileImage', uri);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleChangeUsername = async () => {
    Alert.prompt(
      'Change Username',
      'Enter your new username:',
      async (newUsername) => {
        if (!newUsername) return;
        const usersJson = await AsyncStorage.getItem('users');
        let users = usersJson ? JSON.parse(usersJson) : [];
        // For demo, update the first user
        if (users.length > 0) {
          users[0].username = newUsername;
          await AsyncStorage.setItem('users', JSON.stringify(users));
          setUsername(newUsername);
        }
      },
      'plain-text',
      username
    );
  };

  const handleChangePassword = async () => {
    Alert.prompt(
      'Change Password',
      'Enter your new password:',
      async (newPassword) => {
        if (!newPassword) return;
        const usersJson = await AsyncStorage.getItem('users');
        let users = usersJson ? JSON.parse(usersJson) : [];
        // For demo, update the first user
        if (users.length > 0) {
          users[0].password = newPassword;
          await AsyncStorage.setItem('users', JSON.stringify(users));
        }
      },
      'secure-text'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={profileImage ? { uri: profileImage } : require('./assets/default-profile.png')}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.username}>{username}</Text>
      </View>
      <View style={styles.optionsSection}>
        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('ChangePassword')}>
          <Text style={styles.rowText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.row, styles.signOutRow]} onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.rowText, styles.signOutText]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a143d',
  },
  topSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    backgroundColor: '#1a225a',
  },
  username: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  optionsSection: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  row: {
    backgroundColor: '#1a225a',
    borderRadius: 8,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  rowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  signOutRow: {
    backgroundColor: '#2d375a',
    marginTop: 32,
  },
  signOutText: {
    color: '#ff5252',
    fontWeight: 'bold',
  },
}); 