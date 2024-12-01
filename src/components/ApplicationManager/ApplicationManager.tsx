import React, { useState } from 'react';
import { Application } from '../../types/Application';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

interface ApplicationManagerProps {
  apps: Application[];
  onAddApp: (app: Pick<Application, 'name' | 'processName'>) => void;
  onDeleteApp: (appId: string) => void;
}

export const ApplicationManager: React.FC<ApplicationManagerProps> = ({
  apps,
  onAddApp,
  onDeleteApp,
}) => {
  const [newAppName, setNewAppName] = useState('');
  const [newProcessName, setNewProcessName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAppName.trim() && newProcessName.trim()) {
      onAddApp({ 
        name: newAppName.trim(),
        processName: newProcessName.trim().toLowerCase()
      });
      setNewAppName('');
      setNewProcessName('');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          value={newAppName}
          onChange={(e) => setNewAppName(e.target.value)}
          placeholder="Application name (e.g., Visual Studio Code)"
          className="px-3 py-2 border border-gray-300 rounded-md"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={newProcessName}
            onChange={(e) => setNewProcessName(e.target.value)}
            placeholder="Process name (e.g., code.exe)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md font-mono"
          />
          <button
            type="submit"
            disabled={!newAppName.trim() || !newProcessName.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {apps.map(app => (
          <div key={app.processName} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
            <div>
              <div>{app.name}</div>
              <div className="text-sm text-gray-500 font-mono">{app.processName}</div>
            </div>
            <button
              onClick={() => onDeleteApp(app.processName)}
              className="text-red-500 hover:text-red-700"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}; 