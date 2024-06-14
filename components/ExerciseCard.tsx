import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Exercise, RootStackParamList } from '../types'; // Ensure consistent type import
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
      <Card>
        <Card.Cover source={{ uri: exercise.imageURL }} />
        <Card.Content>
          <Title>{exercise.name}</Title>
          <Paragraph>{exercise.name}</Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
});

export default ExerciseCard;
