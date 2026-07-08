import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock rule-based data generator based on activity ID
const getQuizConfig = (id) => {
  // A real implementation would fetch this from a config JSON file or DB
  return {
    questions: [
      { q: 'Which of the following is correct?', options: ['Option A', 'Option B', 'Option C', 'Option D'], answer: 1 },
      { q: 'Identify the true statement.', options: ['Statement 1', 'Statement 2', 'Statement 3', 'Statement 4'], answer: 0 },
      { q: 'What is the final result?', options: ['10', '20', '30', '40'], answer: 2 },
    ]
  };
};

export default function Quiz({ activity, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const config = getQuizConfig(activity.id);

  const question = config.questions[currentIdx];

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    
    if (idx === question.answer) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (currentIdx < config.questions.length - 1) {
        setCurrentIdx(c => c + 1);
        setSelected(null);
      } else {
        const finalScore = Math.round(((score + (idx === question.answer ? 1 : 0)) / config.questions.length) * 100);
        onComplete(finalScore);
      }
    }, 1000);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between text-slate-400 font-semibold mb-6 text-sm">
        <span>Question {currentIdx + 1} of {config.questions.length}</span>
        <span>Score: {score}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold mb-8 text-white text-center">{question.q}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((opt, idx) => {
              let bgClass = 'bg-slate-800/50 border-white/10 hover:bg-indigo-500/20 hover:border-indigo-500/50 text-white';
              
              if (selected !== null) {
                if (idx === question.answer) {
                  bgClass = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400';
                } else if (idx === selected) {
                  bgClass = 'bg-red-500/20 border-red-500/50 text-red-400';
                }
              }

              return (
                <button 
                  key={idx}
                  className={`p-4 rounded-xl border text-lg text-left transition-all ${bgClass} ${selected !== null ? 'opacity-80' : ''}`}
                  onClick={() => handleSelect(idx)}
                  disabled={selected !== null}
                >
                  {opt}
                </button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
