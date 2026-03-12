/**
 * Feature Flag Test Component
 * Simple component to test the feature flag system
 * Remove this file after testing
 */

'use client';

import { useFeatureFlags, useFeatureFlag } from '@/hooks/use-feature-flag';

export function FeatureFlagTest() {
  const { flags, setFlag, resetFlags, exportFlags, importFlags } = useFeatureFlags();
  const bypassDedupeCheck = useFeatureFlag('bypassDedupeCheck');
  const enableDebugLogs = useFeatureFlag('enableDebugLogs');

  const handleExport = () => {
    const config = exportFlags();
    alert('Configuration copied to console');
  };

  const handleImport = () => {
    const testConfig = JSON.stringify({
      version: 1,
      flags: {
        enableDebugLogs: true,
        enableOfferMockData: false,
        showPreAuthFlow: true,
        bypassDedupeCheck: true,
      },
      updatedAt: new Date().toISOString(),
    });

    const success = importFlags(testConfig);
    alert(success ? 'Import successful!' : 'Import failed!');
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Feature Flag Test</h1>

      <div className="space-y-6">
        {/* Current Flags */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Current Flags</h2>
          <div className="space-y-2">
            {Object.entries(flags).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="font-mono text-sm">{key}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {value ? 'ON' : 'OFF'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Individual Flag Tests */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Individual Flag Tests</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <code className="flex-1">useFeatureFlag('bypassDedupeCheck')</code>
              <span
                className={`px-3 py-1 rounded text-sm font-medium ${
                  bypassDedupeCheck ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                }`}
              >
                {bypassDedupeCheck ? 'TRUE' : 'FALSE'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <code className="flex-1">useFeatureFlag('enableDebugLogs')</code>
              <span
                className={`px-3 py-1 rounded text-sm font-medium ${
                  enableDebugLogs ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                }`}
              >
                {enableDebugLogs ? 'TRUE' : 'FALSE'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => setFlag('bypassDedupeCheck', !flags.bypassDedupeCheck)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Toggle bypassDedupeCheck
            </button>
            <button
              onClick={() => setFlag('enableDebugLogs', !flags.enableDebugLogs)}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Toggle enableDebugLogs
            </button>
            <button
              onClick={handleExport}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Export Configuration
            </button>
            <button
              onClick={handleImport}
              className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Import Test Configuration
            </button>
            <button
              onClick={() => {
                if (confirm('Reset all flags to defaults?')) {
                  resetFlags();
                }
              }}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reset All Flags
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h2 className="text-xl font-semibold mb-3 text-blue-900">Test Instructions</h2>
          <ol className="space-y-2 text-sm text-blue-800">
            <li>1. Press <kbd className="px-2 py-1 bg-white rounded border">Ctrl+Shift+F</kbd> to open the feature flag panel</li>
            <li>2. Toggle flags using the panel or the buttons above</li>
            <li>3. Observe the changes in the "Current Flags" section</li>
            <li>4. Test export/import functionality</li>
            <li>5. Open the panel in another tab and verify cross-tab sync</li>
            <li>6. Refresh the page and verify persistence</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
