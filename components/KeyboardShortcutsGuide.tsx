
import React from 'react';
import { TbKeyboard } from 'react-icons/tb';

const KeyboardShortcutsGuide: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 text-gray-700 p-2 text-xs shadow-lg z-50 animate-fade-in-up hidden md:flex">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 sm:gap-4">
        <TbKeyboard className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-gray-500" strokeWidth={1.5} />
        <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-1 font-sans">
          <span className="whitespace-nowrap"><b className="font-bold text-sky-600">1-7:</b> Tonic (<b className="font-bold text-sky-600">⇧</b> ♯)</span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span className="whitespace-nowrap"><b className="font-bold text-sky-600">Q-U:</b> Mode</span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span className="whitespace-nowrap"><b className="font-bold text-sky-600">A-K:</b> Notes</span>
           <span className="hidden sm:inline text-gray-300">|</span>
          <span className="whitespace-nowrap"><b className="font-bold text-sky-600">Z-M:</b> Chords (<b className="font-bold text-sky-600">⇧</b> 7ths)</span>
        </div>
      </div>
    </footer>
  );
};

export default KeyboardShortcutsGuide;
