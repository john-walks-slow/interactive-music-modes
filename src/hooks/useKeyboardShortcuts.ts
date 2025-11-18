import { useEffect, useCallback } from 'react'
import { Mode, Note, ChordType } from '../types'
import { MODES, UI_GROUPS, COMMON_TONICS } from '../constants/music'
import { getScaleNotesWithAbsoluteSemitones } from '../utils/music'
import { getDiatonicChords } from '../utils/chordTheory'
import { playNote, playChord } from '../utils/audio'
import { getFrequencyFromSemitone } from '../utils/music'
import { getRelativeModeAndTonic } from '../utils/musicTheory'

interface KeyboardShortcutsProps {
  setActiveModeIndex: (index: number) => void
  setTonic: (note: Note) => void
  onNotesAnimate: (notes: Note[]) => void
  onChordPlay: (degree: number) => void
  mode: Mode
  tonic: Note
}

// Maps keyboard keys to mode indices.
const KEY_TO_MODE_INDEX: Record<string, number> = {
  q: MODES.findIndex((m) => m.name === UI_GROUPS[0].name),
  w: MODES.findIndex((m) => m.name === UI_GROUPS[1].name),
  e: MODES.findIndex((m) => m.name === UI_GROUPS[2].name),
  r: MODES.findIndex((m) => m.name === UI_GROUPS[3].name),
  t: MODES.findIndex((m) => m.name === UI_GROUPS[4].name),
  y: MODES.findIndex((m) => m.name === UI_GROUPS[5].name),
  u: MODES.findIndex((m) => m.name === UI_GROUPS[6].name),
}

// Maps keyboard event `code` to tonic semitone values for robustness.
const CODE_TO_TONIC_SEMITONE: Record<string, number> = {
  Digit1: 0,
  Digit2: 2,
  Digit3: 4,
  Digit4: 5,
  Digit5: 7,
  Digit6: 9,
  Digit7: 11,
}

const KEY_TO_MELODY_DEGREE: Record<string, number> = {
  a: 0,
  s: 1,
  d: 2,
  f: 3,
  g: 4,
  h: 5,
  j: 6,
  k: 7, // 7 is octave
}

const KEY_TO_CHORD_DEGREE: Record<string, number> = {
  z: 0,
  x: 1,
  c: 2,
  v: 3,
  b: 4,
  n: 5,
  m: 6,
}

export const useKeyboardShortcuts = ({
  mode,
  tonic,
  setActiveModeIndex,
  setTonic,
  onNotesAnimate,
  onChordPlay,
}: KeyboardShortcutsProps) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.repeat) return

      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      const { key, code, shiftKey } = event
      const lowerKey = key.toLowerCase()

      // 1. Mode Change (Q-U), with Shift for relative mode
      if (KEY_TO_MODE_INDEX.hasOwnProperty(lowerKey)) {
        const targetModeIndex = KEY_TO_MODE_INDEX[lowerKey]
        const targetMode = MODES[targetModeIndex]

        if (shiftKey && targetMode) {
          const result = getRelativeModeAndTonic(mode, tonic, targetMode.name)
          if (result) {
            const { newMode, newTonic } = result
            const newModeIndex = MODES.findIndex((m) => m.name === newMode.name)
            if (newModeIndex !== -1) {
              setActiveModeIndex(newModeIndex)
              setTonic(newTonic)
              event.preventDefault()
              return
            }
          }
        } else {
          if (targetModeIndex !== -1) {
            setActiveModeIndex(targetModeIndex)
            event.preventDefault()
            return
          }
        }
      }

      // 2. Tonic Change (1-7, Shift for sharp)
      if (CODE_TO_TONIC_SEMITONE.hasOwnProperty(code)) {
        let targetSemitone = CODE_TO_TONIC_SEMITONE[code]
        if (shiftKey) {
          targetSemitone = (targetSemitone + 1) % 12
        }
        const newTonic = COMMON_TONICS.find(
          (t) => t.semitone === targetSemitone
        )
        if (newTonic) {
          setTonic(newTonic)
          event.preventDefault()
          return
        }
      }

      // 3. Diatonic Melody (a,s,d,f,g,h,j,k), Shift for sharp
      if (KEY_TO_MELODY_DEGREE.hasOwnProperty(lowerKey)) {
        const degree = KEY_TO_MELODY_DEGREE[lowerKey]
        const scaleNotes = getScaleNotesWithAbsoluteSemitones(mode, tonic)
        let noteToPlay: Note | undefined

        if (degree === 7) {
          // Octave
          noteToPlay = { ...tonic, semitone: tonic.semitone + 12 }
        } else {
          noteToPlay = scaleNotes[degree]
        }

        if (noteToPlay) {
          if (shiftKey) {
            noteToPlay = { ...noteToPlay, semitone: noteToPlay.semitone + 1 }
          }
          playNote(getFrequencyFromSemitone(noteToPlay.semitone), 0.4)
          onNotesAnimate([noteToPlay])
        }

        event.preventDefault()
        return
      }

      // 4. Diatonic Chord (z,x,c,v,b,n,m)
      if (KEY_TO_CHORD_DEGREE.hasOwnProperty(lowerKey)) {
        const degree = KEY_TO_CHORD_DEGREE[lowerKey]
        const chordType: ChordType = shiftKey ? 'seventh' : 'triad'
        const chords = getDiatonicChords(mode, tonic, chordType)
        const chordToPlay = chords[degree]

        if (chordToPlay && chordToPlay.notes.length > 0) {
          // Trigger animations
          onChordPlay(degree)
          onNotesAnimate(chordToPlay.notes)

          // Play audio
          const frequencies = chordToPlay.notes.map((note) => {
            const octaveOffset =
              note.semitone < chordToPlay.notes[0].semitone ? 12 : 0
            return getFrequencyFromSemitone(note.semitone + octaveOffset)
          })
          playChord(frequencies)
          event.preventDefault()
          return
        }
      }
    },
    [mode, tonic, setActiveModeIndex, setTonic, onNotesAnimate, onChordPlay]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}
