import { useState } from 'react';
import { Gift } from 'lucide-react';

const prizes = [
  { type: 'coins', amount: 5, label: '5 Coins', color: '#f59e0b' },
  { type: 'xp', amount: 20, label: '20 XP', color: '#6366f1' },
  { type: 'coins', amount: 15, label: '15 Coins', color: '#f59e0b' },
  { type: 'xp', amount: 50, label: '50 XP', color: '#6366f1' },
  { type: 'coins', amount: 2, label: '2 Coins', color: '#f59e0b' },
  { type: 'xp', amount: 10, label: '10 XP', color: '#6366f1' }
];

export default function SpinWheel({ user, onSpinComplete }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  
  const today = new Date().toISOString().split('T')[0];
  const canSpin = user.last_spin_date !== today;

  const handleSpin = async () => {
    if (!canSpin || isSpinning) return;
    
    setIsSpinning(true);
    setResult(null);

    // Pick a random prize
    const prizeIdx = Math.floor(Math.random() * prizes.length);
    const prize = prizes[prizeIdx];

    // Simulate wheel spin delay
    setTimeout(async () => {
      try {
        const res = await fetch('http://localhost:3000/api/spin-wheel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, prizeType: prize.type, prizeAmount: prize.amount })
        });
        if (res.ok) {
          setResult(prize);
          onSpinComplete();
        }
      } catch (e) {
        console.error("Spin failed", e);
      }
      setIsSpinning(false);
    }, 2000);
  };

  return (
    <div className="glass-panel" style={{ textAlign: 'center' }}>
      <h3 style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
        <Gift color="var(--secondary)" /> Daily Reward Wheel
      </h3>
      
      {!canSpin && !result && (
        <p style={{ color: 'var(--text-muted)' }}>You've already spun today. Come back tomorrow!</p>
      )}

      {result && (
        <div className="animate-pulse-glow" style={{ marginBottom: '1rem', color: 'var(--success)', fontWeight: 'bold' }}>
          You won {result.label}!
        </div>
      )}

      {/* Simple Wheel Visualization */}
      <div 
        style={{
          width: '150px', height: '150px', 
          borderRadius: '50%',
          background: 'conic-gradient(#f59e0b 0% 33%, #6366f1 33% 66%, #f59e0b 66% 100%)',
          margin: '0 auto 1.5rem',
          border: '4px solid var(--surface-border)',
          transition: 'transform 2s cubic-bezier(0.25, 0.1, 0.25, 1)',
          transform: isSpinning ? 'rotate(1080deg)' : 'rotate(0deg)'
        }}
      />
      
      <button 
        className="btn btn-primary" 
        onClick={handleSpin}
        disabled={!canSpin || isSpinning}
      >
        {isSpinning ? 'Spinning...' : canSpin ? 'Spin Now!' : 'Come Back Tomorrow'}
      </button>
    </div>
  );
}
