import React from 'react';
import { Send, Menu, Clock } from 'lucide-react';
import { ContactsList } from './ContactsList';

export const ChatInterface = ({
  selectedContact,
  isLoadingResponse,
  currentMessage,
  setCurrentMessage,
  chatMessages,
  chatEndRef,
  messageInputRef,
  sendMessage,
  contacts,
  isMobile,
  isSidebarOpen,
  setIsSidebarOpen,
  onSelectContact
}) => {
  const selectedContactInfo = contacts.find(c => c.id === selectedContact);

  return (
    <div className="flex h-full relative">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Contacts Sidebar */}
      <ContactsList
        contacts={contacts}
        selectedContact={selectedContact}
        onSelectContact={onSelectContact}
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
      />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-purple-50 to-blue-50 min-w-0">
        {/* Chat Header */}
        <div className="p-3 md:p-4 border-b-4 border-purple-300 bg-gradient-to-r from-purple-200 to-blue-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-purple-300 rounded-lg md:hidden"
              >
                <Menu size={20} className="text-purple-800" />
              </button>
            )}
            <div className="text-xl md:text-2xl">{selectedContactInfo?.avatar}</div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-purple-800 text-sm md:text-base truncate">
                {selectedContactInfo?.name}
              </h3>
              <p className="text-xs md:text-sm text-purple-600 truncate">
                {selectedContactInfo?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3">
          {(chatMessages[selectedContact] || []).map((msg, idx) => (
            <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 md:px-4 py-2 rounded-2xl border-2 shadow-lg ${
                msg.isUser 
                  ? 'bg-gradient-to-r from-green-200 to-blue-200 border-blue-400 text-blue-800' 
                  : 'bg-gradient-to-r from-yellow-100 to-orange-100 border-orange-300 text-orange-800'
              }`}>
                <div className="font-semibold text-xs mb-1">{msg.sender}</div>
                <div className="text-sm break-words">{msg.message}</div>
                <div className="text-xs opacity-70 mt-1 flex items-center gap-1">
                  <Clock size={10} />
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-3 md:p-4 border-t-4 border-purple-300 bg-gradient-to-r from-purple-100 to-blue-100 flex-shrink-0">
          {isLoadingResponse && (
            <div className="mb-2 text-xs text-purple-600 flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
              {selectedContactInfo?.name} is typing...
            </div>
          )}
          <div className="flex gap-2">
            <input
              ref={messageInputRef}
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoadingResponse && sendMessage()}
              placeholder={isLoadingResponse ? "Waiting for response..." : "Type a message..."}
              disabled={isLoadingResponse}
              className={`flex-1 p-2 md:p-3 rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:outline-none bg-white shadow-inner text-sm md:text-base ${isLoadingResponse ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <button
              onClick={sendMessage}
              disabled={isLoadingResponse || !currentMessage.trim()}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-xl border-2 border-green-500 shadow-lg transition-all duration-200 flex-shrink-0 ${
                isLoadingResponse || !currentMessage.trim()
                  ? 'bg-gray-400 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white hover:shadow-xl transform hover:scale-105'
              }`}
            >
              <Send size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 