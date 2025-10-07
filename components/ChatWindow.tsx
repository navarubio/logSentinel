import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, LogType } from '../types';
import { SYSTEM_INSTRUCTIONS } from '../constants';
import { getAiResponse } from '../services/geminiService';

interface ChatWindowProps {
  logType: LogType;
  selectedLogLines: string;
}

const CreditsMarquee = () => {
    return (
        <div className="h-full overflow-hidden relative">
            <style>{`
                @keyframes scroll-up {
                    0% { transform: translateY(100%); }
                    100% { transform: translateY(-110%); }
                }
                .marquee-content {
                    position: absolute;
                    width: 100%;
                    animation: scroll-up 50s linear infinite;
                    will-change: transform;
                }
            `}</style>
            <div className="marquee-content text-lime-400 text-center text-lg md:text-xl space-y-6">
                <p className="font-press-start text-2xl pt-8">LOG SENTINEL 8-BIT</p>
                <p>Una herramienta de:</p>
                <p className="text-2xl text-cyan-400">Lic. Manuel Nava</p>
                <p>con la asistencia de</p>
                <p className="text-2xl text-fuchsia-400">Log Friend A.I.</p>

                <div className="py-8">
                    <div className="h-px bg-lime-400 w-1/2 mx-auto opacity-50"></div>
                </div>

                <p className="font-press-start text-yellow-400">-- ARCADE CLÁSICO --</p>
                {'PAC-MAN,GALAGA,DONKEY KONG,SPACE INVADERS,FROGGER,CENTIPEDE,DEFENDER,ASTEROIDS'.split(',').map(game => <p key={game}>{game}</p>)}

                <div className="py-8">
                    <div className="h-px bg-lime-400 w-1/2 mx-auto opacity-50"></div>
                </div>

                <pre className="text-fuchsia-400 text-4xl leading-tight font-['VT323']">
{`   ▄▄▄   
 ▄█████▄ 
███▀▀▀███
█████████
███▀█▀███`}
                </pre>

                <pre className="text-cyan-400 text-4xl leading-tight font-['VT323']">
{`    █▀▀█    
  ▄██████▄  
▄██████████▄
███ ▀▀ ▀▀ ███
████████████
  ▀██  ██▀  
`}
                </pre>

                <pre className="text-yellow-400 text-4xl leading-tight font-['VT323']">
{`   ▄▄▄▄▄   
 ▄███████▄ 
████ ▀ ████
███████████
 ▀███████▀ 
   ▀▀▀▀▀   `}
                </pre>
                 <div className="pb-8"></div>
            </div>
        </div>
    );
};


const ChatWindow: React.FC<ChatWindowProps> = ({ logType, selectedLogLines }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedLogLines) {
      setInput(prev => `${prev ? prev + '\n' : ''}Analiza las siguientes líneas del log:\n---\n${selectedLogLines}\n---`);
    }
  }, [selectedLogLines]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading]);
  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const systemInstruction = SYSTEM_INSTRUCTIONS[logType] || SYSTEM_INSTRUCTIONS[LogType.None];
    const responseText = await getAiResponse(input, systemInstruction);

    const aiMessage: ChatMessage = { sender: 'ai', text: responseText };
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleClear = () => {
    setMessages([]);
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-black bg-opacity-70 neon-border-cyan p-4">
      <h2 className="text-2xl font-press-start text-cyan-400 mb-4 text-center" style={{ textShadow: '0 0 5px #00ffff' }}>A.I. ASSISTANT</h2>
      <div className={`flex-grow pr-2 space-y-4 text-lg ${messages.length === 0 && !isLoading ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        {messages.length === 0 && !isLoading && <CreditsMarquee />}
        
        {messages.map((msg, index) => (
            <div key={index} className={`w-full p-3 rounded-md border-l-4 ${msg.sender === 'user' ? 'border-purple-500 bg-gray-900 bg-opacity-50' : 'border-cyan-400 bg-gray-800 bg-opacity-50'}`}>
                <p className={`text-sm font-bold mb-1 ${msg.sender === 'user' ? 'text-purple-300' : 'text-cyan-300'}`}>
                    {msg.sender === 'user' ? 'YOU:' : 'A.I. ASSISTANT:'}
                </p>
                <pre className="whitespace-pre-wrap font-['VT323'] leading-snug text-white">
                    {msg.text}
                </pre>
            </div>
        ))}

        {isLoading && (
          <div className="w-full p-3 rounded-md border-l-4 border-cyan-400 bg-gray-800 bg-opacity-50">
             <p className="text-sm font-bold mb-1 text-cyan-300">A.I. ASSISTANT:</p>
             <div className="flex items-center space-x-2 pt-2">
                <div className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                <div className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about the logs..."
          className="w-full bg-gray-900 border-2 border-purple-500 text-lime-400 p-2 focus:outline-none focus:border-lime-400 focus:shadow-[0_0_10px_#9c27b0] resize-none"
          rows={3}
        />
        <div className="mt-2 flex space-x-2">
            <button
            onClick={handleClear}
            className="bg-red-600 text-white font-press-start px-4 py-2 border-2 border-red-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 text-sm"
            style={{ textShadow: '1px 1px 2px black' }}
            >
            LIMPIAR
            </button>
            <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="flex-grow bg-purple-600 text-white font-press-start px-4 py-2 border-2 border-purple-400 hover:bg-lime-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            style={{ textShadow: '1px 1px 2px black' }}
            >
            SEND
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;