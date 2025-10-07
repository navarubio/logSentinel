
import React from 'react';
import { DOMINO_GAME_HTML } from '../constants';

const DominoGameView: React.FC = () => {
  return (
    <div className="w-full h-full p-2 md:p-4 bg-black bg-opacity-50 neon-border-magenta">
      <iframe
        srcDoc={DOMINO_GAME_HTML}
        title="Dominó Venezolano Game"
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

export default DominoGameView;
