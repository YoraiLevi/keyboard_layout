import { KeyProps, KeyboardRowProps } from '../../types/Keyboard';

const standardKey = (label: string, secondaryLabel?: string): KeyProps => ({
  label,
  secondaryLabel,
  type: 'standard',
  width: 1,
  height: 1,
});

const modifierKey = (label: string): KeyProps => ({
  label,
  type: 'modifier',
  width: 1.5,
  height: 1,
});

const functionKey = (label: string): KeyProps => ({
  label,
  type: 'function',
  width: 1,
  height: 1,
});

export const ISO105Layout: KeyboardRowProps[] = [
  {
    keys: [
      standardKey('Esc'),
      { label: '', width: 1 }, // Spacer
      functionKey('F1'),
      functionKey('F2'),
      functionKey('F3'),
      functionKey('F4'),
      { label: '', width: 0.5 }, // Spacer
      functionKey('F5'),
      functionKey('F6'),
      functionKey('F7'),
      functionKey('F8'),
      { label: '', width: 0.5 }, // Spacer
      functionKey('F9'),
      functionKey('F10'),
      functionKey('F11'),
      functionKey('F12'),
    ],
  },
  {
    keys: [
      standardKey('`', '~'),
      standardKey('1', '!'),
      standardKey('2', '@'),
      standardKey('3', '#'),
      standardKey('4', '$'),
      standardKey('5', '%'),
      standardKey('6', '^'),
      standardKey('7', '&'),
      standardKey('8', '*'),
      standardKey('9', '('),
      standardKey('0', ')'),
      standardKey('-', '_'),
      standardKey('=', '+'),
      modifierKey('Backspace'),
    ],
  },
  {
    keys: [
      modifierKey('Tab'),
      standardKey('Q'),
      standardKey('W'),
      standardKey('E'),
      standardKey('R'),
      standardKey('T'),
      standardKey('Y'),
      standardKey('U'),
      standardKey('I'),
      standardKey('O'),
      standardKey('P'),
      standardKey('[', '{'),
      standardKey(']', '}'),
      standardKey('\\', '|'),
    ],
  },
  {
    keys: [
      modifierKey('Caps Lock'),
      standardKey('A'),
      standardKey('S'),
      standardKey('D'),
      standardKey('F'),
      standardKey('G'),
      standardKey('H'),
      standardKey('J'),
      standardKey('K'),
      standardKey('L'),
      standardKey(';', ':'),
      standardKey("'", '"'),
      modifierKey('Enter'),
    ],
  },
  {
    keys: [
      modifierKey('Shift'),
      standardKey('Z'),
      standardKey('X'),
      standardKey('C'),
      standardKey('V'),
      standardKey('B'),
      standardKey('N'),
      standardKey('M'),
      standardKey(',', '<'),
      standardKey('.', '>'),
      standardKey('/', '?'),
      modifierKey('Shift'),
    ],
  },
  {
    keys: [
      modifierKey('Ctrl'),
      modifierKey('Win'),
      modifierKey('Alt'),
      { label: 'Space', width: 6.25, type: 'standard' },
      modifierKey('Alt'),
      modifierKey('Win'),
      modifierKey('Menu'),
      modifierKey('Ctrl'),
    ],
  },
];

export const availableLayouts = {
  ISO105: ISO105Layout,
}; 