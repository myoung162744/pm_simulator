import React, { useState, useEffect } from 'react';
import { generatePrompt, getStrictDataMode, toggleStrictDataMode, getSharedDocuments, shareDocument } from './promptConfig';
import { useResponsive } from './hooks/useResponsive';
import { useChat } from './hooks/useChat';
import { useComments } from './hooks/useComments';
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import { ContactsList } from './components/ContactsList';
import { ChatInterface } from './components/ChatInterface';
import { DocumentInterface } from './components/DocumentInterface';
import { InboxInterface } from './components/InboxInterface';

const StudyHal = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [strictDataMode, setStrictDataMode] = useState(getStrictDataMode());
  const [sharedDocuments, setSharedDocuments] = useState(getSharedDocuments());
  const [showInboxNotification, setShowInboxNotification] = useState(false);
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

  // Generate contacts from configuration
  const contacts = [
    { id: 'sarah-chen', name: 'Sarah Chen', role: 'Senior Product Manager', status: 'online', avatar: '👩‍💼' },
    { id: 'mike-dev', name: 'Mike Rodriguez', role: 'Senior Full-Stack Developer', status: 'online', avatar: '👨‍💻' },
    { id: 'lisa-design', name: 'Lisa Kim', role: 'Senior UX Designer', status: 'online', avatar: '👩‍🎨' },
    { id: 'alex-data', name: 'Alex Thompson', role: 'Senior Data Analyst', status: 'online', avatar: '📊' },
    { id: 'jen-marketing', name: 'Jen Wilson', role: 'Marketing Lead', status: 'online', avatar: '📈' }
  ];

  // Custom hooks
  const { isMobile, isSidebarOpen, setIsSidebarOpen } = useResponsive();
  const getAgentPrompt = (agentId) => generatePrompt(agentId);
  
  // Handle strict data mode toggle
  const handleToggleStrictDataMode = () => {
    const newMode = toggleStrictDataMode();
    setStrictDataMode(newMode);
  };
  
  // Handle document sharing
  const handleDocumentSharing = (message) => {
    const shareDocRegex = /\[SHARE_DOCUMENT:([^\]]+)\]/;
    const match = message.match(shareDocRegex);
    
    if (match && match[1]) {
      const agentId = match[1];
      const updatedSharedDocs = shareDocument(agentId);
      
      if (updatedSharedDocs) {
        setSharedDocuments([...updatedSharedDocs]);
        setShowInboxNotification(true);
        
        // Remove the marker from the message
        return message.replace(shareDocRegex, '');
      }
    }
    
    return message;
  };
  
  const chatHook = useChat(contacts, getAgentPrompt, handleDocumentSharing);
  const commentsHook = useComments(documentContent, contacts, getAgentPrompt);

  // Auto-scroll for chat messages
  useEffect(() => {
    if (activeTab === 'chat') {
      const timeoutId = setTimeout(() => {
        chatHook.chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [chatHook.chatMessages, chatHook.selectedContact, activeTab]);

  // Maintain focus on input field when user is typing
  useEffect(() => {
    if (chatHook.currentMessage && chatHook.messageInputRef.current && document.activeElement !== chatHook.messageInputRef.current) {
      chatHook.messageInputRef.current.focus();
    }
  }, [chatHook.currentMessage]);

  // Preserve scroll position during comment re-renders
  useEffect(() => {
    const activeContainer = isMobile ? commentsHook.mobileCommentsRef.current : commentsHook.desktopCommentsRef.current;
    if (activeContainer && commentsHook.scrollPositionRef.current > 0) {
      const savedPosition = commentsHook.scrollPositionRef.current;
      
      const restoreScroll = () => {
        if (activeContainer && activeContainer.scrollTop !== savedPosition) {
          activeContainer.scrollTop = savedPosition;
        }
      };
      
      requestAnimationFrame(restoreScroll);
      setTimeout(restoreScroll, 0);
      setTimeout(restoreScroll, 10);
      setTimeout(restoreScroll, 50);
    }
  }, [commentsHook.comments, isMobile]);

  const handleSelectContact = (contactId) => {
    chatHook.selectContact(contactId, isMobile, setIsSidebarOpen);
  };

  // Clear inbox notification when switching to inbox tab
  useEffect(() => {
    if (activeTab === 'inbox') {
      setShowInboxNotification(false);
    }
  }, [activeTab]);
  
  return (
    <div className="h-screen flex flex-col" style={{
      backgroundColor: 'var(--gb-cream)',
      fontFamily: "var(--font-mono)"
    }}>
      <Header />
      <TabNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sharedDocuments={sharedDocuments} 
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' ? (
          <>
            <ChatInterface
              {...chatHook}
              contacts={contacts}
              isMobile={isMobile}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              onSelectContact={handleSelectContact}
              strictDataMode={strictDataMode}
              onToggleStrictDataMode={handleToggleStrictDataMode}
            />
            {showInboxNotification && (
              <div className="fixed bottom-4 right-4 pokemon-textbox shadow-lg animate-bounce">
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 'var(--pixel-xs)'
                  }}>NEW DOCUMENT!</span>
                  <button 
                    onClick={() => {
                      setActiveTab('inbox');
                      setShowInboxNotification(false);
                    }}
                    className="pokemon-button pokemon-button--primary"
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 'var(--pixel-xs)',
                      padding: 'var(--spacing-xs) var(--spacing-sm)'
                    }}
                  >
                    VIEW
                  </button>
                </div>
              </div>
            )}
          </>
        ) : activeTab === 'docs' ? (
          <DocumentInterface
            documentContent={documentContent}
            setDocumentContent={setDocumentContent}
            {...commentsHook}
            isMobile={isMobile}
          />
        ) : (
          <InboxInterface
            sharedDocuments={sharedDocuments}
          />
        )}
      </div>
    </div>
  );
};

export default StudyHal; 