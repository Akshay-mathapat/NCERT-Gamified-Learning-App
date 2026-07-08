import { useState } from 'react';

const getDragDropConfig = (id) => {
  return {
    items: ['Label 1', 'Label 2', 'Label 3'],
    slots: [
      { id: 'slot1', label: 'Position 1', correctItem: 'Label 1' },
      { id: 'slot2', label: 'Position 2', correctItem: 'Label 2' },
      { id: 'slot3', label: 'Position 3', correctItem: 'Label 3' }
    ]
  };
};

export default function DragDrop({ activity, onComplete }) {
  const config = getDragDropConfig(activity.id);
  const [availableItems, setAvailableItems] = useState(config.items);
  const [placedItems, setPlacedItems] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSlotClick = (slotId) => {
    if (!selectedItem) return;
    
    setPlacedItems(prev => ({
      ...prev,
      [slotId]: selectedItem
    }));
    
    setAvailableItems(prev => prev.filter(i => i !== selectedItem));
    setSelectedItem(null);
  };

  const handleCheck = () => {
    let correct = 0;
    config.slots.forEach(slot => {
      if (placedItems[slot.id] === slot.correctItem) {
        correct++;
      }
    });
    
    const score = Math.round((correct / config.slots.length) * 100);
    onComplete(score);
  };

  return (
    <div>
      <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-muted)' }}>
        Select an item below, then tap the correct slot to place it.
      </p>

      {/* Available Items */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {availableItems.map((item, idx) => (
          <button 
            key={idx}
            className="btn glass"
            style={{ 
              border: selectedItem === item ? '2px solid var(--primary)' : '1px solid var(--surface-border)',
              background: selectedItem === item ? 'rgba(99, 102, 241, 0.2)' : 'var(--surface)'
            }}
            onClick={() => setSelectedItem(selectedItem === item ? null : item)}
          >
            {item}
          </button>
        ))}
        {availableItems.length === 0 && <span style={{ color: 'var(--success)' }}>All items placed!</span>}
      </div>

      {/* Slots */}
      <div className="grid grid-cols-3" style={{ gap: '1rem', marginBottom: '3rem' }}>
        {config.slots.map(slot => (
          <div 
            key={slot.id}
            className="glass-panel"
            style={{ 
              minHeight: '120px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '2px dashed var(--surface-border)',
              cursor: selectedItem ? 'pointer' : 'default',
              transition: 'all 0.2s'
            }}
            onClick={() => handleSlotClick(slot.id)}
            onMouseOver={(e) => { if(selectedItem) e.currentTarget.style.borderColor = 'var(--primary)' }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--surface-border)' }}
          >
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{slot.label}</span>
            {placedItems[slot.id] && (
              <div className="badge" style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem' }}>
                {placedItems[slot.id]}
              </div>
            )}
          </div>
        ))}
      </div>

      {availableItems.length === 0 && (
        <div style={{ textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={handleCheck}>Submit Answers</button>
        </div>
      )}
    </div>
  );
}
