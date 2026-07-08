const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// Register
app.post('/api/register', (req, res) => {
  const { username, password, role, name } = req.body;
  const hash = bcrypt.hashSync(password, 8);
  const date = new Date().toISOString().split('T')[0];

  db.run(`INSERT INTO users (username, password, role, name, last_login_date) VALUES (?, ?, ?, ?, ?)`, 
    [username, hash, role || 'student', name, date], function(err) {
      if (err) return res.status(400).json({ error: 'Username may already exist.' });
      res.json({ id: this.lastID, username, role, name });
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Streak calculation
    const today = new Date().toISOString().split('T')[0];
    let newStreak = user.streak;
    
    if (user.last_login_date) {
      const lastLogin = new Date(user.last_login_date);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate - lastLogin);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1; // reset streak
      }
    } else {
      newStreak = 1;
    }

    db.run(`UPDATE users SET streak = ?, last_login_date = ? WHERE id = ?`, [newStreak, today, user.id]);

    const { password: _, ...userData } = user;
    userData.streak = newStreak;
    res.json(userData);
  });
});

// Get Activities
app.get('/api/activities', (req, res) => {
  db.all(`SELECT * FROM activities`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get Student Dashboard Info
app.get('/api/student-dashboard/:id', (req, res) => {
  const userId = req.params.id;
  db.get(`SELECT id, username, name, xp, coins, streak, current_level FROM users WHERE id = ?`, [userId], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    
    db.all(`SELECT p.activity_id, p.score, p.completed_at, a.subject, a.topic, a.title 
            FROM progress p JOIN activities a ON p.activity_id = a.id 
            WHERE p.user_id = ?`, [userId], (err, progress) => {
      res.json({ user, progress });
    });
  });
});

// Submit Activity
app.post('/api/submit-activity', (req, res) => {
  const { userId, activityId, score } = req.body;
  const date = new Date().toISOString();

  // Award XP based on score (e.g. max 100 xp per activity)
  const xpEarned = Math.floor((score / 100) * 50) + 10; // Base 10 XP + up to 50 performance XP
  const coinsEarned = score > 80 ? 10 : 5; 

  db.run(`INSERT INTO progress (user_id, activity_id, score, completed_at) VALUES (?, ?, ?, ?)`,
    [userId, activityId, score, date], function(err) {
      if (err) return res.status(500).json({ error: err.message });

      db.get(`SELECT xp, coins, current_level FROM users WHERE id = ?`, [userId], (err, user) => {
        if (!user) return res.status(404).json({ error: 'User not found' });

        const newXp = user.xp + xpEarned;
        const newCoins = user.coins + coinsEarned;
        // Level up logic (every 200 XP = 1 level)
        const newLevel = Math.floor(newXp / 200) + 1;

        db.run(`UPDATE users SET xp = ?, coins = ?, current_level = ? WHERE id = ?`,
          [newXp, newCoins, newLevel, userId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, xpEarned, coinsEarned, levelUp: newLevel > user.current_level, newLevel });
        });
      });
  });
});

// Leaderboard
app.get('/api/leaderboard', (req, res) => {
  db.all(`SELECT id, username, name, xp, current_level, streak FROM users WHERE role = 'student' ORDER BY xp DESC LIMIT 10`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Teacher Dashboard
app.get('/api/teacher-dashboard', (req, res) => {
  db.all(`SELECT u.id, u.name, u.xp, u.current_level, 
          COUNT(p.id) as completed_activities,
          AVG(p.score) as avg_score
          FROM users u
          LEFT JOIN progress p ON u.id = p.user_id
          WHERE u.role = 'student'
          GROUP BY u.id`, [], (err, students) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ students });
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
