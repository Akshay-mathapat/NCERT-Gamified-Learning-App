import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Activity, BarChart2 } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function TeacherDashboard({ user }) {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'teacher') {
      navigate('/');
      return;
    }

    fetch('http://localhost:3000/api/teacher-dashboard', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(d => setData(d.students));
  }, [user, navigate]);

  if (!data) return <div className="container" style={{ textAlign: 'center', marginTop: '2rem' }}>Loading dashboard...</div>;

  const totalStudents = data.length;
  const avgXP = data.reduce((acc, curr) => acc + curr.xp, 0) / (totalStudents || 1);
  const totalActivitiesCompleted = data.reduce((acc, curr) => acc + curr.completed_activities, 0);

  const chartData = {
    labels: data.map(s => s.name),
    datasets: [
      {
        label: 'Total XP Earned',
        data: data.map(s => s.xp),
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Student Performance Overview', color: '#fff' },
    },
    scales: {
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.1)' } },
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.1)' } }
    }
  };

  return (
    <div className="container animate-slide-in">
      <h2 style={{ marginBottom: '1.5rem' }}>Class Overview</h2>
      
      {/* Top Metrics */}
      <div className="grid grid-cols-3" style={{ marginBottom: '2rem' }}>
        <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '0.5rem', color: 'var(--primary)' }}><Users size={32} /></div>
          <div>
            <p style={{ color: 'var(--text-muted)' }}>Total Students</p>
            <h3>{totalStudents}</h3>
          </div>
        </div>
        <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(236, 72, 153, 0.2)', borderRadius: '0.5rem', color: 'var(--secondary)' }}><Activity size={32} /></div>
          <div>
            <p style={{ color: 'var(--text-muted)' }}>Activities Completed</p>
            <h3>{totalActivitiesCompleted}</h3>
          </div>
        </div>
        <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '0.5rem', color: 'var(--success)' }}><BarChart2 size={32} /></div>
          <div>
            <p style={{ color: 'var(--text-muted)' }}>Average XP</p>
            <h3>{Math.round(avgXP)} XP</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="glass-panel">
          <h3 style={{ marginBottom: '1rem' }}>XP Distribution</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
        
        {/* Student Table */}
        <div className="glass-panel overflow-y-auto" style={{ maxHeight: '400px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Class Roster & Details</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--surface-border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Level</th>
                <th style={{ padding: '1rem' }}>Total XP</th>
                <th style={{ padding: '1rem' }}>Activities Completed</th>
                <th style={{ padding: '1rem' }}>Avg Score</th>
              </tr>
            </thead>
            <tbody>
              {data.map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{student.name}</td>
                  <td style={{ padding: '1rem' }}><span className="badge">Lvl {student.current_level}</span></td>
                  <td style={{ padding: '1rem', color: 'var(--primary)', fontWeight: 'bold' }}>{student.xp}</td>
                  <td style={{ padding: '1rem' }}>{student.completed_activities}</td>
                  <td style={{ padding: '1rem' }}>{Math.round(student.avg_score || 0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && <p style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No students registered yet.</p>}
        </div>
      </div>
      </div>
    </div>
  );
}
