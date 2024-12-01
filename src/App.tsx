import { useState } from 'react';
import { KeyboardLayout } from './components/Keyboard/KeyboardLayout';
import { ISO105Layout } from './components/Keyboard/keyboardLayouts';
import { ApplicationSelector } from './components/ApplicationSelector/ApplicationSelector';
import { ShortcutList } from './components/ShortcutList/ShortcutList';
import { KeyboardListener } from './components/Keyboard/KeyboardListener';
import { Application } from './types/Application';
import { Shortcut } from './types/Keyboard';
import { shortcutToString } from './types/Keyboard';
import { findShortcutsForKey } from './utils/shortcutUtils';
import { useShortcutManager } from './hooks/useShortcutManager';
import { PencilIcon, XMarkIcon, NoSymbolIcon } from '@heroicons/react/24/outline';
import { ApplicationManager } from './components/ApplicationManager/ApplicationManager';
import { ImportExport } from './components/ImportExport/ImportExport';
import { ShortcutInput } from './components/ShortcutInput/ShortcutInput';

// Sample data - later we'll move this to a proper data store
const sampleApps: Application[] = [
  {
    processName: 'code.exe',
    name: 'Visual Studio Code',
    shortcuts: [
      {
        id: '1',
        shortcut: {
          modifiers: new Set(['Ctrl', 'Shift']),
          key: 'P'
        },
        friendlyName: 'Command Palette',
      },
      {
        id: '2',
        shortcut: {
          modifiers: new Set(['Ctrl']),
          key: 'B'
        },
        friendlyName: 'Toggle Sidebar',
      },
    ],
  },
  {
    processName: 'chrome.exe',
    name: 'Google Chrome',
    shortcuts: [
      {
        id: '1',
        shortcut: {
          modifiers: new Set(['Ctrl']),
          key: 'T'
        },
        friendlyName: 'New Tab',
      },
      {
        id: '2',
        shortcut: {
          modifiers: new Set(['Ctrl']),
          key: 'W'
        },
        friendlyName: 'Close Tab',
      },
    ],
  },
];

interface SelectedKeyShortcut {
  id: string;
  appId: string;
  appName: string;
  shortcut: Shortcut;
  friendlyName: string;
}

