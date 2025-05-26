import { sendMessageToAPI } from './api';

export const generateCommentsFromAPI = async (documentContent, contacts, getAgentPrompt) => {
  const newComments = [];
  
  // Generate comments from 3-4 random team members
  const availableContacts = contacts.filter(contact => contact.status === 'online' || contact.status === 'away');
  const selectedReviewers = availableContacts
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.min(4, availableContacts.length));
  
  // Generate comments from each selected reviewer
  for (const reviewer of selectedReviewers) {
    const reviewPrompt = `${getAgentPrompt(reviewer.id)}

You are reviewing a Product Requirements Document. Analyze the document and identify 1-3 specific areas where you have feedback from your professional perspective.

Respond ONLY with valid JSON in this exact format (no additional text):

{
  "comments": [
    {
      "text_excerpt": "exact text from document (5-20 words)",
      "comment": "your specific feedback (1-2 sentences)"
    }
  ]
}

Focus on areas most relevant to your role. Each text_excerpt must be found exactly in the document.

Document to review:
${documentContent}`;

    try {
      const response = await sendMessageToAPI({
        message: 'Please provide targeted feedback on specific sections of this PRD.',
        history: [],
        systemPrompt: reviewPrompt,
        characterName: reviewer.name,
        characterRole: reviewer.role
      });

      try {
        // Try to extract JSON from response (may have extra text)
        let jsonMatch = response.match(/\{[\s\S]*"comments"[\s\S]*\]/);
        if (jsonMatch) {
          // Find the complete JSON object
          let jsonStr = jsonMatch[0];
          // Add closing brace if needed
          if (!jsonStr.endsWith('}')) {
            jsonStr += '}';
          }
          
          const parsed = JSON.parse(jsonStr);
          if (parsed.comments && Array.isArray(parsed.comments)) {
            parsed.comments.forEach((commentData, index) => {
              // Find the position of the excerpted text in the document
              let textPosition = -1;
              let actualExcerpt = commentData.text_excerpt;
              
              // Try exact match first
              textPosition = documentContent.toLowerCase().indexOf(actualExcerpt.toLowerCase());
              
              // If not found, try to find similar text
              if (textPosition === -1) {
                // Try matching first few words
                const words = actualExcerpt.split(' ').slice(0, 3).join(' ');
                textPosition = documentContent.toLowerCase().indexOf(words.toLowerCase());
                if (textPosition > -1) {
                  actualExcerpt = words;
                }
              }
              
              // If still not found, place at a reasonable location
              if (textPosition === -1) {
                textPosition = Math.floor(documentContent.length * (index + 1) / (parsed.comments.length + 1));
                actualExcerpt = documentContent.substring(textPosition, Math.min(textPosition + 30, documentContent.length));
              }
              
              newComments.push({
                id: Date.now() + Math.random() * 1000 + index,
                author: reviewer.name,
                text: commentData.comment,
                textExcerpt: actualExcerpt,
                textPosition: textPosition,
                textLength: actualExcerpt.length,
                perspective: reviewer.role,
                resolved: false,
                avatar: reviewer.avatar
              });
            });
          }
        } else {
          // Fallback: create a general comment if no JSON found
          newComments.push({
            id: Date.now() + Math.random(),
            author: reviewer.name,
            text: response,
            textExcerpt: documentContent.substring(0, 50) + '...',
            textPosition: 0,
            textLength: 50,
            perspective: reviewer.role,
            resolved: false,
            avatar: reviewer.avatar
          });
        }
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        // Fallback: create a general comment if JSON parsing fails
        newComments.push({
          id: Date.now() + Math.random(),
          author: reviewer.name,
          text: response,
          textExcerpt: documentContent.substring(0, 50) + '...',
          textPosition: 0,
          textLength: 50,
          perspective: reviewer.role,
          resolved: false,
          avatar: reviewer.avatar
        });
      }
    } catch (reviewerError) {
      console.error(`Error getting comment from ${reviewer.name}:`, reviewerError);
    }
    
    // Small delay between requests to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 800));
  }
  
  return newComments;
}; 