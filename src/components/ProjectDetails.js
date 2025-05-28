import React from 'react';
import { globalVariables } from '../promptConfig';

/**
 * A reusable component to display project details
 * @param {Object} props
 * @param {boolean} props.compact - Whether to show a compact version (for popover)
 */
export const ProjectDetails = ({ compact = false }) => {
  // Use different styles based on whether this is compact (popover) or full view
  const containerClass = compact ? "text-xs" : "";
  const gridClass = compact 
    ? "grid grid-cols-2 gap-2" 
    : "grid grid-cols-1 md:grid-cols-2 gap-4 mb-8";
  const itemClass = compact ? "p-2" : "p-4";
  const outcomeClass = compact 
    ? "mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 p-2 rounded text-white text-sm" 
    : "mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 p-4 rounded-lg shadow-md";
  
  return (
    <>
      {!compact && (
        <h1 className="text-2xl md:text-3xl font-bold text-center text-purple-800 mb-6">
          {globalVariables.project.name}
        </h1>
      )}
      
      {/* Desired Outcome */}
      <div className={outcomeClass}>
        {compact ? (
          <>
            <div className="font-semibold">Desired Outcome:</div>
            <div>{globalVariables.project.desiredOutcome}</div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <div className="text-3xl">🎯</div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white">Desired Outcome</h2>
              <p className="text-white">{globalVariables.project.desiredOutcome}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Project Details */}
      <div className={gridClass}>
        <div className={`bg-blue-50 ${itemClass} rounded${compact ? "" : "-lg shadow-sm"}`}>
          <div className="font-semibold text-blue-800 mb-1">Timeline</div>
          <div className="text-gray-800">{globalVariables.project.timeline}</div>
        </div>
        <div className={`bg-purple-50 ${itemClass} rounded${compact ? "" : "-lg shadow-sm"}`}>
          <div className="font-semibold text-purple-800 mb-1">Budget</div>
          <div className="text-gray-800">{globalVariables.project.budget}</div>
        </div>
        <div className={`bg-pink-50 ${itemClass} rounded${compact ? "" : "-lg shadow-sm"}`}>
          <div className="font-semibold text-pink-800 mb-1">Priority</div>
          <div className="text-gray-800">{globalVariables.project.priority}</div>
        </div>
        <div className={`bg-indigo-50 ${itemClass} rounded${compact ? "" : "-lg shadow-sm"}`}>
          <div className="font-semibold text-indigo-800 mb-1">Stakeholders</div>
          <div className="text-gray-800">{globalVariables.project.stakeholders}</div>
        </div>
      </div>
    </>
  );
};
