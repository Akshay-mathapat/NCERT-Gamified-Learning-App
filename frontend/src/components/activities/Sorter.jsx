import { useState } from 'react';

const getSorterConfig = (id) => {
  return {
    bins: ['Category A', 'Category B'],
    items: [
      { id: 1, label: 'Item 1', correctBin: 0 },
      { id: 2, label: 'Item 2', correctBin: 1 },
      { id: 3, label: 'Item 3', correctBin: 0 },
      { id: 4, label: 'Item 4', correctBin: 1 },
    ]
  };
};

export default function Sorter({ activity, onComplete }) {
  const config = getSorterConfig(activity.id);
  const [items, setItems] = useState(config.items);
  const [placedItems, setPlacedItems] = useState([]);
  const [feedback, setFeedback] = useState('');

  const currentItem = items.length > 0 ? items[0] : null;

  const handleSort = (binIndex) => {
    if (!currentItem) return;

    if (currentItem.correctBin === binIndex) {
      setFeedback('Correct!');
      setPlacedItems([...placedItems, { ...currentItem, placedCorrectly: true }]);
    } else {
      setFeedback('Oops, wrong category!');
      setPlacedItems([...placedItems, { ...currentItem, placedCorrectly: false }]);
    }

    const nextItems = items.slice(1);
    setItems(nextItems);

    setTimeout(() => {
      setFeedback('');
      if (nextItems.length === 0) {
        const correctCount = placedItems.filter(p => p.placedCorrectly).length + (currentItem.correctBin === binIndex ? 1 : 0);
        const finalScore = Math.round((correctCount / config.items.length) * 100);
        onComplete(finalScore);
      }
    }, 800);
  };

  if (!currentItem && items.length === 0) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Calculating score...</div>;
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ minHeight: '40px', marginBottom: '1rem', color: feedback === 'Correct!' ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
        {feedback}
      </div>
      
      <div className="glass" style={{ display: 'inline-block', padding: '2rem', fontSize: '1.5rem', marginBottom: '3rem', background: 'var(--primary)', fontWeight: 'bold' }}>
        {currentItem?.label}
      </div>

      <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
        {config.bins.map((bin, idx) => (
          <div 
            key={idx}
            className="glass-panel"
            style={{ padding: '3rem 1rem', cursor: 'pointer', border: '2px dashed var(--surface-border)', transition: 'all 0.2s' }}
            onClick={() => handleSort(idx)}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--surface-border)'}
          >
            <h3 style={{ color: 'var(--text-muted)' }}>{bin}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
