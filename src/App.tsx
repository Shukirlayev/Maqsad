import React, { useState } from 'react';
import { useGoals } from './hooks/useGoals';
import Dashboard from './components/Dashboard';
import GoalDetail from './components/GoalDetail';
import GoalModal from './components/GoalModal';
import Stats from './components/Stats';
import Reminders from './components/Reminders';
import Profile from './components/Profile';
import { Goal } from './types';
import { Wallet, BellRing, Home, PieChart, Plus, Bell, User } from 'lucide-react';

export default function App() {
  const { goals, addGoal, updateGoal, deleteGoal, addTransaction, deleteTransaction } = useGoals();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const selectedGoal = goals.find((g) => g.id === selectedGoalId) || null;

  const now = new Date();
  const remindersCount = goals.filter(g => {
    if (!g.deadline || g.currentAmount >= g.targetAmount) return false;
    const daysLeft = Math.ceil((new Date(g.deadline).getTime() - now.getTime()) / (1000 * 3600 * 24));
    return daysLeft > 0 && daysLeft <= 7;
  }).length;

  return (
    <div className={theme}>
      <div className="min-h-screen bg-slate-100 dark:bg-[#09090B] text-slate-900 dark:text-slate-200 font-sans w-full flex flex-col items-center justify-center transition-colors duration-300">
        <div className="w-full h-full min-h-screen sm:min-h-0 sm:w-[380px] sm:h-[800px] bg-white dark:bg-[#121214] sm:rounded-[48px] sm:border-[8px] border-slate-200 dark:border-[#1C1C1F] sm:shadow-[0_0_80px_rgba(0,0,0,0.6)] relative flex flex-col overflow-hidden transition-colors duration-300">
          
          {/* Header */}
          <header className="absolute top-0 w-full z-10 bg-white/90 dark:bg-[#121214]/90 backdrop-blur-lg border-b border-slate-200 dark:border-white/5 px-6 py-4 flex items-center justify-between transition-colors duration-300">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveTab('home'); setSelectedGoalId(null); }}>
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Wallet size={16} />
              </div>
              <h1 className="font-semibold text-lg tracking-tight text-slate-900 dark:text-white">Jamg'arma</h1>
            </div>
            <div className="relative cursor-pointer" onClick={() => { setActiveTab('reminders'); setSelectedGoalId(null); }}>
               <BellRing size={20} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors" />
               {remindersCount > 0 && (
                 <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-500 shadow-sm shadow-indigo-500/50 dark:bg-indigo-400 rounded-full animate-pulse border border-white dark:border-[#121214]"></span>
               )}
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto scrollbar-hide pt-[72px]">
             {selectedGoal ? (
               <GoalDetail 
                 goal={selectedGoal} 
                 onBack={() => setSelectedGoalId(null)}
                 onAddTransaction={(amount, note) => addTransaction(selectedGoal.id, amount, note)}
                 onDeleteTransaction={(transId) => deleteTransaction(selectedGoal.id, transId)}
                 onDeleteGoal={() => {
                   deleteGoal(selectedGoal.id);
                   setSelectedGoalId(null);
                 }}
                 onEditGoal={(updates) => updateGoal(selectedGoal.id, updates)}
               />
             ) : activeTab === 'home' ? (
               <Dashboard 
                 goals={goals} 
                 onSelectGoal={setSelectedGoalId} 
                 onAddGoal={() => setIsModalOpen(true)} 
               />
             ) : activeTab === 'stats' ? (
               <Stats goals={goals} />
             ) : activeTab === 'reminders' ? (
               <Reminders goals={goals} />
             ) : (
               <Profile theme={theme} toggleTheme={toggleTheme} />
             )}
          </main>

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 w-full pb-4 sm:pb-0 pt-2 sm:h-20 bg-white/95 dark:bg-[#121214]/95 backdrop-blur-lg border-t border-slate-200 dark:border-white/5 px-6 flex justify-between items-center sm:rounded-b-[40px] shrink-0 z-20 transition-colors duration-300">
            <button onClick={() => {setActiveTab('home'); setSelectedGoalId(null);}} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'home' && !selectedGoal ? 'opacity-100 scale-105' : 'opacity-50 hover:opacity-100'}`}>
              <Home size={22} className={activeTab === 'home' && !selectedGoal ? 'text-indigo-600 dark:text-indigo-400 stroke-[2.5px]' : 'text-slate-500 dark:text-slate-400'} />
              <span className={`text-[10px] font-bold tracking-wide ${activeTab === 'home' && !selectedGoal ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 px-2'}`}>Asosiy</span>
            </button>
            
            <button onClick={() => {setActiveTab('stats'); setSelectedGoalId(null);}} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'stats' && !selectedGoal ? 'opacity-100 scale-105' : 'opacity-50 hover:opacity-100'}`}>
              <PieChart size={22} className={activeTab === 'stats' && !selectedGoal ? 'text-indigo-600 dark:text-indigo-400 stroke-[2.5px]' : 'text-slate-500 dark:text-slate-400'} />
              <span className={`text-[10px] font-bold tracking-wide flex justify-center ${activeTab === 'stats' && !selectedGoal ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 px-2'}`}>Statistika</span>
            </button>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-14 h-14 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center -mt-8 sm:-mt-10 mb-2 shadow-xl shadow-indigo-600/30 dark:shadow-indigo-500/20 border-[6px] border-white dark:border-[#121214] hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-all active:scale-90 text-white z-30"
            >
              <Plus size={26} strokeWidth={3} />
            </button>

            <button onClick={() => {setActiveTab('reminders'); setSelectedGoalId(null);}} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'reminders' && !selectedGoal ? 'opacity-100 scale-105' : 'opacity-50 hover:opacity-100'}`}>
              <Bell size={22} className={activeTab === 'reminders' && !selectedGoal ? 'text-indigo-600 dark:text-indigo-400 stroke-[2.5px]' : 'text-slate-500 dark:text-slate-400'} />
              <span className={`text-[10px] font-bold tracking-wide ${activeTab === 'reminders' && !selectedGoal ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>Eslatma</span>
            </button>

            <button onClick={() => {setActiveTab('profile'); setSelectedGoalId(null);}} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'profile' && !selectedGoal ? 'opacity-100 scale-105' : 'opacity-50 hover:opacity-100'}`}>
              <User size={22} className={activeTab === 'profile' && !selectedGoal ? 'text-indigo-600 dark:text-indigo-400 stroke-[2.5px]' : 'text-slate-500 dark:text-slate-400'} />
              <span className={`text-[10px] font-bold tracking-wide ${activeTab === 'profile' && !selectedGoal ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>Profil</span>
            </button>
          </div>

          <div className="h-1.5 w-32 bg-slate-300 dark:bg-slate-800 rounded-full mx-auto mb-2 absolute bottom-2 left-1/2 -translate-x-1/2 sm:hidden z-20"></div>

          {isModalOpen && (
            <GoalModal 
              onClose={() => setIsModalOpen(false)} 
              onSave={(data) => {
                addGoal(data);
                setIsModalOpen(false);
                setActiveTab('home');
                setSelectedGoalId(null);
              }} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
