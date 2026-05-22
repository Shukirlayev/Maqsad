import React from 'react';
import { Goal } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCurrency } from '../lib/utils';
import { format, addMonths } from 'date-fns';

type Props = {
  goals: Goal[];
};

export default function PredictionGraph({ goals }: Props) {
  const currentDate = new Date();
  
  // Calculate historical monthly savings
  let totalSavedHistory = 0;
  goals.forEach(g => {
    g.history.forEach(t => {
      totalSavedHistory += t.amount;
    });
  });

  const averageMonthly = totalSavedHistory / 3; // Mock average for last 3 months
  const safeAverage = averageMonthly > 0 ? averageMonthly : 500000;

  const data = [];
  let currentSimulated = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const targetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0);

  data.push({
    name: format(currentDate, 'MMM, yyyy'),
    Kutilyotgan: currentSimulated,
    Maqsad: targetAmount,
  });

  for (let i = 1; i <= 6; i++) {
    currentSimulated += safeAverage;
    data.push({
      name: format(addMonths(currentDate, i), 'MMM, yyyy'),
      Kutilyotgan: currentSimulated,
      Maqsad: targetAmount,
    });
  }

  return (
    <div className="bg-white dark:bg-[#1C1C1F] rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm">
      <div className="mb-6">
         <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200">Bashorat Grafigi</h3>
         <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Kelgusi 6 oylik jamg'arma grafigi</p>
      </div>
      <div className="w-full h-48 -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(val) => `${val / 1000}k`} tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
            <Tooltip 
               formatter={(value: number) => formatCurrency(value)}
               contentStyle={{ backgroundColor: '#1C1C1F', borderColor: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
             />
            <Line type="monotone" dataKey="Kutilyotgan" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Maqsad" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
