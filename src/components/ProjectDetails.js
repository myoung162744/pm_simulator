import React from 'react';
import { globalVariables } from '../promptConfig';

/**
 * A reusable component to display project details
 * @param {Object} props
 * @param {boolean} props.compact - Whether to show a compact version (for popover)
 */
export const ProjectDetails = ({ compact = false }) => {
  
  return (
    <>
      {!compact && (
        <h1
          className="font-pixel text-2xl md:text-3xl text-center mb-8"
          style={{ color: 'var(--gb-dark-text)' }}
        >
          {globalVariables.project.name}
        </h1>
      )}
      
      {/* Single unified container for better cohesion */}
      <div className="pokemon-textbox mb-6">
        {/* Desired Outcome Section */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-gray-200">
          <div className="text-3xl">🎯</div>
          <div className="flex-1">
            <h2
              className="font-pixel text-lg md:text-xl mb-2"
              style={{ color: 'var(--gb-dark-text)' }}
            >
              Desired Outcome
            </h2>
            <p className="font-mono text-sm leading-relaxed" style={{ color: 'var(--gb-medium-text)' }}>
              {globalVariables.project.desiredOutcome}
            </p>
          </div>
        </div>
        
        {/* Project Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="font-pixel text-sm mb-2 text-gray-600 uppercase tracking-wide">Timeline</div>
            <div className="font-mono bg-gray-50 p-3 border-l-4 border-blue-500" style={{ color: 'var(--gb-dark-text)' }}>
              {globalVariables.project.timeline}
            </div>
          </div>
          
          <div>
            <div className="font-pixel text-sm mb-2 text-gray-600 uppercase tracking-wide">Priority</div>
            <div className="font-mono bg-gray-50 p-3 border-l-4 border-red-500" style={{ color: 'var(--gb-dark-text)' }}>
              {globalVariables.project.priority}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
