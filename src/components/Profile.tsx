import React from 'react';
import { User, Settings, Bell, Palette, ChevronRight, LogOut, HelpCircle, Shield, CreditCard } from 'lucide-react';

type Props = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

export default function Profile({ theme, toggleTheme }: Props) {
  return (
    <div className="p-4 space-y-6 animate-in fade-in pb-24 min-h-full">
      <div className="flex flex-col items-center mt-6 mb-8">
        <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-500/30 mb-4 relative">
          S
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-white dark:bg-[#121214] rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Sarvar Shukirlayev</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">sarvarshukirlayev05@gmail.com</p>
      </div>

      <div className="space-y-4">
        {/* Settings Group 1 */}
        <div className="bg-white dark:bg-[#1C1C1F] rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-white/5">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors" onClick={toggleTheme}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 flex items-center justify-center">
                <Palette size={18} />
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Kechki rejim</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-sm uppercase tracking-wider font-semibold">{theme}</span>
              <div className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${theme === 'dark' ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 flex items-center justify-center">
                <Bell size={18} />
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Bildirishnomalar</span>
            </div>
            <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
          </div>

          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 flex items-center justify-center">
                <Shield size={18} />
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Maxfiylik va Xavfsizlik</span>
            </div>
            <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
          </div>

          <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 flex items-center justify-center">
                <CreditCard size={18} />
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">To'lovlar</span>
            </div>
            <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
          </div>
        </div>

        {/* Settings Group 2 */}
        <div className="bg-white dark:bg-[#1C1C1F] rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 font-semibold">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-500 flex items-center justify-center">
                <HelpCircle size={18} />
              </div>
              <span>Yordam so'rash</span>
            </div>
            <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
          </div>

          <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 flex items-center justify-center">
                <LogOut size={18} />
              </div>
              <span className="text-red-600 dark:text-red-500">Tizimdan chiqish</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
