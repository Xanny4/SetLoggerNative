import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TextInput as RNTextInput } from 'react-native';
import { TextInput, Button, Card, Snackbar } from 'react-native-paper';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '../types';
import { addSet, getExercises } from '../utils/api';

type AddSetScreenNavigationProp = BottomTabNavigationProp<RootStackParamList, 'AddSet'>;

interface AddSetScreenProps {
  navigation: AddSetScreenNavigationProp;
}

const CustomSearchbar = ({ value, onChangeText, onFocus, onBlur, onClear, image, error}) => (
  <View style={[styles.customSearchbar,  error && styles.errorBorder]}>
    {image && <Image source={{ uri: image }} style={styles.customSearchbarImage} />}
    <RNTextInput
      style={styles.customSearchbarInput}
      value={value}
      onChangeText={onChangeText}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder="Select Exercise*"
    />
    {value ? (
      <TouchableOpacity onPress={onClear}>
        <Text style={styles.clearButton}>X</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

const AddSetScreen: React.FC<AddSetScreenProps> = ({ navigation }) => {
  const [exercise, setExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [exerciseList, setExerciseList] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('#4B0082');
  const [highlightErrors, setHighlightErrors] = useState({ exercise: false, reps: false });
  const [selectedExerciseImage, setSelectedExerciseImage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const exercises = await getExercises();
      setExerciseList(exercises);
      setFilteredExercises(exercises);
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredExercises(
      exerciseList.filter(ex => ex.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, exerciseList]);

  const handleAddSet = async () => {
    Keyboard.dismiss(); 
    
    const errors = {
      exercise: !exercise,
      reps: !reps,
    };
    setHighlightErrors(errors);

    if (errors.exercise || errors.reps) {
      setSnackbarMessage('Please fill in all fields');
      setSnackbarColor('#FF0000'); // Red color for error
      setSnackbarVisible(true);
      return;
    }

    const response = await addSet(exercise, reps, weight);
    if (response.status === 201) {
      setSnackbarMessage('Set added successfully!');
      setSnackbarColor('#4B0082'); // Default color for success
      setSnackbarVisible(true);
      // Clear fields after successful submission
      setExercise('');
      setWeight('');
      setReps('');
      setSearchQuery('');
      setSelectedExerciseImage('');
      setHighlightErrors({ exercise: false, reps: false });
    } else {
      setSnackbarMessage('Failed to add set. Try again.');
      setSnackbarColor('#FF0000'); // Red color for error
      setSnackbarVisible(true);
    }
  };

  const handleSelectExercise = (exercise) => {
    setExercise(exercise._id);
    setSearchQuery(exercise.name);
    setSelectedExerciseImage(exercise.imageURL); // Set the selected exercise's image URL
    setDropdownVisible(false);
    setHighlightErrors(prev => ({ ...prev, exercise: false }));
    Keyboard.dismiss(); // Dismiss keyboard when an exercise is selected
  };

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    const selectedExercise = exerciseList.find(ex => ex.name.toLowerCase() === query.toLowerCase());
    if (selectedExercise) {
      setExercise(selectedExercise._id);
      setSelectedExerciseImage(selectedExercise.imageURL);
    } else {
      setExercise('');
      setSelectedExerciseImage('');
    }
    setDropdownVisible(true);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Card style={styles.card}>
          <Text style={styles.header}>Add Set</Text>
          <CustomSearchbar
            error={highlightErrors.exercise}
            value={searchQuery}
            onChangeText={onChangeSearch}
            onFocus={() => setDropdownVisible(true)}
            onBlur={() => setDropdownVisible(false)}
            onClear={() => {
              setExercise(''); // Clear exercise when X button is pressed
              setSearchQuery('');
              setSelectedExerciseImage(''); // Clear the selected exercise's image
              setHighlightErrors(prev => ({ ...prev, exercise: false }));
            }}
            image={selectedExerciseImage}
          />
          {dropdownVisible && (
            <FlatList
              data={filteredExercises}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelectExercise(item)} style={styles.dropdownItem}>
                  {item.imageURL ? (
                    <Image source={{ uri: item.imageURL }} style={styles.dropdownItemImage} />
                  ) : null}
                  <Text style={styles.dropdownItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              style={styles.dropdown}
              keyboardShouldPersistTaps='handled' // Ensures the dropdown remains visible when tapping on it
            />
          )}
          <TextInput
            label="Reps*"
            value={reps}
            onChangeText={(text) => {
              setReps(text);
              setHighlightErrors(prev => ({ ...prev, reps: false }));
            }}
            keyboardType="numeric"
            style={[
              styles.input,
              highlightErrors.reps && styles.errorBorder
            ]}
            theme={{ colors: { primary: '#4B0082' } }}
          />
          <TextInput
            label="Weight (kg)"
            value={weight}
            onChangeText={(text) => {
              setWeight(text);
            }}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button mode="contained" onPress={handleAddSet} style={styles.button} color="#4B0082">
            Add Set
          </Button>
        </Card>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={Snackbar.DURATION_SHORT}
          style={{ backgroundColor: snackbarColor }}
        >
          {snackbarMessage}
        </Snackbar>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#483D8B',
  },
  card: {
    width: '100%',
    padding: 20,
    backgroundColor: '#6A5ACD',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  customSearchbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#c3bdeb',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 60,
  },
  customSearchbarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  customSearchbarInput: {
    flex: 1,
    fontSize: 15,
    paddingLeft: 3,
  },
  clearButton: {
    fontSize: 16,
    color: 'black',
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#c3bdeb',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
  },
  button: {
    marginTop: 20,
  },
  dropdown: {
    maxHeight: 150,
    backgroundColor: '#D5D0F1',
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dropdownItemImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 20,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  errorBorder: {
    borderColor: 'red',
  },
});

export default AddSetScreen;
