import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Dialog, Portal, Card, Text } from 'react-native-paper';
import { getUser, modifyUser, confirmPassword } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [originalValues, setOriginalValues] = useState({ username: '', email: '' });
  const [password, setPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState({ username: '', email: '', password: '' });
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getUser();
      setUsername(user.username);
      setEmail(user.email);
    };
    fetchUserData();
  }, []);

  const handleEdit = () => {
    if (editMode) {
      setEditMode(false);
      setNewUsername(originalValues.username);
      setNewEmail(originalValues.email);
    } else {
      setEditMode(true);
      setNewUsername(username);
      setNewEmail(email);
      setOriginalValues({ username, email });
    }
  };

  const handleSave = () => {
    setOpenEditDialog(true);
  };

  const handleConfirmSave = async () => {
    const passwordConfirmed = await confirmPassword(password);

    if (!passwordConfirmed) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        password: 'Password is incorrect',
      }));
      return;
    }

    const response = await modifyUser(newUsername, newEmail);
    if (response.user) {
      setUsername(newUsername);
      setEmail(newEmail);
      setEditMode(false);
    } else {
      if (response.errors.username) {
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          username: 'Username is already taken',
        }));
      }
      if (response.errors.email) {
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          email: 'Email is already in use',
        }));
      }
    }

    setOpenEditDialog(false);
    setPassword('');
  };

  const handleLogoutConfirmation = () => {
    setOpenLogoutDialog(true);
  };

  const handleLogout = async () => {
    setOpenLogoutDialog(false);
    await AsyncStorage.removeItem('token');
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Profile Information" />
        <Card.Content>
          <TextInput
            label="Username"
            value={editMode ? newUsername : username}
            onChangeText={setNewUsername}
            disabled={!editMode}
            error={!!errorMessages.username}
          />
          <TextInput
            label="Email"
            value={editMode ? newEmail : email}
            onChangeText={setNewEmail}
            disabled={!editMode}
            error={!!errorMessages.email}
          />
          <View style={styles.buttonsContainer}>
            <Button onPress={handleEdit}>{editMode ? 'Cancel' : 'Edit'}</Button>
            {editMode && <Button onPress={handleSave}>Save Changes</Button>}
          </View>
        </Card.Content>
      </Card>

      <Button mode="contained" onPress={handleLogoutConfirmation} style={styles.logoutButton}>
        Logout
      </Button>

      <Portal>
        <Dialog visible={openEditDialog} onDismiss={() => setOpenEditDialog(false)}>
          <Dialog.Title>Confirm Your Password</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={!!errorMessages.password}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setOpenEditDialog(false)}>Cancel</Button>
            <Button onPress={handleConfirmSave}>Save Changes</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={openLogoutDialog} onDismiss={() => setOpenLogoutDialog(false)}>
          <Dialog.Title>Confirm Logout</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to log out?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setOpenLogoutDialog(false)}>Cancel</Button>
            <Button onPress={handleLogout}>Logout</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginVertical: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  logoutButton: {
    marginTop: 20,
  },
});

export default ProfileScreen;
