const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'hackathon-super-secret-key-12345';
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// JWT Verification Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Register
app.post('/api/register', (req, res) => {
  const { username, password, role, name } = req.body;
  const hash = bcrypt.hashSync(password, 8);
  const date = new Date().toISOString().split('T')[0];

  db.run(`INSERT INTO users (username, password, role, name, last_login_date) VALUES (?, ?, ?, ?, ?)`, 
    [username, hash, role || 'student', name, date], function(err) {
      if (err) return res.status(400).json({ error: 'Username may already exist.' });
      const token = jwt.sign({ id: this.lastID, role }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ id: this.lastID, username, role, name, token });
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

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
    res.json({ ...userData, token });
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
app.get('/api/student-dashboard/:id', authenticateToken, (req, res) => {
  const userId = req.params.id;
  db.get(`SELECT id, username, name, xp, coins, streak, current_level, avatar_url, last_spin_date FROM users WHERE id = ?`, [userId], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    
    db.all(`SELECT p.activity_id, p.score, p.completed_at, a.subject, a.topic, a.title 
            FROM progress p JOIN activities a ON p.activity_id = a.id 
            WHERE p.user_id = ?`, [userId], (err, progress) => {
              
      db.all(`SELECT badge_id FROM user_badges WHERE user_id = ?`, [userId], (err, badges) => {
        res.json({ user, progress, badges: badges.map(b => b.badge_id) });
      });
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
      
      const timeTaken = req.body.timeTaken || 0;
      const today = date.split('T')[0];
      db.run(`INSERT INTO activity_history (user_id, activity_id, score, time_taken_seconds, date) VALUES (?, ?, ?, ?, ?)`,
        [userId, activityId, score, timeTaken, today]);

      db.get(`SELECT xp, coins, current_level FROM users WHERE id = ?`, [userId], (err, user) => {
        if (!user) return res.status(404).json({ error: 'User not found' });

        const newXp = user.xp + xpEarned;
        const newCoins = user.coins + coinsEarned;
        // Level up logic (every 200 XP = 1 level)
        const newLevel = Math.floor(newXp / 200) + 1;

        db.run(`UPDATE users SET xp = ?, coins = ?, current_level = ? WHERE id = ?`,
          [newXp, newCoins, newLevel, userId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            
            if (newLevel > user.current_level) {
              db.run(`INSERT INTO notifications (user_id, title, message, type, created_at) VALUES (?, ?, ?, ?, ?)`,
                [userId, 'Level Up!', `You reached Level ${newLevel}!`, 'level_up', today]);
            }
            
            // Check for badges
            let newBadges = [];
            const checkAndAwardBadge = (badgeId) => {
              db.get(`SELECT id FROM user_badges WHERE user_id = ? AND badge_id = ?`, [userId, badgeId], (err, row) => {
                if (!row) {
                  db.run(`INSERT INTO user_badges (user_id, badge_id, earned_at) VALUES (?, ?, ?)`, [userId, badgeId, date]);
                  db.run(`INSERT INTO notifications (user_id, title, message, type, created_at) VALUES (?, ?, ?, ?, ?)`,
                    [userId, 'Badge Unlocked!', `You earned the ${badgeId} badge!`, 'badge', today]);
                  newBadges.push(badgeId);
                }
              });
            };

            if (score === 100) checkAndAwardBadge('perfect_score');
            if (newLevel >= 2) checkAndAwardBadge('level_2_reached');

            // Wait a small delay to ensure badge inserts resolve before responding
            setTimeout(() => {
              res.json({ success: true, xpEarned, coinsEarned, levelUp: newLevel > user.current_level, newLevel, newBadges });
            }, 100);
        });
      });
  });
});

// Spin Wheel
app.post('/api/spin-wheel', (req, res) => {
  const { userId, prizeType, prizeAmount } = req.body;
  const today = new Date().toISOString().split('T')[0];

  db.get(`SELECT xp, coins, last_spin_date FROM users WHERE id = ?`, [userId], (err, user) => {
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.last_spin_date === today) return res.status(400).json({ error: 'Already spun today' });

    const newXp = prizeType === 'xp' ? user.xp + prizeAmount : user.xp;
    const newCoins = prizeType === 'coins' ? user.coins + prizeAmount : user.coins;

    db.run(`UPDATE users SET xp = ?, coins = ?, last_spin_date = ? WHERE id = ?`, [newXp, newCoins, today, userId], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      
      db.run(`INSERT INTO spin_history (user_id, prize_type, prize_amount, spin_date) VALUES (?, ?, ?, ?)`,
        [userId, prizeType, prizeAmount, today]);

      res.json({ success: true, newXp, newCoins });
    });
  });
});

// Buy Avatar
app.post('/api/buy-avatar', (req, res) => {
  const { userId, avatarUrl, cost } = req.body;
  db.get(`SELECT coins FROM users WHERE id = ?`, [userId], (err, user) => {
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.coins < cost) return res.status(400).json({ error: 'Not enough coins' });

    db.run(`UPDATE users SET coins = ?, avatar_url = ? WHERE id = ?`, [user.coins - cost, avatarUrl, userId], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, newCoins: user.coins - cost, avatarUrl });
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
app.get('/api/teacher-dashboard', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher' && req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
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

// Admin Dashboard
app.get('/api/admin-dashboard', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  db.all(`SELECT id, username, name, role, xp, coins FROM users`, [], (err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ users });
  });
});

// Parent Dashboard
app.get('/api/parent-dashboard/:childId', authenticateToken, (req, res) => {
  if (req.user.role !== 'parent') return res.status(403).json({ error: 'Unauthorized' });
  const childId = req.params.childId;
  db.get(`SELECT id, name, xp, coins, streak, current_level FROM users WHERE id = ? AND role = 'student'`, [childId], (err, child) => {
    if (err || !child) return res.status(404).json({ error: 'Child not found' });
    db.all(`SELECT p.score, p.completed_at, a.title FROM progress p JOIN activities a ON p.activity_id = a.id WHERE p.user_id = ? ORDER BY p.completed_at DESC LIMIT 10`, [childId], (err, activities) => {
      res.json({ child, activities });
    });
  });
});

// Daily Challenge
app.get('/api/dailyChallenge', authenticateToken, (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  db.get(`SELECT * FROM daily_challenges WHERE date = ?`, [today], (err, challenge) => {
    if (challenge) return res.json(challenge);
    
    // Create new challenge
    db.all(`SELECT id FROM activities WHERE type = 'quiz' LIMIT 1`, [], (err, quizzes) => {
      db.all(`SELECT id FROM activities WHERE type = 'puzzle' LIMIT 1`, [], (err, puzzles) => {
        const quizId = quizzes[0] ? quizzes[0].id : 'math-num-1';
        const puzzleId = puzzles[0] ? puzzles[0].id : 'sci-for-2';
        
        db.run(`INSERT INTO daily_challenges (date, quiz_id, puzzle_id, reward_xp, reward_coins) VALUES (?, ?, ?, ?, ?)`,
          [today, quizId, puzzleId, 100, 25], function(err) {
            res.json({ id: this.lastID, date: today, quiz_id: quizId, puzzle_id: puzzleId, reward_xp: 100, reward_coins: 25 });
        });
      });
    });
  });
});

// Leaderboards
app.get('/api/leaderboard/:type', authenticateToken, (req, res) => {
  const type = req.params.type;
  if (type === 'overall') {
    db.all(`SELECT username, name, current_level, xp, avatar_url FROM users WHERE role = 'student' ORDER BY xp DESC LIMIT 10`, [], (err, users) => res.json({ leaderboard: users }));
  } else if (type === 'daily') {
    const today = new Date().toISOString().split('T')[0];
    db.all(`
      SELECT u.username, u.name, u.avatar_url, SUM(ah.score) as score 
      FROM users u JOIN activity_history ah ON u.id = ah.user_id 
      WHERE ah.date = ? AND u.role = 'student' 
      GROUP BY u.id ORDER BY score DESC LIMIT 10
    `, [today], (err, users) => res.json({ leaderboard: users }));
  } else {
    res.json({ leaderboard: [] });
  }
});

// Teacher Analytics
app.get('/api/analytics', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher' && req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  db.all(`SELECT u.name, u.xp, AVG(ah.score) as avg_accuracy FROM users u LEFT JOIN activity_history ah ON u.id = ah.user_id WHERE u.role = 'student' GROUP BY u.id`, [], (err, accuracyData) => {
    res.json({ accuracyData });
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
