import React from 'react';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-samosa-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-samosa-500 to-yellow-400 rounded-lg transform rotate-3 flex items-center justify-center shadow text-white font-bold text-lg select-none">
            S
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-stone-900 leading-none">
              Samosa AI
            </h1>
            <p className="text-xs text-samosa-700 font-medium">Crispy. Spicy. Smart.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4">
           <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-samosa-50 rounded-md border border-samosa-100 text-samosa-700 text-xs font-semibold">
             <span className="w-2 h-2 rounded-full bg-chutney-500"></span>
             Online
           </div>
           
           <button 
             onClick={onToggleSidebar}
             className={`p-2 rounded-lg transition-colors relative ${isSidebarOpen ? 'bg-samosa-100 text-samosa-700' : 'hover:bg-stone-100 text-stone-500'}`}
             aria-label="Toggle history"
           >
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
              </svg>
              {!isSidebarOpen && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-samosa-500 rounded-full border border-white"></span>
              )}
           </button>
        </div>
      </div>
    </header>
  );
};

export default Header;