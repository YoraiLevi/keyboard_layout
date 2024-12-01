import { KeyboardLayoutProps } from '../../types/Keyboard';
import { KeyboardRow } from './KeyboardRow';
import { Application } from '../../types/Application';

interface ExtendedKeyboardLayoutProps extends KeyboardLayoutProps {
  activeKeys?: Set<string>;
  highlightedKeys?: Set<string>;
  apps: Application[];
  onKeySelect?: (key: string) => void;
  selectedKey?: string | null;
}

export const KeyboardLayout: React.FC<ExtendedKeyboardLayoutProps> = ({
  layout,
  className,
  activeKeys = new Set(),
  highlightedKeys = new Set(),
  apps,
  onKeySelect,
  selectedKey
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <div className={`flex flex-col gap-2 p-4 min-w-fit mx-auto ${className}`}>
        {layout.map((row, index) => (
          <KeyboardRow 
            key={index} 
            {...row} 
            activeKeys={activeKeys}
            highlightedKeys={highlightedKeys}
            apps={apps}
            onKeySelect={onKeySelect}
            selectedKey={selectedKey}
          />
        ))}
      </div>
    </div>
  );
}; 