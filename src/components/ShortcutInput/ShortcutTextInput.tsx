import React, { useState, useEffect } from 'react';
import { Shortcut, ModifierKey } from '../../types/Keyboard';

interface ShortcutTextInputProps {
  value: Shortcut | null;
  onChange: (shortcut: Shortcut) => void;
}

export const ShortcutTextInput: React.FC<ShortcutTextInputProps> = ({ value, onChange }) => {
  useEffect(() => {
    setText(value ? `${Array.from(value.modifiers).join('+')}+${value.key}` : '');
  }, [value]);

  const [text, setText] = useState(
    value ? `${Array.from(value.modifiers).join('+')}+${value.key}` : ''
  );

  const parseShortcut = (input: string): Shortcut | null => {
    const parts = input.split('+').map(p => p.trim());
    if (parts.length < 2) return null;

    const key = parts.pop()!;
    const modifiers = new Set(parts as ModifierKey[]);

    return { modifiers, key };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);
    
    const shortcut = parseShortcut(newText);
    if (shortcut) {
      onChange(shortcut);
    }
  };

  return (
    <div className="space-y-2 shortcut-input">
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="e.g., Ctrl+Shift+P"
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />
      <p className="text-sm text-gray-500">
        Format: Modifier+Modifier+Key (e.g., Ctrl+Shift+P)
      </p>
    </div>
  );
}; 