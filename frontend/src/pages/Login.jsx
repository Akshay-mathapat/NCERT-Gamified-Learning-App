import { useState } from 'react';

export default function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'student',
    name: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/login' : '/api/register';
    
    try {
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        if (!isLogin) {
          // If registered, just login automatically or show success
          setIsLogin(true);
          setError('Registration successful! Please login.');
        } else {
          const userObj = data.user || data;
          localStorage.setItem('user', JSON.stringify(userObj));
          if (data.token) localStorage.setItem('token', data.token);
          onLogin(userObj);
        }
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center p-6">
      <div className="glass-panel w-full max-w-md p-8 rounded-2xl shadow-2xl border border-white/10 bg-slate-800/80 backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          {isLogin ? 'Welcome Back!' : 'Join the Adventure'}
        </h2>
        
        {error && <div className="p-3 bg-red-500/20 text-red-300 rounded-lg mb-6 text-center border border-red-500/30">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-slate-400 font-semibold mb-2">Full Name</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:border-indigo-500 focus:outline-none transition-colors" />
            </div>
          )}
          <div>
            <label className="block text-slate-400 font-semibold mb-2">Username</label>
            <input type="text" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full p-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:border-indigo-500 focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-2">Password</label>
            <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full p-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:border-indigo-500 focus:outline-none transition-colors" />
          </div>
          {!isLogin && (
            <div>
              <label className="block text-slate-400 font-semibold mb-2">Role</label>
              <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full p-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:border-indigo-500 focus:outline-none transition-colors">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          
          <button type="submit" className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg transition-colors mt-6 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)]">
            {isLogin ? 'Start Learning' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-400 font-bold hover:text-indigo-300">
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
