import React from 'react'
import { Mode, Note, Interval } from '../types'
import { ENHARMONIC_NOTES } from '../constants/music'

interface PianoProps {
  mode: Mode
  tonic: Note
  scaleNotes: Note[]
  animationTriggers: Map<number, string>
  onNoteClick: (note: Note) => void
}

const getIntervalStyle = (
  interval: Interval | undefined,
  mode: Mode,
  onDark: boolean
): string => {
  return onDark ? 'text-gray-300' : 'text-gray-600'
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

  /**
   * 根据 `ENHARMONIC_NOTES` 生成用于渲染的12个半音列表。
   * 黑键优先使用升号（#）表示，更符合钢琴键盘的习惯。
   */
  const PIANO_NOTES: Note[] = Object.entries(ENHARMONIC_NOTES).map(
    ([semitone, data]) => {
      const sharpName = data.names.find((n) => n.includes('#'))
      const preferredName = sharpName || data.names[0]
      return {
        name: preferredName,
        isBlack: data.isBlack,
        semitone: parseInt(semitone, 10),
      }
    }
  )

  const octaveC: Note = { name: 'C', isBlack: false, semitone: 12 }
  const keysToRender = [...PIANO_NOTES, octaveC]

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

        const animationName = animationTriggers.get(note.semitone)

        return (
          <div
            key={`white-${note.semitone}`}
            onClick={() => onNoteClick(note)}
            className={`absolute h-full border-r border-gray-200 transition-all duration-300 cursor-pointer active:brightness-95 origin-bottom ${
              isScaleNote ? 'bg-sky-100' : 'bg-white'
            }`}
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
                className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-mono ${getIntervalStyle(
                  intervalObject,
                  mode,
                  false
                )}`}
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

        // 动画的 key 直接使用琴键的半音值 (0-12)。
        const animationName = animationTriggers.get(note.semitone)

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
            className={`absolute top-0 h-2/3 rounded-b-md border-2 transition-all duration-300 z-10 cursor-pointer active:brightness-125 origin-bottom ${
              isScaleNote
                ? 'bg-sky-700 border-sky-800'
                : 'bg-slate-800 border-slate-700'
            }`}
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
                className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-mono ${getIntervalStyle(
                  intervalObject,
                  mode,
                  true
                )}`}
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