function App() {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const {
    apps,
    isRecording,
    editingState,
    recordedShortcut,
    canSaveShortcut,
    startEditing,
    startNewShortcut,
    cancelEditing,
    saveShortcut,
    unbindShortcut,
    deleteShortcut,
    updateShortcutName,
    updateShortcutExtraData,
    updateShortcutKeys,
    setApps
  } = useShortcutManager(sampleApps, selectedAppId);

  const selectedApp = apps.find((app) => app.processName === selectedAppId);

  const handleKeySelect = (key: string) => {
    setSelectedKey(key === selectedKey ? null : key);
  };

  const selectedKeyShortcuts: SelectedKeyShortcut[] = selectedKey 
    ? findShortcutsForKey(apps, selectedKey).map(s => ({
        id: s.id,
        appId: s.appId,
        appName: s.appName,
        shortcut: s.shortcut,
        friendlyName: s.friendlyName
      }))
    : [];

  const handleAddApp = ({ name, processName }: Pick<Application, 'name' | 'processName'>) => {
    const newApp: Application = {
      processName,
      name,
      shortcuts: []
    };
    setApps([...apps, newApp]);
  };

  const handleDeleteApp = (processName: string) => {
    setApps(apps.filter(app => app.processName !== processName));
  };

  const handleImport = (importedApps: Application[]) => {
    setApps(importedApps);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl flex flex-col gap-4 sm:gap-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Keyboard Shortcuts Manager
        </h1>

        {/* Recording Status */}
        {isRecording && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <p className="text-blue-700">
                    Recording shortcut...
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={saveShortcut}
                    disabled={!canSaveShortcut}
                    className={`px-3 py-1 rounded-md ${
                      canSaveShortcut
                        ? 'bg-green-100 hover:bg-green-200 text-green-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Save Shortcut
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-3 py-1 rounded-md bg-red-100 hover:bg-red-200 text-red-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Enter shortcut name..."
                  value={editingState?.friendlyName ?? ''}
                  onChange={(e) => updateShortcutName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                
                <ShortcutInput
                  value={recordedShortcut}
                  onChange={updateShortcutKeys}
                />
                
                <textarea
                  placeholder="Enter extra data (JSON)..."
                  value={editingState?.extraData ?? ''}
                  onChange={(e) => updateShortcutExtraData(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md h-24 font-mono"
                />
              </div>

              {recordedShortcut && (
                <div className="text-blue-700 font-mono bg-blue-50 p-2 rounded border border-blue-200">
                  Current shortcut: {shortcutToString(recordedShortcut)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Keyboard Layout */}
        <div className="flex gap-4">
          <div className="flex-1 rounded-lg bg-white p-2 sm:p-6 shadow-lg">
            <KeyboardLayout 
              layout={ISO105Layout} 
              activeKeys={activeKeys}
              highlightedKeys={isRecording && recordedShortcut ? 
                new Set([recordedShortcut.key, ...Array.from(recordedShortcut.modifiers)]) : 
                new Set()}
              apps={apps}
              onKeySelect={handleKeySelect}
              selectedKey={selectedKey}
            />
          </div>

          {/* Selected Key Shortcuts */}
          {selectedKey && (
            <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    Shortcuts using "{selectedKey}"
                  </h2>
                  <button
                    onClick={() => setSelectedKey(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close panel</span>
                    ×
                  </button>
                </div>

                {selectedKeyShortcuts.length > 0 ? (
                  <div className="space-y-4">
                    {selectedKeyShortcuts.map((s: SelectedKeyShortcut) => (
                      <div 
                        key={s.id} 
                        className="flex flex-col gap-2 p-4 rounded-md border border-gray-200"
                      >
                        <div className="text-sm text-gray-500">{s.appName}</div>
                        <div className="font-medium">{s.friendlyName}</div>
                        <div className="font-mono text-sm">{shortcutToString(s.shortcut)}</div>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => startEditing(s.id, s.appId)}
                            className="p-2 rounded-md bg-green-100 hover:opacity-80 transition-opacity text-green-700"
                            title="Edit shortcut"
                          >
                            <span className="sr-only">Edit</span>
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => unbindShortcut(s.id, s.appId)}
                            className="p-2 rounded-md bg-yellow-100 hover:opacity-80 transition-opacity text-yellow-700"
                            title="Unbind shortcut"
                          >
                            <span className="sr-only">Unbind</span>
                            <NoSymbolIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteShortcut(s.id, s.appId)}
                            className="p-2 rounded-md bg-red-100 hover:opacity-80 transition-opacity text-red-700"
                            title="Delete shortcut"
                          >
                            <span className="sr-only">Delete</span>
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No shortcuts using this key</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Application List */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="flex justify-between items-center">
            <ApplicationSelector
              applications={apps}
              selectedAppId={selectedAppId}
              onSelectApplication={setSelectedAppId}
            />
            
            {selectedAppId && !isRecording && (
              <button
                onClick={() => startNewShortcut(selectedAppId)}
                className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
              >
                Record New Shortcut
              </button>
            )}
          </div>

          {selectedApp && (
            <ShortcutList
              shortcuts={selectedApp.shortcuts}
              onEditShortcut={(id) => startEditing(id, selectedApp.processName)}
              onDeleteShortcut={(id) => deleteShortcut(id, selectedApp.processName)}
              onUnbindShortcut={(id) => unbindShortcut(id, selectedApp.processName)}
            />
          )}
        </div>

        {/* Keyboard Listener */}
        <KeyboardListener
          isRecording={isRecording}
          onKeyChange={setActiveKeys}
          onShortcutCapture={updateShortcutKeys}
        />

        {/* Add these sections */}
        <div className="flex gap-4">
          <div className="flex-1 rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-medium mb-4">Manage Applications</h2>
            <ApplicationManager
              apps={apps}
              onAddApp={handleAddApp}
              onDeleteApp={handleDeleteApp}
            />
          </div>

          <div className="flex-1 rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-medium mb-4">Import/Export</h2>
            <ImportExport apps={apps} onImport={handleImport} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
