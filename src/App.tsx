import React, { useState, useEffect } from 'react';
import { useGoals } from './hooks/useGoals';
import Dashboard from './components/Dashboard';
import GoalDetail from './components/GoalDetail';
import GoalModal from './components/GoalModal';
import Stats from './components/Stats';
import Reminders from './components/Reminders';
import Profile from './components/Profile';
import { Goal } from './types';
import { Wallet, BellRing, Home, PieChart, Plus, Bell, User } from 'lucide-react';
import { auth } from './lib/firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function App() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return () => unsub();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const { goals, addGoal, updateGoal, deleteGoal, addTransaction, deleteTransaction, loading: goalsLoading } = useGoals();
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

  if (isAuthLoading) {
    return <div className="min-h-screen bg-[#09090B] flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!currentUser) {
    return (
       <div className={`${theme}`}>
          <div className="min-h-screen bg-slate-100 dark:bg-[#09090B] flex items-center justify-center p-6 text-slate-900 dark:text-white">
             <div className="bg-white dark:bg-[#121214] p-8 rounded-[40px] max-w-sm w-full shadow-2xl border border-slate-200 dark:border-white/5 text-center space-y-6">
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
                  <Wallet size={36} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight mb-2">Maqsadli Jamg'arma</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Orzularingiz uchun professional jamg'arish tizimi</p>
                </div>
                <button onClick={loginWithGoogle} className="w-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-[0.98]">
                  Google orqali kiring
                </button>
             </div>
          </div>
       </div>
    )
  }

  return (
    <div className={theme}>
      <div className="min-h-screen bg-white dark:bg-[#09090B] text-slate-900 dark:text-slate-200 font-sans w-full flex flex-col items-center transition-colors duration-300">
        <div className="w-full h-full min-h-screen max-w-xl bg-white dark:bg-[#121214] relative flex flex-col overflow-hidden transition-colors duration-300 shadow-none sm:shadow-2xl sm:border-x border-slate-200 dark:border-[#1C1C1F]">
          
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
          <div className="fixed bottom-0 w-full max-w-xl pb-6 sm:pb-5 pt-3 bg-white/95 dark:bg-[#121214]/95 backdrop-blur-lg border-t border-slate-200 dark:border-white/5 px-2 grid grid-cols-5 items-end justify-items-center shrink-0 z-20 transition-colors duration-300">
            <button onClick={() => {setActiveTab('home'); setSelectedGoalId(null);}} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'home' && !selectedGoal ? 'opacity-100 scale-105' : 'opacity-50 hover:opacity-100'}`}>
              <Home size={22} className={activeTab === 'home' && !selectedGoal ? 'text-indigo-600 dark:text-indigo-400 stroke-[2.5px]' : 'text-slate-500 dark:text-slate-400'} />
              <span className="text-[10px] font-bold tracking-wide">Asosiy</span>
            </button>
            
            <button onClick={() => {setActiveTab('stats'); setSelectedGoalId(null);}} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'stats' && !selectedGoal ? 'opacity-100 scale-105' : 'opacity-50 hover:opacity-100'}`}>
              <PieChart size={22} className={activeTab === 'stats' && !selectedGoal ? 'text-indigo-600 dark:text-indigo-400 stroke-[2.5px]' : 'text-slate-500 dark:text-slate-400'} />
              <span className="text-[10px] font-bold tracking-wide">Statistika</span>
            </button>

            <div className="relative w-full h-full flex justify-center items-start">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="-mt-6 sm:-mt-8 w-14 h-14 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center shadow-xl shadow-indigo-600/30 dark:shadow-indigo-500/20 border-[6px] border-white dark:border-[#121214] hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-all active:scale-90 text-white z-30"
              >
                <Plus size={26} strokeWidth={3} />
              </button>
            </div>

            <button onClick={() => {setActiveTab('reminders'); setSelectedGoalId(null);}} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'reminders' && !selectedGoal ? 'opacity-100 scale-105' : 'opacity-50 hover:opacity-100'}`}>
              <Bell size={22} className={activeTab === 'reminders' && !selectedGoal ? 'text-indigo-600 dark:text-indigo-400 stroke-[2.5px]' : 'text-slate-500 dark:text-slate-400'} />
              <span className="text-[10px] font-bold tracking-wide">Eslatma</span>
            </button>

            <button onClick={() => {setActiveTab('profile'); setSelectedGoalId(null);}} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'profile' && !selectedGoal ? 'opacity-100 scale-105' : 'opacity-50 hover:opacity-100'}`}>
              <User size={22} className={activeTab === 'profile' && !selectedGoal ? 'text-indigo-600 dark:text-indigo-400 stroke-[2.5px]' : 'text-slate-500 dark:text-slate-400'} />
              <span className="text-[10px] font-bold tracking-wide">Profil</span>
            </button>
          </div>

          <div className="h-1.5 w-32 bg-slate-300 dark:bg-slate-800 rounded-full absolute bottom-2 left-1/2 -translate-x-1/2 sm:hidden z-30 pointer-events-none"></div>

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
