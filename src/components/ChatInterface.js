import React from 'react';
import { Send, Menu, Clock, Database, Lock, Unlock } from 'lucide-react';
import { ContactsList } from './ContactsList';

export const ChatInterface = ({
  selectedContact,
  isLoadingResponse,
  currentMessage,
  setCurrentMessage,
  chatMessages,
  chatEndRef,
  messageInputRef,
  sendMessage,
  contacts,
  isMobile,
  isSidebarOpen,
  setIsSidebarOpen,
  onSelectContact,
  currentPhase,
  canManuallyAdvance,
  advancementRequirements,
  onManualAdvance
}) => {
  const selectedContactInfo = contacts.find(c => c.id === selectedContact);

  return (
    <div className="flex h-full relative">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Contacts Sidebar */}
      <ContactsList
        contacts={contacts}
        selectedContact={selectedContact}
        onSelectContact={onSelectContact}
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
      />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0" style={{
        backgroundColor: 'var(--gb-cream)'
      }}>
        {/* Chat Header */}
        <div className="pokemon-panel--header flex-shrink-0" style={{
          backgroundColor: 'var(--gb-dark-beige)',
          padding: 'var(--spacing-lg) var(--spacing-xl)'
        }}>
          <div className="flex items-center gap-4">
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="pokemon-button md:hidden"
                style={{
                  padding: 'var(--spacing-sm)',
                  minHeight: '36px',
                  minWidth: '36px'
                }}
              >
                ☰
              </button>
            )}
            <div className="text-3xl">{selectedContactInfo?.avatar}</div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold truncate text-primary" style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-lg)',
                marginBottom: 'var(--spacing-xs)'
              }}>
                {selectedContactInfo?.name?.toUpperCase()}
              </h3>
              <p className="text-xs truncate text-secondary" style={{
                fontFamily: "var(--font-mono)",
                fontSize: 'var(--text-sm)'
              }}>
                {selectedContactInfo?.role?.toUpperCase()}
              </p>
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

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4" style={{
          padding: 'var(--spacing-xl)'
        }}>
          {(chatMessages[selectedContact] || []).map((msg, idx) => (
            <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] sm:max-w-md lg:max-w-lg pokemon-textbox`}
                style={{
                  backgroundColor: msg.isUser ? 'var(--gb-blue)' : 'var(--gb-yellow)',
                  padding: 'var(--spacing-md) var(--spacing-lg)',
                  boxShadow: '2px 2px 0px var(--gb-darker-beige)'
                }}
              >
                <div className="font-bold" style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'var(--pixel-sm)',
                  color: msg.isUser ? 'var(--gb-white)' : 'var(--gb-dark-text)',
                  marginBottom: 'var(--spacing-sm)'
                }}>{msg.sender.toUpperCase()}</div>
                <div className="break-words" style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 'var(--text-base)',
                  lineHeight: '1.6',
                  color: msg.isUser ? 'var(--gb-white)' : 'var(--gb-dark-text)',
                  marginBottom: 'var(--spacing-sm)'
                }}>{msg.message}</div>
                <div className="flex items-center gap-2 opacity-75" style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 'var(--text-xs)',
                  color: msg.isUser ? 'var(--gb-white)' : 'var(--gb-medium-text)'
                }}>
                  🕐 {msg.time}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Message Input */}
        <div className="pokemon-panel--header flex-shrink-0" style={{
          backgroundColor: 'var(--gb-medium-beige)',
          borderTop: '2px solid var(--gb-black)',
          padding: 'var(--spacing-lg) var(--spacing-xl)'
        }}>
          {isLoadingResponse && (
            <div className="flex items-center gap-3 text-primary" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-sm)',
              marginBottom: 'var(--spacing-md)'
            }}>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{
                borderColor: 'var(--gb-dark-text)'
              }}></div>
              {selectedContactInfo?.name?.toUpperCase()} IS TYPING...
            </div>
          )}
          <div className="flex gap-3">
            <input
              ref={messageInputRef}
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoadingResponse && sendMessage()}
              placeholder={isLoadingResponse ? "WAITING..." : "TYPE MESSAGE..."}
              disabled={isLoadingResponse}
              className={`flex-1 pokemon-textbox ${isLoadingResponse ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 'var(--text-base)',
                backgroundColor: 'var(--gb-white)',
                color: 'var(--gb-dark-text)',
                padding: 'var(--spacing-md) var(--spacing-lg)',
                minHeight: '48px'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={isLoadingResponse || !currentMessage.trim()}
              className={`pokemon-button pokemon-button--danger transition-all duration-200 ${
                isLoadingResponse || !currentMessage.trim()
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-105'
              }`}
              style={{
                fontSize: 'var(--pixel-lg)',
                minHeight: '48px',
                minWidth: '48px'
              }}
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 