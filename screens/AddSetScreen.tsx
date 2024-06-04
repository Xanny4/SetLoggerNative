import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '../screens/types';

type AddSetScreenNavigationProp = BottomTabNavigationProp<RootStackParamList, 'AddSet'>;

interface AddSetScreenProps {
  navigation: AddSetScreenNavigationProp;
}

const AddSetScreen: React.FC<AddSetScreenProps> = ({ navigation }) => {
  const [exercise, setExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const handleAddSet = () => {
    // Your logic to add the set goes here
    console.log('Adding set for exercise:', exercise, 'with weight:', weight, 'and reps:', reps);
    // You can add the set and navigate back to the main app screen or perform any other action
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.header}>Add Set</Text>
        <TextInput
          label="Exercise"
          value={exercise}
          onChangeText={setExercise}
          style={styles.input}
        />
        <TextInput
          label="Weight (kg)"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          label="Reps"
          value={reps}
          onChangeText={setReps}
          keyboardType="numeric"
          style={styles.input}
        />
        <Button mode="contained" onPress={handleAddSet} style={styles.button}>
          Add Set
        </Button>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '80%',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default AddSetScreen;
