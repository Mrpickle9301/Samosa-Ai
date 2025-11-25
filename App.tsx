import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import MessageBubble from './components/MessageBubble';
import InputArea from './components/InputArea';
import Sidebar from './components/Sidebar';
import { Message, Role, ChatSession } from './types';
import { initializeChat, sendMessageStream } from './services/gemini';

const App: React.FC = () => {
  // State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load sessions from local storage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('samosa_sessions');
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        // Convert timestamp strings back to Date objects
        const hydrated: ChatSession[] = parsed.map((s: any) => ({
          ...s,
          updatedAt: new Date(s.updatedAt),
          messages: s.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }))
        }));
        
        // Sort by newest
        hydrated.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        setSessions(hydrated);
      } catch (e) {
        console.error("Failed to parse sessions", e);
      }
    }
    
    // Start a new chat initially if no previous session selected
    startNewChat();
  }, []);

  // Save sessions to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('samosa_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const startNewChat = () => {
    const newId = Date.now().toString();
    const initialGreeting: Message = {
      id: 'init-' + newId,
      role: Role.MODEL,
      text: "Yo! I'm Samosa AI. Fresh out the fryer. \n\nNeed some code, advice, or just want to chat? I'm listening.",
      timestamp: new Date(),
    };
    
    // Reset internal Gemini state
    initializeChat();

    setMessages([initialGreeting]);
    setCurrentSessionId(null); // Null means "drafting new chat" until first user message
    setIsSidebarOpen(false);
  };

  const handleSelectSession = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setCurrentSessionId(session.id);
      setMessages(session.messages);
      
      // Re-initialize Gemini with history
      initializeChat(session.messages);
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    
    if (currentSessionId === id) {
      startNewChat();
    }
  };

  const updateCurrentSession = (updatedMessages: Message[]) => {
    if (!currentSessionId) {
      // Create new session
      const newId = Date.now().toString();
      
      // Try to generate a title from the first user message
      const firstUserMsg = updatedMessages.find(m => m.role === Role.USER);
      const title = firstUserMsg ? firstUserMsg.text.slice(0, 30) + (firstUserMsg.text.length > 30 ? '...' : '') : "New Chat";

      const newSession: ChatSession = {
        id: newId,
        title: title,
        messages: updatedMessages,
        updatedAt: new Date(),
      };
      
      setCurrentSessionId(newId);
      setSessions(prev => [newSession, ...prev]);
    } else {
      // Update existing session
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            messages: updatedMessages,
            updatedAt: new Date(),
          };
        }
        return s;
      }).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsgId = Date.now().toString();
    const newUserMsg: Message = {
      id: userMsgId,
      role: Role.USER,
      text: text,
      timestamp: new Date(),
    };

    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    updateCurrentSession(newMessages); // Save user message
    setIsLoading(true);

    try {
      // Create a placeholder for the AI response
      const aiMsgId = (Date.now() + 1).toString();
      const newAiMsg: Message = {
        id: aiMsgId,
        role: Role.MODEL,
        text: '',
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages(prev => [...prev, newAiMsg]);

      // Stream response
      let accumulatedText = "";
      
      await sendMessageStream(text, (chunk) => {
        accumulatedText += chunk;
        setMessages(prev => {
          const updated = prev.map(msg => 
            msg.id === aiMsgId 
              ? { ...msg, text: accumulatedText } 
              : msg
          );
          // Only update session periodically or at end to save perf could be better, 
          // but for now let's update state for UI reactivity
          return updated;
        });
      });

      // Finish streaming and update session with final full text
      setMessages(prev => {
        const finalMessages = prev.map(msg => 
          msg.id === aiMsgId 
            ? { ...msg, isStreaming: false } 
            : msg
        );
        updateCurrentSession(finalMessages);
        return finalMessages;
      });

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: Role.MODEL,
        text: "Oof, dropped the chutney. Something went wrong connecting to the kitchen (API). Try again?",
        timestamp: new Date(),
      };
      const finalWithErr = [...newMessages, errorMsg];
      setMessages(finalWithErr);
      updateCurrentSession(finalWithErr);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#fdfaf6] to-[#f9f4e8] text-stone-800 font-sans overflow-hidden">
      <Header 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        <main 
          className={`flex-1 flex flex-col w-full mx-auto transition-all duration-300 ease-in-out
            ${isSidebarOpen && window.innerWidth >= 768 ? 'mr-72' : 'mr-0'}
          `}
        >
          <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-2 scroll-smooth">
            <div className="max-w-3xl mx-auto flex flex-col space-y-2 min-h-[50vh]">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          </div>

          <div className="w-full bg-gradient-to-t from-[#f9f4e8] via-[#f9f4e8] to-transparent pt-4">
             <div className="max-w-3xl mx-auto">
                <InputArea onSend={handleSendMessage} disabled={isLoading} />
             </div>
          </div>
        </main>

        <Sidebar 
          isOpen={isSidebarOpen}
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={handleSelectSession}
          onNewChat={startNewChat}
          onDeleteSession={handleDeleteSession}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
    </div>
  );
};

export default App;