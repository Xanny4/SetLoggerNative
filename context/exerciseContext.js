// exerciseContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getExercises } from '../utils/api';

const ExerciseContext = createContext();

export const ExerciseProvider = ({ children }) => {
    const [exercises, setExercises] = useState([]);

    const refreshExercises = async () => {
        try {
            const fetchedExercises = await getExercises();
            setExercises(fetchedExercises);
        } catch (error) {
            console.error('Error fetching exercises:', error);
        }
    };

    useEffect(() => {
        refreshExercises();
    }, []);

    return (
        <ExerciseContext.Provider value={{ exercises, refreshExercises }}>
            {children}
        </ExerciseContext.Provider>
    );
};

export const useExerciseContext = () => {
    const context = useContext(ExerciseContext);
    if (context === undefined) {
        throw new Error('useExerciseContext must be used within an ExerciseProvider');
    }
    return context;
};