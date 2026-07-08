import { Medal } from 'lucide-react';

const ALL_BADGES = [
  { id: 'perfect_score', icon: '🎯', title: 'Sharpshooter', desc: 'Score 100% on an activity' },
  { id: 'level_2_reached', icon: '⭐', title: 'Rising Star', desc: 'Reach Level 2' },
  { id: 'math_whiz', icon: '📐', title: 'Math Whiz', desc: 'Complete 3 Math topics' },
  { id: 'science_pro', icon: '🔬', title: 'Science Pro', desc: 'Complete 3 Science topics' }
];

export default function Achievements({ earnedBadgeIds = [] }) {
  return (
    <div className="glass-panel" style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Medal color="var(--warning)" /> Achievements Showcase
      </h3>
      
      <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
        {ALL_BADGES.map(badge => {
          const isEarned = earnedBadgeIds.includes(badge.id);
          return (
            <div 
              key={badge.id} 
              className="glass" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                padding: '0.75rem',
                opacity: isEarned ? 1 : 0.4,
                filter: isEarned ? 'none' : 'grayscale(100%)',
                border: isEarned ? '1px solid var(--warning)' : '1px solid var(--surface-border)'
              }}
            >
              <div style={{ fontSize: '2rem' }}>{badge.icon}</div>
              <div>
                <div style={{ fontWeight: 'bold' }}>{badge.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{badge.desc}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
