import { useState } from 'react';
import { User } from 'lucide-react';

const avatars = [
  { id: 'av1', url: '👩‍🚀', cost: 0, name: 'Astronaut' },
  { id: 'av2', url: '🦸‍♂️', cost: 50, name: 'Hero' },
  { id: 'av3', url: '🧙‍♀️', cost: 100, name: 'Wizard' },
  { id: 'av4', url: '🥷', cost: 150, name: 'Ninja' }
];

export default function AvatarShop({ user, onAvatarUpdate }) {
  const [error, setError] = useState('');

  const handleBuy = async (avatar) => {
    if (user.coins < avatar.cost) {
      setError('Not enough coins!');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/buy-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, avatarUrl: avatar.url, cost: avatar.cost })
      });
      const data = await res.json();
      if (res.ok) {
        onAvatarUpdate();
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError('Purchase failed');
    }
  };

  return (
    <div className="glass-panel">
      <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <User color="var(--primary)" /> Avatar Shop
      </h3>
      
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        {avatars.map(av => {
          const isOwned = user.avatar_url === av.url;
          return (
            <div key={av.id} className="glass" style={{ minWidth: '120px', textAlign: 'center', border: isOwned ? '2px solid var(--success)' : '1px solid var(--surface-border)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{av.url}</div>
              <div style={{ fontWeight: 'bold' }}>{av.name}</div>
              <div style={{ color: 'gold', marginBottom: '0.5rem' }}>{av.cost} Coins</div>
              
              <button 
                className={`btn ${isOwned ? 'btn-secondary' : 'btn-primary'}`} 
                style={{ width: '100%', padding: '0.25rem', fontSize: '0.875rem' }}
                onClick={() => handleBuy(av)}
                disabled={isOwned}
              >
                {isOwned ? 'Equipped' : 'Buy'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  );
}
