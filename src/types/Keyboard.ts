export interface KeyProps {
  label: string;
  width?: number;  // Width multiplier (1 = standard key width)
  height?: number; // Height multiplier (1 = standard key height)
  type?: 'standard' | 'function' | 'modifier' | 'special';
  secondaryLabel?: string;
  className?: string;
  isActive?: boolean;
  isHighlighted?: boolean;
}

export interface KeyboardRowProps {
  keys: KeyProps[];
  className?: string;
}

export interface KeyboardLayoutProps {
  layout: KeyboardRowProps[];
  className?: string;
}

export type ModifierKey = 'Ctrl' | 'Alt' | 'Shift' | 'Win';

export interface Shortcut {
  modifiers: Set<ModifierKey>;
  key: string;  // The non-modifier key
}

export function shortcutToString(shortcut: Shortcut): string {
  const modifiers = Array.from(shortcut.modifiers).sort();
  return [...modifiers, shortcut.key].join(' + ');
}

export function stringToShortcut(str: string): Shortcut {
  const parts = str.split(' + ');
  const key = parts[parts.length - 1];
  const modifiers = new Set(
    parts.slice(0, -1).filter((mod): mod is ModifierKey => 
      ['Ctrl', 'Alt', 'Shift', 'Win'].includes(mod)
    )
  );
  return { modifiers, key };
}

export interface KeyboardEvent {
  key: string;
  code: string;
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
} 