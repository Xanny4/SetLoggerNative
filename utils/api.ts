import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise } from '../types';

type SetResponse = any; // Replace 'any' with the actual type
type UserResponse = any; // Replace 'any' with the actual type
type ConfirmPasswordResponse = any; // Replace 'any' with the actual type
type AddSetResponse = {
  status: any;
}
type AuthenticateResponse = {
  user: any; // Replace 'any' with the actual user type
  message: string;
  token: string;
};

type CreateUserResponse = {
  user: any;
  message: string;
}

const API_URL = process.env.API_URL;

const getToken = async (): Promise<string> => {
  return await AsyncStorage.getItem('token') || '';
};

export const getSets = async (
  exercise: string = '',
  dateStart: string = '',
  dateEnd: string = '',
  typeSort: string = '',
  sortOrder: string = 'desc',
  page: number = 1,
  pageSize: number = 10
): Promise<SetResponse | undefined> => {
  try {
    const token = await getToken();
    const response = await axios.get<SetResponse>(
      `${API_URL}/sets/?exercise=${exercise}&dateStart=${dateStart}&dateEnd=${dateEnd}&typeSort=${typeSort}&sortOrder=${sortOrder}&page=${page}&pageSize=${pageSize}`,
      {
        headers: {
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      if (await AsyncStorage.getItem('token')) await AsyncStorage.removeItem('token');
      return;
    }
    console.error('Error getting sets:', error);
  }
};

export const addSet = async (exercise: string, reps: string, weight: string): Promise<AddSetResponse> => {
  try {
    const token = await getToken();
    const response = await axios.post<any>(`${API_URL}/sets/`, {
      exercise,
      reps,
      weight,
    },
      {
        headers: {
          authorization: token,
        },
    });
    return response;
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.error('Creating Set failed:', error.response.data.message);
    } else {
      console.error('Error Creating Set:', error);
    }
    throw error;
  }
}

export const deleteSet = async (id: string): Promise<void | undefined> => {
  try {
    const token = await getToken();
    const response = await axios.delete(
      `${API_URL}/sets/${id}`,
      {
        headers: {
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      if (await AsyncStorage.getItem('token')) await AsyncStorage.removeItem('token');
      return;
    }
    console.error('Error deleting set:', error);
  }
};

export const getExercises = async (): Promise<Exercise[] | undefined> => {
  try {
    const token = await getToken();
    const response = await axios.get<Exercise[]>(`${API_URL}/exercises/`, {
      headers: {
        authorization: token,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      if (await AsyncStorage.getItem('token')) await AsyncStorage.removeItem('token');
      return;
    }
    console.error('Error getting exercises:', error);
  }
};

export const createExercise = async (exercise: any): Promise<any> => {
  try {
    const token = await getToken();
    const response = await axios.post<Exercise>(
      `${API_URL}/exercises/`,
      { exercise },
      {
        headers: {
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      if (await AsyncStorage.getItem('token')) await AsyncStorage.removeItem('token');
      return;
    }
    console.error('Error creating exercise:', error);
  }
};

export const getExerciseById = async (id: string): Promise<Exercise | undefined> => {
  try {
    const token = await getToken();
    const response = await axios.get<Exercise>(
      `${API_URL}/exercises/${id}`,
      {
        headers: {
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      if (await AsyncStorage.getItem('token')) await AsyncStorage.removeItem('token');
      return;
    }
    console.error('Error getting exercise:', error);
  }
};

export const getUser = async (): Promise<UserResponse | undefined> => {
  try {
    const token = await getToken();
    const response = await axios.get<UserResponse>(`${API_URL}/users/`, {
      headers: {
        authorization: token,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      if (await AsyncStorage.getItem('token')) await AsyncStorage.removeItem('token');
      return;
    }
    console.error('Error getting user:', error);
  }
};

export const modifyUser = async (username: string, email: string): Promise<UserResponse | undefined> => {
  try {
    const token = await getToken();
    const response = await axios.put<UserResponse>(
      `${API_URL}/users/`,
      {
        username,
        email,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      if (await AsyncStorage.getItem('token')) await AsyncStorage.removeItem('token');
      return;
    }
    console.error('Error modifying user:', error);
  }
};

export const confirmPassword = async (password: string): Promise<ConfirmPasswordResponse | undefined> => {
  try {
    const token = await getToken();
    const response = await axios.post<ConfirmPasswordResponse>(
      `${API_URL}/users/confirmPassword`,
      {
        password,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      if (await AsyncStorage.getItem('token')) await AsyncStorage.removeItem('token');
      return;
    }
    console.error("Error confirming user's password:", error);
  }
};

export const authenticateUser = async (email: string, password: string): Promise<AuthenticateResponse | undefined> => {
  try {
    console.log(`${API_URL}/users/authenticate`);
    const response = await axios.post<AuthenticateResponse>(`${API_URL}/users/authenticate`, {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.error('Authentication failed:', error.response.data.message);
    } else {
      console.error('Error authenticating user:', error);
    }
    throw error;
  }
};

export const createUser = async (username: string, email: string, password: string): Promise<CreateUserResponse | undefined> => {
  try {
    const response = await axios.post<CreateUserResponse>(`${API_URL}/users/`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.error('Creating User failed:', error.response.data.message);
    } else {
      console.error('Error Creating user:', error);
    }
    throw error;
  }
};

