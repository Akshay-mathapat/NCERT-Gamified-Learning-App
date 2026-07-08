import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, TrendingUp, Award, Calendar } from 'lucide-react';

export default function ParentDashboard({ user }) {
  const [childId, setChildId] = useState('');
  const [childData, setChildData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'parent') {
      navigate('/');
    }
  }, [user, navigate]);

  const fetchChild = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`http://localhost:3000/api/parent-dashboard/${childId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (!res.ok) setError(data.error);
      else setChildData(data);
    } catch (err) {
      setError('Failed to fetch data');
    }
  };

  return (
    <div className="container animate-slide-in p-6">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Eye className="text-emerald-500" size={36} /> Parent Portal
      </h2>

      {!childData ? (
        <div className="glass-panel max-w-md mx-auto">
          <h3 className="text-xl font-bold mb-4">Link Student Account</h3>
          {error && <div className="text-red-400 bg-red-500/20 p-2 rounded mb-4">{error}</div>}
          <form onSubmit={fetchChild}>
            <input 
              type="number" 
              placeholder="Enter Child's Student ID" 
              className="w-full p-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:border-emerald-500 focus:outline-none mb-4"
              value={childId}
              onChange={(e) => setChildId(e.target.value)}
              required
            />
            <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-bold">
              View Progress
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-between items-center bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20">
            <div>
              <h3 className="text-2xl font-bold">Student: {childData.child.name}</h3>
              <p className="text-emerald-400">Level {childData.child.current_level}</p>
            </div>
            <button onClick={() => setChildData(null)} className="text-slate-400 hover:text-white">View Another</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel flex items-center gap-4">
              <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-400"><TrendingUp size={32} /></div>
              <div>
                <p className="text-slate-400">Total XP</p>
                <h3 className="text-2xl font-bold">{childData.child.xp}</h3>
              </div>
            </div>
            <div className="glass-panel flex items-center gap-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg text-yellow-400"><Award size={32} /></div>
              <div>
                <p className="text-slate-400">Coins</p>
                <h3 className="text-2xl font-bold">{childData.child.coins}</h3>
              </div>
            </div>
            <div className="glass-panel flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-lg text-orange-400"><Calendar size={32} /></div>
              <div>
                <p className="text-slate-400">Learning Streak</p>
                <h3 className="text-2xl font-bold">{childData.child.streak} Days</h3>
              </div>
            </div>
          </div>

          <div className="glass-panel">
            <h3 className="text-xl font-bold mb-4">Recent Activity History</h3>
            <div className="space-y-4">
              {childData.activities.length === 0 ? (
                <p className="text-slate-400">No activities completed yet.</p>
              ) : (
                childData.activities.map((act, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg border border-white/5">
                    <div>
                      <div className="font-bold text-lg">{act.title}</div>
                      <div className="text-sm text-slate-400">{new Date(act.completed_at).toLocaleString()}</div>
                    </div>
                    <div className={`font-bold text-lg ${act.score >= 80 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                      {act.score}% Score
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
