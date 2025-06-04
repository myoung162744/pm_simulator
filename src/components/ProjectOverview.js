import React from 'react';
import { globalVariables } from '../promptConfig';
import { ProjectDetails } from './ProjectDetails';

const ProjectOverview = () => {
  return (
    <div
      className="h-screen flex flex-col items-center justify-center p-lg"
      style={{ backgroundColor: 'var(--gb-cream)' }}
    >
      
      <div className="flex-1 overflow-auto p-lg flex flex-col items-center justify-center w-full">
        <div className="pokemon-panel w-full max-w-4xl p-lg">
          <ProjectDetails compact={false} />
          
          {/* Begin Simulation Button */}
          <div className="flex justify-center">
            <button 
              className="pokemon-button pokemon-button--primary font-pixel text-pixel-lg py-md px-lg"
              onClick={() => window.location.href = '/study'}
            >
              GO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;
