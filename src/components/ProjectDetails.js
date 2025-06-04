import React from 'react';
import { globalVariables } from '../promptConfig';

/**
 * A reusable component to display project details
 * @param {Object} props
 * @param {boolean} props.compact - Whether to show a compact version (for popover)
 */
export const ProjectDetails = ({ compact = false }) => {
  // Use different styles based on whether this is compact (popover) or full view
  const gridClass = compact 
    ? "grid grid-cols-2 gap-sm" // Adjusted gap
    : "grid grid-cols-1 md:grid-cols-2 gap-md mb-lg"; // Adjusted gap and margin
  const itemClass = compact ? "p-sm" : "p-md"; // Adjusted padding
  const outcomeClass = compact 
    ? "pokemon-textbox mb-md p-sm text-sm" // Adjusted styles
    : "pokemon-textbox mb-lg p-md"; // Adjusted styles
  
  return (
    <>
      {!compact && (
        <h1
          className="font-pixel text-2xl md:text-3xl text-center mb-lg"
          style={{ color: 'var(--gb-dark-text)' }}
        >
          {globalVariables.project.name}
        </h1>
      )}
      
      {/* Desired Outcome */}
      <div className={outcomeClass}>
        {compact ? (
          <>
            <div className="font-pixel" style={{ color: 'var(--gb-dark-text)' }}>Desired Outcome:</div>
            <div className="font-mono" style={{ color: 'var(--gb-medium-text)' }}>{globalVariables.project.desiredOutcome}</div>
          </>
        ) : (
          <div className="flex items-center gap-md"> {/* Adjusted gap */}
            <div className="text-3xl">🎯</div>
            <div>
              <h2
                className="font-pixel text-lg md:text-xl mb-sm"
                style={{ color: 'var(--gb-dark-text)' }}
              >
                Desired Outcome
              </h2>
              <p className="font-mono" style={{ color: 'var(--gb-medium-text)' }}>{globalVariables.project.desiredOutcome}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Project Details */}
      <div className={gridClass}>
        <div
          className={`${itemClass} border-2 border-black rounded`}
          style={{ backgroundColor: 'var(--gb-white)' }}
        >
          <div className="font-pixel mb-sm" style={{ color: 'var(--gb-dark-text)' }}>Timeline</div>
          <div className="font-mono" style={{ color: 'var(--gb-medium-text)' }}>{globalVariables.project.timeline}</div>
        </div>
        <div
          className={`${itemClass} border-2 border-black rounded`}
          style={{ backgroundColor: 'var(--gb-white)' }}
        >
          <div className="font-pixel mb-sm" style={{ color: 'var(--gb-dark-text)' }}>Budget</div>
          <div className="font-mono" style={{ color: 'var(--gb-medium-text)' }}>{globalVariables.project.budget}</div>
        </div>
        <div
          className={`${itemClass} border-2 border-black rounded`}
          style={{ backgroundColor: 'var(--gb-white)' }}
        >
          <div className="font-pixel mb-sm" style={{ color: 'var(--gb-dark-text)' }}>Priority</div>
          <div className="font-mono" style={{ color: 'var(--gb-medium-text)' }}>{globalVariables.project.priority}</div>
        </div>
        <div
          className={`${itemClass} border-2 border-black rounded`}
          style={{ backgroundColor: 'var(--gb-white)' }}
        >
          <div className="font-pixel mb-sm" style={{ color: 'var(--gb-dark-text)' }}>Stakeholders</div>
          <div className="font-mono" style={{ color: 'var(--gb-medium-text)' }}>{globalVariables.project.stakeholders}</div>
        </div>
      </div>
    </>
  );
};
