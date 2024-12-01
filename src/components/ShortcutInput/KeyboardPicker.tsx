import React, { useState, useEffect } from 'react';
import { Shortcut, ModifierKey } from '../../types/Keyboard';
import { KeyboardLayout } from '../Keyboard/KeyboardLayout';
import { ISO105Layout } from '../Keyboard/keyboardLayouts';

interface KeyboardPickerProps {
  value: Shortcut | null;
  onChange: (shortcut: Shortcut) => void;
}

export const KeyboardPicker: React.FC<KeyboardPickerProps> = ({ value, onChange }) => {
  useEffect(() => {
    setSelectedModifiers(value?.modifiers || new Set());
  }, [value]);

  const [selectedModifiers, setSelectedModifiers] = useState<Set<ModifierKey>>(
    value?.modifiers || new Set()
  );

  const handleModifierClick = (modifier: ModifierKey) => {
    const newModifiers = new Set(selectedModifiers);
    if (newModifiers.has(modifier)) {
      newModifiers.delete(modifier);
    } else {
      newModifiers.add(modifier);
    }
    setSelectedModifiers(newModifiers);
    if (value?.key) {
      onChange({ modifiers: newModifiers, key: value.key });
    }
  };

  const handleKeySelect = (key: string) => {
    onChange({ modifiers: selectedModifiers, key });
  };

  return (
    <div className="space-y-4 shortcut-input">
      <div className="flex gap-2">
        {['Ctrl', 'Alt', 'Shift', 'Win'].map(modifier => (
          <button
            key={modifier}
            onClick={() => handleModifierClick(modifier as ModifierKey)}
            className={`px-3 py-1 rounded ${
              selectedModifiers.has(modifier as ModifierKey)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100'
            }`}
          >
            {modifier}
          </button>
        ))}
      </div>

      <KeyboardLayout
        layout={ISO105Layout}
        onKeySelect={handleKeySelect}
        highlightedKeys={value ? new Set([value.key]) : new Set()}
        apps={[]}
      />
    </div>
  );
}; 