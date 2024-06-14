import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { TextInput, DataTable, IconButton, Snackbar } from 'react-native-paper';
import { getSets, getExercises, deleteSet } from '../utils/api';

// Custom Pagination Component
const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <View style={styles.paginationContainer}>
      {pages.map((page) => (
        <Text
          key={page}
          style={[styles.pageNumber, page === currentPage && styles.currentPage]}
          onPress={() => onPageChange(page)}
        >
          {page}
        </Text>
      ))}
    </View>
  );
};

const SetsTable = ({ exercise }: { exercise?: string }) => {
  const [sets, setSets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [exercisesData, setExercisesData] = useState<any[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<any | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [sortCriteria, setSortCriteria] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('desc');

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
  }, [exercise, sortCriteria, sortOrder, startDate, endDate, page, confirmDelete]);

  const findExerciseById = (exerciseId: string) => {
    return exercisesData.find((exercise) => exercise?._id === exerciseId);
  };

  useEffect(() => {
    if (exercise) {
      setSelectedExercise(findExerciseById(exercise));
    } else {
      setSelectedExercise(null);
    }
  }, [exercise, exercisesData]);

  const fetchSets = async () => {
    setLoading(true);
    try {
      const { sets, totalPages } = await getSets(
        exercise,
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

  const handleDelete = async (setId: string) => {
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

  const handleSort = (criteria: string) => {
    if (sortCriteria === criteria) {
      setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCriteria(criteria);
      setSortOrder('desc');
    }
  };

  const handlePagination = (pageNumber: number) => {
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
        <ScrollView horizontal>
          <DataTable>
            <DataTable.Header>
              {!exercise && (
                <DataTable.Title>
                  <Text style={styles.headerText}>Exercise</Text>
                </DataTable.Title>
              )}
              <DataTable.Title onPress={() => handleSort('reps')}>
                <Text style={styles.headerText}>Reps</Text>
              </DataTable.Title>
              <DataTable.Title onPress={() => handleSort('weight')}>
                <Text style={styles.headerText}>Weight (kg)</Text>
              </DataTable.Title>
              <DataTable.Title onPress={() => handleSort('createdAt')}>
                <Text style={styles.headerText}>Date</Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text style={styles.headerText}>Actions</Text>
              </DataTable.Title>
            </DataTable.Header>
            {sets.map((set) => {
              const ex = findExerciseById(set.exercise);
              return (
                <DataTable.Row key={set._id}>
                  {!exercise && (
                    <DataTable.Cell>
                      <Text>{ex?.name}</Text>
                      {ex?.imageURL && (
                        <Image
                          source={{ uri: ex?.imageURL }}
                          style={styles.exerciseImage}
                        />
                      )}
                    </DataTable.Cell>
                  )}
                  <DataTable.Cell>
                    <Text>{set.reps}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text>{set.weight}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text>{new Date(set.createdAt).toLocaleDateString()}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <IconButton
                      icon="delete"
                      iconColor="red"
                      size={20}
                      onPress={() => handleDelete(set._id)}
                    />
                  </DataTable.Cell>
                </DataTable.Row>
              );
            })}
          </DataTable>
        </ScrollView>
      )}
      <CustomPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePagination}
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  pageNumber: {
    margin: 5,
    fontSize: 16,
    color: 'blue',
  },
  currentPage: {
    fontWeight: 'bold',
    color: 'red',
  },
});

export default SetsTable;
