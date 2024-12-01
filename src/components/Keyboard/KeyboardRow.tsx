import React from 'react';
import { KeyboardRowProps } from '../../types/Keyboard';
import { Key } from './Key';
import { Application } from '../../types/Application';

interface ExtendedKeyboardRowProps extends KeyboardRowProps {
  activeKeys?: Set<string>;
  highlightedKeys?: Set<string>;
  apps: Application[];
  onKeySelect?: (key: string) => void;
  selectedKey?: string | null;
}

export const KeyboardRow: React.FC<ExtendedKeyboardRowProps> = ({ 
  keys, 
  className,
  activeKeys = new Set(),
  highlightedKeys = new Set(),
  apps,
  onKeySelect,
  selectedKey
}) => {
  return (
    <div className={`flex flex-row gap-1 flex-wrap justify-center ${className}`}>
      {keys.map((key, index) => (
        <Key 
          key={index} 
          {...key} 
          isActive={activeKeys.has(key.label)}
          isHighlighted={highlightedKeys.has(key.label)}
          apps={apps}
          onSelect={onKeySelect}
          isSelected={selectedKey === key.label}
        />
      ))}
    </div>
  );
};
