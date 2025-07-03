import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, TextInput, FlatList, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function generateKey() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

const STAR_VALUES = [1, 2, 3, 4, 5];

export default function ReviewScreen() {
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
        const gamesJson = await AsyncStorage.getItem(`reviews_${user.username}`);
        const loadedGames = gamesJson ? JSON.parse(gamesJson) : [];
        const normalizedGames = loadedGames.map(g =>
          typeof g === 'string' ? { key: generateKey(), name: g, rating: 0 } : { ...g, rating: g.rating || 0 }
        );
        setGames(normalizedGames);
        if (normalizedGames.length !== loadedGames.length) {
          await AsyncStorage.setItem(`reviews_${user.username}`, JSON.stringify(normalizedGames));
        }
      }
    };
    loadGames();
  }, []);

  const addGame = async (gameName) => {
    if (!gameName) return;
    const newGameObj = { key: generateKey(), name: gameName, rating: 0 };
    const updatedGames = [...games, newGameObj];
    setGames(updatedGames);
    await AsyncStorage.setItem(`reviews_${username}`, JSON.stringify(updatedGames));
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

  const setRating = async (index, rating) => {
    const newGames = [...games];
    newGames[index].rating = rating;
    newGames.sort((a, b) => b.rating - a.rating);
    setGames(newGames);
    await AsyncStorage.setItem(`reviews_${username}`, JSON.stringify(newGames));
  };

  const deleteGame = async (index) => {
    const newGames = games.filter((_, i) => i !== index);
    setGames(newGames);
    await AsyncStorage.setItem(`reviews_${username}`, JSON.stringify(newGames));
  };

  const renderStars = (rating, onPress) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity key={star} onPress={() => onPress(star)}>
            <Text style={[styles.star, rating >= star ? styles.starFilled : styles.starEmpty]}>★</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Game Reviews</Text>
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
            <Text style={styles.gameText}>{item.name}</Text>
            {renderStars(item.rating, (star) => setRating(index, star))}
            <TouchableOpacity onPress={() => deleteGame(index)} style={styles.deleteButton}>
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </SafeAreaView>
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
  gameText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  star: {
    fontSize: 22,
    marginHorizontal: 2,
  },
  starFilled: {
    color: '#ffd700',
  },
  starEmpty: {
    color: '#aaa',
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginHorizontal: 2,
    backgroundColor: '#ff5252',
    borderRadius: 4,
  },
  deleteIcon: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
}); 