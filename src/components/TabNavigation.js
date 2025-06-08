import React from 'react';
import { MessageSquare, FileText, Inbox } from 'lucide-react';

export const TabNavigation = ({ 
  activeTab, 
  setActiveTab, 
  sharedDocuments = [], 
  currentPhase,
  canManuallyAdvance,
  advancementRequirements,
  onManualAdvance
}) => {
  const hasSharedDocuments = sharedDocuments.length > 0;
  
  return (
    <div className="pokemon-panel--header flex-shrink-0" style={{
      backgroundColor: 'var(--gb-dark-beige)',
      padding: 'var(--spacing-md) var(--spacing-lg)'
    }}>
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 md:flex-none pokemon-button transition-all duration-200 ${
              activeTab === 'chat' ? 'pokemon-button--secondary' : ''
            }`}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-sm)',
              backgroundColor: activeTab === 'chat' ? 'var(--gb-yellow)' : 'var(--gb-light-beige)',
              color: 'var(--gb-dark-text)',
              boxShadow: activeTab === 'chat' 
                ? 'inset 1px 1px 0px var(--gb-white)' 
                : '1px 1px 0px var(--gb-darker-beige)',
              padding: 'var(--spacing-md) var(--spacing-lg)',
              minHeight: '44px',
              transform: activeTab === 'chat' ? 'translate(1px, 1px)' : 'none'
            }}
          >
            💬 <span className="hidden sm:inline ml-2">TEAM </span>
            <span className="sm:hidden">CHAT</span>
            <span className="hidden sm:inline">CHAT</span>
          </button>
          
          <button
            onClick={() => setActiveTab('docs')}
            className={`flex-1 md:flex-none pokemon-button transition-all duration-200 ${
              activeTab === 'docs' ? 'pokemon-button--secondary' : ''
            }`}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-sm)',
              backgroundColor: activeTab === 'docs' ? 'var(--gb-yellow)' : 'var(--gb-light-beige)',
              color: 'var(--gb-dark-text)',
              boxShadow: activeTab === 'docs' 
                ? 'inset 1px 1px 0px var(--gb-white)' 
                : '1px 1px 0px var(--gb-darker-beige)',
              padding: 'var(--spacing-md) var(--spacing-lg)',
              minHeight: '44px',
              transform: activeTab === 'docs' ? 'translate(1px, 1px)' : 'none'
            }}
          >
            📄 <span className="ml-2">DOCUMENT</span>
          </button>
          
          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex-1 md:flex-none pokemon-button transition-all duration-200 relative ${
              activeTab === 'inbox' ? 'pokemon-button--secondary' : ''
            }`}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-sm)',
              backgroundColor: activeTab === 'inbox' ? 'var(--gb-yellow)' : 'var(--gb-light-beige)',
              color: 'var(--gb-dark-text)',
              boxShadow: activeTab === 'inbox' 
                ? 'inset 1px 1px 0px var(--gb-white)' 
                : '1px 1px 0px var(--gb-darker-beige)',
              padding: 'var(--spacing-md) var(--spacing-lg)',
              minHeight: '44px',
              transform: activeTab === 'inbox' ? 'translate(1px, 1px)' : 'none'
            }}
          >
            📮 <span className="hidden sm:inline ml-2">INBOX</span>
            <span className="inline sm:hidden ml-2">INBOX</span>
            {hasSharedDocuments && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full" style={{
                backgroundColor: 'var(--gb-red)',
                color: 'var(--gb-white)',
                border: '1px solid var(--gb-black)',
                fontSize: 'var(--pixel-xs)',
                fontFamily: "'Press Start 2P', monospace",
                minWidth: '20px',
                fontWeight: 'normal'
              }}>
                {sharedDocuments.length}
              </span>
            )}
          </button>
        </div>

        {/* Phase Advancement Button */}
        <div className="flex items-center">
          <button 
            onClick={onManualAdvance}
            disabled={!canManuallyAdvance}
            className={`pokemon-button transition-all relative ${
              canManuallyAdvance ? 'pokemon-button--danger' : 'opacity-50 cursor-not-allowed'
            }`}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-xs)'
            }}
            title={advancementRequirements?.reason || 'Advance to next phase'}
          >
            {currentPhase?.icon || '⏭️'}
            <span className="hidden sm:inline ml-2">
              {canManuallyAdvance ? 'NEXT PHASE' : 'LOCKED'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}; 