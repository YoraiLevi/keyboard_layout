import { useState } from 'react';
import { Application, ShortcutMapping } from '../types/Application';
import { Shortcut } from '../types/Keyboard';

interface ShortcutManager {
  apps: Application[];
  isRecording: boolean;
  recordedShortcut: Shortcut | null;
  editingState: EditingState | null;
  canSaveShortcut: boolean;
  // Actions
  startEditing: (shortcutId: string, processName: string) => void;
  startNewShortcut: (processName: string) => void;
  cancelEditing: () => void;
  saveShortcut: () => void;
  unbindShortcut: (shortcutId: string, processName: string) => void;
  deleteShortcut: (shortcutId: string, processName: string) => void;
  // Form updates
  updateShortcutName: (name: string) => void;
  updateShortcutExtraData: (data: string) => void;
  updateShortcutKeys: (shortcut: Shortcut) => void;
  // Apps management
  setApps: (apps: Application[] | ((prev: Application[]) => Application[])) => void;
}

interface EditingState {
  appId: string;
  shortcutId: string;
  friendlyName: string;
  extraData: string;
  shortcut: Shortcut | null;
}

export function useShortcutManager(
  initialApps: Application[],
  selectedAppId: string | null
): ShortcutManager {
 console.log(selectedAppId)
  const [apps, setApps] = useState<Application[]>(initialApps);
  const [editingState, setEditingState] = useState<EditingState | null>(null);

  const isRecording = editingState !== null;
  const canSaveShortcut = Boolean(
    editingState?.friendlyName.trim().length && 
    editingState?.shortcut !== null
  );

  // Helper to find a shortcut
  const findShortcut = (processName: string, shortcutId: string) => {
    const app = apps.find(a => a.processName === processName);
    return app?.shortcuts.find(s => s.id === shortcutId);
  };

  // Start editing existing shortcut
  const startEditing = (shortcutId: string, processName: string) => {
    const shortcut = findShortcut(processName, shortcutId);
    if (shortcut) {
      setEditingState({
        appId: processName,
        shortcutId,
        friendlyName: shortcut.friendlyName,
        extraData: shortcut.extraData || '',
        shortcut: shortcut.shortcut
      });
    }
  };

  // Start creating new shortcut
  const startNewShortcut = (processName: string) => {
    setEditingState({
      appId: processName,
      shortcutId: Date.now().toString(),
      friendlyName: '',
      extraData: '',
      shortcut: null
    });
  };

  const cancelEditing = () => {
    setEditingState(null);
  };

  // Form update handlers
  const updateShortcutName = (name: string) => {
    if (editingState) {
      setEditingState({ ...editingState, friendlyName: name });
    }
  };

  const updateShortcutExtraData = (data: string) => {
    if (editingState) {
      setEditingState({ ...editingState, extraData: data });
    }
  };

  const updateShortcutKeys = (shortcut: Shortcut) => {
    if (editingState) {
      setEditingState({ ...editingState, shortcut });
    }
  };

  // Save changes
  const saveShortcut = () => {
    if (!editingState || !canSaveShortcut) return;

    if (editingState.extraData.trim() && !isValidJson(editingState.extraData)) {
      alert('Invalid JSON in extra data');
      return;
    }

    setApps(currentApps => 
      currentApps.map(app => {
        if (app.processName === editingState.appId) {
          const existingShortcut = app.shortcuts.find(s => s.id === editingState.shortcutId);
          if (existingShortcut) {
            // Edit existing
            return {
              ...app,
              shortcuts: app.shortcuts.map(s => 
                s.id === editingState.shortcutId ? {
                  ...s,
                  shortcut: editingState.shortcut,
                  friendlyName: editingState.friendlyName,
                  extraData: editingState.extraData.trim() || undefined
                } : s
              )
            };
          } else {
            // Create new
            const newShortcut: ShortcutMapping = {
              id: editingState.shortcutId,
              shortcut: editingState.shortcut,
              friendlyName: editingState.friendlyName,
              extraData: editingState.extraData.trim() || undefined,
            };
            return {
              ...app,
              shortcuts: [...app.shortcuts, newShortcut]
            };
          }
        }
        return app;
      })
    );

    cancelEditing();
  };

  // Delete/Unbind operations
  const unbindShortcut = (shortcutId: string, processName: string) => {
    setApps(currentApps => 
      currentApps.map(app => 
        app.processName === processName ? {
          ...app,
          shortcuts: app.shortcuts.map(s => 
            s.id === shortcutId ? { ...s, shortcut: null } : s
          )
        } : app
      )
    );
  };

  const deleteShortcut = (shortcutId: string, processName: string) => {
    setApps(currentApps => 
      currentApps.map(app => 
        app.processName === processName ? {
          ...app,
          shortcuts: app.shortcuts.filter(s => s.id !== shortcutId)
        } : app
      )
    );
  };

  // Add isValidJson helper back
  const isValidJson = (str: string) => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  return {
    apps,
    isRecording,
    editingState,
    recordedShortcut: editingState?.shortcut ?? null,
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
  };
} 