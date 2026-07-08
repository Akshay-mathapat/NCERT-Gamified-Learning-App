const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, 'database.sqlite'));

db.serialize(() => {
  db.run(`ALTER TABLE users ADD COLUMN avatar_url TEXT DEFAULT '/avatars/default.png'`, (err) => {
    if (err) console.log('Column avatar_url may already exist.');
    else console.log('Added avatar_url column.');
  });
  db.run(`ALTER TABLE users ADD COLUMN last_spin_date TEXT`, (err) => {
    if (err) console.log('Column last_spin_date may already exist.');
    else console.log('Added last_spin_date column.');
  });
});
