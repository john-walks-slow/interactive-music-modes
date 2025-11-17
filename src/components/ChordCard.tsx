import React from 'react'
import { Chord, Note } from '../types'
import { playChord } from '../utils/audio'
import { getFrequencyFromSemitone } from '../utils/music'

interface ChordCardProps {
  chord: Chord
  onNotesAnimate: (notes: Note[]) => void
  onPlay: () => void
  animationName?: string
}

const ChordCard: React.FC<ChordCardProps> = ({
  chord,
  onNotesAnimate,
  onPlay,
  animationName,
}) => {
  const handleClick = () => {
    if (chord.notes.length === 0) return

    // Trigger animations and state updates
    onPlay()
    onNotesAnimate(chord.notes)

    // Play the chord sound
    const frequencies = chord.notes.map((note) => {
      // Ensure notes wrap correctly for chords built on higher degrees
      const octaveOffset = note.semitone < chord.notes[0].semitone ? 12 : 0
      return getFrequencyFromSemitone(note.semitone + octaveOffset)
    })
    playChord(frequencies)
  }

  const getQualityClasses = (quality: string): string => {
    const lowerQuality = quality.toLowerCase()
    if (lowerQuality.includes('major'))
      return 'bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-200'
    if (lowerQuality.includes('minor'))
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200'
    if (lowerQuality.includes('diminished'))
      return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
    if (lowerQuality.includes('dominant'))
      return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200'
    if (lowerQuality.includes('augmented'))
      return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
    return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
  }

  const qualityClasses = getQualityClasses(chord.quality)

  const animationStyle = animationName
    ? { animation: `${animationName} 0.4s ease-out` }
    : {}

  return (
    <div
      onClick={handleClick}
      className={`w-full h-24 sm:h-28 flex flex-col items-center justify-center p-2 rounded-lg border cursor-pointer transition-all duration-200 active:scale-95 text-center ${qualityClasses}`}
      style={animationStyle}
    >
      <span className="text-sm sm:text-lg font-bold font-mono">
        {chord.romanNumeral}
      </span>
      <span className="text-xs sm:text-sm font-semibold mt-1">
        {chord.name}
      </span>
    </div>
  )
}

export default ChordCard
