import React, { useEffect, useState } from 'react';
import { ModifierKey, Shortcut } from '../../types/Keyboard';

interface KeyboardListenerProps {
  onKeyChange?: (activeKeys: Set<string>) => void;
  onShortcutCapture?: (shortcut: Shortcut) => void;
  isRecording?: boolean;
}

export const KeyboardListener: React.FC<KeyboardListenerProps> = ({
  onKeyChange,
  onShortcutCapture,
  isRecording = false,
}) => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  const MODIFIER_KEYS = new Set<ModifierKey>(['Ctrl', 'Alt', 'Shift', 'Win']);

  const KEY_DISPLAY_NAMES: { [key: string]: string } = {
    'ShiftLeft': 'Shift',
    'ShiftRight': 'Shift',
    'ControlLeft': 'Ctrl',
    'ControlRight': 'Ctrl',
    'AltLeft': 'Alt',
    'AltRight': 'Alt',
    'MetaLeft': 'Win',
    'MetaRight': 'Win',
  };

  const getDisplayKey = (code: string, key: string): string => {
    // Handle modifier keys
    if (code in KEY_DISPLAY_NAMES) {
      return KEY_DISPLAY_NAMES[code];
    }

    // Handle letter keys
    if (code.startsWith('Key')) {
      return code.slice(3).toUpperCase();
    }

    // Handle number keys
    if (code.startsWith('Digit')) {
      return code.slice(5);
    }

    // Handle other keys
    return key.length === 1 ? key.toUpperCase() : key;
  };

  const shouldIgnoreEvent = (target: EventTarget | null) => {
    if (!target || !(target instanceof Element)) return false;
    
    // Ignore events from ShortcutInput elements and their children
    const isShortcutInput = target.closest('.shortcut-input');
    if (isShortcutInput) {
      // If it's a button or select, we want to ignore it
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'SELECT' || 
        target.tagName === 'INPUT' ||
        target.tagName === 'OPTION'
      ) {
        return true;
      }
    }

    // Still ignore regular input/textarea
    return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
  };

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (shouldIgnoreEvent(e.target)) {
        return;
      }
      
      e.preventDefault();
      const displayKey = getDisplayKey(e.code, e.key);
      
      const newActiveKeys = new Set(activeKeys);
      newActiveKeys.add(displayKey);
      setActiveKeys(newActiveKeys);
      onKeyChange?.(newActiveKeys);
    };

    const handleKeyUp = (e: globalThis.KeyboardEvent) => {
      if (shouldIgnoreEvent(e.target)) {
        return;
      }

      e.preventDefault();
      const displayKey = getDisplayKey(e.code, e.key);

      // Only capture non-modifier keys for shortcuts
      if (isRecording && !MODIFIER_KEYS.has(displayKey as ModifierKey)) {
        const modifiers = new Set(
          Array.from(activeKeys).filter((key): key is ModifierKey => 
            MODIFIER_KEYS.has(key as ModifierKey)
          )
        );
        onShortcutCapture?.({ modifiers, key: displayKey });
      }

      const newActiveKeys = new Set(activeKeys);
      newActiveKeys.delete(displayKey);
      setActiveKeys(newActiveKeys);
      onKeyChange?.(newActiveKeys);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeKeys, onKeyChange, onShortcutCapture, isRecording]);

  return null;
};
