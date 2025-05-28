import React from 'react';
import { globalVariables } from '../promptConfig';
import { ProjectDetails } from './ProjectDetails';

const ProjectOverview = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex flex-col">
      
      <div className="flex-1 overflow-auto p-4 md:p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl bg-white bg-opacity-90 rounded-xl shadow-xl p-6 md:p-8">
          <ProjectDetails compact={false} />
          
          {/* Begin Simulation Button */}
          <div className="flex justify-center">
            <button 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
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
