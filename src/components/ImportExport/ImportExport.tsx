import React, { useRef, useState } from 'react';
import { Application } from '../../types/Application';
import { exportAllData, exportApps, importData, downloadJson } from '../../utils/importExport';

interface ImportExportProps {
  apps: Application[];
  onImport: (apps: Application[]) => void;
}

export const ImportExport: React.FC<ImportExportProps> = ({ apps, onImport }) => {
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = selectedApps.size > 0 
      ? exportApps(apps, Array.from(selectedApps))
      : exportAllData(apps);
    downloadJson(data, 'shortcuts.json');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedApps = importData(event.target?.result as string);
        onImport(importedApps);
      } catch (error) {
        alert('Failed to import: Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Export
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleImport}
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Select apps to export:</h3>
        {apps.map(app => (
          <label key={app.processName} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedApps.has(app.processName)}
              onChange={(e) => {
                const newSelected = new Set(selectedApps);
                if (e.target.checked) {
                  newSelected.add(app.processName);
                } else {
                  newSelected.delete(app.processName);
                }
                setSelectedApps(newSelected);
              }}
            />
            {app.name}
          </label>
        ))}
      </div>
    </div>
  );
}; 