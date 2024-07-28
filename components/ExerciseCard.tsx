import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Exercise, RootStackParamList } from '../types';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type ExerciseCardNavigationProp = BottomTabNavigationProp<RootStackParamList, 'YourSets'>;

interface ExerciseCardProps {
  exercise: Exercise;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  const navigation = useNavigation<ExerciseCardNavigationProp>();

  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate('YourSets', { exerciseId: exercise._id })} 
      style={styles.card}
    >
      <Card style={styles.cardContent}>
        {exercise.imageURL ? (
          <Card.Cover source={{ uri: exercise.imageURL }} style={styles.image} />
        ) : (
          <View >
            <Text style={styles.noImageText}>{exercise.name}</Text>
          </View>
        )}
        {exercise.imageURL && (
          <Card.Content>
            <Title style={styles.title}>{exercise.name}</Title>
          </Card.Content>
        )}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
    maxWidth: '48%',
    aspectRatio: 1,
  },
  cardContent: {
    justifyContent: 'center',
    height: '100%',
  },
  image: {
    height: '70%',
  },
  noImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  noImageText: {
    fontSize: 18,
    textAlign: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 14,
  },
});

export default ExerciseCard;
