const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

app.post('/api/claude', async (req, res) => {
  const { message, history, systemPrompt, characterName, characterRole } = req.body;
  try {
    // Construct the full system prompt with character information
    const fullSystemPrompt = `${systemPrompt}

Context: You are responding in a Product Manager simulation chat interface. ${characterName ? `Your name is ${characterName}` : ''} ${characterRole ? `and you work as a ${characterRole}` : ''}. 

Keep your responses natural and conversational, in character based on your role and personality.`;

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 512,
        system: fullSystemPrompt,
        messages: [
          ...(history || []),
          { role: 'user', content: message }
        ]
      },
      {
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        }
      }
    );
    res.json({ response: response.data.content[0].text });
  } catch (err) {
    console.error('Claude API Error Details:');
    console.error('Status:', err.response?.status);
    console.error('Status Text:', err.response?.statusText);
    console.error('Error Data:', err.response?.data);
    console.error('Full Error:', err.message);
    console.error('Request Body Keys:', Object.keys(req.body));
    console.error('History Length:', req.body.history?.length || 0);
    console.error('System Prompt Length:', req.body.systemPrompt?.length || 0);
    console.error('Message Length:', req.body.message?.length || 0);
    
    // Provide more specific error responses
    const status = err.response?.status;
    let errorMessage = err.message;
    let statusCode = 500;
    
    if (status === 400) {
      errorMessage = 'Invalid request - message may be too long or contain invalid content';
      statusCode = 400;
    } else if (status === 401 || status === 403) {
      errorMessage = 'Authentication failed - check API key';
      statusCode = status;
    } else if (status === 429) {
      errorMessage = 'Rate limit exceeded - too many requests';
      statusCode = 429;
    } else if (status === 413 || err.message?.includes('too long')) {
      errorMessage = 'Request too large - conversation history too long';
      statusCode = 413;
    }
    
    res.status(statusCode).json({ error: errorMessage });
  }
});

app.listen(4000, () => console.log('Server running on port 4000'));