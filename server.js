const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/claude', async (req, res) => {
  const { message, history, systemPrompt, characterName, characterRole } = req.body;
  try {
    // Construct the full system prompt with character information
    const fullSystemPrompt = `${systemPrompt}

Context: You are responding in a Product Manager simulation chat interface. ${characterName ? `Your name is ${characterName}` : ''} ${characterRole ? `and you work as a ${characterRole}` : ''}. 

Keep your responses:
- Natural and conversational (1-3 sentences typically)
- In character based on your role and personality
- Focused on the topic being discussed
- Professional but approachable

Remember: You're having a conversation with a colleague, not giving a formal presentation.`;

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-20250514',
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
    console.error('Claude API Error:', err.response?.data || err.message);
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(4000, () => console.log('Server running on port 4000'));