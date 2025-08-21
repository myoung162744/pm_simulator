const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

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
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    const error = new Error(errorData.error || 'Failed to get response from Claude');
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return data.response;
}; 