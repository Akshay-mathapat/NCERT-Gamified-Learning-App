import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Star, Flame, Target, BookOpen } from 'lucide-react';

export default function StudentDashboard({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/');
      return;
    }

    // Fetch dashboard data
    fetch(`http://localhost:3000/api/student-dashboard/${user.id}`)
      .then(res => res.json())
      .then(data => setDashboardData(data));

    // Fetch all activities
    fetch(`http://localhost:3000/api/activities`)
      .then(res => res.json())
      .then(data => setActivities(data));

    // Fetch leaderboard
    fetch(`http://localhost:3000/api/leaderboard`)
      .then(res => res.json())
      .then(data => setLeaderboard(data));

  }, [user, navigate]);

  if (!dashboardData) return <div className="container" style={{ textAlign: 'center', marginTop: '2rem' }}>Loading dashboard...</div>;

  const { progress } = dashboardData;
  const completedIds = progress.map(p => p.activity_id);
  const mathsActivities = activities.filter(a => a.subject === 'Maths');
  const scienceActivities = activities.filter(a => a.subject === 'Science');

  const getProgressPercentage = (subjectActivities) => {
    if (subjectActivities.length === 0) return 0;
    const completed = subjectActivities.filter(a => completedIds.includes(a.id)).length;
    return Math.round((completed / subjectActivities.length) * 100);
  };

  const levelProgress = (dashboardData.user.xp % 200) / 200 * 100;

  return (
    <div className="container animate-slide-in">
      <div className="grid" style={{ gridTemplateColumns: '1fr 300px' }}>
        
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Stats Bar */}
          <div className="glass" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy color="var(--warning)" size={32} />
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Current Level</p>
                <h3>Level {dashboardData.user.current_level}</h3>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star color="var(--primary)" size={32} />
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total XP</p>
                <h3>{dashboardData.user.xp} XP</h3>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ background: 'gold', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 'bold' }}>C</div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Coins</p>
                <h3>{dashboardData.user.coins}</h3>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Flame color="var(--danger)" size={32} />
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Daily Streak</p>
                <h3>{dashboardData.user.streak} Days</h3>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="glass">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>XP to next level</span>
              <span>{dashboardData.user.xp % 200} / 200</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${levelProgress}%` }}></div>
            </div>
          </div>

          {/* Subjects */}
          <h2 style={{ marginTop: '1rem' }}><BookOpen style={{ display: 'inline', verticalAlign: 'middle' }} /> Learning Paths</h2>
          
          <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--math-color)' }}>Mathematics</h3>
              <span className="badge math">{getProgressPercentage(mathsActivities)}% Complete</span>
            </div>
            <div className="grid grid-cols-2">
              {mathsActivities.map(activity => {
                const isCompleted = completedIds.includes(activity.id);
                return (
                  <div key={activity.id} className="glass" style={{ padding: '1rem', background: isCompleted ? 'rgba(16, 185, 129, 0.1)' : 'var(--surface)' }}>
                    <div className="badge math" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{activity.topic}</div>
                    <h4>{activity.title}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{activity.description}</p>
                    <button 
                      className="btn btn-primary" 
                      style={{ width: '100%', justifyContent: 'center', background: isCompleted ? 'var(--success)' : 'var(--primary)' }}
                      onClick={() => navigate(`/activity/${activity.id}`)}
                    >
                      {isCompleted ? 'Play Again' : 'Start Activity'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--science-color)' }}>Science</h3>
              <span className="badge science">{getProgressPercentage(scienceActivities)}% Complete</span>
            </div>
            <div className="grid grid-cols-2">
              {scienceActivities.map(activity => {
                const isCompleted = completedIds.includes(activity.id);
                return (
                  <div key={activity.id} className="glass" style={{ padding: '1rem', background: isCompleted ? 'rgba(16, 185, 129, 0.1)' : 'var(--surface)' }}>
                    <div className="badge science" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{activity.topic}</div>
                    <h4>{activity.title}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{activity.description}</p>
                    <button 
                      className="btn btn-primary" 
                      style={{ width: '100%', justifyContent: 'center', background: isCompleted ? 'var(--success)' : 'var(--primary)' }}
                      onClick={() => navigate(`/activity/${activity.id}`)}
                    >
                      {isCompleted ? 'Play Again' : 'Start Activity'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div>
          <div className="glass" style={{ position: 'sticky', top: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target color="var(--primary)" /> Top Explorers
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {leaderboard.map((student, idx) => (
                <div key={student.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem' }}>
                  <div style={{ fontWeight: 'bold', width: '20px', textAlign: 'center', color: idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? '#cd7f32' : 'var(--text-muted)' }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600' }}>{student.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lvl {student.current_level} • 🔥 {student.streak}</div>
                  </div>
                  <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                    {student.xp} XP
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
