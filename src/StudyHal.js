import React, { useState, useEffect } from 'react';
import { generatePrompt, getSharedDocuments, shareDocument } from './promptConfig';
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
import { PhaseInterstitial, PhaseStatus } from './components/PhaseInterstitial';
import { EvaluationScreen } from './components/EvaluationScreen';
import { PortfolioPage } from './components/PortfolioPage';
import { CommunicationFeedback } from './components/CommunicationFeedback';

const StudyHal = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [sharedDocuments, setSharedDocuments] = useState(getSharedDocuments());
  const [showInboxNotification, setShowInboxNotification] = useState(false);
  
  // Phase management
  const [phaseManager] = useState(() => new PhaseManager());
  const [currentPhase, setCurrentPhase] = useState(phaseManager.getCurrentPhase());
  const [showInterstitial, setShowInterstitial] = useState(true);
  const [isNewPhase, setIsNewPhase] = useState(true);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [simulationCompleted, setSimulationCompleted] = useState(false);
  const [showCommunicationFeedback, setShowCommunicationFeedback] = useState(false);
  
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
    { id: 'mike-dev', name: 'Mike Rodriguez', role: 'Senior Mobile Tech Lead', status: 'online', avatar: '👨‍💻' },
    { id: 'lisa-design', name: 'Lisa Meyer', role: 'Senior UX Designer', status: 'online', avatar: '👩‍🎨' },
    { id: 'alex-data', name: 'Alex Kim', role: 'Senior Data Analyst', status: 'online', avatar: '📊' }
  ];

  // Custom hooks
  const { isMobile, isSidebarOpen, setIsSidebarOpen } = useResponsive();
  const getAgentPrompt = (agentId) => generatePrompt(agentId, currentPhase);
  
  // Phase management functions
  const handlePhaseAdvance = () => {
    const advanced = phaseManager.advanceToNextPhase();
    if (advanced) {
      const newPhase = phaseManager.getCurrentPhase();
      setCurrentPhase(newPhase);
      
      // Check if we should show communication feedback
      if (newPhase.id === 'COMMUNICATION_FEEDBACK') {
        setShowCommunicationFeedback(true);
        setIsNewPhase(false);
        setShowInterstitial(false);
      } else {
        setIsNewPhase(true);
        setShowInterstitial(true);
      }
    }
  };

  const handleManualPhaseAdvance = () => {
    const advanced = phaseManager.forceAdvancePhase();
    if (advanced) {
      const newPhase = phaseManager.getCurrentPhase();
      setCurrentPhase(newPhase);
      
      // Check if we should show communication feedback
      if (newPhase.id === 'COMMUNICATION_FEEDBACK') {
        setShowCommunicationFeedback(true);
        setIsNewPhase(false);
        setShowInterstitial(false);
      } else {
        setIsNewPhase(true);
        setShowInterstitial(true);
      }
    }
  };
  
  const handleInterstitialContinue = () => {
    setShowInterstitial(false);
  };

  const handleEvaluationComplete = () => {
    setShowPortfolio(true);
  };
  
  const handlePortfolioComplete = () => {
    setSimulationCompleted(true);
  };

  const handleCommunicationFeedbackComplete = () => {
    setShowCommunicationFeedback(false);
    // Advance to next phase after feedback
    const advanced = phaseManager.advanceToNextPhase();
    if (advanced) {
      setCurrentPhase(phaseManager.getCurrentPhase());
      setIsNewPhase(true);
      setShowInterstitial(true);
    }
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
  
  // Custom generateComments function that also handles phase advancement
  const generateCommentsWithPhaseAdvancement = async () => {
    // First generate the comments
    await commentsHook.generateComments();
    
    // Then advance phase if we're in PLANNING or FINALIZATION
    if (currentPhase.id === 'PLANNING' || currentPhase.id === 'FINALIZATION') {
      const advanced = phaseManager.advanceToNextPhase();
      if (advanced) {
        setCurrentPhase(phaseManager.getCurrentPhase());
        setIsNewPhase(true);
        setShowInterstitial(true);
        
        // If we just moved to EVALUATION phase, skip the interstitial and show evaluation directly
        if (phaseManager.getCurrentPhase().id === 'EVALUATION') {
          setShowInterstitial(false);
        }
      }
    }
  };

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
  
  // Show portfolio page after evaluation
  if (showPortfolio && !simulationCompleted) {
    return (
      <PortfolioPage 
        documentContent={documentContent}
        onContinue={handlePortfolioComplete}
      />
    );
  }

  // Show completion screen if simulation is done
  if (simulationCompleted) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--gb-cream)' }}>
        <div className="text-center pokemon-panel" style={{ maxWidth: '600px', padding: 'var(--spacing-xl)' }}>
          <h1 className="font-bold mb-6" style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'var(--pixel-lg)',
            color: 'var(--gb-green)'
          }}>
            🎉 SIMULATION COMPLETE!
          </h1>
          <p className="mb-6" style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'var(--pixel-sm)',
            color: 'var(--gb-dark-blue)',
            lineHeight: '1.6'
          }}>
            Congratulations! You've successfully completed the ShopSphere Product Management Simulation. 
            Your mobile checkout optimization proposal has been submitted and evaluated.
          </p>
          <p style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'var(--pixel-xs)',
            color: 'var(--gb-dark-blue)',
            lineHeight: '1.6'
          }}>
            Thank you for participating in this immersive PM experience. Use the insights from your evaluation 
            to continue growing as a product manager.
          </p>
        </div>
      </div>
    );
  }

  // Show communication feedback screen
  if (showCommunicationFeedback) {
    return (
      <CommunicationFeedback
        chatMessages={chatHook.chatMessages}
        sharedDocuments={sharedDocuments}
        timeSpent={phaseManager.getTimeSpentInPhase('ASSIGNMENT') + phaseManager.getTimeSpentInPhase('RESEARCH')}
        onContinue={handleCommunicationFeedbackComplete}
      />
    );
  }

  // Show evaluation screen if in evaluation phase
  if (currentPhase.id === 'EVALUATION' && !showInterstitial) {
    return (
      <div className="h-screen flex flex-col" style={{
        backgroundColor: 'var(--gb-cream)',
        fontFamily: "var(--font-mono)"
      }}>
        <Header>
          <PhaseStatus 
            phase={currentPhase} 
            progress={phaseManager.getOverallProgress()}
            simulationConfig={simulationConfig}
          />
        </Header>
        
        <EvaluationScreen
          documentContent={documentContent}
          simulationData={{
            phase: currentPhase,
            progress: phaseManager.getOverallProgress(),
            timeSpent: phaseManager.getTimeSpentInPhase('FINALIZATION')
          }}
          onComplete={handleEvaluationComplete}
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col" style={{
      backgroundColor: 'var(--gb-cream)',
      fontFamily: "var(--font-mono)"
    }}>
      <Header>
        <PhaseStatus 
          phase={currentPhase} 
          progress={phaseManager.getOverallProgress()}
          simulationConfig={simulationConfig}
        />
      </Header>
      
      <TabNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sharedDocuments={sharedDocuments}
        currentPhase={currentPhase}
        canManuallyAdvance={phaseManager.canManuallyAdvancePhase()}
        advancementRequirements={phaseManager.getAdvancementRequirements()}
        onManualAdvance={handleManualPhaseAdvance}
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
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
              generateComments={generateCommentsWithPhaseAdvancement}
              isMobile={isMobile}
              phase={currentPhase}
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