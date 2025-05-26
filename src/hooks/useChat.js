import { useState, useRef, useEffect } from 'react';
import { sendMessageToAPI } from '../services/api';

export const useChat = (contacts, getAgentPrompt) => {
  const [selectedContact, setSelectedContact] = useState('sarah-chen');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatMessages, setChatMessages] = useState({
    'sarah-chen': [
      { sender: 'Sarah Chen', message: 'Hey! Ready to work on that new feature proposal?', time: '10:30 AM', isUser: false },
      { sender: 'You', message: 'Absolutely! What do you think our priorities should be?', time: '10:32 AM', isUser: true }
    ],
    'mike-dev': [
      { sender: 'Mike Rodriguez', message: 'The backend APIs for user analytics are ready for review', time: '9:45 AM', isUser: false }
    ],
    'lisa-design': [
      { sender: 'Lisa Kim', message: 'I have some wireframes ready for the dashboard redesign', time: '11:15 AM', isUser: false }
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
        
        // Add Claude's response to chat
        setChatMessages(prev => ({
          ...prev,
          [selectedContact]: [
            ...(prev[selectedContact] || []),
            { 
              sender: contactInfo?.name || 'Unknown', 
              message: response, 
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