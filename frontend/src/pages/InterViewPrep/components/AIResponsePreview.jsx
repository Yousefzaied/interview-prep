import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AIResponsePreview = ({ content }) => {
  if (!content) {
    return (
      <p className="text-gray-400 italic">No response available.</p>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mt-3">
      <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, children, ...props }) {
              return !inline ? (
                <pre className="bg-gray-900 text-gray-100 rounded-lg p-3 overflow-auto my-2">
                  <code {...props}>{children}</code>
                </pre>
              ) : (
                <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded">
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default AIResponsePreview;
