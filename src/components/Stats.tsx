import React from 'react';
import { Goal } from '../types';
import { formatCurrency } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { Target, TrendingUp, Award } from 'lucide-react';

export default function Stats({ goals }: { goals: Goal[] }) {
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount).length;

  const pieData = [
    { name: "Yig'ilgan", value: totalSaved },
    { name: "Qolgan", value: Math.max(0, totalTarget - totalSaved) }
  ];
  const COLORS = ['#6366f1', '#3b82f6'];

  return (
    <div className="p-6 space-y-6 animate-in fade-in pb-24">
       <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Statistika</h2>
       
       <div className="grid grid-cols-2 gap-4">
         <div className="bg-white dark:bg-[#1C1C1F] p-4 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
           <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2">
             <Target size={16} />
           </div>
           <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalGoals}</p>
           <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Jami maqsadlar</p>
         </div>
         <div className="bg-white dark:bg-[#1C1C1F] p-4 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
           <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
             <Award size={16} />
           </div>
           <p className="text-2xl font-bold text-slate-900 dark:text-white">{completedGoals}</p>
           <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Bajarildi</p>
         </div>
       </div>

       <div className="bg-white dark:bg-[#1C1C1F] rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm">
         <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-6 flex items-center gap-2">
           <TrendingUp size={16} className="text-indigo-500" />
           Umumiy taraqqiyot
         </h3>
         <div className="w-full h-48 relative">
           <ResponsiveContainer width="100%" height="100%">
             <PieChart>
               <Pie
                 data={pieData}
                 cx="50%"
                 cy="50%"
                 innerRadius={60}
                 outerRadius={80}
                 startAngle={90}
                 endAngle={-270}
                 dataKey="value"
                 stroke="none"
                 cornerRadius={4} // Needs recharts beta or alternative, fallback to none
               >
                 {pieData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                 ))}
               </Pie>
               <Tooltip 
                 formatter={(value: number) => formatCurrency(value)}
                 contentStyle={{ backgroundColor: '#1C1C1F', borderColor: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: '8px' }}
                 itemStyle={{ color: '#fff' }}
               />
             </PieChart>
           </ResponsiveContainer>
           <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-2xl font-bold text-slate-900 dark:text-white">
               {totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%
             </span>
             <span className="text-xs text-slate-500 dark:text-slate-400">Yig'ildi</span>
           </div>
         </div>
       </div>

    </div>
  )
}
