import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { TextInput, DataTable, IconButton, Snackbar } from 'react-native-paper';
import { getSets, getExercises, deleteSet } from '../utils/api';

const SetsTable = ({ exerciseId }) => {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [exercisesData, setExercisesData] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const exercises = await getExercises();
        setExercisesData(exercises);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetchSets();
    setConfirmDelete(false);
  }, [exerciseId, sortCriteria, sortOrder, startDate, endDate, page, confirmDelete]);

  const findExerciseById = (id) => {
    return exercisesData.find((exercise) => exercise?._id === id);
  };

  useEffect(() => {
    if (exerciseId) {
      setSelectedExercise(findExerciseById(exerciseId));
    } else {
      setSelectedExercise(null);
    }
  }, [exerciseId, exercisesData]);

  const fetchSets = async () => {
    setLoading(true);
    try {
      const { sets, totalPages } = await getSets(
        exerciseId,
        startDate,
        endDate,
        sortCriteria,
        sortOrder,
        page
      );
      setSets(sets);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Error fetching sets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (setId) => {
    try {
      await deleteSet(setId);
      setConfirmDelete(true);
      setSnackbarMessage('Set deleted successfully!');
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Error deleting set:', error);
      setSnackbarMessage('Failed to delete set. Try again.');
      setSnackbarVisible(true);
    }
  };

  const handleSort = (criteria) => {
    if (sortCriteria === criteria) {
      setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCriteria(criteria);
      setSortOrder('desc');
    }
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <View style={styles.container}>
      {selectedExercise && (
        <View style={styles.exerciseContainer}>
          <Text style={styles.exerciseName}>{selectedExercise.name}</Text>
          {selectedExercise.imageURL && (
            <Image
              source={{ uri: selectedExercise.imageURL }}
              style={styles.exerciseImage}
            />
          )}
        </View>
      )}
      <View style={styles.datePickerContainer}>
        <TextInput
          label="Start Date"
          value={startDate}
          onChangeText={(text) => setStartDate(text)}
          mode="outlined"
          style={styles.datePicker}
          keyboardType="numeric"
        />
        <TextInput
          label="End Date"
          value={endDate}
          onChangeText={(text) => setEndDate(text)}
          mode="outlined"
          style={styles.datePicker}
          keyboardType="numeric"
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView horizontal={false}>
          <DataTable style={styles.dataTable}>
            <DataTable.Header>
              {!exerciseId && (<DataTable.Title>Exercise</DataTable.Title>)}
              <DataTable.Title onPress={() => handleSort('reps')}>Reps</DataTable.Title>
              <DataTable.Title onPress={() => handleSort('weight')}>Weight (kg)</DataTable.Title>
              <DataTable.Title onPress={() => handleSort('createdAt')}>Date</DataTable.Title>
              <DataTable.Title>Actions</DataTable.Title>
            </DataTable.Header>
            {sets.map((set) => {
              const ex = findExerciseById(set.exercise);
              return (
                <DataTable.Row key={set._id}>
                  {!exerciseId && (
                    <DataTable.Cell>
                      <View>
                        {ex?.imageURL && (
                          <Image
                            source={{ uri: ex?.imageURL }}
                            style={styles.miniExerciseImage}
                          />
                        )}
                        <Text>{ex?.name}</Text>
                      </View>
                    </DataTable.Cell>
                  )}
                  <DataTable.Cell>{set.reps || '-'}</DataTable.Cell>
                  <DataTable.Cell>{set.weight || '-'}</DataTable.Cell>
                  <DataTable.Cell>{new Date(set.createdAt).toLocaleDateString()}</DataTable.Cell>
                  <DataTable.Cell>
                    <IconButton
                      icon="delete"
                      onPress={() => handleDelete(set._id)}
                      size={20}
                    />
                  </DataTable.Cell>
                </DataTable.Row>
              );
            })}
          </DataTable>
        </ScrollView>
      )}
      <DataTable.Pagination
        page={page}
        numberOfPages={totalPages}
        onPageChange={handlePageChange}
        label={`Page ${page} of ${totalPages}`}
        showFastPaginationControls
        numberOfItemsPerPage={5}
      />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: '#FF0000' }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  exerciseContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  exerciseImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  miniExerciseImage: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    marginRight: 10,
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  datePicker: {
    flex: 1,
    marginHorizontal: 5,
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerCell: {
    justifyContent: 'center',
  },
  dataCell: {
    justifyContent: 'center',
  },
  dataTable: {
    flex: 1,
    marginBottom: 20,
    marginTop: 10,
  },
  flex1: {
    flex: 1,
  },
});

export default SetsTable;
