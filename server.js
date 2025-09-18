// server.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');

const app = express();
app.use(helmet());
app.use(express.json());
app.use(compression());

app.set('trust proxy', 1);
const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
app.use(limiter);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Listar produtos
app.get('/products', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, price, stock FROM products ORDER BY id'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_server_error' });
  }
});

// Buscar produto por ID
app.get('/products/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, price, stock FROM products WHERE id = $1',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'not_found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_server_error' });
  }
});

// Criar produto
app.post('/products', async (req, res) => {
  const { name, price, stock } = req.body;
  if (!name || price == null || stock == null) {
    return res.status(400).json({ error: 'invalid_body' });
  }
  try {
    const { rows } = await pool.query(
      'INSERT INTO products (name, price, stock) VALUES ($1, $2, $3) RETURNING id, name, price, stock',
      [name, price, stock]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_server_error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on ${port}`));
