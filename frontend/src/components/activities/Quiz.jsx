import { useState } from 'react';

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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        <span>Question {currentIdx + 1} of {config.questions.length}</span>
        <span>Score: {score}</span>
      </div>
      
      <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>{question.q}</h3>

      <div className="grid grid-cols-2">
        {question.options.map((opt, idx) => {
          let bg = 'var(--surface)';
          let border = '1px solid var(--surface-border)';
          if (selected !== null) {
            if (idx === question.answer) {
              bg = 'rgba(16, 185, 129, 0.2)';
              border = '1px solid var(--success)';
            } else if (idx === selected) {
              bg = 'rgba(239, 68, 68, 0.2)';
              border = '1px solid var(--danger)';
            }
          }

          return (
            <button 
              key={idx}
              className="btn"
              style={{
                background: bg,
                border: border,
                color: 'white',
                padding: '1.5rem',
                justifyContent: 'center',
                fontSize: '1.25rem',
                transition: 'all 0.2s',
                transform: selected === null ? 'none' : 'scale(0.98)'
              }}
              onClick={() => handleSelect(idx)}
              disabled={selected !== null}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  );
}
