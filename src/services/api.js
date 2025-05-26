const API_BASE_URL = 'http://localhost:4000/api';

export const sendMessageToAPI = async ({ message, history, systemPrompt, characterName, characterRole }) => {
  const response = await fetch(`${API_BASE_URL}/claude`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      history,
      systemPrompt,
      characterName,
      characterRole
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get response from Claude');
  }

  const data = await response.json();
  return data.response;
}; 