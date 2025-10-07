
import React from 'react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <style>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; text-shadow: 0 0 8px #00ffff, 0 0 12px #00ffff; }
          50% { opacity: 0.8; text-shadow: 0 0 6px #00ffff, 0 0 10px #00ffff; }
        }
        .flicker {
          animation: flicker 1.5s infinite;
        }
        @keyframes rocket-fly {
          0% { transform: translateY(20px) rotate(-45deg); }
          50% { transform: translateY(-20px) rotate(-45deg); }
          100% { transform: translateY(20px) rotate(-45deg); }
        }
        .rocket {
          animation: rocket-fly 2s ease-in-out infinite;
          transform: rotate(-45deg);
        }
        .flame {
          position: absolute;
          bottom: -15px;
          left: 10px;
          width: 10px;
          height: 25px;
          background-color: #ff00ff;
          border-radius: 50%;
          filter: blur(5px);
          animation: flame-flicker 0.2s infinite;
        }
         @keyframes flame-flicker {
          0% { transform: scaleY(1) scaleX(1); opacity: 1; }
          50% { transform: scaleY(0.8) scaleX(1.2); opacity: 0.8; }
          100% { transform: scaleY(1) scaleX(1); opacity: 1; }
        }
      `}</style>
      <div className="relative w-20 h-20 rocket">
        <div className="text-5xl text-cyan-400">▲</div>
        <div className="flame"></div>
      </div>
      <p className="text-2xl text-cyan-400 flicker font-press-start">LOADING...</p>
    </div>
  );
};

export default LoadingAnimation;
