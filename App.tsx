import React, { useState, useEffect, useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { BottomTabNavigationProp, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import AddSetScreen from './screens/AddSetScreen';
import ExercisesScreen from './screens/ExercisesScreen';
import ProfileScreen from './screens/ProfileScreen';
import YourSetsScreen from './screens/YourSetsScreen';

import { MaterialIcons } from '@expo/vector-icons';
import { PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useNavigation} from '@react-navigation/native';

import { SetsProvider } from './context/setsContext';
import { ExerciseProvider } from './context/exerciseContext';
import { RootStackParamList } from './types';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Exercises Tab
const ExercisesStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ExercisesStack" component={ExercisesScreen} options={{ headerShown: false }} />
    <Stack.Screen name="YourSets" component={YourSetsScreen} options={{title: ""}}/>
  </Stack.Navigator>
);

const BottomNavigationBar: React.FC = () => {
  const navigation = useNavigation<BottomTabNavigationProp<RootStackParamList>>();
  return (
    <Tab.Navigator
      initialRouteName="AddSet"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap = 'home';

          if (route.name === 'AddSet') {
            iconName = 'add';
          } else if (route.name === 'Exercises') {
            iconName = 'fitness-center';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else if (route.name === 'YourSets') {
            iconName = 'list'; // Changed icon for YourSetsScreen
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="AddSet" component={AddSetScreen} options={{ title: 'Add Set' }} />
      <Tab.Screen name="Exercises" component={ExercisesStack} options={{ title: 'Exercises' }} listeners={{
        tabPress: (e) => {
          navigation.navigate('Exercises');
        }
      }} />
      <Tab.Screen name="YourSets" component={YourSetsScreen} options={{ title: 'Your Sets' }} listeners={{
        tabPress: (e) => {
          navigation.navigate('YourSets');
        }
      }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setUserToken(token);
    } catch (error) {
      console.error('Failed to fetch the token from storage', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
    const intervalId = setInterval(checkLoginStatus, 5000); // Check every 5 seconds
    return () => clearInterval(intervalId); // Clear the interval when the component unmounts
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ExerciseProvider>
    <SetsProvider>
    <NavigationContainer>
      <PaperProvider>
        {userToken ? (
          <BottomNavigationBar />
        ) : (
          <LoginScreen onLoginSuccess={checkLoginStatus} />
        )}
      </PaperProvider>
    </NavigationContainer>
    </SetsProvider>
    </ExerciseProvider>

  );
};

export default App;
