import React, { useState, useRef, useEffect } from 'react';

interface InputAreaProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4">
      <div className="relative flex items-end gap-2 bg-white p-2 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-stone-100 focus-within:ring-2 focus-within:ring-samosa-200 transition-all duration-300">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something real..."
          disabled={disabled}
          rows={1}
          className="w-full bg-transparent border-none text-stone-800 placeholder-stone-400 focus:ring-0 resize-none py-3 px-4 max-h-[120px] overflow-y-auto disabled:opacity-50 font-sans"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          className={`mb-1 p-3 rounded-full flex-shrink-0 transition-all duration-200 
            ${!input.trim() || disabled 
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed' 
              : 'bg-samosa-500 text-white hover:bg-samosa-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
      <div className="text-center mt-2">
        <p className="text-[10px] text-stone-400 font-medium">
          Samosa AI can make mistakes. Always check the spices.
        </p>
      </div>
    </div>
  );
};

export default InputArea;
