// src/components/Message.jsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Message({ message, fromUser, darkMode }) {
  const messageClasses = [
    "max-w-md",
    "break-words",
    "px-4",
    "py-2",
    "rounded-lg",
    fromUser
      ? "bg-gray-300 text-gray-900 ml-auto"
      : darkMode
      ? "bg-transparent text-gray-100 mr-auto"
      : "bg-transparent text-gray-900 mr-auto",
    "my-2",
  ].join(" ");

  const messageAlignmentClasses = fromUser ? "justify-end" : "justify-start";

  return (
    <div className={`flex ${messageAlignmentClasses}`}>
      <div className={messageClasses}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, ...props }) => (
              <p className="mb-1 last:mb-0" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong className="font-extrabold" {...props} />
            ),
            em: ({ node, ...props }) => <em className="italic" {...props} />,

            h1: ({ node, ...props }) => (
              <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-xl font-bold mt-3 mb-2" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-lg font-bold mt-2 mb-1" {...props} />
            ),

            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside ml-4 mb-2" {...props} />
            ),

            ol: ({ node, ...props }) => (
              <ol className="list-decimal list-inside ml-4 mb-2" {...props} />
            ),

            li: ({ node, ...props }) => <li className="mb-1" {...props} />,

            a: ({ node, ...props }) => (
              <a
                className="text-blue-700 underline hover:text-blue-800"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-gray-400 pl-4 italic text-gray-700 my-2"
                {...props}
              />
            ),

            code: ({ node, inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <pre className="overflow-auto bg-gray-800 text-white p-3 rounded-md my-2 text-sm">
                  <code className={`language-${match[1]}`} {...props}>
                    {String(children).replace(/\n$/, "")}
                  </code>
                </pre>
              ) : (
                <code
                  className="bg-gray-300 text-gray-900 px-1 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            },
          }}
        >
          {message}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default Message;
