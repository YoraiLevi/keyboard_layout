import { Application } from '../types/Application';
import { Shortcut, ModifierKey } from '../types/Keyboard';

export function findShortcutsForKey(apps: Application[], key: string): Array<{
  id: string;
  appId: string;
  appName: string;
  shortcut: Shortcut;
  friendlyName: string;
}> {
  return apps.flatMap(app => 
    app.shortcuts
      .filter(s => 
        s.shortcut !== null && 
        (s.shortcut.key === key || Array.from(s.shortcut.modifiers).includes(key as ModifierKey))
      )
      .map(s => ({
        id: s.id,
        appId: app.processName,
        appName: app.name,
        shortcut: s.shortcut!,
        friendlyName: s.friendlyName
      }))
  );
} 