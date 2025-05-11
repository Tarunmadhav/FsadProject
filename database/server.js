import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './db.mjs';
import bcrypt from 'bcrypt';

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Signup API
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send('Missing required fields');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)';

    db.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).send('Error signing up');
      }
      res.send({ id: result.insertId, name, email });
    });
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

// Login API
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('Missing required fields');
    }

    const query = 'SELECT * FROM users WHERE email = ?';

    db.query(query, [email], async (err, results) => {
      if (err) {
        return res.status(500).send('Error logging in');
      }

      if (results.length === 0) {
        return res.status(401).send('Invalid credentials');
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        return res.status(401).send('Invalid credentials');
      }

      res.send({ id: user.id, name: user.name, email: user.email });
    });
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});