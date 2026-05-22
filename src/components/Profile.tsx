import React, { useState } from 'react';
import { User, Settings, Bell, Palette, ChevronRight, LogOut, HelpCircle, Shield, CreditCard, Sparkles } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

type Props = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

export default function Profile({ theme, toggleTheme }: Props) {
  const user = auth.currentUser;

  return (
    <div className="p-4 space-y-6 animate-in fade-in pb-24 min-h-full">
      <div className="flex flex-col items-center mt-6 mb-8">
        {user?.photoURL ? (
          <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-white dark:border-[#1C1C1F] shadow-xl shadow-indigo-500/20 mb-4 relative z-10">
            <img src={user.photoURL} alt="profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        ) : (
          <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[32px] flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-indigo-500/30 mb-4 relative z-10 border-4 border-white dark:border-[#1C1C1F]">
            {user?.displayName ? user.displayName[0].toUpperCase() : 'U'}
          </div>
        )}
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{user?.displayName || 'Unknown User'}</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">{user?.email}</p>
        
        <div className="mt-4 flex gap-3">
          <div className="bg-white dark:bg-[#1C1C1F] px-4 py-2 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Premium Account</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Settings Group 1 */}
        <div className="bg-white dark:bg-[#1C1C1F] rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-white/5 p-2">
          <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors" onClick={toggleTheme}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 flex items-center justify-center shadow-inner dark:shadow-none">
                <Palette size={20} />
              </div>
              <span className="font-bold text-[15px] text-slate-800 dark:text-slate-200">Kechki rejim</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-xs uppercase tracking-wider font-bold">{theme}</span>
              <div className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors ${theme === 'dark' ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors mt-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 flex items-center justify-center shadow-inner dark:shadow-none">
                <Bell size={20} />
              </div>
              <span className="font-bold text-[15px] text-slate-800 dark:text-slate-200">Bildirishnomalar</span>
            </div>
            <ChevronRight size={20} className="text-slate-300 dark:text-slate-600" />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors mt-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 flex items-center justify-center shadow-inner dark:shadow-none">
                <Shield size={20} />
              </div>
              <span className="font-bold text-[15px] text-slate-800 dark:text-slate-200">Maxfiylik va Xavfsizlik</span>
            </div>
            <ChevronRight size={20} className="text-slate-300 dark:text-slate-600" />
          </div>
        </div>

        {/* Settings Group 2 */}
        <div className="bg-white dark:bg-[#1C1C1F] rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-white/5 p-2 font-semibold">
          <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-500 flex items-center justify-center shadow-inner dark:shadow-none">
                <HelpCircle size={20} />
              </div>
              <span className="font-bold text-[15px] text-slate-800 dark:text-slate-200">Yordam so'rash</span>
            </div>
            <ChevronRight size={20} className="text-slate-300 dark:text-slate-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
