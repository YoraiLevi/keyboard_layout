import React, { useState, useEffect } from 'react';
import { Shortcut, ModifierKey } from '../../types/Keyboard';

interface ShortcutInputProps {
  value: Shortcut | null;
  onChange: (shortcut: Shortcut) => void;
}

export const ShortcutInput: React.FC<ShortcutInputProps> = ({ value, onChange }) => {
  const modifierKeys: ModifierKey[] = ['Ctrl', 'Alt', 'Shift', 'Win'];
  const commonKeys = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
    'Tab', 'Enter', 'Space', 'Delete', 'Escape'
  ];

  useEffect(() => {
    setSelectedModifiers(value?.modifiers || new Set());
    setSelectedKey(value?.key || '');
  }, [value]);

  const [selectedModifiers, setSelectedModifiers] = useState<Set<ModifierKey>>(
    value?.modifiers || new Set()
  );
  const [selectedKey, setSelectedKey] = useState<string>(value?.key || '');

  const handleModifierChange = (modifier: ModifierKey) => {
    const newModifiers = new Set(selectedModifiers);
    if (newModifiers.has(modifier)) {
      newModifiers.delete(modifier);
    } else {
      newModifiers.add(modifier);
    }
    setSelectedModifiers(newModifiers);
    onChange({ modifiers: newModifiers, key: selectedKey });
  };

  const handleKeyChange = (key: string) => {
    setSelectedKey(key);
    onChange({ modifiers: selectedModifiers, key });
  };

  return (
    <div className="space-y-4 shortcut-input">
      <div className="flex gap-2">
        {modifierKeys.map(modifier => (
          <label key={modifier} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={selectedModifiers.has(modifier)}
              onChange={() => handleModifierChange(modifier)}
              className="rounded"
            />
            {modifier}
          </label>
        ))}
      </div>

      <select
        value={selectedKey}
        onChange={(e) => handleKeyChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      >
        <option value="">Select a key</option>
        {commonKeys.map(key => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
    </div>
  );
}; 