import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, MessageSquare, Users, Clock, Star, Menu, X, ChevronLeft } from 'lucide-react';
import { generatePrompt, globalVariables, agentConfigs, getAgentDisplayInfo } from './promptConfig';

const ProductManagerSimulator = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedContact, setSelectedContact] = useState('sarah-chen');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  // Generate dynamic prompts using the configuration system
  const getAgentPrompt = (agentId) => generatePrompt(agentId);
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
  const [currentMessage, setCurrentMessage] = useState('');
  const [documentContent, setDocumentContent] = useState(`# Product Requirements Document: User Dashboard Enhancement

## Overview
This document outlines the requirements for enhancing our user dashboard to improve user engagement and provide better analytics insights.

## Problem Statement
Users are struggling to find relevant information quickly in our current dashboard, leading to decreased engagement and user satisfaction.

## Proposed Solution
Implement a personalized, widget-based dashboard that allows users to customize their experience and access key metrics at a glance.

## Success Metrics
- Increase user session duration by 25%
- Improve user satisfaction scores by 15%
- Reduce support tickets related to navigation by 30%`);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [isGeneratingComments, setIsGeneratingComments] = useState(false);
  const [hoveredCommentId, setHoveredCommentId] = useState(null);
  const scrollPositionRef = useRef(0);
  const mobileCommentsRef = useRef(null);
  const desktopCommentsRef = useRef(null);


  const chatEndRef = useRef(null);
  const messageInputRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate contacts from configuration
  const contacts = [
    { id: 'sarah-chen', name: 'Sarah Chen', role: 'Senior Product Manager', status: 'online', avatar: '👩‍💼' },
    { id: 'mike-dev', name: 'Mike Rodriguez', role: 'Senior Full-Stack Developer', status: 'online', avatar: '👨‍💻' },
    { id: 'lisa-design', name: 'Lisa Kim', role: 'Senior UX Designer', status: 'online', avatar: '👩‍🎨' },
    { id: 'alex-data', name: 'Alex Thompson', role: 'Senior Data Analyst', status: 'online', avatar: '📊' },
    { id: 'jen-marketing', name: 'Jen Wilson', role: 'Marketing Lead', status: 'online', avatar: '📈' }
  ];

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
        
        const response = await fetch('http://localhost:4000/api/claude', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            history: history,
            systemPrompt: systemPrompt,
            characterName: contactInfo?.name,
            characterRole: contactInfo?.role
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response from Claude');
        }

        const data = await response.json();
        
        // Add Claude's response to chat
        setChatMessages(prev => ({
          ...prev,
          [selectedContact]: [
            ...(prev[selectedContact] || []),
            { 
              sender: contactInfo?.name || 'Unknown', 
              message: data.response, 
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

  useEffect(() => {
    // Only auto-scroll in chat tab, not in documents tab
    if (activeTab === 'chat') {
      const timeoutId = setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [chatMessages, selectedContact, activeTab]);

  // Maintain focus on input field when user is typing
  useEffect(() => {
    if (currentMessage && messageInputRef.current && document.activeElement !== messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [currentMessage]);

  // Preserve scroll position during comment re-renders
  useEffect(() => {
    const activeContainer = isMobile ? mobileCommentsRef.current : desktopCommentsRef.current;
    if (activeContainer && scrollPositionRef.current > 0) {
      const savedPosition = scrollPositionRef.current;
      
      // Restore scroll position after comments update
      const restoreScroll = () => {
        if (activeContainer && activeContainer.scrollTop !== savedPosition) {
          activeContainer.scrollTop = savedPosition;
        }
      };
      
      // Multiple timing attempts to ensure it works
      requestAnimationFrame(restoreScroll);
      setTimeout(restoreScroll, 0);
      setTimeout(restoreScroll, 10);
      setTimeout(restoreScroll, 50);
    }
  }, [comments, isMobile]);

  const selectContact = (contactId) => {
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

  const generateComments = async () => {
    if (!documentContent.trim() || isGeneratingComments) return;
    
    setIsGeneratingComments(true);
    
    try {
      const newComments = [];
      
      // Split document into logical sections (paragraphs, headings, etc.)
      const sections = documentContent.split(/\n\s*\n/).filter(section => section.trim().length > 20);
      
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
      "comment": "your specific feedback (1-2 sentences)",
      "concern_level": "low|medium|high"
    }
  ]
}

Focus on areas most relevant to your role. Each text_excerpt must be found exactly in the document.

Document to review:
${documentContent}`;

        try {
          const response = await fetch('http://localhost:4000/api/claude', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: 'Please provide targeted feedback on specific sections of this PRD.',
              history: [],
              systemPrompt: reviewPrompt,
              characterName: reviewer.name,
              characterRole: reviewer.role
            }),
          });

          if (response.ok) {
            const data = await response.json();
            
            try {
              // Try to extract JSON from response (may have extra text)
              let jsonMatch = data.response.match(/\{[\s\S]*"comments"[\s\S]*\]/);
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
                      concernLevel: commentData.concern_level || 'medium',
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
                  text: data.response,
                  textExcerpt: documentContent.substring(0, 50) + '...',
                  textPosition: 0,
                  textLength: 50,
                  concernLevel: 'medium',
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
                text: data.response,
                textExcerpt: documentContent.substring(0, 50) + '...',
                textPosition: 0,
                textLength: 50,
                concernLevel: 'medium',
                perspective: reviewer.role,
                resolved: false,
                avatar: reviewer.avatar
              });
            }
          }
        } catch (reviewerError) {
          console.error(`Error getting comment from ${reviewer.name}:`, reviewerError);
        }
        
        // Small delay between requests to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      if (newComments.length > 0) {
        setComments(prev => [...prev, ...newComments]);
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
          resolved: false
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
        resolved: false
      }]);
    } finally {
      setIsGeneratingComments(false);
    }
  };

  const renderDocumentWithHighlights = () => {
    if (comments.length === 0) {
      return documentContent;
    }

    // Sort comments by position and resolve overlaps
    const sortedComments = [...comments]
      .sort((a, b) => a.textPosition - b.textPosition)
      .filter((comment, index, arr) => {
        // Remove overlapping comments (keep the first one)
        if (index === 0) return true;
        const prev = arr[index - 1];
        return comment.textPosition >= prev.textPosition + prev.textLength;
      });
    
    let result = [];
    let lastIndex = 0;

    sortedComments.forEach((comment, index) => {
      // Add text before this comment
      if (comment.textPosition > lastIndex) {
        result.push(
          <span key={`text-${index}`}>
            {documentContent.substring(lastIndex, comment.textPosition)}
          </span>
        );
      }

      // Add highlighted text for this comment
      const isHovered = hoveredCommentId === comment.id;
      const highlightColor = isHovered 
        ? 'bg-purple-200 border-purple-400 ring-2 ring-purple-300 shadow-lg' 
        : 'bg-blue-100 border-blue-300 hover:bg-blue-200 hover:border-blue-400';
      
      const endPosition = Math.min(comment.textPosition + comment.textLength, documentContent.length);
      
      result.push(
        <span
          key={`highlight-${comment.id}`}
          className={`${highlightColor} border rounded px-1 cursor-pointer transition-all duration-200`}
          title={`${comment.author}: ${comment.text}`}
          onMouseEnter={() => setHoveredCommentId(comment.id)}
          onMouseLeave={() => setHoveredCommentId(null)}
        >
          {documentContent.substring(comment.textPosition, endPosition)}
        </span>
      );

      lastIndex = endPosition;
    });

    // Add remaining text
    if (lastIndex < documentContent.length) {
      result.push(
        <span key="remaining-text">
          {documentContent.substring(lastIndex)}
        </span>
      );
    }

    return result;
  };

  const ChatInterface = () => (
    <div className="flex h-full relative">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Contacts Sidebar */}
      <div className={`${
        isMobile 
          ? `fixed left-0 top-0 h-full w-80 z-50 transform transition-transform duration-300 ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`
          : 'w-72 relative'
      } bg-gradient-to-b from-blue-100 to-blue-200 border-r-4 border-blue-400 overflow-y-auto`}>
        <div className="p-4 border-b-2 border-blue-300 bg-gradient-to-r from-blue-200 to-purple-200">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-blue-800 flex items-center gap-2">
              <Users size={20} />
              Team Members
            </h2>
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 hover:bg-blue-300 rounded"
              >
                <X size={20} className="text-blue-800" />
              </button>
            )}
          </div>
        </div>
        <div className="p-2">
          {contacts.map(contact => (
            <div
              key={contact.id}
              onClick={() => selectContact(contact.id)}
              className={`p-3 m-1 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                selectedContact === contact.id 
                  ? 'bg-gradient-to-r from-yellow-200 to-orange-200 border-orange-400 shadow-lg transform scale-105' 
                  : 'bg-white border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl flex-shrink-0">{contact.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-800 truncate">{contact.name}</div>
                  <div className="text-xs text-gray-600 truncate">{contact.role}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className={`w-2 h-2 rounded-full ${
                      contact.status === 'online' ? 'bg-green-400' : 
                      contact.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-xs capitalize text-gray-500">{contact.status}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-purple-50 to-blue-50 min-w-0">
        {/* Chat Header */}
        <div className="p-3 md:p-4 border-b-4 border-purple-300 bg-gradient-to-r from-purple-200 to-blue-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-purple-300 rounded-lg md:hidden"
              >
                <Menu size={20} className="text-purple-800" />
              </button>
            )}
            <div className="text-xl md:text-2xl">{contacts.find(c => c.id === selectedContact)?.avatar}</div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-purple-800 text-sm md:text-base truncate">
                {contacts.find(c => c.id === selectedContact)?.name}
              </h3>
              <p className="text-xs md:text-sm text-purple-600 truncate">
                {contacts.find(c => c.id === selectedContact)?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3">
          {(chatMessages[selectedContact] || []).map((msg, idx) => (
            <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 md:px-4 py-2 rounded-2xl border-2 shadow-lg ${
                msg.isUser 
                  ? 'bg-gradient-to-r from-green-200 to-blue-200 border-blue-400 text-blue-800' 
                  : 'bg-gradient-to-r from-yellow-100 to-orange-100 border-orange-300 text-orange-800'
              }`}>
                <div className="font-semibold text-xs mb-1">{msg.sender}</div>
                <div className="text-sm break-words">{msg.message}</div>
                <div className="text-xs opacity-70 mt-1 flex items-center gap-1">
                  <Clock size={10} />
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-3 md:p-4 border-t-4 border-purple-300 bg-gradient-to-r from-purple-100 to-blue-100 flex-shrink-0">
          {isLoadingResponse && (
            <div className="mb-2 text-xs text-purple-600 flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
              {contacts.find(c => c.id === selectedContact)?.name} is typing...
            </div>
          )}
          <div className="flex gap-2">
            <input
              ref={messageInputRef}
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoadingResponse && sendMessage()}
              placeholder={isLoadingResponse ? "Waiting for response..." : "Type a message..."}
              disabled={isLoadingResponse}
              className={`flex-1 p-2 md:p-3 rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:outline-none bg-white shadow-inner text-sm md:text-base ${isLoadingResponse ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <button
              onClick={sendMessage}
              disabled={isLoadingResponse || !currentMessage.trim()}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-xl border-2 border-green-500 shadow-lg transition-all duration-200 flex-shrink-0 ${
                isLoadingResponse || !currentMessage.trim()
                  ? 'bg-gray-400 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white hover:shadow-xl transform hover:scale-105'
              }`}
            >
              <Send size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const DocumentInterface = () => (
    <div className="flex h-full relative">
      {/* Document Editor */}
      <div className="flex-1 bg-gradient-to-br from-yellow-50 to-orange-50 flex flex-col">
        <div className="p-3 md:p-4 border-b-4 border-orange-300 bg-gradient-to-r from-yellow-200 to-orange-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base md:text-lg text-orange-800 flex items-center gap-2">
              <FileText size={16} className="md:w-5 md:h-5" />
              <span className="hidden sm:inline">Product Requirements Document</span>
              <span className="sm:hidden">PRD</span>
            </h2>
            <div className="flex gap-2">
              <button
                onClick={generateComments}
                disabled={isGeneratingComments || !documentContent.trim()}
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                  isGeneratingComments || !documentContent.trim()
                    ? 'bg-gray-200 border border-gray-400 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-200 hover:bg-blue-300 border border-blue-400 text-blue-800'
                }`}
              >
                {isGeneratingComments ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                    Reviewing...
                  </>
                ) : (
                  '📝 Get Feedback'
                )}
              </button>
              {isMobile && (
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="px-3 py-1 bg-pink-200 border border-pink-400 rounded-full text-xs font-bold text-pink-800"
                >
                  💬 Comments {comments.length > 0 ? `(${comments.length})` : ''}
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className="px-2 md:px-3 py-1 bg-green-200 border border-green-400 rounded-full text-xs font-bold text-green-800">
              ✨ Draft
            </span>
            {comments.length > 0 && (
              <span className="px-2 md:px-3 py-1 bg-purple-200 border border-purple-400 rounded-full text-xs font-bold text-purple-800">
                💬 {comments.length} Comments
              </span>
            )}
          </div>
        </div>
        
        <div className="flex-1 p-3 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-lg border-4 border-orange-300 shadow-xl p-3 md:p-6 h-full">
            {comments.length > 0 ? (
              <div className="w-full h-full overflow-y-auto">
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-blue-800">
                      📝 Review Mode - Hover over highlights to see connections
                    </span>
                    <button
                      onClick={() => {
                        setComments([]);
                        setHoveredCommentId(null);
                      }}
                      className="text-xs bg-blue-200 hover:bg-blue-300 px-2 py-1 rounded border border-blue-400 text-blue-800"
                    >
                      ✏️ Edit Document
                    </button>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-blue-600">
                      💡 Hover over highlighted text or comments to see their connections
                    </span>
                  </div>
                </div>
                <div className="prose max-w-none font-mono text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                  {renderDocumentWithHighlights()}
                </div>
              </div>
            ) : (
              <textarea
                value={documentContent}
                onChange={(e) => setDocumentContent(e.target.value)}
                className="w-full h-full p-3 md:p-4 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none resize-none font-mono text-xs md:text-sm"
                placeholder="Start writing your PRD..."
              />
            )}
          </div>
        </div>
      </div>

      {/* Comments Sidebar */}
      {isMobile ? (
        /* Mobile: Full screen overlay */
        <div className={`fixed inset-0 bg-gradient-to-b from-pink-100 to-purple-100 z-50 transform transition-transform duration-300 ${
          showComments ? 'translate-x-0' : 'translate-x-full'
        } border-l-4 border-pink-400 overflow-y-auto`}>
          <div className="p-3 md:p-4 border-b-2 border-pink-300 bg-gradient-to-r from-pink-200 to-purple-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-pink-800 text-sm md:text-base">Comments & Feedback</h3>
              <button
                onClick={() => setShowComments(false)}
                className="p-1 hover:bg-pink-300 rounded"
              >
                <X size={20} className="text-pink-800" />
              </button>
            </div>
          </div>
          <div 
            ref={mobileCommentsRef}
            className="p-3 md:p-4 space-y-4"
            style={{ overflowAnchor: 'none' }}
            onScroll={(e) => {
              scrollPositionRef.current = e.target.scrollTop;
            }}
          >
            {comments.length === 0 ? (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-2 border-blue-200 text-center">
                <h4 className="font-bold text-sm text-blue-800 mb-2">🎯 Ready for Review</h4>
                <p className="text-xs text-blue-600 mb-3">
                  Write your PRD in the editor and click "Get Feedback" to receive AI-powered comments from your team.
                </p>
                <button
                  onClick={generateComments}
                  disabled={isGeneratingComments || !documentContent.trim()}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    isGeneratingComments || !documentContent.trim()
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {isGeneratingComments ? 'Generating Feedback...' : '📝 Get Feedback'}
                </button>
              </div>
            ) : (
              <>
                {comments.map(comment => {
                  const isHovered = hoveredCommentId === comment.id;
                  const commentStyle = isHovered 
                    ? 'border-purple-300 bg-purple-50 ring-2 ring-purple-200 shadow-lg' 
                    : 'border-blue-200 bg-blue-50 hover:border-blue-300 hover:bg-blue-100';
                  
                  return (
                    <div 
                      key={comment.id} 
                      className={`${commentStyle} bg-white p-3 rounded-lg border-2 shadow-md transition-all duration-200`}
                      onMouseEnter={() => setHoveredCommentId(comment.id)}
                      onMouseLeave={() => setHoveredCommentId(null)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {comment.avatar && (
                          <span className="text-lg flex-shrink-0">{comment.avatar}</span>
                        )}
                        <span className="font-bold text-sm text-pink-800 truncate">{comment.author}</span>
                        {comment.perspective && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                            {comment.perspective}
                          </span>
                        )}
                        <span className="text-xs text-gray-400 ml-auto">just now</span>
                      </div>
                      
                      {comment.textExcerpt && (
                        <div className="mb-2 p-2 bg-gray-100 border-l-4 border-gray-400 text-xs">
                          <span className="text-gray-600 font-semibold">Commenting on: </span>
                          <span className="text-gray-800 italic">"{comment.textExcerpt}"</span>
                        </div>
                      )}
                      
                      <p className="text-sm text-gray-700">{comment.text}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <button className="text-xs bg-green-200 hover:bg-green-300 px-2 py-1 rounded border border-green-400">
                          ✓ Resolve
                        </button>
                        <button 
                          onClick={generateComments}
                          className="text-xs bg-orange-200 hover:bg-orange-300 px-2 py-1 rounded border border-orange-400"
                        >
                          🔄 Get More Feedback
                        </button>
                      </div>
                    </div>
                  );
                })}
                
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded-lg border-2 border-yellow-400">
                  <h4 className="font-bold text-sm text-yellow-800 mb-2">💡 Next Steps</h4>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    <li>• Address stakeholder feedback</li>
                    <li>• Schedule review meeting</li>
                    <li>• Update success metrics</li>
                    <li>• Get final approval</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Desktop: Fixed sidebar */
        <div className="w-80 bg-gradient-to-b from-pink-100 to-purple-100 border-l-4 border-pink-400 overflow-y-auto flex flex-col">
          <div className="p-4 border-b-2 border-pink-300 bg-gradient-to-r from-pink-200 to-purple-200 flex-shrink-0">
            <h3 className="font-bold text-pink-800">Comments & Feedback</h3>
          </div>
          <div 
            ref={desktopCommentsRef}
            className="p-4 space-y-4 flex-1"
            style={{ overflowAnchor: 'none' }}
            onScroll={(e) => {
              scrollPositionRef.current = e.target.scrollTop;
            }}
          >
            {comments.length === 0 ? (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-2 border-blue-200 text-center">
                <h4 className="font-bold text-sm text-blue-800 mb-2">🎯 Ready for Review</h4>
                <p className="text-xs text-blue-600 mb-3">
                  Write your PRD and click "Get Feedback" to receive AI comments.
                </p>
                <button
                  onClick={generateComments}
                  disabled={isGeneratingComments || !documentContent.trim()}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    isGeneratingComments || !documentContent.trim()
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {isGeneratingComments ? 'Generating...' : '📝 Get Feedback'}
                </button>
              </div>
            ) : (
              <>
                {comments.map(comment => {
                  const isHovered = hoveredCommentId === comment.id;
                  const commentStyle = isHovered 
                    ? 'border-purple-300 bg-purple-50 ring-2 ring-purple-200 shadow-lg' 
                    : 'border-blue-200 bg-blue-50 hover:border-blue-300 hover:bg-blue-100';
                  
                  return (
                    <div 
                      key={comment.id} 
                      className={`${commentStyle} bg-white p-3 rounded-lg border-2 shadow-md transition-all duration-200`}
                      onMouseEnter={() => setHoveredCommentId(comment.id)}
                      onMouseLeave={() => setHoveredCommentId(null)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {comment.avatar && (
                          <span className="text-lg flex-shrink-0">{comment.avatar}</span>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-pink-800 truncate">{comment.author}</span>
                            {comment.perspective && (
                              <span className="text-xs bg-blue-100 text-blue-600 px-1 py-0.5 rounded">
                                {comment.perspective}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">just now</span>
                        </div>
                      </div>
                      
                      {comment.textExcerpt && (
                        <div className="mb-2 p-2 bg-gray-100 border-l-4 border-gray-400 text-xs">
                          <span className="text-gray-600 font-semibold">Re: </span>
                          <span className="text-gray-800 italic">"{comment.textExcerpt.length > 40 ? comment.textExcerpt.substring(0, 40) + '...' : comment.textExcerpt}"</span>
                        </div>
                      )}
                      
                      <p className="text-sm text-gray-700">{comment.text}</p>
                      <div className="flex gap-2 mt-2">
                        <button className="text-xs bg-green-200 hover:bg-green-300 px-2 py-1 rounded border border-green-400">
                          ✓ Resolve
                        </button>
                        <button 
                          onClick={generateComments}
                          className="text-xs bg-orange-200 hover:bg-orange-300 px-2 py-1 rounded border border-orange-400"
                        >
                          🔄 More Feedback
                        </button>
                      </div>
                    </div>
                  );
                })}
                
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded-lg border-2 border-yellow-400">
                  <h4 className="font-bold text-sm text-yellow-800 mb-2">💡 Next Steps</h4>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    <li>• Address stakeholder feedback</li>
                    <li>• Schedule review meeting</li>
                    <li>• Update success metrics</li>
                    <li>• Get final approval</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );



  return (
    <div className="h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 p-3 md:p-4 border-b-4 border-blue-600 shadow-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-lg md:text-2xl font-bold text-white drop-shadow-lg">
            🚀 <span className="hidden sm:inline">StudyHal</span>
            <span className="sm:hidden">StudyHal</span>
          </h1>
          <div className="flex items-center gap-2 md:gap-4 text-white">
            <div className="flex items-center gap-1 md:gap-2">
              <div className="w-2 md:w-3 h-2 md:h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs md:text-sm font-semibold">
                <span className="hidden sm:inline">{globalVariables.company.name}</span>
                <span className="sm:hidden">Company</span>
              </span>
            </div>
            <div className="bg-white bg-opacity-20 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold">
              🎯 <span className="hidden sm:inline">{globalVariables.project.name}</span>
              <span className="sm:hidden">Project</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gradient-to-r from-purple-300 to-blue-300 border-b-4 border-purple-500 flex-shrink-0">
        <div className="flex">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 font-bold text-xs md:text-sm border-r-2 border-purple-400 transition-all duration-200 ${
              activeTab === 'chat'
                ? 'bg-gradient-to-b from-yellow-200 to-orange-200 text-orange-800 shadow-inner'
                : 'text-purple-800 hover:bg-purple-200'
            }`}
          >
            <MessageSquare className="inline mr-1 md:mr-2" size={14} />
            <span className="hidden sm:inline">Team </span>Chat
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 font-bold text-xs md:text-sm transition-all duration-200 ${
              activeTab === 'docs'
                ? 'bg-gradient-to-b from-yellow-200 to-orange-200 text-orange-800 shadow-inner'
                : 'text-purple-800 hover:bg-purple-200'
            }`}
          >
            <FileText className="inline mr-1 md:mr-2" size={14} />
            Documents
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' ? <ChatInterface /> : <DocumentInterface />}
      </div>
    </div>
  );
};

export default ProductManagerSimulator;