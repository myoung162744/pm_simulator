import { sendMessageToAPI } from './api';
import { getCompanyContextForReviews } from '../companyConfig';

// Helper function to get formatted timestamp in user's timezone
const getFormattedTimestamp = (date) => {
  return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};

// Helper to find all matches of a substring, ignoring case, and return their line and char positions
const findMatches = (document, searchText) => {
  const lines = document.split('\n');
  const results = [];
  const searchLower = searchText.toLowerCase();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLower = line.toLowerCase();
    let lastIndex = -1;
    while ((lastIndex = lineLower.indexOf(searchLower, lastIndex + 1)) !== -1) {
      results.push({
        line: i,
        start: lastIndex,
        end: lastIndex + searchText.length,
      });
    }
  }
  return results;
};

export const generateCommentsFromAPI = async (documentContent, contacts, getAgentPrompt) => {
  const newComments = [];
  
  // Generate comments from 3-4 random team members
  const availableContacts = contacts.filter(contact => contact.status === 'online' || contact.status === 'away');
  const selectedReviewers = availableContacts
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.min(4, availableContacts.length));
  
  // Generate comments from each selected reviewer
  // TODO: Generate comments from all reviewers
  for (const reviewer of selectedReviewers) {
    const reviewPrompt = `${getAgentPrompt(reviewer.id)}

COMPANY CONTEXT:
${getCompanyContextForReviews()}

You are reviewing a Product Requirements Document. Analyze the document and identify specific areas where you have feedback from your professional perspective.

Respond ONLY with valid JSON in this exact format (no additional text):

{
  "comments": [
    {
      "text_excerpt": "exact text from document (5-20 words)",
      "comment": "your specific feedback (1-2 sentences)"
    }
  ]
}

Focus on areas most relevant to your role. Each text_excerpt must be found exactly in the document. Ensure selected text is all within the same line.

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
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.comments && Array.isArray(parsed.comments)) {
            parsed.comments.forEach((commentData, index) => {
              const excerpt = commentData.text_excerpt;
              const matches = findMatches(documentContent, excerpt);

              if (matches.length > 0) {
                // For simplicity, we'll just take the first match.
                // A more complex implementation could let the user choose or try to be smarter.
                const match = matches[0]; 

                newComments.push({
                  id: `${Date.now()}-${reviewer.id}-${index}`,
                  author: reviewer.name,
                  text: commentData.comment,
                  textExcerpt: excerpt,
                  lineOffset: match.line,
                  charRange: [match.start, match.end],
                  perspective: reviewer.role,
                  resolved: false,
                  avatar: reviewer.avatar,
                  timestamp: getFormattedTimestamp(new Date())
                });
              }
              // If no match is found, we simply drop the comment as requested.
            });
          }
        }
      } catch (parseError) {
        console.error('JSON parsing error:', parseError, 'for response:', response);
        // Fallback or error handling can be improved if needed, but for now, we just log.
      }
    } catch (reviewerError) {
      console.error(`Error getting comment from ${reviewer.name}:`, reviewerError);
    }
    
    // Small delay between requests to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 800));
  }
  
  return newComments;
}; 