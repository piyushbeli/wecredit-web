/**
 * Feature Flag Panel Component
 * Dev panel UI for managing feature flags
 */

'use client';

import { useState, useEffect } from 'react';
import { useDevPanel, useFeatureFlags } from '@/hooks/use-feature-flag';
import { FEATURE_FLAG_METADATA, FLAG_CATEGORIES, type FlagCategory, type FeatureFlagName } from '@/lib/constants/feature-flags';

/**
 * Feature flag panel with all controls
 */
export function FeatureFlagPanel() {
  const { isPanelOpen, togglePanel, isDevMode } = useDevPanel();
  const { flags, setFlag, resetFlags, exportFlags, importFlags } = useFeatureFlags();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FlagCategory | 'all'>('all');
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+F or Cmd+Shift+F to toggle panel
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        togglePanel();
      }
      
      // Ctrl+Shift+R or Cmd+Shift+R to reset flags
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        if (confirm('Reset all feature flags to defaults?')) {
          resetFlags();
        }
      }

      // Escape to close panel
      if (e.key === 'Escape' && isPanelOpen) {
        togglePanel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPanelOpen, togglePanel, resetFlags]);

  // Handle export
  const handleExport = () => {
    const json = exportFlags();
    navigator.clipboard.writeText(json);
    setShowExport(true);
    setTimeout(() => setShowExport(false), 2000);
  };

  // Handle import
  const handleImport = () => {
    setImportError('');
    const success = importFlags(importText);
    if (success) {
      setShowImport(false);
      setImportText('');
    } else {
      setImportError('Invalid JSON or version mismatch');
    }
  };

  // Filter flags
  const filteredFlags = Object.keys(FEATURE_FLAG_METADATA)
    .filter((key) => {
      const metadata = FEATURE_FLAG_METADATA[key as FeatureFlagName];
      
      // Category filter
      if (selectedCategory !== 'all' && metadata.category !== selectedCategory) {
        return false;
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          metadata.label.toLowerCase().includes(query) ||
          metadata.description.toLowerCase().includes(query)
        );
      }
      
      return true;
    });

  // Group flags by category
  const groupedFlags = filteredFlags.reduce((acc, key) => {
    const metadata = FEATURE_FLAG_METADATA[key as FeatureFlagName];
    if (!acc[metadata.category]) {
      acc[metadata.category] = [];
    }
    acc[metadata.category].push(key as FeatureFlagName);
    return acc;
  }, {} as Record<FlagCategory, FeatureFlagName[]>);

  // Don't render in production
  if (!isDevMode) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      {isPanelOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9998"
          onClick={togglePanel}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-gray-900 text-white shadow-2xl z-9999 transform transition-transform duration-300 overflow-hidden flex flex-col ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-linear-to-r from-purple-600 to-blue-600 p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              🚩 Feature Flags
            </h2>
            <button
              onClick={togglePanel}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-purple-100">
            Toggle features for development & testing
          </p>
        </div>

        {/* Search and filters */}
        <div className="p-4 bg-gray-800 border-b border-gray-700">
          <input
            type="text"
            placeholder="Search flags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
          />
          
          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {Object.entries(FLAG_CATEGORIES).map(([category, { label, icon }]) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as FlagCategory)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>

        {/* Flags list */}
        <div className="flex-1 overflow-y-auto p-4">
          {Object.entries(groupedFlags).map(([category, flagNames]) => (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                {FLAG_CATEGORIES[category as FlagCategory].icon}
                {FLAG_CATEGORIES[category as FlagCategory].label}
              </h3>
              <div className="space-y-3">
                {flagNames.map((flagName) => {
                  const metadata = FEATURE_FLAG_METADATA[flagName];
                  const isEnabled = flags[flagName];
                  
                  return (
                    <div
                      key={flagName}
                      className="bg-gray-800 rounded-lg p-3 hover:bg-gray-750 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">{metadata.label}</h4>
                          <p className="text-xs text-gray-400">{metadata.description}</p>
                        </div>
                        <button
                          onClick={() => setFlag(flagName, !isEnabled)}
                          className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${
                            isEnabled ? 'bg-green-500' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                              isEnabled ? 'translate-x-6' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredFlags.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No flags found</p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-gray-800 border-t border-gray-700 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                if (confirm('Reset all feature flags to defaults?')) {
                  resetFlags();
                }
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
            >
              🔄 Reset All
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors relative"
            >
              {showExport ? '✅ Copied!' : '📤 Export'}
            </button>
          </div>
          <button
            onClick={() => setShowImport(true)}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
          >
            📥 Import
          </button>
          
          {/* Keyboard shortcuts hint */}
          <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-700">
            <p>⌨️ Ctrl+Shift+F: Toggle Panel</p>
            <p>⌨️ Ctrl+Shift+R: Reset All</p>
          </div>
        </div>
      </div>

      {/* Import modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10000 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl p-6 max-w-lg w-full">
            <h3 className="text-lg font-bold mb-4">Import Feature Flags</h3>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste exported JSON here..."
              className="w-full h-48 px-3 py-2 bg-gray-800 rounded-lg text-base font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
            />
            {importError && (
              <p className="text-red-400 text-sm mb-4">{importError}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowImport(false);
                  setImportText('');
                  setImportError('');
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
