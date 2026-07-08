import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ParentDashboard from './pages/ParentDashboard';
import ActivityView from './pages/ActivityView';
import { LogOut } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.role === 'teacher') navigate('/teacher');
    else if (userData.role === 'admin') navigate('/admin');
    else if (userData.role === 'parent') navigate('/parent');
    else navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const isLandingPage = location.pathname === '/';

  return (
    <>
      {user && !isLandingPage && (
        <nav style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--surface-border)' }}>
          <h2 className="gradient-text">NCERT Gamified</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{user.avatar_url || '👤'}</span> 
              Welcome, {user.name}
            </span>
            <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/dashboard" element={<StudentDashboard user={user} />} />
        <Route path="/teacher" element={<TeacherDashboard user={user} />} />
        <Route path="/admin" element={<AdminDashboard user={user} />} />
        <Route path="/parent" element={<ParentDashboard user={user} />} />
        <Route path="/activity/:id" element={<ActivityView user={user} />} />
      </Routes>
    </>
  );
}

export default App;
