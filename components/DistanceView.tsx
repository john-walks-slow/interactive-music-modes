
import React, { useState, useEffect, useRef } from 'react';
import { Mode, Note } from '../types';

interface DistanceViewProps {
  mode: Mode;
  tonic: Note;
  scaleNotes: Note[];
  animationTriggers: Map<number, string>;
  onNoteClick: (note: Note) => void;
}

const DegreeNode: React.FC<{ label: string; degreeText: string; onClick?: () => void; animationName?: string; }> = ({ label, degreeText, onClick, animationName }) => {
  return (
    <div 
        className={`relative flex-shrink-0 w-6 h-6 md:w-14 md:h-14 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
        style={{ animation: animationName ? `${animationName} 0.4s ease-out` : 'none' }}
    >
      <div className={`w-full h-full rounded-full bg-sky-200 flex items-center justify-center font-bold text-sky-800 text-[9px] md:text-base border border-sky-300 md:border-2 transition-transform ${(onClick ? 'active:scale-95' : '')}`}>
        {label}
      </div>
      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[9px] md:text-xs text-gray-500 font-semibold whitespace-nowrap">{degreeText}</span>
    </div>
  );
};


const StepConnector: React.FC<{ step: string; changeType?: 'increased' | 'decreased'; isTense?: boolean }> = ({ step, changeType, isTense = false }) => {
  const getFlexGrow = () => {
    switch (step) {
      case 'W': return 2;
      case 'H': return 1;
      case 'WH': return 3; // For Harmonic Minor's augmented 2nd
      default: return 1;
    }
  };
  
  const flexGrow = getFlexGrow();
  
  const baseBgColor = isTense ? 'bg-amber-300' : 'bg-sky-100';

  let animationBgColor: string | null = null;
  if (changeType === 'increased') {
      animationBgColor = 'bg-green-300';
  } else if (changeType === 'decreased') {
      animationBgColor = 'bg-red-300';
  }
  
  const bgColor = animationBgColor || baseBgColor;

  return (
    <div
      className="flex items-center justify-center h-6 md:h-14 transition-all duration-500 ease-in-out min-w-0"
      style={{ flexGrow }}
    >
      <div className={`w-full h-1 ${bgColor} transition-colors duration-300`} />
    </div>
  );
};

const DistanceView: React.FC<DistanceViewProps> = ({ mode, tonic, scaleNotes, animationTriggers, onNoteClick }) => {
    const prevModeRef = useRef<Mode>(mode);
    const [changedSteps, setChangedSteps] = useState<Map<number, 'increased' | 'decreased'>>(new Map());
    
    // Effect for handling mode/tonic change animations
    useEffect(() => {
        const prevFormula = prevModeRef.current.formula;
        const newStepChanges = new Map<number, 'increased' | 'decreased'>();
        
        const getStepValue = (step: string): number => {
            switch (step) {
                case 'H': return 1;
                case 'W': return 2;
                case 'WH': return 3;
                default: return 0;
            }
        };

        const currentSteps = mode.formula.split('-');
        const prevSteps = prevFormula.split('-');
        currentSteps.forEach((step, index) => {
            if (index < prevSteps.length && step !== prevSteps[index]) {
                const currentValue = getStepValue(step);
                const prevValue = getStepValue(prevSteps[index]);
                if (currentValue > prevValue) {
                    newStepChanges.set(index, 'increased');
                } else if (currentValue < prevValue) {
                    newStepChanges.set(index, 'decreased');
                }
            }
        });
        setChangedSteps(newStepChanges);

        prevModeRef.current = mode;

        const timer = setTimeout(() => {
            setChangedSteps(new Map());
        }, 600);

        return () => clearTimeout(timer);
    }, [mode, tonic]);

  const steps = mode.formula.split('-');
  const octaveNote: Note = { ...tonic, semitone: tonic.semitone + 12 };

  return (
    <div className="flex items-center justify-center p-6 bg-white border border-gray-200 rounded-lg h-full w-full">
      <div className="flex items-center justify-between w-full">
        {scaleNotes.map((note, index) => {
           if (!note) return null;
           const interval = mode.intervals[index];
           const animationName = animationTriggers.get(note.semitone);

           return (
            <React.Fragment key={interval.number}>
                <DegreeNode 
                  label={`${interval.quality}${interval.number}`} 
                  degreeText={note.name}
                  animationName={animationName}
                  onClick={() => onNoteClick(note)}
                />
                {index < steps.length && (
                <StepConnector 
                    step={steps[index]} 
                    changeType={changedSteps.get(index)}
                    isTense={steps[index] === 'H'}
                />
                )}
            </React.Fragment>
           );
        })}
        {/* Final Root Node (Octave) */}
        <DegreeNode 
            label="P8" 
            degreeText={tonic.name} 
            animationName={animationTriggers.get(octaveNote.semitone)}
            onClick={() => onNoteClick(octaveNote)}
        />
      </div>
    </div>
  );
};

export default DistanceView;
