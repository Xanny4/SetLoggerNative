import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Image, Alert } from 'react-native';
import { TextInput, Button, Card, Modal, Portal, Provider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createExercise, searchExercises, getExercises } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseError } from 'firebase/app';
import ExerciseCard from '../components/ExerciseCard';
import { Exercise } from '../types'; 
import { storage } from '../utils/firebaseConfig';
import { useExerciseContext } from '../context/exerciseContext';

const ExercisesScreen: React.FC = () => {
  const { exercises, refreshExercises } = useExerciseContext();
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseImage, setNewExerciseImage] = useState<string | null>(null);

  useEffect(() => {
    setFilteredExercises(exercises);
  }, [exercises]); 

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredExercises(exercises);
    } else {
      const results = await searchExercises(query);
      if (results) setFilteredExercises(results.exercises);
    }
  };

  const handleAddExercise = async () => {
    const imageURL = newExerciseImage ? await uploadImage(newExerciseImage) : null;
    await createExercise({ name: newExerciseName, imageURL: imageURL });
    await refreshExercises();
    setNewExerciseName('');
    setNewExerciseImage(null);
    setIsModalVisible(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setNewExerciseImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string | null): Promise<string | null> => {
    if (!uri) return null;

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error("User is not authenticated");
        return null;
      }
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `images/${Date.now()}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error: any) {
      if (error.code === 'auth/network-request-failed') {
        console.error("Network request failed. Please check your connection.");
      } else if (error instanceof FirebaseError) {
        console.error("Firebase Storage Error:", error.code, error.message, error.customData);
      } else {
        console.error("Unknown Error uploading image:", error);
      }
      return null;
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.searchBarContainer}>
          <TextInput
            placeholder="Search exercises..."
            value={searchQuery}
            onChangeText={handleSearch}
            style={styles.searchBar}
          />
          <Button
            icon="plus"
            mode="contained"
            onPress={() => setIsModalVisible(true)}
            style={styles.addButton}
          >
            Add
          </Button>
        </View>
        <FlatList
          data={filteredExercises}
          renderItem={({ item }) => (
            <ExerciseCard key={item._id} exercise={item} />
          )}
          keyExtractor={(item) => item._id}
          numColumns={2} // Set the number of columns
          columnWrapperStyle={styles.row} // Custom style for row
        />
        <Portal>
          <Modal visible={isModalVisible} onDismiss={() => setIsModalVisible(false)} contentContainerStyle={styles.modalContainer}>
            <Card style={styles.modalCard}>
              <Card.Title title="Add Exercise" />
              <Card.Content>
                <TextInput
                  label="Exercise Name"
                  value={newExerciseName}
                  onChangeText={setNewExerciseName}
                  style={styles.input}
                />
                <Button mode="contained" onPress={pickImage} style={styles.imageButton}>
                  Pick an image
                </Button>
                {newExerciseImage && <Image source={{ uri: newExerciseImage }} style={styles.imagePreview} />}
                <Button mode="contained" onPress={handleAddExercise} style={styles.saveButton}>
                  Save
                </Button>
              </Card.Content>
            </Card>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    alignSelf: 'center',
  },
  row: {
    justifyContent: 'space-between',
  },
  modalContainer: {
    padding: 20,
    justifyContent: 'center',
  },
  modalCard: {
    padding: 20,
  },
  input: {
    marginBottom: 20,
  },
  imageButton: {
    marginBottom: 20,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  saveButton: {
    marginTop: 10,
  },
});

export default ExercisesScreen;
