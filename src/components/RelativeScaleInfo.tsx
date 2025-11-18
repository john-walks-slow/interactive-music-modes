import React from 'react'
import { Mode, Note } from '../types'
import { SCALES, CHROMATIC_NOTES, COMMON_TONICS } from '../constants/music'
import { TbBulb } from 'react-icons/tb'

interface RelativeScaleInfoProps {
  mode: Mode
  tonic: Note
  onSelectMode: (modeName: string, tonicName: string) => void
}

// Defines the relationship between a mode and its parent scale's tonic.
// The offset is the number of semitones the mode's tonic is *above* the parent Ionian tonic.
const MODE_RELATIONSHIPS: {
  [key: string]: { relative: string; offset: number }
} = {
  Ionian: { relative: 'Aeolian', offset: -3 }, // Relative minor is 3 semitones down
  Dorian: { relative: 'Ionian', offset: 2 },
  Phrygian: { relative: 'Ionian', offset: 4 },
  Lydian: { relative: 'Ionian', offset: 5 },
  Mixolydian: { relative: 'Ionian', offset: 7 },
  Aeolian: { relative: 'Ionian', offset: 9 },
  Locrian: { relative: 'Ionian', offset: 11 },
}

const RelativeScaleInfo: React.FC<RelativeScaleInfoProps> = ({
  mode,
  tonic,
  onSelectMode,
}) => {
  if (mode.category !== 'Major Scale Modes') {
    return null
  }

  const relationship = MODE_RELATIONSHIPS[mode.name]
  if (!relationship) {
    return null
  }

  const { relative: relativeModeName, offset } = relationship

  // To find the parent/relative tonic, we adjust the current tonic's semitone by the offset.
  // For modes finding their parent Ionian, we subtract the offset.
  // For Ionian finding its relative Aeolian, we also subtract (offset is -3).
  const relativeTonicSemitone = (tonic.semitone - offset + 12) % 12

  const relativeTonic =
    COMMON_TONICS.find((n) => n.semitone === relativeTonicSemitone) ||
    CHROMATIC_NOTES.find((n) => n.semitone === relativeTonicSemitone)

  const relativeMode = SCALES[relativeModeName]

  if (!relativeTonic || !relativeMode) {
    return null
  }

  const handleJump = () => {
    onSelectMode(relativeMode.name, relativeTonic.name)
  }
  const isRelativeMajor =
    relativeMode.name === 'Ionian' && mode.name !== 'Ionian'
  const isRelativeMinor = relativeMode.name === 'Aeolian'
  return (
    <div className="mt-4 p-3 bg-sky-50 rounded-lg border border-sky-200">
      <div className="flex items-start gap-3">
        <TbBulb className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-sky-800">
          <span className="font-semibold">
            {tonic.name} {mode.name}
          </span>{' '}
          uses the same notes as{' '}
          <button
            onClick={handleJump}
            className="font-semibold text-sky-600 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-400 rounded"
          >
            {relativeTonic.name} {relativeMode.name}
          </button>
          {isRelativeMajor && ' (the Major Scale)'}
          {isRelativeMinor && ' (the Natural Minor)'}.
        </p>
      </div>
    </div>
  )
}

export default RelativeScaleInfo
