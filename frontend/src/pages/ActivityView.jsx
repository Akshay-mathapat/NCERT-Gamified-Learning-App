import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Quiz from '../components/activities/Quiz';
import Sorter from '../components/activities/Sorter';
import Match from '../components/activities/Match';
import DragDrop from '../components/activities/DragDrop';

export default function ActivityView({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [rewardData, setRewardData] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetch('http://localhost:3000/api/activities')
      .then(res => res.json())
      .then(data => {
        const found = data.find(a => a.id === id);
        if (found) setActivity(found);
      });
  }, [id, user, navigate]);

  const handleComplete = async (score) => {
    try {
      const res = await fetch('http://localhost:3000/api/submit-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, activityId: id, score })
      });
      const data = await res.json();
      setRewardData({ ...data, score });
      setShowResult(true);
      // Update local user state if needed, though they will refetch on dashboard load
    } catch (err) {
      console.error('Failed to submit score');
    }
  };

  if (!activity) return <div className="container" style={{ textAlign: 'center', marginTop: '2rem' }}>Loading activity...</div>;

  const renderActivityComponent = () => {
    // We categorize the 30 activities into a few scalable templates
    switch (activity.type) {
      case 'quiz':
      case 'calculate':
      case 'measure':
      case 'converter':
        return <Quiz activity={activity} onComplete={handleComplete} />;
      case 'sorter':
        return <Sorter activity={activity} onComplete={handleComplete} />;
      case 'match':
        return <Match activity={activity} onComplete={handleComplete} />;
      case 'drag-drop':
      case 'sequence':
      case 'visual':
      case 'identify':
      case 'puzzle':
        return <DragDrop activity={activity} onComplete={handleComplete} />;
      default:
        return <div>Activity template not found.</div>;
    }
  };

  return (
    <div className="container animate-slide-in">
      <button className="btn" style={{ background: 'transparent', color: 'var(--text-muted)', marginBottom: '1rem', padding: 0 }} onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
        {showResult ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Activity Complete!</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', margin: '2rem 0' }}>
              <div className="glass" style={{ width: '150px' }}>
                <p style={{ color: 'var(--text-muted)' }}>Score</p>
                <h3 style={{ fontSize: '2rem' }}>{rewardData.score}%</h3>
              </div>
              <div className="glass" style={{ width: '150px' }}>
                <p style={{ color: 'var(--text-muted)' }}>XP Earned</p>
                <h3 style={{ fontSize: '2rem', color: 'var(--primary)' }}>+{rewardData.xpEarned}</h3>
              </div>
              <div className="glass" style={{ width: '150px' }}>
                <p style={{ color: 'var(--text-muted)' }}>Coins</p>
                <h3 style={{ fontSize: '2rem', color: 'gold' }}>+{rewardData.coinsEarned}</h3>
              </div>
            </div>
            {rewardData.levelUp && (
              <h3 style={{ color: 'var(--success)', marginBottom: '2rem' }} className="animate-pulse-glow">
                🎉 Congratulations! You reached Level {rewardData.newLevel}! 🎉
              </h3>
            )}
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Continue Learning</button>
          </div>
        ) : (
          <>
            <div style={{ borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
              <span className={`badge ${activity.subject.toLowerCase()}`}>{activity.subject} &gt; {activity.topic}</span>
              <h2 style={{ marginTop: '0.5rem' }}>{activity.title}</h2>
              <p style={{ color: 'var(--text-muted)' }}>{activity.description}</p>
            </div>
            
            {/* Inject Game Logic Here */}
            {renderActivityComponent()}
          </>
        )}
      </div>
    </div>
  );
}
