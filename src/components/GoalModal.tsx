import React, { useState } from 'react';
import { X, Calendar, Focus, Car, Home, Smartphone, Plane, GraduationCap, Heart, Gift, Wallet } from 'lucide-react';

type Props = {
  onClose: () => void;
  onSave: (data: { title: string; targetAmount: number; deadline?: string; color: string; category?: string }) => void;
};

const COLORS = ['#6366f1', '#3b82f6', '#0ea5e9', '#10b981', '#f59e0b', '#f97316', '#ef4444', '#db2777', '#8b5cf6'];

const CATEGORIES = [
  { id: 'auto', label: 'Avto', icon: Car },
  { id: 'home', label: 'Uy', icon: Home },
  { id: 'tech', label: 'Texnika', icon: Smartphone },
  { id: 'travel', label: 'Sayohat', icon: Plane },
  { id: 'education', label: 'Ta\'lim', icon: GraduationCap },
  { id: 'health', label: 'Salomatlik', icon: Heart },
  { id: 'gifts', label: 'Sovg\'alar', icon: Gift },
  { id: 'other', label: 'Boshqa', icon: Wallet },
];

export default function GoalModal({ onClose, onSave }: Props) {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [category, setCategory] = useState(CATEGORIES[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(targetAmount);
    if (title.trim() && !isNaN(amount) && amount > 0) {
      onSave({
        title,
        targetAmount: amount,
        deadline: deadline || undefined,
        color,
        category,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 dark:bg-[#09090B]/90 backdrop-blur-md">
      <div 
        className="w-full max-w-md bg-white dark:bg-[#1C1C1F] border border-transparent dark:border-white/5 rounded-t-[40px] sm:rounded-3xl p-6 pb-20 sm:pb-6 shadow-2xl animate-in slide-in-from-bottom-2 fade-in max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Yangi maqsad yaratish</h2>
          <button onClick={onClose} className="p-3 bg-slate-100 dark:bg-[#121214] text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:text-slate-200 dark:hover:bg-white/10 transition-colors active:scale-95">
            <X size={20} className="stroke-[3px]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest">Nima uchun pul yig'moqchisiz?</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: Yangi telefon"
              className="w-full border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-slate-50 dark:bg-[#121214] transition-all text-slate-900 dark:text-white font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-inner dark:shadow-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest">Kategoriya</label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${isSelected ? 'bg-indigo-50 dark:bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'bg-slate-50 dark:bg-[#121214] border-slate-200 dark:border-white/5 text-slate-500 hover:bg-slate-100 dark:hover:bg-[#202024]'}`}
                  >
                    <Icon size={20} strokeWidth={isSelected ? 2.5 : 2} />
                    <span className="text-[10px] font-bold mt-1.5 line-clamp-1">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest">Qancha kerak? (Sum)</label>
            <input 
              type="number" 
              required
              min="1"
              step="any"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="100000"
              className="w-full border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-slate-50 dark:bg-[#121214] transition-all text-slate-900 dark:text-white font-black font-mono text-xl placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-inner dark:shadow-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest">Qachongacha yakunlaysiz? (ixtiyoriy)</label>
            <div className="relative">
              <input 
                type="date" 
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-slate-50 dark:bg-[#121214] transition-all text-slate-900 dark:text-white font-bold shadow-inner dark:shadow-none"
                style={{ colorScheme: 'auto' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-widest">Belgi rangi</label>
            <div className="flex gap-3 flex-wrap bg-slate-50 dark:bg-[#121214] p-3 rounded-2xl border border-slate-200 dark:border-white/5 shadow-inner dark:shadow-none">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-9 h-9 rounded-full border-[3px] focus:outline-none transition-all ${color === c ? 'scale-110 border-white dark:border-[#1C1C1F] ring-[3px] ring-indigo-500 shadow-md' : 'border-transparent shadow-none hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full mt-4 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 text-white font-black py-4.5 px-4 rounded-2xl shadow-xl shadow-indigo-600/30 dark:shadow-none transition-all focus:ring-4 focus:ring-indigo-500/40 outline-none active:scale-[0.98] text-[15px] tracking-wide"
          >
            MAQSADNI SAQLASH
          </button>
        </form>
      </div>
    </div>
  );
}
