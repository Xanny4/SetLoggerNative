import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authenticateUser } from '../utils/api'; // Adjust the import path as necessary

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (errorMessage) setSuccessMessage(null);
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) setErrorMessage(null);
  }, [successMessage]);
  
  const handleLogin = async () => {
    try {
      const response = await authenticateUser(email, password);
      if (!response) return;
      console.log(response.user);
      if (response.user) {
        setSuccessMessage(response.message);
        await AsyncStorage.setItem('token', response.token);
        setTimeout(onLoginSuccess, 1000); // Add 1 second delay before redirection        
      } else {
        setErrorMessage(response.message);
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'An error occurred during login.');
    }
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    // Your signup logic goes here
    console.log('Signing up with username:', username, 'and password:', password);
    // Save the token in async storage after successful signup
    await AsyncStorage.setItem('userToken', 'dummy-token');
    // Navigate to the main app screen
    // navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>{isSignup ? 'Sign Up' : 'Login'}</Text>
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        {isSignup && (
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
        )}
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        {isSignup && (
          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
          />
        )}
        <Button mode="contained" onPress={isSignup ? handleSignup : handleLogin} style={styles.button}>
          {isSignup ? 'Sign Up' : 'Login'}
        </Button>
        <Button
          mode="text"
          onPress={() => {
            setIsSignup(!isSignup);
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          style={styles.toggleButton}
        >
          {isSignup ? 'Already have an account? Login' : 'Don’t have an account? Sign Up'}
        </Button>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  toggleButton: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  successText: {
    color: 'green',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default LoginScreen;
