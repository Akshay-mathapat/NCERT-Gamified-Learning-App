import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Rocket, Book, Star, Activity } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden font-sans">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-slate-900/50 backdrop-blur-md fixed w-full top-0 z-50 border-b border-white/10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">NCERT Gamified</h1>
        <div className="space-x-4">
          <button onClick={() => navigate('/login')} className="px-4 py-2 text-slate-300 hover:text-white transition-colors">Log In</button>
          <button onClick={() => navigate('/login')} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-semibold transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)]">Sign Up Free</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <motion.div 
          className="lg:w-1/2 space-y-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl lg:text-7xl font-extrabold leading-tight">
            Learn Math & Science <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">The Fun Way!</span>
          </h2>
          <p className="text-xl text-slate-400">
            Embark on a learning journey through the Math Castle and Science Island. Earn coins, unlock badges, and customize your avatar while mastering NCERT concepts.
          </p>
          <div className="flex gap-4 pt-4">
            <button onClick={() => navigate('/login')} className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-lg rounded-xl font-bold transition-transform hover:scale-105 shadow-lg shadow-indigo-500/30 flex items-center gap-2">
              <Rocket /> Start Your Adventure
            </button>
          </div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div 
          className="lg:w-1/2 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
          <div className="relative glass-panel border border-white/20 p-8 rounded-2xl shadow-2xl bg-slate-800/80 backdrop-blur-xl">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🦸‍♂️</div>
                <div>
                  <div className="font-bold">Student Pro</div>
                  <div className="text-sm text-yellow-400 font-semibold">Level 5 Explorer</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-400">1,250 XP</div>
                <div className="text-sm text-slate-400">🔥 7 Day Streak</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-12 bg-slate-700/50 rounded-lg animate-pulse flex items-center px-4"><span className="text-emerald-400 mr-2">✓</span> Photosynthesis Quiz Passed</div>
              <div className="h-12 bg-slate-700/50 rounded-lg animate-pulse delay-75 flex items-center px-4"><span className="text-emerald-400 mr-2">✓</span> Algebra Balancer Passed</div>
              <div className="h-12 bg-indigo-500/20 border border-indigo-500/50 rounded-lg flex items-center px-4 text-indigo-300 font-semibold">⭐ New Badge Unlocked: Math Whiz!</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-slate-400 text-lg">Designed specifically for NCERT syllabus with built-in gamification.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -10 }} className="glass-panel p-8 rounded-2xl border border-white/10 bg-slate-800/50 text-center">
              <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6"><Book size={32} /></div>
              <h3 className="text-xl font-bold mb-3">Interactive Topics</h3>
              <p className="text-slate-400">Over 30 distinct activities across Mathematics and Science using puzzles, drag-drops, and quizzes.</p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="glass-panel p-8 rounded-2xl border border-white/10 bg-slate-800/50 text-center">
              <div className="w-16 h-16 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6"><Star size={32} /></div>
              <h3 className="text-xl font-bold mb-3">Earn Rewards</h3>
              <p className="text-slate-400">Collect XP, Coins, and Badges. Spin the daily wheel and customize your learning avatar.</p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="glass-panel p-8 rounded-2xl border border-white/10 bg-slate-800/50 text-center">
              <div className="w-16 h-16 bg-pink-500/20 text-pink-400 rounded-full flex items-center justify-center mx-auto mb-6"><Activity size={32} /></div>
              <h3 className="text-xl font-bold mb-3">Track Progress</h3>
              <p className="text-slate-400">Detailed dashboards for both students and teachers to monitor completion, streaks, and class performance.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 text-center px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to start your adventure?</h2>
        <button onClick={() => navigate('/login')} className="px-10 py-5 bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-xl rounded-full font-bold transition-transform hover:scale-105 shadow-xl shadow-pink-500/30">
          Join for Free Today
        </button>
      </section>

    </div>
  );
}
