import { Mode, Note } from '../types'
import { getIntervalSemitone } from '../constants/music'
import { getScaleNotes } from './musicTheory'

// C4 (Middle C) is our reference note for frequency calculations.
const C4_FREQUENCY = 261.63

/**
 * Calculates the frequency of a note based on its semitone offset from C.
 * For this application, all notes are played in the 4th octave.
 * @param semitone - The number of semitones above C (C=0, C#=1, etc.).
 * @returns The frequency in Hz.
 */
export const getFrequencyFromSemitone = (semitone: number): number => {
  // The formula for frequency is F = F_base * 2^(n/12), where n is the number of semitones away.
  return C4_FREQUENCY * Math.pow(2, semitone / 12)
}

/**
 * Calculates the seven notes of a given mode, starting from a tonic, with absolute, ascending semitone values.
 * This is crucial for audio playback and unambiguous animation triggering.
 * @param mode - The musical mode (e.g., Ionian, Dorian).
 * @param tonic - The starting note of the scale.
 * @returns An array of seven Note objects representing the scale.
 */
export const getScaleNotesWithAbsoluteSemitones = (
  mode: Mode,
  tonic: Note,
): Note[] => {
  const namedNotes = getScaleNotes(mode, tonic) // For correct note names (e.g., Db vs C#)
  return mode.intervals
    .map((interval, i) => {
      const noteInfo = namedNotes[i]
      if (!noteInfo) return null // Should not happen with valid modes/tonics

      const intervalSemitones = getIntervalSemitone(interval)
      // Calculate absolute semitone from the tonic
      return {
        ...noteInfo,
        semitone: tonic.semitone + intervalSemitones,
      }
    })
    .filter(Boolean) as Note[]
}
