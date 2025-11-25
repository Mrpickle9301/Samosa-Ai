import React from 'react';
import { ChatSession } from '../types';

interface SidebarProps {
  isOpen: boolean;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (e: React.MouseEvent, id: string) => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClose,
}) => {
  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <div 
        className={`fixed top-16 right-0 bottom-0 w-72 bg-white border-l border-stone-200 shadow-xl transform transition-transform duration-300 ease-in-out z-30 flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <h2 className="font-display font-bold text-stone-800">Your Stash</h2>
          <button 
            onClick={onClose}
            className="md:hidden text-stone-400 hover:text-stone-600 p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 bg-samosa-500 hover:bg-samosa-600 text-white py-2.5 px-4 rounded-xl font-medium transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
            Fresh Chat
          </button>
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
          {sessions.length === 0 ? (
            <div className="text-center mt-10 px-6">
              <p className="text-stone-400 text-sm italic">Nothing in the stash yet.</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`group relative flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors border border-transparent
                  ${currentSessionId === session.id 
                    ? 'bg-samosa-50 border-samosa-100' 
                    : 'hover:bg-stone-50 hover:border-stone-100'
                  }`}
                onClick={() => {
                  onSelectSession(session.id);
                  if (window.innerWidth < 768) onClose();
                }}
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${currentSessionId === session.id ? 'bg-samosa-500' : 'bg-stone-300'}`} />
                
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-medium truncate ${currentSessionId === session.id ? 'text-stone-900' : 'text-stone-600'}`}>
                    {session.title || "New Conversation"}
                  </h3>
                  <p className="text-[10px] text-stone-400">
                    {new Date(session.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={(e) => onDeleteSession(e, session.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                  title="Delete Chat"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.49 1.478l-.565 9.064a2.625 2.625 0 01-2.622 2.44H7.297a2.625 2.625 0 01-2.622-2.44l-.565-9.064a48.846 48.846 0 01-.49-1.478.75.75 0 011.478-.25c1.24.101 2.476.197 3.714.247v-.227c0-1.25.867-2.27 2.03-2.522.992-.214 2.007-.214 2.998 0 1.163.252 2.03 1.272 2.03 2.522zM10 13.25a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75H10zM14 13.25a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75H14zM8.5 9.75a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75H8.5zM15.5 9.75a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75H15.5z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;