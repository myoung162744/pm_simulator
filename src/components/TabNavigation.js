import React from 'react';
import { MessageSquare, FileText, Inbox } from 'lucide-react';

export const TabNavigation = ({ activeTab, setActiveTab, sharedDocuments = [] }) => {
  const hasSharedDocuments = sharedDocuments.length > 0;
  
  return (
    <div className="bg-gradient-to-r from-purple-300 to-blue-300 border-b-4 border-purple-500 flex-shrink-0">
      <div className="flex">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 font-bold text-xs md:text-sm border-r-2 border-purple-400 transition-all duration-200 ${
            activeTab === 'chat'
              ? 'bg-gradient-to-b from-yellow-200 to-orange-200 text-orange-800 shadow-inner'
              : 'text-purple-800 hover:bg-purple-200'
          }`}
        >
          <MessageSquare className="inline mr-1 md:mr-2" size={14} />
          <span className="hidden sm:inline">Team </span>Chat
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 font-bold text-xs md:text-sm border-r-2 border-purple-400 transition-all duration-200 ${
            activeTab === 'docs'
              ? 'bg-gradient-to-b from-yellow-200 to-orange-200 text-orange-800 shadow-inner'
              : 'text-purple-800 hover:bg-purple-200'
          }`}
        >
          <FileText className="inline mr-1 md:mr-2" size={14} />
          Document
        </button>
        {hasSharedDocuments && (
          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 font-bold text-xs md:text-sm transition-all duration-200 ${
              activeTab === 'inbox'
                ? 'bg-gradient-to-b from-yellow-200 to-orange-200 text-orange-800 shadow-inner'
                : 'text-purple-800 hover:bg-purple-200'
            }`}
          >
            <Inbox className="inline mr-1 md:mr-2" size={14} />
            <span className="hidden sm:inline">Inbox</span>
            <span className="inline sm:hidden">Inbox</span>
            {hasSharedDocuments && (
              <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-500 rounded-full">
                {sharedDocuments.length}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}; 