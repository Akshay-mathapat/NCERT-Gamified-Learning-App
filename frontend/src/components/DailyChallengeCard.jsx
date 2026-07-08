import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Puzzle, HelpCircle, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DailyChallengeCard({ user }) {
  const [challenge, setChallenge] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/api/dailyChallenge', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setChallenge(data));
  }, []);

  if (!challenge) return null;

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gradient-to-br from-fuchsia-600 to-purple-600 rounded-3xl p-6 shadow-2xl relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform duration-700"><Star size={120} /></div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
          🌟 Daily Challenge
        </h3>
        <p className="text-purple-100 mb-6 font-medium">Complete today's tasks for bonus rewards!</p>

        <div className="space-y-3">
          <button 
            onClick={() => navigate(`/activity/${challenge.quiz_id}`)}
            className="w-full bg-white/20 hover:bg-white/30 text-white p-4 rounded-2xl flex items-center justify-between transition-colors backdrop-blur-sm border border-white/20"
          >
            <div className="flex items-center gap-3">
              <div className="bg-fuchsia-500 p-2 rounded-xl"><HelpCircle size={24} /></div>
              <span className="font-bold text-lg">Today's Quiz</span>
            </div>
            <span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full">Go</span>
          </button>

          <button 
            onClick={() => navigate(`/activity/${challenge.puzzle_id}`)}
            className="w-full bg-white/20 hover:bg-white/30 text-white p-4 rounded-2xl flex items-center justify-between transition-colors backdrop-blur-sm border border-white/20"
          >
            <div className="flex items-center gap-3">
              <div className="bg-purple-500 p-2 rounded-xl"><Puzzle size={24} /></div>
              <span className="font-bold text-lg">Today's Puzzle</span>
            </div>
            <span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full">Go</span>
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between bg-black/20 p-4 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 text-yellow-300 font-bold">
            <Gift size={20} /> Reward:
          </div>
          <div className="font-black text-white">
            +{challenge.reward_xp} XP <span className="text-yellow-400">|</span> +{challenge.reward_coins} Coins
          </div>
        </div>
      </div>
    </motion.div>
  );
}
