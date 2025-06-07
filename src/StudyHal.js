import React, { useState, useEffect } from 'react';
import { generatePrompt, getStrictDataMode, toggleStrictDataMode, getSharedDocuments, shareDocument } from './promptConfig';
import { PhaseManager, phases, simulationConfig, initialContext } from './phaseConfig';
import { useResponsive } from './hooks/useResponsive';
import { useChat } from './hooks/useChat';
import { useComments } from './hooks/useComments';
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import { ContactsList } from './components/ContactsList';
import { ChatInterface } from './components/ChatInterface';
import { DocumentInterface } from './components/DocumentInterface';
import { InboxInterface } from './components/InboxInterface';
import { PhaseInterstitial, PhaseStatus, ObjectivesSidebar } from './components/PhaseInterstitial';

const StudyHal = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [strictDataMode, setStrictDataMode] = useState(getStrictDataMode());
  const [sharedDocuments, setSharedDocuments] = useState(getSharedDocuments());
  const [showInboxNotification, setShowInboxNotification] = useState(false);
  
  // Phase management
  const [phaseManager] = useState(() => new PhaseManager());
  const [currentPhase, setCurrentPhase] = useState(phaseManager.getCurrentPhase());
  const [showInterstitial, setShowInterstitial] = useState(true);
  const [isNewPhase, setIsNewPhase] = useState(true);
  
  const [documentContent, setDocumentContent] = useState(`# Mobile Checkout Optimization Proposal

## Problem Statement
ShopSphere is experiencing a critical mobile checkout abandonment issue with a 78% abandonment rate, significantly higher than our 65% desktop rate. This represents a $2.4M monthly revenue impact.

## Current State Analysis
*[To be completed based on research findings]*

## Proposed Solution
*[Draft your solution here based on team input and document review]*

## Success Metrics
*[Define specific, measurable goals]*

## Implementation Plan
*[Outline phases and timeline]*

## Risk Mitigation
*[Address potential challenges]*`);

  // Generate contacts from configuration
  const contacts = [
    { id: 'sarah-chen', name: 'Sarah Chen', role: 'VP of Product', status: 'online', avatar: '👩‍💼' },
    { id: 'mike-dev', name: 'Alex Rodriguez', role: 'Senior Mobile Tech Lead', status: 'online', avatar: '👨‍💻' },
    { id: 'lisa-design', name: 'Maya Patel', role: 'Senior UX Designer', status: 'online', avatar: '👩‍🎨' },
    { id: 'alex-data', name: 'Jordan Kim', role: 'Senior Data Analyst', status: 'online', avatar: '📊' },
    { id: 'jen-marketing', name: 'Priya Sharma', role: 'Customer Success Manager', status: 'online', avatar: '📈' }
  ];

  // Custom hooks
  const { isMobile, isSidebarOpen, setIsSidebarOpen } = useResponsive();
  const getAgentPrompt = (agentId) => generatePrompt(agentId, currentPhase);
  
  // Phase management functions
  const handleActionComplete = (actionId) => {
    const progress = phaseManager.completeAction(actionId);
    setCurrentPhase(phaseManager.getCurrentPhase());
    
    // Check if we should show interstitial for phase completion
    if (progress.percentage === 100) {
      setShowInterstitial(true);
      setIsNewPhase(false);
    }
  };
  
  const handlePhaseAdvance = () => {
    const advanced = phaseManager.advanceToNextPhase();
    if (advanced) {
      setCurrentPhase(phaseManager.getCurrentPhase());
      setIsNewPhase(true);
      setShowInterstitial(true);
    }
  };
  
  const handleInterstitialContinue = () => {
    if (!isNewPhase && phaseManager.canAdvancePhase()) {
      handlePhaseAdvance();
    } else {
      setShowInterstitial(false);
    }
  };
  
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
    
    // Track phase actions
    if (currentPhase.id === 'ASSIGNMENT' && contactId === 'sarah-chen') {
      handleActionComplete('chat_with_sarah');
    } else if (currentPhase.id === 'RESEARCH') {
      handleActionComplete('chat_with_team');
    }
  };

  // Clear inbox notification when switching to inbox tab
  useEffect(() => {
    if (activeTab === 'inbox') {
      setShowInboxNotification(false);
      // Track document review for research phase
      if (currentPhase.id === 'RESEARCH') {
        handleActionComplete('review_documents');
      }
    }
  }, [activeTab]);
  
  // Track document editing actions
  useEffect(() => {
    if (activeTab === 'docs' && documentContent.length > 500) {
      if (currentPhase.id === 'PLANNING') {
        handleActionComplete('draft_proposal');
      } else if (currentPhase.id === 'COLLABORATION') {
        handleActionComplete('revise_document');
      } else if (currentPhase.id === 'FINALIZATION') {
        handleActionComplete('finalize_proposal');
      }
    }
  }, [documentContent, activeTab, currentPhase.id]);
  
  return (
    <div className="h-screen flex flex-col" style={{
      backgroundColor: 'var(--gb-cream)',
      fontFamily: "var(--font-mono)"
    }}>
      <Header>
        <PhaseStatus 
          phase={currentPhase} 
          progress={phaseManager.getOverallProgress()}
          phaseProgress={phaseManager.getPhaseProgress()}
        />
      </Header>
      
      <TabNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sharedDocuments={sharedDocuments} 
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Objectives Sidebar (Desktop only) */}
        {!isMobile && (
          <div className="w-80 p-4 border-r-2 border-gray-600 overflow-y-auto">
            <ObjectivesSidebar 
              phase={currentPhase}
              phaseProgress={phaseManager.getPhaseProgress()}
              completedActions={phaseManager.completedActions}
            />
            
            {/* Company Context */}
            <div className="pokemon-panel p-4">
              <h3 className="font-bold mb-3 text-center" style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-sm)',
                color: 'var(--gb-dark-green)'
              }}>
                MISSION CONTEXT
              </h3>
              <div className="space-y-2 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                <p><strong>Company:</strong> {simulationConfig.company.name}</p>
                <p><strong>Role:</strong> {simulationConfig.userRole.title}</p>
                <p><strong>Manager:</strong> {simulationConfig.userRole.manager}</p>
                <p><strong>Problem:</strong> 78% mobile abandonment vs 65% desktop</p>
                <p><strong>Impact:</strong> $2.4M monthly revenue at risk</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Interface */}
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
              onDocumentChange={() => {
                if (currentPhase.id === 'PLANNING') {
                  handleActionComplete('get_feedback');
                } else if (currentPhase.id === 'COLLABORATION') {
                  handleActionComplete('respond_to_comments');
                } else if (currentPhase.id === 'FINALIZATION') {
                  handleActionComplete('submit_to_manager');
                }
              }}
            />
          ) : (
            <InboxInterface
              sharedDocuments={sharedDocuments}
            />
          )}
        </div>
      </div>
      
      {/* Phase Interstitial */}
      {showInterstitial && (
        <PhaseInterstitial
          phase={currentPhase}
          progress={phaseManager.getOverallProgress()}
          isNewPhase={isNewPhase}
          timeSpent={phaseManager.getTimeSpentInPhase()}
          onContinue={handleInterstitialContinue}
        />
      )}
    </div>
  );
};

export default StudyHal; 