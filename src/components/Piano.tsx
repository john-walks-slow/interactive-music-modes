import React from 'react'
import { Mode, Note, Interval } from '../types'
import { CHROMATIC_NOTES } from '../constants/music'

interface PianoProps {
  mode: Mode
  tonic: Note
  scaleNotes: Note[]
  animationTriggers: Map<number, string>
  onNoteClick: (note: Note) => void
}

/**
 * Determines the Tailwind CSS classes for a minimal interval label.
 * It adjusts text color based on the interval's quality and whether it's on a light or dark background.
 * @param onDark - True if the label is for a black key, false for a white key.
 */
const getIntervalStyle = (
  interval: Interval | undefined,
  mode: Mode,
  onDark: boolean,
): string => {
  // if (!interval) return onDark ? 'text-gray-400' : 'text-gray-500';
  return onDark ? 'text-gray-300' : 'text-gray-600'
  const isCharacteristic =
    mode.characteristicIntervals?.includes(interval.number) &&
    mode.derivation?.parent !== mode.name

  // Characteristic intervals (like Lydian's #4) get a distinct color and are bold.
  if (isCharacteristic) {
    return onDark ? 'text-amber-300 font-bold' : 'text-amber-600 font-bold'
  }

  // The 3rd is a key quality tone, so it's also bold.
  if (interval.number === 3) {
    if (interval.quality === 'M')
      return onDark ? 'text-sky-200 font-bold' : 'text-sky-600 font-bold'
    if (interval.quality === 'm')
      return onDark ? 'text-yellow-200 font-bold' : 'text-yellow-600 font-bold'
  }
  // Standard colors for other interval qualities.
  switch (interval.quality) {
    case 'M':
      return onDark ? 'text-sky-300' : 'text-sky-500'
    case 'm':
      return onDark ? 'text-yellow-300' : 'text-yellow-500'
    case 'A':
      return onDark ? 'text-green-300' : 'text-green-600'
    case 'd':
      return onDark ? 'text-red-300' : 'text-red-600'
    case 'P':
    default:
      return onDark ? 'text-gray-300' : 'text-gray-600'
  }
}

const Piano: React.FC<PianoProps> = ({
  mode,
  tonic,
  scaleNotes,
  animationTriggers,
  onNoteClick,
}) => {
  const relativeToAbsoluteMap = new Map<number, number>()
  scaleNotes.forEach((note) => {
    relativeToAbsoluteMap.set(note.semitone % 12, note.semitone)
  })
  const octaveAbsoluteSemitone = tonic.semitone + 12

  // Create maps for interval labels and interval objects for styling
  const semitoneToIntervalMap = new Map<number, string>()
  const semitoneToIntervalObjectMap = new Map<number, Interval>()

  if (scaleNotes.length > 0) {
    const intervals = mode.intervals
    scaleNotes.forEach((note, index) => {
      if (intervals[index]) {
        const interval = intervals[index]
        const label = `${interval.quality}${interval.number}`
        semitoneToIntervalMap.set(note.semitone % 12, label)
        semitoneToIntervalObjectMap.set(note.semitone % 12, interval)
      }
    })
  }

  const octaveC: Note = { name: 'C', isBlack: false, semitone: 12 }
  const keysToRender = [...CHROMATIC_NOTES, octaveC]

  const whiteKeys = keysToRender.filter((n) => !n.isBlack)
  const WHITE_KEY_COUNT = whiteKeys.length
  const WHITE_KEY_WIDTH_PERCENT = 100 / WHITE_KEY_COUNT
  const BLACK_KEY_WIDTH_PERCENT = WHITE_KEY_WIDTH_PERCENT * 0.6

  return (
    <div className="relative w-full h-full select-none overflow-hidden rounded-lg border-2 border-gray-200 bg-slate-100 shadow-inner">
      {/* White Keys */}
      {whiteKeys.map((note, index) => {
        const relativeSemitone = note.semitone % 12
        const isScaleNote = semitoneToIntervalMap.has(relativeSemitone)
        const isRootPitchClass = relativeSemitone === tonic.semitone % 12
        const isOctaveDisplayKey = note.semitone === 12
        const label = isScaleNote
          ? semitoneToIntervalMap.get(relativeSemitone)
          : ''
        const intervalObject = isScaleNote
          ? semitoneToIntervalObjectMap.get(relativeSemitone)
          : undefined

        let animationName
        if (isScaleNote) {
          if (isRootPitchClass && isOctaveDisplayKey) {
            animationName = animationTriggers.get(octaveAbsoluteSemitone)
          } else {
            const absoluteSemitone = relativeToAbsoluteMap.get(relativeSemitone)
            animationName = animationTriggers.get(absoluteSemitone)
          }
        }

        return (
          <div
            key={`white-${note.semitone}`}
            onClick={() => onNoteClick(note)}
            className={`absolute h-full border-r border-gray-200 transition-all duration-300 cursor-pointer active:brightness-95 origin-bottom ${isScaleNote ? 'bg-sky-100' : 'bg-white'}`}
            style={{
              left: `${index * WHITE_KEY_WIDTH_PERCENT}%`,
              width: `${WHITE_KEY_WIDTH_PERCENT}%`,
              backgroundColor: isRootPitchClass ? '#bae6fd' : undefined, // sky-200
              animation: animationName
                ? `${animationName} 0.4s ease-out`
                : 'none',
            }}
          >
            {label && (
              <span
                className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-mono ${getIntervalStyle(intervalObject, mode, false)}`}
              >
                {isRootPitchClass && isOctaveDisplayKey ? 'P8' : label}
              </span>
            )}
          </div>
        )
      })}

      {/* Black Keys */}
      {keysToRender.map((note, keyIndex) => {
        if (!note.isBlack) return null

        const relativeSemitone = note.semitone % 12
        const isScaleNote = semitoneToIntervalMap.has(relativeSemitone)
        const isRootPitchClass = relativeSemitone === tonic.semitone % 12
        const label = isScaleNote
          ? semitoneToIntervalMap.get(relativeSemitone)
          : ''
        const intervalObject = isScaleNote
          ? semitoneToIntervalObjectMap.get(relativeSemitone)
          : undefined

        let animationName
        if (isScaleNote) {
          const absoluteSemitone = relativeToAbsoluteMap.get(relativeSemitone)
          animationName = animationTriggers.get(absoluteSemitone)
        }

        const whiteKeysBefore = keysToRender
          .slice(0, keyIndex)
          .filter((n) => !n.isBlack).length
        const leftPosition =
          whiteKeysBefore * WHITE_KEY_WIDTH_PERCENT -
          BLACK_KEY_WIDTH_PERCENT / 2

        return (
          <div
            key={`black-${note.semitone}`}
            onClick={() => onNoteClick(note)}
            className={`absolute top-0 h-2/3 rounded-b-md border-2 transition-all duration-300 z-10 cursor-pointer active:brightness-125 origin-bottom ${isScaleNote ? 'bg-sky-700 border-sky-800' : 'bg-slate-800 border-slate-700'}`}
            style={{
              left: `${leftPosition}%`,
              width: `${BLACK_KEY_WIDTH_PERCENT}%`,
              backgroundColor: isRootPitchClass ? '#0186d1' : undefined,
              borderColor: isRootPitchClass ? 'black' : undefined,
              animation: animationName
                ? `${animationName} 0.4s ease-out`
                : 'none',
            }}
          >
            {label && (
              <span
                className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-mono ${getIntervalStyle(intervalObject, mode, true)}`}
              >
                {label}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Piano
