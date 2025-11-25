import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Split by code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="text-sm md:text-base leading-relaxed break-words">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          // It's a code block
          const content = part.slice(3, -3).replace(/^[a-z]+\n/, ''); // Remove language identifier if present
          return (
            <div key={index} className="my-3 overflow-x-auto rounded-md bg-stone-900 p-4 text-gray-100 font-mono text-sm shadow-sm border border-stone-700">
              <pre className="whitespace-pre-wrap">{content.trim()}</pre>
            </div>
          );
        }

        // It's regular text, handle inline formatting (bold, italics) simpler approach
        // We will split by newlines to handle paragraphs
        const lines = part.split('\n');
        return lines.map((line, lineIndex) => (
          <p key={`${index}-${lineIndex}`} className={`min-h-[1em] ${lineIndex < lines.length - 1 ? 'mb-2' : ''}`}>
             {renderInlineFormatting(line)}
          </p>
        ));
      })}
    </div>
  );
};

// Helper to handle **bold** and `code`
const renderInlineFormatting = (text: string): React.ReactNode[] => {
  if (!text) return [];
  
  // Split by bold syntax
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-samosa-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-stone-200 text-samosa-800 px-1 py-0.5 rounded font-mono text-xs md:text-sm">{part.slice(1, -1)}</code>;
    }
    return <span key={i}>{part}</span>;
  });
};

export default MarkdownRenderer;
