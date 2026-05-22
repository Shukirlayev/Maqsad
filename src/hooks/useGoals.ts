import { useState, useEffect } from 'react';
import { Goal, Transaction } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'maqsadli-jamgarma-goals';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Local storage parselashda xatolik", e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  const addGoal = (goalData: Omit<Goal, 'id' | 'createdAt' | 'currentAmount' | 'history'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: uuidv4(),
      currentAmount: 0,
      createdAt: new Date().toISOString(),
      history: [],
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const updateGoal = (id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt' | 'history'>>) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const addTransaction = (goalId: string, amount: number, note?: string) => {
    const transaction: Transaction = {
      id: uuidv4(),
      amount,
      date: new Date().toISOString(),
      note,
    };
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const newCurrentAmout = Math.max(0, g.currentAmount + amount);
          return {
            ...g,
            currentAmount: newCurrentAmout,
            history: [transaction, ...g.history],
          };
        }
        return g;
      })
    );
  };

  const deleteTransaction = (goalId: string, transactionId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const trans = g.history.find((t) => t.id === transactionId);
          if (!trans) return g;
          
          const newCurrent = Math.max(0, g.currentAmount - trans.amount);
          return {
            ...g,
            currentAmount: newCurrent,
            history: g.history.filter((t) => t.id !== transactionId),
          };
        }
        return g;
      })
    );
  };

  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    addTransaction,
    deleteTransaction,
  };
}
