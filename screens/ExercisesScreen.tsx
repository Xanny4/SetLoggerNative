// ExercisesScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Card, Modal, Portal, Provider } from 'react-native-paper';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '../screens/types';

type ExercisesScreenNavigationProp = BottomTabNavigationProp<RootStackParamList, 'Exercises'>;

interface Exercise {
  id: string;
  name: string;
}

interface ExercisesScreenProps {
  navigation: ExercisesScreenNavigationProp;
}

const ExercisesScreen: React.FC<ExercisesScreenProps> = ({ navigation }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');

  useEffect(() => {
    // Fetch exercises from the database (mock data here)
    const fetchExercises = async () => {
      // Replace with your data fetching logic
      const fetchedExercises = [
        { id: '1', name: 'Bench Press' },
        { id: '2', name: 'Squat' },
        { id: '3', name: 'Deadlift' },
      ];
      setExercises(fetchedExercises);
      setFilteredExercises(fetchedExercises);
    };

    fetchExercises();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = exercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredExercises(filtered);
  };

  const handleAddExercise = () => {
    const newExercise = { id: Date.now().toString(), name: newExerciseName };
    setExercises([...exercises, newExercise]);
    setFilteredExercises([...exercises, newExercise]);
    setNewExerciseName('');
    setIsModalVisible(false);
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
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Title title={item.name} />
            </Card>
          )}
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
    padding: 20,
  },
  searchBarContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    alignSelf: 'center',
  },
  card: {
    marginBottom: 10,
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
  saveButton: {
    marginTop: 10,
  },
});

export default ExercisesScreen;
