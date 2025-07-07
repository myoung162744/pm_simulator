import { useState, useRef } from 'react';
import { generateCommentsFromAPI } from '../services/commentsService';

// Helper function to get formatted timestamp in user's timezone
const getFormattedTimestamp = (date) => {
  return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};

export const useComments = (documentContent, contacts, getAgentPrompt) => {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [isGeneratingComments, setIsGeneratingComments] = useState(false);
  const scrollPositionRef = useRef(0);
  const mobileCommentsRef = useRef(null);
  const desktopCommentsRef = useRef(null);

  const generateComments = async () => {
    if (!documentContent.trim() || isGeneratingComments) return;
    
    setIsGeneratingComments(true);
    
    try {
      const newComments = await generateCommentsFromAPI(
        documentContent, 
        contacts, 
        getAgentPrompt
      );
      
      if (newComments.length > 0) {
        // Add timestamps to the new comments
        const commentsWithTimestamps = newComments.map(comment => ({
          ...comment,
          timestamp: getFormattedTimestamp(new Date())
        }));
        
        setComments(prev => [...prev, ...commentsWithTimestamps]);
        setShowComments(true);
      } else {
        // Fallback if all individual requests failed
        setComments([{
          id: Date.now(),
          author: 'System',
          text: 'Sorry, there was an error generating comments. Please try again.',
          textExcerpt: 'System message',
          textPosition: 0,
          textLength: 0,
          perspective: 'System',
          resolved: false,
          timestamp: getFormattedTimestamp(new Date())
        }]);
      }
    } catch (error) {
      console.error('Error generating comments:', error);
      setComments([{
        id: Date.now(),
        author: 'System',
        text: 'Sorry, there was an error generating comments. Please try again.',
        textExcerpt: 'System message',
        textPosition: 0,
        textLength: 0,
        perspective: 'System',
        resolved: false,
        timestamp: getFormattedTimestamp(new Date())
      }]);
    } finally {
      setIsGeneratingComments(false);
    }
  };

  const clearComments = () => {
    setComments([]);
    setShowComments(false);
  };

  return {
    comments,
    setComments,
    showComments,
    setShowComments,
    isGeneratingComments,
    scrollPositionRef,
    mobileCommentsRef,
    desktopCommentsRef,
    generateComments,
    clearComments
  };
}; 