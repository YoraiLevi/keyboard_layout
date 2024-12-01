import { Application } from '../types/Application';

export interface ExportData {
  apps: Application[];
  version: '1.0';
}

export const exportAllData = (apps: Application[]): string => {
  const data: ExportData = {
    apps,
    version: '1.0'
  };
  return JSON.stringify(data, null, 2);
};

export const exportApps = (apps: Application[], processNames: string[]): string => {
  const selectedApps = apps.filter(app => processNames.includes(app.processName));
  return exportAllData(selectedApps);
};

export const importData = (jsonString: string): Application[] => {
  try {
    const data: ExportData = JSON.parse(jsonString);
    if (data.version !== '1.0') {
      throw new Error('Unsupported version');
    }
    return data.apps;
  } catch (error) {
    throw new Error('Invalid import data');
  }
};

export const downloadJson = (data: string, filename: string) => {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}; 