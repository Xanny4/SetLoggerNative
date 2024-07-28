import React, { createContext, useState, useCallback } from 'react';
import { getSets } from '../utils/api';

export const SetsContext = createContext();

export const SetsProvider = ({ children }) => {
    const [sets, setSets] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const refreshSets = useCallback(async (exerciseId, startDate, endDate, sortCriteria, sortOrder, page) => {
        try {
            const { sets: newSets, totalPages: newTotalPages } = await getSets(
                exerciseId,
                startDate,
                endDate,
                sortCriteria,
                sortOrder,
                page
            );
            setSets(newSets);
            setTotalPages(newTotalPages);
        } catch (error) {
            console.error('Error fetching sets:', error);
        }
    }, []);

    return (
        <SetsContext.Provider value={{ sets, totalPages, refreshSets }}>
            {children}
        </SetsContext.Provider>
    );
};