'use client';

import { useState } from 'react';

/** Props for DebugData component */
interface DebugDataProps {
  data: unknown;
  title?: string;
  defaultOpen?: boolean;
}

/**
 * Debug component to visualize API data
 * Only renders in development mode
 */
const DebugData = ({ data, title = 'API Response', defaultOpen = false }: DebugDataProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isCopied, setIsCopied] = useState(false);
  // Only show in development
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'production') {
    return null;
  }
  const jsonString = JSON.stringify(data, null, 2);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-lg">
      <div className="bg-gray-900 rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-750 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-mono text-gray-200">{title}</span>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {/* Content */}
        {isOpen && (
          <div className="relative">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 px-3 py-1 text-xs font-medium bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
            >
              {isCopied ? '✓ Copied' : 'Copy'}
            </button>
            {/* JSON Display */}
            <pre className="p-4 pt-10 max-h-96 overflow-auto text-xs font-mono text-gray-300 bg-gray-900">
              <code>
                <JsonHighlight json={jsonString} />
              </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

/** Props for JsonHighlight */
interface JsonHighlightProps {
  json: string;
}

/**
 * Syntax highlights JSON string
 */
const JsonHighlight = ({ json }: JsonHighlightProps) => {
  const highlighted = json
    .replace(/"([^"]+)":/g, '<span class="text-purple-400">"$1"</span>:')
    .replace(/: "([^"]*)"(,?)/g, ': <span class="text-green-400">"$1"</span>$2')
    .replace(/: (\d+)(,?)/g, ': <span class="text-yellow-400">$1</span>$2')
    .replace(/: (true|false)(,?)/g, ': <span class="text-blue-400">$1</span>$2')
    .replace(/: (null)(,?)/g, ': <span class="text-gray-500">$1</span>$2');
  return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
};

export default DebugData;

