import React from 'react';
import { Message, Role } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm text-sm md:text-base select-none
          ${isUser 
            ? 'bg-stone-200 text-stone-600' 
            : 'bg-gradient-to-br from-samosa-400 to-samosa-600 text-white'
          }`}>
          {isUser ? 'You' : 'AI'}
        </div>

        {/* Bubble */}
        <div className={`relative px-5 py-3.5 rounded-2xl shadow-sm border
          ${isUser 
            ? 'bg-white border-stone-100 text-stone-800 rounded-tr-sm' 
            : 'bg-white border-samosa-100 text-stone-800 rounded-tl-sm'
          }`}>
            
          {/* Header Name (Optional) */}
          {!isUser && (
            <div className="text-xs font-bold text-samosa-600 mb-1 tracking-wide uppercase">
              Samosa AI
            </div>
          )}

          <MarkdownRenderer content={message.text} />
          
          {/* Timestamp or Status */}
          <div className={`text-[10px] mt-2 opacity-40 font-medium flex items-center gap-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
             {message.isStreaming ? (
                <span className="flex items-center gap-1 text-samosa-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-samosa-500 animate-pulse"></span>
                  Thinking...
                </span>
             ) : (
                message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
