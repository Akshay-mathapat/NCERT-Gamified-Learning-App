import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Database } from 'lucide-react';

export default function AdminDashboard({ user }) {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetch('http://localhost:3000/api/admin-dashboard', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(d => setData(d.users));
  }, [user, navigate]);

  return (
    <div className="container animate-slide-in p-6">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Shield className="text-indigo-500" size={36} /> Admin Control Panel
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 border-l-4 border-l-indigo-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-400"><Users size={32} /></div>
            <div>
              <p className="text-slate-400">Total Users</p>
              <h3 className="text-2xl font-bold">{data.length}</h3>
            </div>
          </div>
        </div>
        <div className="glass-panel p-6 border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-400"><Database size={32} /></div>
            <div>
              <p className="text-slate-400">System Status</p>
              <h3 className="text-2xl font-bold">Online</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <h3 className="text-xl font-bold mb-4 p-4 border-b border-white/10">User Directory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-slate-400">
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Username</th>
                <th className="p-4">Role</th>
                <th className="p-4">XP</th>
                <th className="p-4">Coins</th>
              </tr>
            </thead>
            <tbody>
              {data.map(u => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-slate-400">#{u.id}</td>
                  <td className="p-4 font-bold">{u.name}</td>
                  <td className="p-4">{u.username}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      u.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                      u.role === 'teacher' ? 'bg-indigo-500/20 text-indigo-400' :
                      u.role === 'parent' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-indigo-400 font-bold">{u.xp}</td>
                  <td className="p-4 text-yellow-400 font-bold">{u.coins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
