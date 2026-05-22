import { useState, useEffect } from 'react';
import { Goal, Transaction } from '../types';
import { db, auth } from '../lib/firebase';
import { collection, doc, setDoc, onSnapshot, deleteDoc, query, where } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setGoals([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'goals'), 
      where('userId', '==', auth.currentUser.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbGoals = snapshot.docs.map(doc => doc.data() as Goal);
      setGoals(dbGoals);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const addGoal = async (goalData: Omit<Goal, 'id' | 'createdAt' | 'currentAmount' | 'history'>) => {
    if (!auth.currentUser) return;
    const newGoal: Goal = {
      ...goalData,
      id: uuidv4(),
      userId: auth.currentUser.uid,
      currentAmount: 0,
      createdAt: new Date().toISOString(),
      history: [],
    };
    try {
      await setDoc(doc(db, 'goals', newGoal.id), newGoal);
    } catch (error) {
      console.error("Xatolik: ", error);
    }
  };

  const updateGoal = async (id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt' | 'history'>>) => {
    const goal = goals.find(g => g.id === id);
    if (!goal || !auth.currentUser) return;
    
    const updatedGoal = { ...goal, ...updates };
    try {
      await setDoc(doc(db, 'goals', id), updatedGoal);
    } catch (error) {
       console.error("Xatolik: ", error);
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'goals', id));
    } catch (error) {
       console.error("Xatolik: ", error);
    }
  };

  const addTransaction = async (goalId: string, amount: number, note?: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal || !auth.currentUser) return;

    const transaction: Transaction = {
      id: uuidv4(),
      amount,
      date: new Date().toISOString(),
      note,
    };
    
    const newCurrentAmount = Math.max(0, goal.currentAmount + amount);
    const updatedGoal = {
      ...goal,
      currentAmount: newCurrentAmount,
      history: [transaction, ...goal.history],
    };
    try {
      await setDoc(doc(db, 'goals', goalId), updatedGoal);
    } catch (error) {
       console.error("Xatolik:", error);
    }
  };

  const deleteTransaction = async (goalId: string, transactionId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal || !auth.currentUser) return;

    const trans = goal.history.find(t => t.id === transactionId);
    if (!trans) return;

    const newCurrent = Math.max(0, goal.currentAmount - trans.amount);
    const updatedGoal = {
      ...goal,
      currentAmount: newCurrent,
      history: goal.history.filter(t => t.id !== transactionId),
    };
    try {
      await setDoc(doc(db, 'goals', goalId), updatedGoal);
    } catch (error) {
       console.error("Xatolik:", error);
    }
  };

  return {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
    addTransaction,
    deleteTransaction,
  };
}
