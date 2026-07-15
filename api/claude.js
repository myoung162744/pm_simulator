const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic();

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history, systemPrompt, characterName, characterRole } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: 'Missing message' });
  }

  // Construct the full system prompt with character information
  const fullSystemPrompt = `${systemPrompt}

Context: You are responding in a Product Manager simulation chat interface. ${characterName ? `Your name is ${characterName}` : ''} ${characterRole ? `and you work as a ${characterRole}` : ''}.

Keep your responses natural and conversational, in character based on your role and personality.`;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 512,
      thinking: { type: 'disabled' },
      system: fullSystemPrompt,
      messages: [
        ...(history || []),
        { role: 'user', content: message }
      ]
    });

    const text = response.content.find((block) => block.type === 'text')?.text ?? '';
    return res.status(200).json({ response: text });
  } catch (err) {
    console.error('Claude API Error:', err.status, err.message);

    if (err instanceof Anthropic.BadRequestError) {
      return res.status(400).json({ error: 'Invalid request - message may be too long or contain invalid content' });
    }
    if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) {
      return res.status(err.status).json({ error: 'Authentication failed - check API key' });
    }
    if (err instanceof Anthropic.RateLimitError) {
      return res.status(429).json({ error: 'Rate limit exceeded - too many requests' });
    }
    if (err instanceof Anthropic.APIError && err.status === 413) {
      return res.status(413).json({ error: 'Request too large - conversation history too long' });
    }
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
