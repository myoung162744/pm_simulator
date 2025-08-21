import { useState, useRef, useEffect } from 'react';
import { sendMessageToAPI } from '../services/api';

// Helper function to get formatted timestamp in user's timezone
const getFormattedTimestamp = (date) => {
  return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};

// Helper function to get timestamp for a specific time today
const getTimestampForTime = (hours, minutes) => {
  const now = new Date();
  const timestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  return getFormattedTimestamp(timestamp);
};

export const useChat = (contacts, getAgentPrompt, processMessage = null) => {
  const [selectedContact, setSelectedContact] = useState('sarah-chen');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatMessages, setChatMessages] = useState({
    'sarah-chen': [
      { sender: 'Sarah Chen', message: 'Hi! I wanted to discuss the critical mobile checkout optimization project I assigned you. The CEO is particularly interested in improving our conversion rates. How are you thinking about approaching this?', time: getTimestampForTime(10, 30), isUser: false }
    ],
    'mike-dev': [
      { sender: 'Mike Rodriguez', message: 'Hey! I\'m your technical partner for the mobile checkout project. I\'ve got deep experience with mobile payment SDKs and performance optimization. What specific technical challenges are you seeing in the current implementation?', time: getTimestampForTime(9, 45), isUser: false }
    ],
    'lisa-design': [
      { sender: 'Lisa Kim', message: 'Hello! I\'m the UX lead for the mobile checkout redesign. I can help ensure we maintain a great user experience while optimizing for conversion. Would you like to review some of the current pain points in the checkout flow?', time: getTimestampForTime(11, 15), isUser: false }
    ],
    'alex-data': [
      { sender: 'Jordan Kim', message: 'Hi there! I\'m your data partner for the mobile checkout optimization project.', time: getTimestampForTime(10, 0), isUser: false }
    ]
  });

  const chatEndRef = useRef(null);
  const messageInputRef = useRef(null);

  const selectContact = (contactId, isMobile, setIsSidebarOpen) => {
    setSelectedContact(contactId);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    // Focus the input after a short delay to ensure it's rendered
    setTimeout(() => {
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
    }, 100);
  };

  const sendMessage = async () => {
    if (currentMessage.trim() && !isLoadingResponse) {
      const userMessage = currentMessage;
      
      // Add user message to chat
      setChatMessages(prev => ({
        ...prev,
        [selectedContact]: [
          ...(prev[selectedContact] || []),
          { sender: 'You', message: userMessage, time: getFormattedTimestamp(new Date()), isUser: true }
        ]
      }));
      setCurrentMessage('');
      setIsLoadingResponse(true);
      
      // Maintain focus on input after sending message
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
      
      try {
        // Get chat history for context - limit to prevent token overflow
        const allHistory = (chatMessages[selectedContact] || []).map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.message
        }));
        
        // Keep only the most recent messages to stay within token limits
        // Rough estimate: ~4 chars per token, limit to ~6000 tokens for history
        const MAX_HISTORY_CHARS = 24000;
        let history = [];
        let charCount = 0;
        
        // Add messages from most recent backwards until we hit the limit
        for (let i = allHistory.length - 1; i >= 0; i--) {
          const messageChars = allHistory[i].content.length;
          if (charCount + messageChars <= MAX_HISTORY_CHARS) {
            history.unshift(allHistory[i]);
            charCount += messageChars;
          } else {
            break;
          }
        }

        // Add the agent's personality prompt as system context
        const contactInfo = contacts.find(c => c.id === selectedContact);
        const systemPrompt = getAgentPrompt(selectedContact);
        
        const response = await sendMessageToAPI({
          message: userMessage,
          history: history,
          systemPrompt: systemPrompt,
          characterName: contactInfo?.name,
          characterRole: contactInfo?.role
        });
        
        // Process the response if needed (e.g., for document sharing)
        const processedResponse = processMessage ? processMessage(response) : response;
        
        // Add Claude's response to chat
        setChatMessages(prev => ({
          ...prev,
          [selectedContact]: [
            ...(prev[selectedContact] || []),
            { 
              sender: contactInfo?.name || 'Unknown', 
              message: processedResponse, 
              time: getFormattedTimestamp(new Date()), 
              isUser: false 
            }
          ]
        }));
      } catch (error) {
        console.error('Error sending message:', error);
        
        // Determine error message based on error type
        let errorMessage = "Sorry, I'm having trouble responding right now. Please try again.";
        
        if (error.message?.includes('Failed to fetch') || error.name === 'NetworkError') {
          errorMessage = "Network connection issue. Please check your connection and try again.";
        } else if (error.status === 413 || error.message?.includes('too long')) {
          errorMessage = "Conversation too long. Please start a new conversation.";
        } else if (error.status === 429 || error.message?.includes('Rate limit')) {
          errorMessage = "Too many requests. Please wait a moment and try again.";
        } else if (error.status === 401 || error.status === 403 || error.message?.includes('Authentication')) {
          errorMessage = "Authentication issue. Please refresh the page and try again.";
        } else if (error.status === 400 || error.message?.includes('Invalid request')) {
          errorMessage = "Invalid message format. Please try rephrasing your message.";
        }
        
        setChatMessages(prev => ({
          ...prev,
          [selectedContact]: [
            ...(prev[selectedContact] || []),
            { 
              sender: contacts.find(c => c.id === selectedContact)?.name || 'Unknown', 
              message: errorMessage, 
              time: getFormattedTimestamp(new Date()), 
              isUser: false 
            }
          ]
        }));
      } finally {
        setIsLoadingResponse(false);
        // Restore focus to input after response is received
        setTimeout(() => {
          if (messageInputRef.current && !messageInputRef.current.disabled) {
            messageInputRef.current.focus();
          }
        }, 100);
      }
    }
  };

  return {
    selectedContact,
    setSelectedContact,
    isLoadingResponse,
    currentMessage,
    setCurrentMessage,
    chatMessages,
    setChatMessages,
    chatEndRef,
    messageInputRef,
    selectContact,
    sendMessage
  };
}; 