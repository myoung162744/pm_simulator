import React from 'react';
import { Users, X } from 'lucide-react';

export const ContactsList = ({ 
  contacts, 
  selectedContact, 
  onSelectContact, 
  isMobile, 
  isSidebarOpen, 
  onCloseSidebar 
}) => {
  return (
    <div className={`${
      isMobile 
        ? `fixed left-0 top-0 h-full w-80 z-50 transform transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`
        : 'w-72 relative'
    } bg-gradient-to-b from-blue-100 to-blue-200 border-r-4 border-blue-400 overflow-y-auto`}>
      <div className="p-4 border-b-2 border-blue-300 bg-gradient-to-r from-blue-200 to-purple-200">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-blue-800 flex items-center gap-2">
            <Users size={20} />
            Team Members
          </h2>
          {isMobile && (
            <button
              onClick={onCloseSidebar}
              className="p-1 hover:bg-blue-300 rounded"
            >
              <X size={20} className="text-blue-800" />
            </button>
          )}
        </div>
      </div>
      <div className="p-2">
        {contacts.map(contact => (
          <div
            key={contact.id}
            onClick={() => onSelectContact(contact.id)}
            className={`p-3 m-1 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
              selectedContact === contact.id 
                ? 'bg-gradient-to-r from-yellow-200 to-orange-200 border-orange-400 shadow-lg transform scale-105' 
                : 'bg-white border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl flex-shrink-0">{contact.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-gray-800 truncate">{contact.name}</div>
                <div className="text-xs text-gray-600 truncate">{contact.role}</div>
                <div className="flex items-center gap-1 mt-1">
                  <div className={`w-2 h-2 rounded-full ${
                    contact.status === 'online' ? 'bg-green-400' : 
                    contact.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-xs capitalize text-gray-500">{contact.status}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 