import React, { useState } from 'react';
import { KeyProps } from '../../types/Keyboard';
import clsx from 'clsx';
import { Application } from '../../types/Application';
import { findShortcutsForKey } from '../../utils/shortcutUtils';
import { shortcutToString } from '../../types/Keyboard';

interface ExtendedKeyProps extends KeyProps {
  apps: Application[];
  onSelect?: (key: string) => void;
  isSelected?: boolean;
}

export const Key: React.FC<ExtendedKeyProps> = ({
  label,
  width = 1,
  height = 1,
  type = 'standard',
  secondaryLabel,
  className,
  isActive = false,
  isHighlighted = false,
  apps,
  onSelect,
  isSelected = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const shortcuts = findShortcutsForKey(apps, label);

  return (
    <div className="relative">
      <div
        className={clsx(
          'flex flex-col items-center justify-center rounded-md border border-gray-300 p-1 shadow-sm transition-colors duration-100 cursor-pointer',
          'min-h-[2.5rem] text-center',
          {
            'bg-white': !isActive && !isHighlighted && !isSelected,
            'bg-gray-50': type === 'modifier' && !isActive && !isHighlighted && !isSelected,
            'bg-gray-100': type === 'function' && !isActive && !isHighlighted && !isSelected,
            'bg-blue-50': type === 'special' && !isActive && !isHighlighted && !isSelected,
            'bg-blue-500 text-white border-blue-600': isActive,
            'bg-yellow-50 border-yellow-200': isHighlighted && !isActive,
            'ring-2 ring-blue-500': isSelected,
          },
          className
        )}
        style={{
          width: `${width * 2.5}rem`,
          minWidth: `${width * 2.5}rem`,
          height: `${height * 2.5}rem`,
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => onSelect?.(label)}
      >
        <span 
          className={clsx('text-xs font-medium leading-none', {
            'text-gray-700': !isActive,
            'text-white': isActive,
          })}
        >
          {label}
        </span>
        {secondaryLabel && (
          <span 
            className={clsx('text-xs leading-none mt-1', {
              'text-gray-500': !isActive,
              'text-blue-100': isActive,
            })}
          >
            {secondaryLabel}
          </span>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && shortcuts.length > 0 && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-xs">
          <div className="bg-gray-900 text-white text-xs rounded py-2 px-3 shadow-lg">
            <div className="font-medium mb-1">Shortcuts using this key:</div>
            <div className="space-y-1">
              {shortcuts.map((s, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-gray-300">{s.appName}</span>
                  <span className="font-mono">{shortcutToString(s.shortcut)} - {s.friendlyName}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-8 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
}; 