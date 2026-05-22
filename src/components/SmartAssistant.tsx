import React, { useState } from 'react';
import { Goal } from '../types';
import { Bot, Sparkles, AlertCircle } from 'lucide-react';

type Props = {
  goals: Goal[];
};

export default function SmartAssistant({ goals }: Props) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeGoals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goals }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Tarmoq xatosi');
      }
      setAdvice(data.message);
    } catch (err: any) {
      setError(err.message || "Tahlilda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1C1C1F] rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-all duration-500"></div>
      
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
          <Bot size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-800 dark:text-white">AI Moliyaviy Maslahatchi</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Holatingizni tahlil qiling</p>
        </div>
      </div>

      {!advice && !loading && !error && (
        <div className="mt-6 relative z-10">
           <button 
             onClick={analyzeGoals}
             className="w-full bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors"
           >
             <Sparkles size={18} />
             Tahlil qilish
           </button>
        </div>
      )}

      {loading && (
        <div className="mt-6 flex flex-col items-center justify-center py-4 space-y-3 relative z-10">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">Ma'lumotlar tahlil qilinmoqda...</p>
        </div>
      )}

      {error && (
         <div className="mt-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-medium flex items-start gap-3 relative z-10">
           <AlertCircle size={18} className="shrink-0 mt-0.5" />
           <p>{error}</p>
         </div>
      )}

      {advice && !loading && (
        <div className="mt-6 relative z-10">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#252529] text-slate-700 dark:text-slate-300 text-sm leading-relaxed border border-slate-100 dark:border-white/5 font-medium markdown-body whitespace-pre-wrap">
            {advice}
          </div>
          <button 
             onClick={analyzeGoals}
             className="w-full mt-4 bg-transparent border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors"
           >
             Qayta tahlil
           </button>
        </div>
      )}
    </div>
  );
}
