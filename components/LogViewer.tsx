import React, { useState } from 'react';
import { LogEntry } from '../types';

interface LogViewerProps {
  entries: LogEntry[];
  fileName: string;
  onClear: () => void;
  onSelectLines: (lines: string) => void;
}

const LogViewer: React.FC<LogViewerProps> = ({ entries, fileName, onClear, onSelectLines }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLines, setSelectedLines] = useState<Set<number>>(new Set());

  const toggleLineSelection = (id: number) => {
    const newSelection = new Set(selectedLines);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedLines(newSelection);
  };

  const handleSendToChat = () => {
    const lines = entries
      .filter(entry => selectedLines.has(entry.id))
      .map(entry => entry.original)
      .join('\n');
    onSelectLines(lines);
    setSelectedLines(new Set()); // Clear selection after sending
  };

  const filteredEntries = entries.filter(entry =>
    entry.original.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-black bg-opacity-70 neon-border-magenta p-4">
      <div className="flex-shrink-0 flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-press-start text-fuchsia-400" style={{ textShadow: '0 0 5px #ff00ff' }}>
          LOG: {fileName}
        </h2>
        <div className="flex items-center space-x-4">
            <input
                type="text"
                placeholder="Filter logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-900 border-2 border-fuchsia-500 text-lime-400 px-2 py-1 focus:outline-none focus:border-lime-400 w-48"
            />
            <button
              onClick={handleSendToChat}
              disabled={selectedLines.size === 0}
              className="bg-lime-500 text-black font-press-start px-3 py-1 text-sm border-2 border-lime-300 hover:bg-fuchsia-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Analyze
            </button>
            <button
                onClick={onClear}
                className="bg-red-600 text-white font-press-start px-3 py-1 text-sm border-2 border-red-400 hover:bg-yellow-400 hover:text-black"
            >
              Close
            </button>
        </div>
      </div>
      <div className="flex-grow overflow-auto bg-black text-sm">
        <pre className="p-2">
          <code>
            {filteredEntries.map((entry) => (
              <div 
                key={entry.id} 
                className={`flex items-start hover:bg-gray-800 cursor-pointer transition-colors duration-200 ${selectedLines.has(entry.id) ? 'bg-cyan-500 bg-opacity-40' : ''}`}
                onClick={() => toggleLineSelection(entry.id)}
              >
                <input 
                  type="checkbox"
                  className="mt-1 mr-3 shrink-0 cursor-pointer"
                  checked={selectedLines.has(entry.id)}
                  readOnly
                />
                <span className="text-gray-500 mr-4 select-none w-12 text-right">{entry.id + 1}</span>
                <span className={`flex-grow ${entry.isError ? 'text-red-500' : 'text-gray-300'}`}>
                  {entry.original}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default LogViewer;