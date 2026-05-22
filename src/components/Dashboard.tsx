import React from 'react';
import { Goal } from '../types';
import { formatCurrency } from '../lib/utils';
import { Target, Calendar, ChevronRight } from 'lucide-react';

type Props = {
  goals: Goal[];
  onSelectGoal: (id: string) => void;
  onAddGoal: () => void;
};

export default function Dashboard({ goals, onSelectGoal, onAddGoal }: Props) {
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);

  return (
    <div className="p-6 space-y-8 animate-in fade-in pb-32 max-w-full overflow-hidden min-h-[90vh]">
      
      {/* Overview Section */}
      <section className="space-y-4 pt-2">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Umumiy yig'ildi</h2>
        </div>
        <div className="bg-white dark:bg-[#1C1C1F] rounded-3xl p-6 border border-slate-200 dark:border-white/5 flex flex-col justify-center shadow-sm">
          <div className="space-y-2">
            <p className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{formatCurrency(totalSaved)}</p>
            <div className="flex gap-2 items-center text-sm font-semibold">
              <span className="text-slate-400 dark:text-slate-500">Maqsad qilingan jami summa:</span>
              <span className="text-indigo-600 dark:text-indigo-400">{formatCurrency(totalTarget)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Goals List */}
      <section className="space-y-4 pb-12">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Mening Maqsadlarim</h2>
        </div>
        
        {goals.length === 0 ? (
          <div className="text-center py-16 px-6 border-[3px] border-dashed border-slate-200 dark:border-white/10 rounded-[32px] space-y-4">
            <div className="w-16 h-16 bg-slate-100 dark:bg-[#202024] rounded-2xl flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500 rotate-12">
              <Target size={28} />
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-300 font-bold">Hali maqsad qo'shilmadi</p>
              <p className="text-slate-400 text-xs mt-2 max-w-[200px] mx-auto leading-relaxed">Orzularingiz uchun pul yig'ishni hozirdan boshlang.</p>
            </div>
            <button 
              onClick={onAddGoal}
              className="text-indigo-600 dark:text-indigo-400 font-bold text-sm bg-indigo-50 dark:bg-indigo-500/10 px-5 py-2.5 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors mt-2"
            >
              Birinchi maqsadni qo'shish
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              const now = new Date();
              let reminderText = null;
              
              if (goal.deadline && goal.currentAmount < goal.targetAmount) {
                const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - now.getTime()) / (1000 * 3600 * 24));
                if (daysLeft > 0 && daysLeft <= 7) {
                  reminderText = `Muddatiga ${daysLeft} kun qoldi`;
                } else if (daysLeft < 0) {
                  reminderText = "Muddat o'tgan";
                }
              }

              return (
                <div 
                  key={goal.id} 
                  onClick={() => onSelectGoal(goal.id)}
                  className="bg-white dark:bg-[#1C1C1F] rounded-3xl border border-slate-200 dark:border-white/5 p-5 shadow-sm hover:shadow-md dark:shadow-none hover:bg-slate-50 dark:hover:bg-[#222226] transition-all duration-300 active:scale-[0.97] cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-[18px] flex items-center justify-center text-white shadow-md shadow-slate-200/50 dark:shadow-none transition-transform group-hover:scale-105" style={{ backgroundColor: goal.color || '#4f46e5' }}>
                         <Target size={20} strokeWidth={2.5} />
                       </div>
                       <div>
                         <h3 className="font-bold text-[17px] text-slate-900 dark:text-slate-100 leading-tight mb-1">{goal.title}</h3>
                         {reminderText ? (
                           <span className="text-xs font-bold text-orange-500 dark:text-orange-400 flex items-center gap-1">
                             <Calendar size={13} strokeWidth={2.5} /> {reminderText}
                           </span>
                         ) : (
                           <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold block bg-indigo-50 dark:bg-indigo-500/10 inline-block px-2 py-0.5 rounded-md">{progress}% bajarildi</span>
                         )}
                       </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-400 transition-colors transform group-hover:translate-x-1" />
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-[#2A2A2E] h-2.5 rounded-full overflow-hidden mb-3">
                    <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%`, backgroundColor: goal.color || '#4f46e5' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">{formatCurrency(goal.currentAmount)}</span>
                    <span className="text-slate-400 dark:text-slate-500">{formatCurrency(goal.targetAmount)} qilinadi</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
