import React, { useState } from 'react';
import LogAnalyzerView from './components/LogAnalyzerView';
import DominoGameView from './components/DominoGameView';

type View = 'analyzer' | 'game';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('analyzer');

  const neonBorderStyle = `border-2 p-1 transition-all duration-300`;
  const activeStyle = `text-yellow-300 border-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.8)] bg-yellow-900 bg-opacity-50`;
  const inactiveStyle = `text-cyan-300 border-cyan-400 hover:bg-cyan-900 hover:bg-opacity-50`;

  return (
    <main className="bg-black text-white h-screen flex flex-col p-2 md:p-4" style={{ 
        backgroundImage: 'radial-gradient(#1a1a1a 1px, transparent 1px)',
        backgroundSize: '20px 20px'
    }}>
      <style>{`
        .neon-border-cyan {
          border: 2px solid #00ffff;
          box-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff, inset 0 0 5px #00ffff;
        }
        .neon-border-magenta {
          border: 2px solid #ff00ff;
          box-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 15px #ff00ff, inset 0 0 5px #ff00ff;
        }
      `}</style>
      <header className="flex-shrink-0 flex justify-between items-center p-2 neon-border-cyan mb-4">
        <h1 className="text-2xl md:text-3xl font-press-start text-cyan-300" style={{ textShadow: '0 0 5px #00ffff, 0 0 10px #00ffff' }}>
          Log Sentinel 8-Bit
        </h1>
        <nav className="flex space-x-2 md:space-x-4 font-press-start text-xs md:text-sm">
          <button 
            onClick={() => setActiveView('analyzer')}
            className={`${neonBorderStyle} ${activeView === 'analyzer' ? activeStyle : inactiveStyle}`}
          >
            LOG_ANALYZER
          </button>
          <button 
            onClick={() => setActiveView('game')}
            className={`${neonBorderStyle} ${activeView === 'game' ? activeStyle : inactiveStyle}`}
          >
            DOMINO_BREAK
          </button>
        </nav>
      </header>
      <div className="flex-grow w-full min-h-0">
        {activeView === 'analyzer' ? <LogAnalyzerView /> : <DominoGameView />}
      </div>
    </main>
  );
};

export default App;