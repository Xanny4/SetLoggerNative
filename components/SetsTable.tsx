import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { DataTable, IconButton, Snackbar, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getExercises, deleteSet } from '../utils/api';
import { SetsContext } from '../context/setsContext';
import { useFocusEffect } from '@react-navigation/native';

const SetsTable = ({ exerciseId }) => {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const [page, setPage] = useState(0); // Pagination starts at 0
  const [exercisesData, setExercisesData] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [sortCriteria, setSortCriteria] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const { sets, totalPages, refreshSets } = useContext(SetsContext);

  useFocusEffect(
    React.useCallback(() => {
      // Reset page number on focus
      setPage(0);
    }, [])
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await refreshSets(exerciseId, startDate, endDate, sortCriteria, sortOrder, page + 1);
        const exercises = await getExercises();
        setExercisesData(exercises);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [exerciseId, sortCriteria, sortOrder, startDate, endDate, page]);

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

  const handleDelete = async (setId) => {
    try {
      await deleteSet(setId);
      refreshSets(exerciseId, startDate, endDate, sortCriteria, sortOrder, page + 1);
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

  const onStartDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const clearDates = () => {
    setStartDate(undefined);
    setEndDate(undefined);
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
        <View style={styles.datePickerWrapper}>
          <Text style={styles.datePickerLabel}>Start Date</Text>
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            onChange={onStartDateChange}
            style={styles.datePicker}
          />
        </View>
        <View style={styles.datePickerWrapper}>
          <Text style={styles.datePickerLabel}>End Date</Text>
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            onChange={onEndDateChange}
            style={styles.datePicker}
          />
        </View>
      </View>
      <Button onPress={clearDates} mode="outlined" style={styles.clearDatesButton}>
        Clear Dates
      </Button> 
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
      ) : (
        <ScrollView horizontal={true}>
          <DataTable style={styles.dataTable}>
            <DataTable.Header>
              {!exerciseId && (<DataTable.Title style={styles.tableColumn}>Exercise</DataTable.Title>)}
              <DataTable.Title style={styles.tableColumn} onPress={() => handleSort('reps')}>
                Reps {sortCriteria === 'reps' && (
                  <Text>{sortOrder === 'asc' ? '▲' : '▼'}</Text>
                )}
              </DataTable.Title>
              <DataTable.Title style={styles.tableColumn} onPress={() => handleSort('weight')}>
                Weight (kg) {sortCriteria === 'weight' && (
                  <Text>{sortOrder === 'asc' ? '▲' : '▼'}</Text>
                )}
              </DataTable.Title>
              <DataTable.Title style={styles.tableColumn} onPress={() => handleSort('createdAt')}>
                Date {sortCriteria === 'createdAt' && (
                  <Text>{sortOrder === 'asc' ? '▲' : '▼'}</Text>
                )}
              </DataTable.Title>
              <DataTable.Title style={styles.tableColumn}>Actions</DataTable.Title>
            </DataTable.Header>
            {sets.map((set) => {
              const ex = findExerciseById(set.exercise);
              return (
                <DataTable.Row key={set._id}>
                  {!exerciseId && (
                    <DataTable.Cell style={styles.tableColumn}>
                      <View style={styles.exerciseInfo}>
                        {ex?.imageURL && (
                          <Image
                            source={{ uri: ex?.imageURL }}
                            style={styles.miniExerciseImage}
                          />
                        )}
                        <Text style={styles.cellText}>{ex?.name}</Text>
                      </View>
                    </DataTable.Cell>
                  )}
                  <DataTable.Cell style={styles.tableColumn}>
                    <Text style={styles.cellText}>{set.reps || '-'}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.tableColumn}>
                    <Text style={styles.cellText}>{set.weight || '-'}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.tableColumn}>
                    <>
                    {console.log(set.createdAt)}
                    </>
                    <Text style={styles.cellText}>{new Date(set.createdAt).toLocaleDateString()}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.tableColumn}>
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
        label={`Page ${page + 1} of ${totalPages}`}
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
    width: 50,
    height: 50,
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
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  datePickerWrapper: {
    marginHorizontal: 5,
    alignItems: 'center',
  },
  datePickerLabel: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: 'center',
  },
  datePicker: {
    width: '100%',
    alignSelf: 'flex-start',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  dataTable: {
    flex: 1,
    marginBottom: 20,
    marginTop: 10,
  },
  tableColumn: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    textAlign: 'center',
  },
  clearDatesButton: {
    marginBottom: 10,
  },
});

export default SetsTable;
