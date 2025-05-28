import React, { useState } from 'react';
import { globalVariables } from '../promptConfig';
import { ProjectDetails } from './ProjectDetails';

export const Header = () => {
  const [showProjectPopover, setShowProjectPopover] = useState(false);
  return (
    <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 p-3 md:p-4 border-b-4 border-blue-600 shadow-xl flex-shrink-0">
      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-2xl font-bold text-white drop-shadow-lg">
          🚀 <span className="hidden sm:inline">StudyHal</span>
          <span className="sm:hidden">StudyHal</span>
        </h1>
        <div className="flex items-center gap-2 md:gap-4 text-white">
          <div className="flex items-center gap-1 md:gap-2">
            <div className="w-2 md:w-3 h-2 md:h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs md:text-sm font-semibold">
              <span className="hidden sm:inline">{globalVariables.company.name}</span>
              <span className="sm:hidden">Company</span>
            </span>
          </div>
          <div className="relative">
            <div 
              className="bg-white bg-opacity-20 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold cursor-pointer hover:bg-opacity-30 transition-all"
              onMouseEnter={() => setShowProjectPopover(true)}
              onMouseLeave={() => setShowProjectPopover(false)}
            >
              🎯 <span className="hidden sm:inline">{globalVariables.project.name}</span>
              <span className="sm:hidden">Project</span>
            </div>
            
            {/* Project Popover */}
            {showProjectPopover && (
              <div 
                className="absolute right-0 mt-2 w-72 md:w-96 bg-white rounded-lg shadow-xl z-50 transform origin-top-right"
                onMouseEnter={() => setShowProjectPopover(true)}
                onMouseLeave={() => setShowProjectPopover(false)}
              >
                <div className="p-4">
                  <h3 className="text-lg font-bold text-purple-800 mb-2">{globalVariables.project.name}</h3>
                  <ProjectDetails compact={true} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 