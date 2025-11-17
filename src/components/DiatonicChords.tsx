import React, { useState } from 'react'
import { Mode, Note, ChordType } from '../types'
import { getDiatonicChords } from '../utils/chordTheory'
import ChordCard from './ChordCard'

interface DiatonicChordsProps {
  mode: Mode
  tonic: Note
  onNotesAnimate: (notes: Note[]) => void
  animatingChordIndices: Map<number, string>
  onChordPlay: (degree: number) => void
}

const DiatonicChords: React.FC<DiatonicChordsProps> = ({
  mode,
  tonic,
  onNotesAnimate,
  animatingChordIndices,
  onChordPlay,
}) => {
  const [chordType, setChordType] = useState<ChordType>('triad')

  const chords = getDiatonicChords(mode, tonic, chordType)

  const baseClasses =
    'px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:z-10 focus:ring-2 focus:ring-sky-500'
  const activeClasses = 'bg-sky-50 text-sky-700'
  const inactiveClasses = 'bg-white text-gray-500 hover:bg-gray-50'

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
        <h3 className="text-base font-semibold text-gray-800">Chords</h3>
        <div
          className="inline-flex rounded-md shadow-sm self-start sm:self-center"
          role="group"
        >
          <button
            type="button"
            onClick={() => setChordType('triad')}
            className={`${baseClasses} rounded-l-lg border border-gray-200 ${
              chordType === 'triad' ? activeClasses : inactiveClasses
            }`}
          >
            Triads
          </button>
          <button
            type="button"
            onClick={() => setChordType('seventh')}
            className={`${baseClasses} rounded-r-md border-t border-b border-r border-gray-200 ${
              chordType === 'seventh' ? activeClasses : inactiveClasses
            }`}
          >
            Seventh Chords
          </button>
        </div>
      </div>
      <div className="flex flex-wrap -mx-1 sm:-mx-2">
        {chords.map((chord, index) => (
          <div key={index} className="w-1/4 sm:w-1/7 p-1 sm:p-2">
            <ChordCard
              chord={chord}
              onNotesAnimate={onNotesAnimate}
              animationName={animatingChordIndices.get(index)}
              onPlay={() => onChordPlay(index)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// A small layout fix for 7 items in a flex row
const style = document.createElement('style')
style.innerHTML = `
  @media (min-width: 640px) { /* sm breakpoint */
    .sm\\:w-1\\/7 {
      width: 14.2857143%;
    }
  }
`
document.head.appendChild(style)

export default DiatonicChords
