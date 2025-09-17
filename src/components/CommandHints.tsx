import { commands } from '@/data/commands';
import { motion } from 'framer-motion';
import React from 'react';

interface CommandHintsProps {
  inputValue: string;
  onSelect: (template: string) => void;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
}

const CommandHints: React.FC<CommandHintsProps> = ({
  inputValue,
  onSelect,
  highlightedIndex,
  setHighlightedIndex,
}) => {
  const filteredCommands = React.useMemo(() => {
    const query = inputValue.substring(1).toLowerCase();
    if (!query) return commands;
    return commands.filter((cmd) => cmd.name.toLowerCase().includes(query));
  }, [inputValue]);

  const listRef = React.useRef<HTMLUListElement>(null);

  React.useEffect(() => {
    if (listRef.current && highlightedIndex >= 0) {
      const highlightedItem = listRef.current.children[highlightedIndex] as HTMLLIElement;
      if (highlightedItem) {
        highlightedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  if (filteredCommands.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="absolute bottom-full mb-2 w-full rounded-lg border border-gray-700 bg-gray-800 p-2 shadow-lg"
    >
      <p className="px-2 py-1 text-xs text-gray-400">Commands</p>
      <ul ref={listRef} className="max-h-48 overflow-y-auto custom-scrollbar">
        {filteredCommands.map((cmd, index) => (
          <li
            key={cmd.name}
            onClick={() => onSelect(cmd.template)}
            onMouseEnter={() => setHighlightedIndex(index)}
            className={`flex cursor-pointer items-center justify-between rounded-md p-2 text-sm ${
              index === highlightedIndex ? 'bg-gray-600 text-white' : 'hover:bg-gray-700'
            }`}
          >
            <span>{cmd.name}</span>
            <span className="text-xs text-gray-500">{cmd.description}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default CommandHints;
