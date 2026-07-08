import { useState, useEffect } from 'react';

const getMatchConfig = (id) => {
  return {
    pairs: [
      { left: 'Term A', right: 'Definition A', id: 1 },
      { left: 'Term B', right: 'Definition B', id: 2 },
      { left: 'Term C', right: 'Definition C', id: 3 },
    ]
  };
};

export default function Match({ activity, onComplete }) {
  const config = getMatchConfig(activity.id);
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);
  const [mistakes, setMistakes] = useState(0);

  useEffect(() => {
    // Shuffle logic
    const shuffledLeft = [...config.pairs].sort(() => Math.random() - 0.5);
    const shuffledRight = [...config.pairs].sort(() => Math.random() - 0.5);
    setLeftItems(shuffledLeft);
    setRightItems(shuffledRight);
  }, []);

  useEffect(() => {
    if (selectedLeft !== null && selectedRight !== null) {
      if (selectedLeft === selectedRight) {
        setMatchedIds(prev => [...prev, selectedLeft]);
        setSelectedLeft(null);
        setSelectedRight(null);
        
        if (matchedIds.length + 1 === config.pairs.length) {
          setTimeout(() => {
            const accuracy = Math.max(0, 100 - (mistakes * 20));
            onComplete(accuracy);
          }, 1000);
        }
      } else {
        setMistakes(m => m + 1);
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 800);
      }
    }
  }, [selectedLeft, selectedRight]);

  return (
    <div>
      <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-muted)' }}>Match the items on the left with the correct items on the right.</p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
        
        {/* Left Column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {leftItems.map((item) => {
            const isMatched = matchedIds.includes(item.id);
            const isSelected = selectedLeft === item.id;
            return (
              <button
                key={item.id}
                className="btn glass"
                style={{ 
                  justifyContent: 'center', 
                  opacity: isMatched ? 0 : 1, 
                  pointerEvents: isMatched ? 'none' : 'auto',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--surface-border)' 
                }}
                onClick={() => setSelectedLeft(item.id)}
              >
                {item.left}
              </button>
            )
          })}
        </div>

        {/* Right Column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {rightItems.map((item) => {
            const isMatched = matchedIds.includes(item.id);
            const isSelected = selectedRight === item.id;
            return (
              <button
                key={item.id}
                className="btn glass"
                style={{ 
                  justifyContent: 'center', 
                  opacity: isMatched ? 0 : 1, 
                  pointerEvents: isMatched ? 'none' : 'auto',
                  border: isSelected ? '2px solid var(--secondary)' : '1px solid var(--surface-border)'
                }}
                onClick={() => setSelectedRight(item.id)}
              >
                {item.right}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
