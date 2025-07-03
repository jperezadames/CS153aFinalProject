import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Alert, Platform, TextInput, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReviewScreen from './ReviewScreen';
import ProfileScreen from './ProfileScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

function generateKey() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function HomeTab() {
  const [games, setGames] = useState([]);
  const [username, setUsername] = useState('');
  const [inputVisible, setInputVisible] = useState(false);
  const [newGame, setNewGame] = useState('');

  useEffect(() => {
    const loadGames = async () => {
      const userJson = await AsyncStorage.getItem('currentUser');
      const user = userJson ? JSON.parse(userJson) : null;
      if (user) {
        setUsername(user.username);
        const gamesJson = await AsyncStorage.getItem(`games_${user.username}`);
        const loadedGames = gamesJson ? JSON.parse(gamesJson) : [];
        const normalizedGames = loadedGames.map(g =>
          typeof g === 'string' ? { key: generateKey(), name: g } : g
        );
        setGames(normalizedGames);
        if (normalizedGames.length !== loadedGames.length) {
          await AsyncStorage.setItem(`games_${user.username}`, JSON.stringify(normalizedGames));
        }
      }
    };
    loadGames();
  }, []);

  const addGame = async (gameName) => {
    if (!gameName) return;
    const newGameObj = { key: generateKey(), name: gameName };
    const updatedGames = [...games, newGameObj];
    setGames(updatedGames);
    await AsyncStorage.setItem(`games_${username}`, JSON.stringify(updatedGames));
  };

  const handleAddGame = () => {
    if (Platform.OS === 'web') {
      setInputVisible(true);
    } else {
      Alert.prompt(
        'Add Game',
        'Enter the name of the game:',
        async (gameName) => {
          if (gameName) {
            await addGame(gameName);
          }
        },
        'plain-text'
      );
    }
  };

  const handleWebInput = async () => {
    if (newGame) {
      await addGame(newGame);
      setNewGame('');
      setInputVisible(false);
    }
  };

  const moveGame = async (index, direction) => {
    const newGames = [...games];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= games.length) return;
    [newGames[index], newGames[targetIndex]] = [newGames[targetIndex], newGames[index]];
    setGames(newGames);
    await AsyncStorage.setItem(`games_${username}`, JSON.stringify(newGames));
  };

  const deleteGame = async (index) => {
    const newGames = games.filter((_, i) => i !== index);
    setGames(newGames);
    await AsyncStorage.setItem(`games_${username}`, JSON.stringify(newGames));
  };

  const moveToReview = async (index) => {
    const userJson = await AsyncStorage.getItem('currentUser');
    const user = userJson ? JSON.parse(userJson) : null;
    if (!user) return;
    const game = games[index];
    const reviewsJson = await AsyncStorage.getItem(`reviews_${user.username}`);
    const reviews = reviewsJson ? JSON.parse(reviewsJson) : [];
    if (!reviews.some(r => r.name === game.name)) {
      reviews.push({ key: game.key, name: game.name, rating: 0 });
      await AsyncStorage.setItem(`reviews_${user.username}`, JSON.stringify(reviews));
    }
    const newGames = games.filter((_, i) => i !== index);
    setGames(newGames);
    await AsyncStorage.setItem(`games_${user.username}`, JSON.stringify(newGames));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>My Games</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddGame}>
          <Text style={styles.addButtonText}>Add Game</Text>
        </TouchableOpacity>
      </View>
      {inputVisible && (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter game name"
            placeholderTextColor="#aaa"
            value={newGame}
            onChangeText={setNewGame}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleWebInput}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={games}
        keyExtractor={item => item.key}
        renderItem={({ item, index }) => (
          <View style={styles.gameRow}>
            <Text style={styles.rank}>{index + 1}.</Text>
            <Text style={styles.gameText}>{item.name}</Text>
            <TouchableOpacity
              onPress={() => moveToReview(index)}
              style={styles.checkboxButton}
              accessibilityLabel="Mark as completed"
            >
              <Ionicons name="checkbox-outline" size={22} color="#4fc3f7" />
            </TouchableOpacity>
            <View style={styles.arrowContainer}>
              <TouchableOpacity
                onPress={() => moveGame(index, -1)}
                disabled={index === 0}
                style={[styles.arrowButton, index === 0 && styles.arrowDisabled]}
              >
                <Text style={styles.arrowText}>↑</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => moveGame(index, 1)}
                disabled={index === games.length - 1}
                style={[styles.arrowButton, index === games.length - 1 && styles.arrowDisabled]}
              >
                <Text style={styles.arrowText}>↓</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteGame(index)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
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
      <Tab.Screen name="Reviews" component={ReviewScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a143d',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 24,
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4fc3f7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#0a143d',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#1a225a',
    borderRadius: 6,
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  gameRow: {
    backgroundColor: '#1a225a',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 6,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rank: {
    color: '#4fc3f7',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 12,
    width: 28,
    textAlign: 'right',
  },
  gameText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  arrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  arrowButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginHorizontal: 2,
    backgroundColor: '#4fc3f7',
    borderRadius: 4,
  },
  arrowText: {
    color: '#0a143d',
    fontWeight: 'bold',
    fontSize: 18,
  },
  arrowDisabled: {
    backgroundColor: '#1a225a',
    opacity: 0.5,
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginHorizontal: 2,
    backgroundColor: '#ff5252',
    borderRadius: 4,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  checkboxButton: {
    marginRight: 8,
    padding: 4,
    borderRadius: 4,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 