import React, { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, FAB } from 'react-native-paper';
import SetsTable from '../components/SetsTable'; // Adjust the path as necessary
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { SetsContext } from '../context/setsContext';

type YourSetsScreenRouteProp = RouteProp<RootStackParamList, 'YourSets'>;
type YourSetsScreenNavigationProp = BottomTabNavigationProp<RootStackParamList, 'YourSets'>;

interface Props {
  route: YourSetsScreenRouteProp;
  navigation: YourSetsScreenNavigationProp;
}

const YourSetsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { exerciseId } = route.params || {};

  // Debugging log to check if exerciseId is being passed correctly
  console.log('exerciseId:', exerciseId);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <SetsTable exerciseId={exerciseId} />
      </View>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddSet')}
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
