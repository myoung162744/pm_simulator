import React from 'react';
import { globalVariables } from '../promptConfig';

export const Header = () => {
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
          <div className="bg-white bg-opacity-20 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold">
            🎯 <span className="hidden sm:inline">{globalVariables.project.name}</span>
            <span className="sm:hidden">Project</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 