import React from 'react';
import { Goal } from '../types';
import { Calendar, Bell, AlertTriangle } from 'lucide-react';
import { formatDate } from '../lib/utils';

export default function Reminders({ goals }: { goals: Goal[] }) {
  const now = new Date();
  
  const reminders = goals.map(g => {
    if (!g.deadline || g.currentAmount >= g.targetAmount) return null;
    const daysLeft = Math.ceil((new Date(g.deadline).getTime() - now.getTime()) / (1000 * 3600 * 24));
    return { ...g, daysLeft };
  }).filter(g => g !== null && g.daysLeft <= 7) as (Goal & {daysLeft: number})[];

  reminders.sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="p-6 space-y-6 animate-in fade-in pb-24 min-h-full">
       <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
         Eslatmalar
       </h2>
       
       {reminders.length === 0 ? (
         <div className="text-center py-16 flex flex-col items-center justify-center opacity-70">
           <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
             <Bell size={28} className="text-slate-400 dark:text-slate-500" />
           </div>
           <p className="text-slate-600 dark:text-slate-400 font-medium">Hozircha xavotirga o'rin yo'q.</p>
           <p className="text-xs text-slate-500 mt-1">Yaqin 7 kun ichida muddati tugaydigan maqsadlar bu yerda ko'rinadi.</p>
         </div>
       ) : (
         <div className="space-y-4">
           {reminders.map(r => {
             const isOverdue = r.daysLeft < 0;
             const isCritical = r.daysLeft === 0 || r.daysLeft === 1;
             
             let Icon = Calendar;
             let colorClass = 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30';
             
             if (isOverdue) {
               colorClass = 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30';
               Icon = AlertTriangle;
             } else if (isCritical) {
               colorClass = 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30';
             }

             return (
               <div key={r.id} className="bg-white dark:bg-[#1C1C1F] border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow">
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${colorClass}`}>
                   <Icon size={24} />
                 </div>
                 <div className="flex-1">
                   <h3 className="font-bold text-slate-900 dark:text-white capitalize">{r.title}</h3>
                   <p className="text-sm font-medium mt-0.5" style={{ color: isOverdue ? '#ef4444' : isCritical ? '#f97316' : '#6366f1' }}>
                     {isOverdue 
                       ? `Muddat o'tgan (${Math.abs(r.daysLeft)} kun oldin)` 
                       : (r.daysLeft === 0 ? "Bugun oxirgi kun!" : `${r.daysLeft} kundan so'ng muddat tugaydi.`)}
                   </p>
                   <span className="text-xs font-medium text-slate-500 dark:text-slate-500 block mt-2 opacity-80">
                     Oxirgi muddat: {formatDate(r.deadline!)}
                   </span>
                 </div>
               </div>
             )
           })}
         </div>
       )}
    </div>
  )
}
