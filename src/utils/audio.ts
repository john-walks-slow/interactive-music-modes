import { Note } from '../types'
import { getFrequencyFromSemitone } from './musicTheory'

// Create a singleton AudioContext to be reused
let audioContext: AudioContext | null = null

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    // Fallback for older browsers
    const AudioContext =
      window.AudioContext || (window as any).webkitAudioContext
    audioContext = new AudioContext()
  }
  return audioContext
}

/**
 * Plays a single note with a given frequency and duration.
 * @param frequency - The frequency of the note in Hz.
 * @param duration - The duration of the note in seconds.
 */
export const playNote = (frequency: number, duration: number = 0.5) => {
  const context = getAudioContext()

  // Resume context if it's suspended (required by modern browser policies)
  if (context.state === 'suspended') {
    context.resume()
  }

  const oscillator = context.createOscillator()
  const gainNode = context.createGain()

  oscillator.type = 'sine' // A clean, pure tone
  oscillator.frequency.setValueAtTime(frequency, context.currentTime)

  // Simple ADSR-like envelope to prevent clicks
  gainNode.gain.setValueAtTime(0, context.currentTime)
  gainNode.gain.linearRampToValueAtTime(0.7, context.currentTime + 0.02) // Attack
  gainNode.gain.linearRampToValueAtTime(0, context.currentTime + duration) // Decay/Release

  oscillator.connect(gainNode)
  gainNode.connect(context.destination)

  oscillator.start()
  oscillator.stop(context.currentTime + duration)
}

/**
 * Plays a sequence of notes (a scale), triggering an animation callback for each note.
 * @param notes - An array of Note objects to play in sequence.
 * @param onNotesAnimate - A callback function to trigger animations for played notes.
 * @param noteDuration - The duration of each note.
 * @param gap - The time gap between notes.
 * @returns The total duration of the playback in seconds.
 */
export const playScale = (
  notes: Note[],
  onNotesAnimate: (notes: Note[]) => void,
  noteDuration: number = 0.2,
  gap: number = 0.1
): number => {
  const context = getAudioContext()
  if (context.state === 'suspended') {
    context.resume()
  }

  notes.forEach((note, index) => {
    setTimeout(
      () => {
        // Trigger animation callback for the single note
        onNotesAnimate([note])

        // Play audio for the note
        const frequency = getFrequencyFromSemitone(note.semitone)
        playNote(frequency, noteDuration)
      },
      index * (noteDuration + gap) * 1000
    )
  })

  return (noteDuration + gap) * notes.length
}

/**
 * Plays multiple notes simultaneously as a chord.
 * @param frequencies - An array of frequencies to play together.
 * @param duration - The duration of the chord in seconds.
 */
export const playChord = (frequencies: number[], duration: number = 0.8) => {
  const context = getAudioContext()
  if (context.state === 'suspended') {
    context.resume()
  }

  // Use a single gain node for the entire chord to apply a unified envelope
  const masterGain = context.createGain()
  masterGain.connect(context.destination)

  // Dynamic gain to prevent clipping. It gets lower as more notes are added.
  const maxGain = Math.min(0.4, 0.9 / frequencies.length)

  masterGain.gain.setValueAtTime(0, context.currentTime)
  masterGain.gain.linearRampToValueAtTime(maxGain, context.currentTime + 0.02) // Smooth attack
  masterGain.gain.linearRampToValueAtTime(0, context.currentTime + duration) // Smooth release

  frequencies.forEach((frequency) => {
    const oscillator = context.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, context.currentTime)

    // Each oscillator connects to the single gain node
    oscillator.connect(masterGain)

    oscillator.start()
    oscillator.stop(context.currentTime + duration)
  })
}
