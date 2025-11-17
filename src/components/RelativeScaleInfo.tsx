import React from 'react'
import { Mode, Note } from '../types'
import { SCALES, CHROMATIC_NOTES, COMMON_TONICS } from '../constants/music'
import { TbBulb } from 'react-icons/tb'

interface RelativeScaleInfoProps {
  mode: Mode
  tonic: Note
}

// Defines the semitone distance from a mode's root UP to the parent Ionian root.
// We subtract this to find the parent tonic.
const MODE_SEMITONE_OFFSETS: { [key: string]: number } = {
  Ionian: 0,
  Dorian: 2,
  Phrygian: 4,
  Lydian: 5,
  Mixolydian: 7,
  Aeolian: 9,
  Locrian: 11,
}

const RelativeScaleInfo: React.FC<RelativeScaleInfoProps> = ({
  mode,
  tonic,
}) => {
  // This feature is only relevant for the 7 modes of the major scale.
  if (mode.category !== 'Major Scale Modes' || mode.name === 'Ionian') {
    return null
  }

  const offset = MODE_SEMITONE_OFFSETS[mode.name]
  if (offset === undefined) {
    return null
  }

  const relativeMajorTonicSemitone = (tonic.semitone - offset + 12) % 12
  // Find a suitable tonic from our common list. This prefers flats (Db, Eb, etc.) over sharps for relevant keys.
  const relativeMajorTonic =
    COMMON_TONICS.find((n) => n.semitone === relativeMajorTonicSemitone) ||
    CHROMATIC_NOTES.find((n) => n.semitone === relativeMajorTonicSemitone) // Fallback for other keys like F#

  const ionianMode = SCALES['Ionian']

  if (!relativeMajorTonic) {
    return null
  }

  return (
    <div className="mt-4 p-3 bg-sky-50 rounded-lg border border-sky-200">
      <div className="flex items-start gap-3">
        <TbBulb className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-sky-800">
          <span className="font-semibold">
            {tonic.name} {mode.name}
          </span>{' '}
          uses the same notes as{' '}
          <span className="font-semibold">
            {relativeMajorTonic.name} {ionianMode.name}
          </span>{' '}
          (Major Scale).
        </p>
      </div>
    </div>
  )
}

export default RelativeScaleInfo
