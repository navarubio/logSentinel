import React, { useState } from 'react';
import { LogType, LogEntry } from '../types';
import LoadingAnimation from './LoadingAnimation';
import LogViewer from './LogViewer';
import ChatWindow from './ChatWindow';

const LogAnalyzerView: React.FC = () => {
  const [logType, setLogType] = useState<LogType>(LogType.None);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLogLines, setSelectedLogLines] = useState<string>('');

  const parseLogContent = (content: string): LogEntry[] => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      const lowerLine = line.toLowerCase();
      const isError = lowerLine.includes('error') || lowerLine.includes('err') || lowerLine.includes('advertencia');
      return { id: index, original: line, isError };
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && logType !== LogType.None) {
      setIsLoading(true);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const parsedEntries = parseLogContent(content);
        // Simulate retro loading time
        setTimeout(() => {
          setLogEntries(parsedEntries);
          setIsLoading(false);
        }, 1500);
      };
      reader.readAsText(file);
    } else if (logType === LogType.None) {
        alert("Please select a log type first!");
        event.target.value = ''; // Reset file input
    }
  };

  const clearLog = () => {
    setLogEntries([]);
    setFileName('');
    setLogType(LogType.None);
    setSelectedLogLines('');
  };

  const FileLoader = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-70 neon-border-magenta p-8 space-y-8">
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          <h2 className="text-3xl font-press-start text-fuchsia-400 text-center" style={{ textShadow: '0 0 8px #ff00ff' }}>
            SELECT LOG TYPE
          </h2>
          <div className="relative">
             <select
                value={logType}
                onChange={(e) => setLogType(e.target.value as LogType)}
                className="appearance-none font-press-start text-xl bg-black border-2 border-fuchsia-500 text-lime-400 p-4 pr-12 focus:outline-none focus:border-lime-400 focus:shadow-[0_0_15px_#ff00ff] cursor-pointer"
            >
                <option value={LogType.None}>-- CHOOSE --</option>
                <option value={LogType.Payara}>PAYARA SERVER</option>
                <option value={LogType.PostgreSQL}>POSTGRESQL</option>
                <option value={LogType.Sensors}>SENSORS</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-lime-400">
                <span>▼</span>
            </div>
          </div>
          <label htmlFor="file-upload" className={`font-press-start text-xl p-4 border-2 transition-all duration-300
              ${logType === LogType.None 
              ? 'text-gray-600 border-gray-700 cursor-not-allowed'
              : 'text-white bg-fuchsia-600 border-fuchsia-400 hover:bg-lime-500 hover:text-black cursor-pointer'}`}
          >
            UPLOAD .TXT FILE
          </label>
          <input 
            id="file-upload" 
            type="file" 
            accept=".txt" 
            className="hidden"
            onChange={handleFileChange}
            disabled={logType === LogType.None}
          />
        </>
      )}
    </div>
  );

  return (
    <div className="flex flex-row w-full h-full p-2 md:p-4 space-x-4">
      <div className="w-3/4 h-full">
        {logEntries.length === 0 ? <FileLoader /> : <LogViewer entries={logEntries} fileName={fileName} onClear={clearLog} onSelectLines={setSelectedLogLines} />}
      </div>
      <div className="w-1/4 h-full">
        <ChatWindow logType={logType} selectedLogLines={selectedLogLines} />
      </div>
    </div>
  );
};

export default LogAnalyzerView;