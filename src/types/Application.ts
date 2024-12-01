import { Shortcut } from './Keyboard';

export interface Application {
  processName: string;
  name: string;
  shortcuts: ShortcutMapping[];
}

export interface ShortcutMapping {
  id: string;
  shortcut: Shortcut | null;  // null when unbound
  friendlyName: string;
  extraData?: string;
} 