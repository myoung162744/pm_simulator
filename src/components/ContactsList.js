import React from 'react';
import { Users, X } from 'lucide-react';

export const ContactsList = ({ 
  contacts, 
  selectedContact, 
  onSelectContact, 
  isMobile, 
  isSidebarOpen, 
  onCloseSidebar 
}) => {
  return (
    <div className={`${
      isMobile 
        ? `fixed left-0 top-0 h-full w-80 z-50 transform transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`
        : 'w-80 relative'
    } pokemon-panel--sidebar overflow-y-auto`} style={{
      backgroundColor: 'var(--gb-medium-beige)'
    }}>
      <div className="pokemon-panel--header" style={{
        backgroundColor: 'var(--gb-dark-beige)',
        padding: 'var(--spacing-lg) var(--spacing-xl)'
      }}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-primary" style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'var(--pixel-lg)'
          }}>👥 TEAM</h3>
          {isMobile && (
            <button
              onClick={onCloseSidebar}
              className="pokemon-button--danger"
              style={{
                padding: 'var(--spacing-xs)',
                minHeight: '32px',
                minWidth: '32px'
              }}
            >
              ❌
            </button>
          )}
        </div>
      </div>
      <div style={{ padding: 'var(--spacing-md)' }}>
        {contacts.map(contact => (
          <div
            key={contact.id}
            onClick={() => onSelectContact(contact.id)}
            className={`cursor-pointer transition-all duration-200 pokemon-textbox hover:scale-102 ${
              selectedContact === contact.id ? 'shadow-lg' : 'shadow-md'
            }`}
            style={{
              backgroundColor: selectedContact === contact.id ? 'var(--gb-yellow)' : 'var(--gb-white)',
              boxShadow: selectedContact === contact.id 
                ? '2px 2px 0px var(--gb-darker-beige)' 
                : '1px 1px 0px var(--gb-darker-beige)',
              transform: selectedContact === contact.id ? 'translate(-1px, -1px)' : 'none',
              margin: `var(--spacing-sm) 0`,
              padding: 'var(--spacing-lg)'
            }}
          >
            <div className="flex items-center gap-4">
              <div className="text-2xl flex-shrink-0">{contact.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate text-primary" style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'var(--pixel-sm)',
                  marginBottom: 'var(--spacing-xs)'
                }}>{contact.name.toUpperCase()}</div>
                <div className="text-xs truncate text-secondary" style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 'var(--text-xs)'
                }}>{contact.role.toUpperCase()}</div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full border border-black`} style={{
                    backgroundColor: contact.status === 'online' ? 'var(--gb-red)' : 
                      contact.status === 'away' ? 'var(--gb-yellow)' : 'var(--gb-darker-beige)',
                    borderColor: 'var(--gb-black)'
                  }}></div>
                  <span className="text-xs capitalize text-muted" style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 'var(--text-xs)'
                  }}>{contact.status.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 