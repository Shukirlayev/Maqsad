import React, { useState } from 'react';
import { Goal } from '../types';
import { formatCurrency, formatDate } from '../lib/utils';
import { ArrowLeft, Trash2, PlusCircle, MinusCircle, History, Target, Car, Home as HomeIcon, Smartphone, Plane, GraduationCap, Heart, Gift, Wallet } from 'lucide-react';
import { BarChart, Bar, Tooltip, ResponsiveContainer } from 'recharts';

const CATEGORY_ICONS: Record<string, any> = {
  auto: Car,
  home: HomeIcon,
  tech: Smartphone,
  travel: Plane,
  education: GraduationCap,
  health: Heart,
  gifts: Gift,
  other: Wallet,
};

type Props = {
  goal: Goal;
  onBack: () => void;
  onAddTransaction: (amount: number, note?: string) => void;
  onDeleteTransaction: (id: string) => void;
  onDeleteGoal: () => void;
  onEditGoal: (updates: Partial<Goal>) => void;
};

export default function GoalDetail({ goal, onBack, onAddTransaction, onDeleteTransaction, onDeleteGoal }: Props) {
  const [isAddingFunds, setIsAddingFunds] = useState(false);
  const [isWithdrawingFunds, setIsWithdrawingFunds] = useState(false);
  const [amountInput, setAmountInput] = useState('');
  const [noteInput, setNoteInput] = useState('');

  const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

  const chartData = [...goal.history].reverse().slice(-10).map((t) => ({
    name: formatDate(t.date).slice(0, 6) + '...',
    amount: t.amount,
  }));

  const handleTransaction = (e: React.FormEvent, isWithdraw: boolean) => {
    e.preventDefault();
    const val = parseFloat(amountInput);
    if (!isNaN(val) && val > 0) {
      onAddTransaction(isWithdraw ? -val : val, noteInput);
      setIsAddingFunds(false);
      setIsWithdrawingFunds(false);
      setAmountInput('');
      setNoteInput('');
    }
  };

  const showForm = isAddingFunds || isWithdrawingFunds;
  
  const CategoryIcon = goal.category ? CATEGORY_ICONS[goal.category] : Target;

  return (
    <div className="p-6 pb-32 space-y-6 animate-in slide-in-from-right-8 fade-in duration-300 min-h-[90vh]">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-white/5 transition-colors active:scale-95">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              if (confirm("Haqiqatan ham bu maqsadni o'chirmoqchimisiz? Buni bekor qilib bo'lmaydi.")) {
                onDeleteGoal();
              }
            }} 
            className="p-2 text-rose-500 dark:text-rose-400/80 hover:text-rose-600 dark:hover:text-rose-400 rounded-full hover:bg-rose-100 dark:hover:bg-rose-500/10 transition-colors active:scale-95"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Header Info */}
      <div className="text-center space-y-4 mt-2">
        <div className="flex items-center justify-center gap-3">
          <div 
            className="w-20 h-20 rounded-[32px] mx-auto flex items-center justify-center text-white shadow-2xl shadow-indigo-500/10 dark:shadow-none border-[4px] border-white dark:border-[#121214]"
            style={{ backgroundColor: goal.color || '#4f46e5' }}
          >
             <CategoryIcon size={36} strokeWidth={2.5} />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight capitalize">{goal.title}</h1>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Prognoz bo'yicha yig'ildi: <span className="text-indigo-600 dark:text-indigo-400">{progress}%</span></p>
        
        {goal.deadline && (
          <div className="inline-flex">
            <span className="text-xs text-slate-600 dark:text-slate-300 font-bold bg-white dark:bg-[#1C1C1F] px-4 py-2 rounded-full shadow-sm border border-slate-200 dark:border-white/5 uppercase tracking-wide">
              MUDDAT: {formatDate(goal.deadline)}
            </span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="bg-white dark:bg-[#1C1C1F] rounded-[24px] p-5 border border-slate-200 dark:border-white/5 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-500 mb-1.5 tracking-widest uppercase">Yig'ildi</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">{formatCurrency(goal.currentAmount)}</p>
        </div>
        <div className="bg-white dark:bg-[#1C1C1F] rounded-[24px] p-5 border border-slate-200 dark:border-white/5 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-500 mb-1.5 tracking-widest uppercase">Maqsad</p>
          <p className="text-lg font-bold text-slate-500 dark:text-slate-400 leading-none truncate">{formatCurrency(goal.targetAmount)}</p>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-4 px-1 uppercase tracking-widest">
            O'sish tarixi 
          </h2>
          <div className="h-44 w-full bg-white dark:bg-[#1C1C1F] rounded-3xl p-4 border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{top: 10, bottom: -10}}>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ display: 'none' }}
                  contentStyle={{ backgroundColor: '#1C1C1F', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)' }}
                  cursor={{fill: 'var(--tw-colors-slate-100)', opacity: 0.1}}
                />
                <Bar dataKey="amount" fill={goal.color || '#4f46e5'} radius={[6,6,2,2]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!showForm && (
        <div className="flex gap-4 pt-6">
          <button 
            onClick={() => setIsAddingFunds(true)}
            className="flex-1 py-4 px-4 rounded-2xl bg-indigo-600 dark:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 dark:shadow-none hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-all active:scale-[0.97]"
          >
            <PlusCircle size={22} /> Qo'shish
          </button>
          <button 
            onClick={() => setIsWithdrawingFunds(true)}
            className="flex-1 py-4 px-4 rounded-2xl bg-white dark:bg-[#202024] border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-[#2A2A2E] shadow-sm transition-all active:scale-[0.97]"
          >
            <MinusCircle size={22} /> Olish
          </button>
        </div>
      )}

      {/* Transaction Form */}
      {showForm && (
        <form onSubmit={(e) => handleTransaction(e, isWithdrawingFunds)} className="bg-white dark:bg-[#1C1C1F] p-5 rounded-3xl border border-slate-200 dark:border-white/5 space-y-5 shadow-lg animate-in fade-in slide-in-from-top-4 mt-6">
           <div className="flex justify-between items-center mb-1">
             <h3 className="font-bold text-lg text-slate-900 dark:text-white">{isWithdrawingFunds ? 'Pul olish' : 'Pul qo\'shish'}</h3>
             <button type="button" onClick={() => { setIsAddingFunds(false); setIsWithdrawingFunds(false); }} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors p-2 bg-slate-100 dark:bg-white/5 rounded-full">
               <ArrowLeft size={16} />
             </button>
           </div>
           
           <div>
             <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wide">Summa (So'm)</label>
             <input 
               type="number" 
               required
               min="1"
               step="any"
               value={amountInput}
               onChange={(e) => setAmountInput(e.target.value)}
               placeholder="M: 50000"
               className="w-full bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-xl font-bold text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
             />
           </div>
           
           <div>
             <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wide">Izoh (ixtiyoriy)</label>
             <input 
               type="text" 
               value={noteInput}
               onChange={(e) => setNoteInput(e.target.value)}
               placeholder="M: Maoshdan"
               className="w-full bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-3.5 text-base font-medium text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
             />
           </div>

           <button 
             type="submit"
             className="w-full py-4 rounded-2xl bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 text-white font-bold text-base mt-2 active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/30 dark:shadow-none"
           >
             Tasdiqlash
           </button>
        </form>
      )}

      {/* Transaction History list */}
      <div className="pt-8 space-y-4">
        <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 px-1 uppercase tracking-widest flex items-center gap-2">
          Amallar Tarixi
        </h2>
        {goal.history.length === 0 ? (
           <p className="text-sm font-medium text-slate-500 dark:text-slate-500 bg-white dark:bg-[#1C1C1F]/40 p-6 rounded-3xl border-[2px] border-dashed border-slate-200 dark:border-white/10 text-center shadow-sm">
             Hech qanday o'zgarishlar yo'q.
           </p>
        ) : (
          <div className="space-y-3">
            {goal.history.map((tx) => {
              const isPositive = tx.amount > 0;
              return (
                <div key={tx.id} className="flex items-center justify-between bg-white dark:bg-[#1C1C1F] border border-slate-200 dark:border-white/5 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <p className={`font-bold text-lg ${isPositive ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {isPositive ? '+' : ''}{formatCurrency(tx.amount)}
                    </p>
                    <div className="flex gap-2 items-center mt-1">
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{formatDate(tx.date)}</span>
                      {tx.note && <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-md max-w-[140px] truncate">{tx.note}</span>}
                    </div>
                  </div>
                  <button 
                    onClick={() => { if(confirm("Ushbu yozuvni o'chirmoqchimisiz?")) onDeleteTransaction(tx.id); }}
                    className="p-2.5 text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors active:scale-90"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  );
}
