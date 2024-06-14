import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, FAB } from 'react-native-paper';
import SetsTable from '../components/SetsTable'; // Adjust the path as necessary
import { useNavigation } from '@react-navigation/native';

interface YourSetsScreenProps {
  exerciseId: string;
}

const YourSetsScreen: React.FC<YourSetsScreenProps> = ({exerciseId}) => {
  //const { exerciseId } = route.params || {}; // Destructure with fallback

  // Debugging log to check if exerciseId is being passed correctly
  console.log('exerciseId:', exerciseId);
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Your Sets" />
      </Appbar.Header>
      <View style={styles.content}>
        <SetsTable exercise={exerciseId} />
      </View>
      <FAB
        style={styles.fab}
        icon="plus"
        //onPress={() => navigation.navigate('AddSet', { exerciseId })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

export default YourSetsScreen;
