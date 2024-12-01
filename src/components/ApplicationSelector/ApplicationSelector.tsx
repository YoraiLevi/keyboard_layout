import React from 'react';
import { Application } from '../../types/Application';

interface ApplicationSelectorProps {
  applications: Application[];
  selectedAppId: string | null;
  onSelectApplication: (processName: string | null) => void;
}

export const ApplicationSelector: React.FC<ApplicationSelectorProps> = ({
  applications,
  selectedAppId,
  onSelectApplication,
}) => {
  return (
    <select
      value={selectedAppId || ''}
      onChange={(e) => onSelectApplication(e.target.value || null)}
      className="px-3 py-2 border border-gray-300 rounded-md"
    >
      <option value="">Select an application</option>
      {applications.map((app) => (
        <option key={app.processName} value={app.processName}>
          {app.name}
        </option>
      ))}
    </select>
  );
}; 