// src/components/Message.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import remarkGfm from 'remark-gfm';       // Import GitHub Flavored Markdown plugin

function Message({ message, fromUser }) {
  // Define Tailwind CSS classes for the message bubble
  const messageClasses = [
    'max-w-md',
    'break-words', // Ensures long words break to the next line
    'px-4',
    'py-2',
    // Using rounded-lg for a softer, more appropriate border-radius for text blocks
    'rounded-lg',
    // Conditional styling based on who sent the message
    fromUser ? 'bg-blue-500' : 'bg-gray-200',
    fromUser ? 'text-white' : 'text-gray-800',
    fromUser ? 'ml-auto' : 'mr-auto', // Align messages right for user, left for bot
    'my-2' // Margin top/bottom for spacing between messages
  ].join(' ');

  // Define alignment for the message bubble itself
  const messageAlignmentClasses = fromUser ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex ${messageAlignmentClasses}`}>
      <div className={messageClasses}>
        {/* Use ReactMarkdown to render the message content */}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]} // Apply the GFM plugin for extended Markdown support (tables, task lists, strikethrough)
          // Define custom components to apply Tailwind CSS styles to rendered HTML elements
          components={{
            // Styling for paragraphs (default block element)
            p: ({ node, ...props }) => <p className="mb-1 last:mb-0" {...props} />, // Adds margin below paragraphs, except the last one
            // Styling for strong (bold) text
            strong: ({ node, ...props }) => <strong className="font-extrabold" {...props} />,
            // Styling for emphasis (italic) text
            em: ({ node, ...props }) => <em className="italic" {...props} />,
            // Styling for headings (h1-h6) - example for h2, you can extend for others
            h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-3 mb-2" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-2 mb-1" {...props} />,
            // Styling for unordered lists
            ul: ({ node, ...props }) => <ul className="list-disc list-inside ml-4 mb-2" {...props} />,
            // Styling for ordered lists
            ol: ({ node, ...props }) => <ol className="list-decimal list-inside ml-4 mb-2" {...props} />,
            // Styling for list items
            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
            // Styling for links
            a: ({ node, ...props }) => <a className="text-blue-700 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer" {...props} />,
            // Styling for blockquotes
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-gray-400 pl-4 italic text-gray-700 my-2" {...props} />
            ),
            // Styling for code blocks (e.g., ```javascript code here ```)
            code: ({ node, inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                // Block code (triple backticks)
                <pre className="overflow-auto bg-gray-800 text-white p-3 rounded-md my-2 text-sm">
                  <code className={`language-${match[1]}`} {...props}>
                    {String(children).replace(/\n$/, '')} {/* Remove trailing newline from children */}
                  </code>
                </pre>
              ) : (
                // Inline code (single backticks)
                <code className="bg-gray-300 text-gray-900 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              );
            },
            // Add more custom components for other HTML tags (e.g., table, img) as needed
          }}
        >
          {message}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default Message;