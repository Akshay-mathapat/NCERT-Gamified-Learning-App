const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.serialize(() => {
      // Create Users Table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT, -- 'student' or 'teacher'
        name TEXT,
        xp INTEGER DEFAULT 0,
        coins INTEGER DEFAULT 0,
        streak INTEGER DEFAULT 0,
        last_login_date TEXT,
        current_level INTEGER DEFAULT 1
      )`);

      // Create Activities Table
      db.run(`CREATE TABLE IF NOT EXISTS activities (
        id TEXT PRIMARY KEY,
        subject TEXT,
        topic TEXT,
        type TEXT,
        title TEXT,
        description TEXT
      )`);

      // Create Progress Table
      db.run(`CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        activity_id TEXT,
        score INTEGER,
        completed_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (activity_id) REFERENCES activities(id)
      )`);

      // Seed Activities if empty
      db.get("SELECT COUNT(*) AS count FROM activities", (err, row) => {
        if (row && row.count === 0) {
          const insertActivity = db.prepare(`INSERT INTO activities (id, subject, topic, type, title, description) VALUES (?, ?, ?, ?, ?, ?)`);
          
          const mathsActivities = [
            // Numbers
            { id: 'math-num-1', s: 'Maths', t: 'Numbers', type: 'quiz', title: 'Number Sense Quiz', d: 'Test your basic number knowledge' },
            { id: 'math-num-2', s: 'Maths', t: 'Numbers', type: 'drag-drop', title: 'Number Line Placement', d: 'Drag numbers to the correct spot on the number line' },
            { id: 'math-num-3', s: 'Maths', t: 'Numbers', type: 'sorter', title: 'Even & Odd Sorter', d: 'Sort the numbers into even and odd bins' },
            // Fractions
            { id: 'math-fra-1', s: 'Maths', t: 'Fractions', type: 'match', title: 'Fraction Matcher', d: 'Match fractions to their visual representations' },
            { id: 'math-fra-2', s: 'Maths', t: 'Fractions', type: 'visual', title: 'Pizza Slices', d: 'Select the correct number of pizza slices for the fraction' },
            { id: 'math-fra-3', s: 'Maths', t: 'Fractions', type: 'quiz', title: 'Greater or Less Than', d: 'Identify which fraction is larger' },
            // Geometry
            { id: 'math-geo-1', s: 'Maths', t: 'Geometry', type: 'identify', title: 'Shape Identifier', d: 'Identify the 2D and 3D shapes' },
            { id: 'math-geo-2', s: 'Maths', t: 'Geometry', type: 'measure', title: 'Angle Measuring', d: 'Estimate the angle using the protractor tool' },
            { id: 'math-geo-3', s: 'Maths', t: 'Geometry', type: 'match', title: 'Formula Match', d: 'Match shapes with their area and perimeter formulas' },
            // Algebra
            { id: 'math-alg-1', s: 'Maths', t: 'Algebra', type: 'puzzle', title: 'Equation Balancer', d: 'Balance the equations to find the value of x' },
            { id: 'math-alg-2', s: 'Maths', t: 'Algebra', type: 'quiz', title: 'Missing Variable Quiz', d: 'Solve for the missing variable' },
            { id: 'math-alg-3', s: 'Maths', t: 'Algebra', type: 'sorter', title: 'Term Sorter', d: 'Sort expressions into monomials, binomials, and trinomials' },
            // Mensuration
            { id: 'math-men-1', s: 'Maths', t: 'Mensuration', type: 'calculate', title: 'Area & Perimeter Calculator', d: 'Calculate area and perimeter for given shapes' },
            { id: 'math-men-2', s: 'Maths', t: 'Mensuration', type: 'converter', title: 'Unit Converter Challenge', d: 'Convert between cm, m, and km' },
            { id: 'math-men-3', s: 'Maths', t: 'Mensuration', type: 'match', title: '3D Shape Match', d: 'Match 3D shapes to their volume formulas' },
          ];

          const scienceActivities = [
            // Plants
            { id: 'sci-pla-1', s: 'Science', t: 'Plants', type: 'drag-drop', title: 'Parts of a Plant', d: 'Drag the labels to the correct plant parts' },
            { id: 'sci-pla-2', s: 'Science', t: 'Plants', type: 'sequence', title: 'Photosynthesis Sequencer', d: 'Order the steps of photosynthesis' },
            { id: 'sci-pla-3', s: 'Science', t: 'Plants', type: 'match', title: 'Leaf Type Matcher', d: 'Match the leaf image to its plant' },
            // Human Body
            { id: 'sci-hum-1', s: 'Science', t: 'Human Body', type: 'drag-drop', title: 'Organ Placement Game', d: 'Place organs in the correct location on the human body' },
            { id: 'sci-hum-2', s: 'Science', t: 'Human Body', type: 'sorter', title: 'System Match', d: 'Sort organs into digestive and respiratory systems' },
            { id: 'sci-hum-3', s: 'Science', t: 'Human Body', type: 'quiz', title: 'Body Facts Quiz', d: 'Test your knowledge on the human body' },
            // Force and Motion
            { id: 'sci-for-1', s: 'Science', t: 'Force & Motion', type: 'sorter', title: 'Push or Pull Categorizer', d: 'Categorize actions into push or pull forces' },
            { id: 'sci-for-2', s: 'Science', t: 'Force & Motion', type: 'puzzle', title: 'Friction Match', d: 'Identify high vs low friction surfaces' },
            { id: 'sci-for-3', s: 'Science', t: 'Force & Motion', type: 'quiz', title: 'Speed & Time Quiz', d: 'Calculate speed and time in various scenarios' },
            // Electricity
            { id: 'sci-ele-1', s: 'Science', t: 'Electricity', type: 'sequence', title: 'Circuit Builder Steps', d: 'Order the steps to build a complete circuit' },
            { id: 'sci-ele-2', s: 'Science', t: 'Electricity', type: 'sorter', title: 'Conductor & Insulator Sorter', d: 'Sort materials into conductors and insulators' },
            { id: 'sci-ele-3', s: 'Science', t: 'Electricity', type: 'match', title: 'Component Match', d: 'Match circuit symbols to their components' },
            // Environment
            { id: 'sci-env-1', s: 'Science', t: 'Environment', type: 'sorter', title: 'Recycling Bin Sorter', d: 'Sort waste into paper, plastic, glass, and organic bins' },
            { id: 'sci-env-2', s: 'Science', t: 'Environment', type: 'sequence', title: 'Food Chain Sequencer', d: 'Order organisms to create a correct food chain' },
            { id: 'sci-env-3', s: 'Science', t: 'Environment', type: 'quiz', title: 'Eco-Warrior Quiz', d: 'Test your knowledge on environmental conservation' },
          ];

          const allActivities = [...mathsActivities, ...scienceActivities];
          allActivities.forEach(a => {
            insertActivity.run(a.id, a.s, a.t, a.type, a.title, a.d);
          });
          insertActivity.finalize();
          console.log('Seeded activities.');
        }
      });
    });
  }
});

module.exports = db;
