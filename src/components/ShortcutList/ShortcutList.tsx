import React from 'react';
import { ShortcutMapping } from '../../types/Application';
import { shortcutToString } from '../../types/Keyboard';
import { PencilIcon, XMarkIcon, NoSymbolIcon } from '@heroicons/react/24/outline';

interface ShortcutListProps {
  shortcuts: ShortcutMapping[];
  onEditShortcut: (id: string) => void;
  onDeleteShortcut: (id: string) => void;
  onUnbindShortcut: (id: string) => void;
}

const ActionButton: React.FC<{
  onClick: () => void;
  className: string;
  title: string;
  children: React.ReactNode;
}> = ({ onClick, className, title, children }) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-2 rounded-md hover:opacity-80 transition-opacity ${className}`}
  >
    <span className="sr-only">{title}</span>
    {children}
  </button>
);

export const ShortcutList: React.FC<ShortcutListProps> = ({
  shortcuts,
  onEditShortcut,
  onDeleteShortcut,
  onUnbindShortcut,
}) => {
  return (
    <div className="mt-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Shortcut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Extra Data
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {shortcuts.map((shortcut) => (
            <tr key={shortcut.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {shortcut.friendlyName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                {shortcut.shortcut ? shortcutToString(shortcut.shortcut) : 
                  <span className="text-gray-400 italic">No shortcut</span>}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {shortcut.extraData}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <div className="flex justify-end gap-2">
                  <ActionButton
                    onClick={() => onEditShortcut(shortcut.id)}
                    className="bg-green-100 text-green-700"
                    title="Edit shortcut"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </ActionButton>
                  <ActionButton
                    onClick={() => onUnbindShortcut(shortcut.id)}
                    className="bg-yellow-100 text-yellow-700"
                    title="Unbind shortcut"
                  >
                    <NoSymbolIcon className="h-4 w-4" />
                  </ActionButton>
                  <ActionButton
                    onClick={() => onDeleteShortcut(shortcut.id)}
                    className="bg-red-100 text-red-700"
                    title="Delete shortcut"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </ActionButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 