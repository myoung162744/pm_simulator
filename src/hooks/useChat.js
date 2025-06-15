import { useState, useRef, useEffect } from 'react';
import { sendMessageToAPI } from '../services/api';

export const useChat = (contacts, getAgentPrompt, processMessage = null) => {
  const [selectedContact, setSelectedContact] = useState('sarah-chen');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatMessages, setChatMessages] = useState({
    'sarah-chen': [
      { sender: 'Sarah Chen', message: 'Hi! I wanted to discuss the critical mobile checkout optimization project I assigned you. The CEO is particularly interested in improving our conversion rates. How are you thinking about approaching this?', time: '10:30 AM', isUser: false }
    ],
    'mike-dev': [
      { sender: 'Mike Rodriguez', message: 'Hey! I\'m your technical partner for the mobile checkout project. I\'ve got deep experience with mobile payment SDKs and performance optimization. What specific technical challenges are you seeing in the current implementation?', time: '9:45 AM', isUser: false }
    ],
    'lisa-design': [
      { sender: 'Lisa Kim', message: 'Hello! I\'m the UX lead for the mobile checkout redesign. I can help ensure we maintain a great user experience while optimizing for conversion. Would you like to review some of the current pain points in the checkout flow?', time: '11:15 AM', isUser: false }
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
          { sender: 'You', message: userMessage, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), isUser: true }
        ]
      }));
      setCurrentMessage('');
      setIsLoadingResponse(true);
      
      // Maintain focus on input after sending message
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
      
      try {
        // Get chat history for context
        const history = (chatMessages[selectedContact] || []).map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.message
        }));

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
              time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
              isUser: false 
            }
          ]
        }));
      } catch (error) {
        console.error('Error sending message:', error);
        // Fallback to a generic response
        setChatMessages(prev => ({
          ...prev,
          [selectedContact]: [
            ...(prev[selectedContact] || []),
            { 
              sender: contacts.find(c => c.id === selectedContact)?.name || 'Unknown', 
              message: "Sorry, I'm having trouble responding right now. Please try again.", 
              time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
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