import { Goal } from '../types';
import { differenceInDays, startOfDay, parseISO } from 'date-fns';

export function calculateStreak(goals: Goal[]): { currentStreak: number, maxStreak: number } {
  let allDates: Date[] = [];
  goals.forEach(g => {
    g.history.forEach(t => {
      allDates.push(startOfDay(parseISO(t.date)));
    });
  });

  if (allDates.length === 0) return { currentStreak: 0, maxStreak: 0 };

  // Sort descending
  allDates.sort((a, b) => b.getTime() - a.getTime());

  // Remove duplicates
  const uniqueDates: Date[] = [];
  allDates.forEach(d => {
    if (uniqueDates.length === 0 || uniqueDates[uniqueDates.length - 1].getTime() !== d.getTime()) {
      uniqueDates.push(d);
    }
  });

  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 1;
  
  const today = startOfDay(new Date());
  let lastDate = uniqueDates[0];

  // Check if current streak is active (today or yesterday)
  const daysFromToday = differenceInDays(today, lastDate);
  
  if (daysFromToday > 1) {
    currentStreak = 0;
  } else {
    currentStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
        const diff = differenceInDays(uniqueDates[i-1], uniqueDates[i]);
        if (diff === 1) {
            currentStreak++;
        } else {
            break;
        }
    }
  }

  // Calculate Max Streak
  for (let i = 1; i < uniqueDates.length; i++) {
     const diff = differenceInDays(uniqueDates[i-1], uniqueDates[i]);
     if (diff === 1) {
         tempStreak++;
     } else {
         if (tempStreak > maxStreak) maxStreak = tempStreak;
         tempStreak = 1;
     }
  }
  if (tempStreak > maxStreak) maxStreak = tempStreak;
  
  // If there's only one date
  if (maxStreak === 0 && uniqueDates.length > 0) {
      maxStreak = 1;
  }

  return { currentStreak, maxStreak };
}
