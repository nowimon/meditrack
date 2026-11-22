/**
 * MediTrack DSA Lab - Application Context
 *
 * Provides a shared store for waste requests so that the Dashboard
 * and WasteRequests page stay in sync via React Context.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { WasteRequest } from '../models/WasteRequest';
import { generateSampleWasteRequests } from '../data/dataGenerator';

interface AppContextValue {
  requests: WasteRequest[];
  setRequests: React.Dispatch<React.SetStateAction<WasteRequest[]>>;
  addRequest: (req: Omit<WasteRequest, 'id' | 'createdAt'>) => void;
  deleteRequest: (id: number) => void;
  updateStatus: (id: number, status: WasteRequest['status']) => void;
  resetRequests: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const DEFAULT_REQUESTS = generateSampleWasteRequests(20, 42);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<WasteRequest[]>(DEFAULT_REQUESTS);

  const addRequest = useCallback((req: Omit<WasteRequest, 'id' | 'createdAt'>) => {
    setRequests((prev) => [
      ...prev,
      {
        ...req,
        id: prev.length > 0 ? Math.max(...prev.map((r) => r.id)) + 1 : 1,
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const deleteRequest = useCallback((id: number) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateStatus = useCallback((id: number, status: WasteRequest['status']) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }, []);

  const resetRequests = useCallback(() => {
    setRequests(DEFAULT_REQUESTS);
  }, []);

  return (
    <AppContext.Provider value={{ requests, setRequests, addRequest, deleteRequest, updateStatus, resetRequests }}>
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
