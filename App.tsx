import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/LoginScreen';
import AddSetScreen from './screens/AddSetScreen';
import ExercisesScreen from './screens/ExercisesScreen';
import ProfileScreen from './screens/ProfileScreen';
import YourSetsScreen from './screens/YourSetsScreens'; // Correct the import if typo

import { MaterialIcons } from '@expo/vector-icons';
import { PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const BottomNavigationBar: React.FC = () => {
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
            iconName = 'fitness-center';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="AddSet" component={AddSetScreen} options={{ title: 'Add Set' }} />
      <Tab.Screen name="Exercises" component={ExercisesScreen} options={{ title: 'Exercises' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      <Tab.Screen name="YourSets" component={YourSetsScreen} options={{ title: 'Your Sets' } } />
    </Tab.Navigator>
  );
};

const App = () => {
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
    const intervalId = setInterval(checkLoginStatus, 1000); // Check every 5 seconds
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
    <NavigationContainer>
      <PaperProvider>
        {userToken ? (
          <BottomNavigationBar />
        ) : (
          <LoginScreen onLoginSuccess={checkLoginStatus} />
        )}
      </PaperProvider>
    </NavigationContainer>
  );
};

export default App;
