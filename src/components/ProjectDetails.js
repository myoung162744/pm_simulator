import React from 'react';
import { globalVariables } from '../promptConfig';
import { phases } from '../phaseConfig';

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
          Product Management Simulation
        </h1>
      )}
      
      {/* Single unified container for better cohesion */}
      <div className="pokemon-textbox mb-6">
        {/* Simulation Overview Section */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-gray-200">
          <div className="text-3xl">🎯</div>
          <div className="flex-1">
            <h2
              className="font-pixel text-lg md:text-xl mb-2"
              style={{ color: 'var(--gb-dark-text)' }}
            >
              What You'll Experience
            </h2>
            <p className="font-mono text-sm leading-relaxed" style={{ color: 'var(--gb-medium-text)' }}>
              A realistic product management scenario where you'll tackle a critical business problem through research, planning, and team collaboration. You'll work with AI team members, review documents, and deliver a solution proposal.
            </p>
          </div>
        </div>
        
        {/* Simulation Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="font-pixel text-sm mb-2 text-gray-600 uppercase tracking-wide">Your Role</div>
            <div className="font-mono bg-gray-50 p-3 border-l-4 border-blue-500" style={{ color: 'var(--gb-dark-text)' }}>
              Senior Product Manager<br/>
              Mobile Experience Team
            </div>
          </div>
          
          <div>
            <div className="font-pixel text-sm mb-2 text-gray-600 uppercase tracking-wide">Duration</div>
            <div className="font-mono bg-gray-50 p-3 border-l-4 border-green-500" style={{ color: 'var(--gb-dark-text)' }}>
              60-90 minutes<br/>
              (5 structured phases)
            </div>
          </div>
        </div>

        {/* Phases Overview */}
        <div>
          <h3 className="font-pixel text-md mb-3" style={{ color: 'var(--gb-dark-text)' }}>
            Simulation Phases
          </h3>
          <div className="space-y-2">
            {Object.values(phases).slice(0, 5).map((phase, index) => (
              <div key={phase.id} className="flex items-center gap-3">
                <div className="text-lg">{phase.icon}</div>
                <div className="flex-1">
                  <div className="font-pixel text-sm" style={{ color: 'var(--gb-dark-text)' }}>
                    Phase {index + 1}: {phase.title}
                  </div>
                  <div className="font-mono text-xs" style={{ color: 'var(--gb-medium-text)' }}>
                    {phase.description}
                  </div>
                </div>
                <div className="font-mono text-xs text-gray-500">
                  {phase.estimatedTime}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
