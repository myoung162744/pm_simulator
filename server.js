const express = require('express');
const cors = require('cors');
require('dotenv').config();

const claudeHandler = require('./api/claude');

const app = express();

// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Same handler that Vercel deploys as a serverless function
app.post('/api/claude', claudeHandler);

app.listen(4000, () => console.log('Server running on port 4000'));
