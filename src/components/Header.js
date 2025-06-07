import React, { useState } from 'react';
import { globalVariables } from '../promptConfig';
import { ProjectDetails } from './ProjectDetails';

export const Header = ({ children }) => {
  const [showProjectPopover, setShowProjectPopover] = useState(false);
  return (
    <div className="pokemon-panel--header shadow-lg flex-shrink-0" style={{
      backgroundColor: 'var(--gb-medium-beige)',
      padding: 'var(--spacing-lg) var(--spacing-xl)'
    }}>
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-bold text-primary" style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 'var(--pixel-lg)',
          letterSpacing: '1px'
        }}>
          <span className="hidden sm:inline">STUDYHAL</span>
          <span className="sm:hidden">STUDYHAL</span>
        </h1>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 pokemon-textbox" style={{
            padding: 'var(--spacing-xs) var(--spacing-md)',
            backgroundColor: 'var(--gb-white)',
            minHeight: '32px'
          }}>
            <div className="w-3 h-3 rounded-full animate-pulse" style={{
              backgroundColor: 'var(--gb-red)'
            }}></div>
            <span className="font-bold text-primary" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-sm)'
            }}>
              <span className="hidden sm:inline">{globalVariables.company.name}</span>
              <span className="sm:hidden">COMPANY</span>
            </span>
          </div>
          <div className="relative">
            <button 
              className="pokemon-button--secondary transition-all hover:scale-105"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-xs)',
                padding: 'var(--spacing-xs) var(--spacing-sm)'
              }}
              onMouseEnter={() => setShowProjectPopover(true)}
              onMouseLeave={() => setShowProjectPopover(false)}
            >
              🎯 <span className="hidden sm:inline ml-2">{globalVariables.project.name}</span>
              <span className="sm:hidden ml-2">PROJECT</span>
            </button>
            
            {/* Project Popover */}
            {showProjectPopover && (
              <div 
                className="absolute right-0 mt-2 w-80 md:w-96 pokemon-panel--content rounded-lg shadow-xl z-50 transform origin-top-right"
                style={{
                  backgroundColor: 'var(--gb-cream)',
                  padding: 'var(--spacing-lg)'
                }}
                onMouseEnter={() => setShowProjectPopover(true)}
                onMouseLeave={() => setShowProjectPopover(false)}
              >
                <h3 className="font-bold mb-3 text-primary" style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'var(--pixel-lg)'
                }}>{globalVariables.project.name}</h3>
                <ProjectDetails compact={true} />
              </div>
            )}
          </div>
        </div>
      </div>
      {children && (
        <div className="border-t-2 border-gray-300 pt-2">
          {children}
        </div>
      )}
    </div>
  );
}; 