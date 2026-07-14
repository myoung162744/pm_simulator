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
      { sender: 'Sarah Chen', message: 'Hi, glad you\'re here. I\'m assigning you a critical project that came straight out of this morning\'s leadership meeting. Our mobile checkout abandonment rate is at 78% versus 65% on desktop, and that gap is costing us roughly $2.4M a month in commission revenue. The CEO wants a plan. I need you to own this: dig into the problem, work with Mike (engineering), Lisa (design), and Alex (data), and bring me a proposal I can take to leadership by Friday. Let me know what questions you have about the scope before you dive in.', time: getTimestampForTime(10, 30), isUser: false }
    ],
    'mike-dev': [
      { sender: 'Mike Rodriguez', message: 'Hey, Mike here — tech lead for the mobile team. Sarah mentioned she\'s bringing you in on the checkout project. Once you\'ve gotten the full brief from her, happy to walk you through how the current mobile checkout is built and where the technical bottlenecks are.', time: getTimestampForTime(9, 45), isUser: false }
    ],
    'lisa-design': [
      { sender: 'Lisa Meyer', message: 'Hi! Lisa here — I lead UX for mobile. Heard Sarah is putting you on the checkout project. Grab the brief from her first, then come find me — I can share what we\'ve been hearing from users about the mobile checkout experience.', time: getTimestampForTime(11, 15), isUser: false }
    ],
    'alex-data': [
      { sender: 'Alex Kim', message: 'Hi there! Alex from the data team. Sarah flagged that you\'ll be leading the mobile checkout work. I\'ve been tracking our funnel metrics closely, so once you\'ve been briefed, ping me and I can pull up the numbers on where users drop off.', time: getTimestampForTime(10, 0), isUser: false }
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