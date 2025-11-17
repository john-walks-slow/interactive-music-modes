
import React, { useState } from 'react';
import { Mode, Note } from '../types';
import IntervalDetail from './IntervalDetail';
import { playScale } from '../utils/audio';
import { FaPlay } from 'react-icons/fa';
import RelativeScaleInfo from './RelativeScaleInfo';
import DiatonicChords from './DiatonicChords';
import { getScaleNotesWithAbsoluteSemitones } from '../utils/music';

interface ModeInfoProps {
  mode: Mode;
  tonic: Note;
  onNotesAnimate: (notes: Note[]) => void;
  animatingChordIndices: Map<number, string>;
  onChordPlay: (degree: number) => void;
}

const ModeInfo: React.FC<ModeInfoProps> = ({ mode, tonic, onNotesAnimate, animatingChordIndices, onChordPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayScale = () => {
    if (isPlaying) return;

    const scaleNotes = getScaleNotesWithAbsoluteSemitones(mode, tonic);
    if (scaleNotes.length < 7) return;
    
    // Add the octave note for playback
    const octaveNote: Note = { ...tonic, semitone: tonic.semitone + 12, name: tonic.name };
    const finalNotesToPlay = [...scaleNotes, octaveNote];

    setIsPlaying(true);
    const durationMs = playScale(finalNotesToPlay, onNotesAnimate) * 1000;
    
    setTimeout(() => {
        setIsPlaying(false);
    }, durationMs);
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      {/* Top section for name and description */}
      <div className="flex justify-between items-start gap-5">
        <div className="flex-grow">
          <div className="min-h-[2.25rem]">
            <h2 key={mode.name} className="animate-fade-in-up text-xl sm:text-2xl font-bold text-gray-800">
                {mode.name}
            </h2>
          </div>
          <div className="min-h-[3rem] md:min-h-[1.5rem] mt-1">
            <p key={mode.description} className="animate-fade-in-up text-gray-600">
              {mode.description}
            </p>
          </div>
        </div>
        <button
            onClick={handlePlayScale}
            disabled={isPlaying}
            className="flex-shrink-0 mt-1 flex items-center justify-center w-10 h-10 rounded-full bg-sky-500 text-white transition-all duration-200 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            aria-label="Play scale"
        >
            <FaPlay className="w-5 h-5 ml-0.5" />
        </button>
      </div>
      
      <RelativeScaleInfo mode={mode} tonic={tonic} />

      {/* Interval Analysis section */}
      {mode.derivation && (
        <div className="mt-6 pt-6 border-t border-gray-200">
            <IntervalDetail mode={mode} />
        </div>
      )}

      {/* Diatonic Chords section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <DiatonicChords 
          mode={mode} 
          tonic={tonic} 
          onNotesAnimate={onNotesAnimate}
          animatingChordIndices={animatingChordIndices}
          onChordPlay={onChordPlay}
        />
      </div>
    </div>
  );
};

export default ModeInfo;
