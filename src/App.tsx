import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useLayoutEffect,
} from 'react'
import { MODES, COMMON_TONICS } from './constants/music'
import ModeSelector from './components/ModeSelector'
import Piano from './components/Piano'
import ModeInfo from './components/ModeInfo'
import { ViewMode, Note, Mode } from './types'
import ViewModeSwitcher from './components/ViewModeSwitcher'
import DistanceView from './components/DistanceView'
import { TbMusic } from 'react-icons/tb'
import TonicSelector from './components/TonicSelector'
import { playNote } from './utils/audio'
import {
  getFrequencyFromSemitone,
  getScaleNotesWithAbsoluteSemitones,
} from './utils/music'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import KeyboardShortcutsGuide from './components/KeyboardShortcutsGuide'

const App: React.FC = () => {
  const [activeModeIndex, setActiveModeIndex] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('distance')
  const [tonic, setTonic] = useState<Note>(COMMON_TONICS[0])
  const [animationTriggers, setAnimationTriggers] = useState(
    new Map<number, string>()
  )
  const [animatingChordIndices, setAnimatingChordIndices] = useState(
    new Map<number, string>()
  )

  const noteAnimationTimeouts = useRef(new Map<number, NodeJS.Timeout>())
  const chordAnimationTimeouts = useRef(new Map<number, NodeJS.Timeout>())

  const activeMode = MODES[activeModeIndex]

  const scaleNotes = useMemo(
    () => getScaleNotesWithAbsoluteSemitones(activeMode, tonic),
    [activeMode, tonic]
  )

  // Synchronously clear animations before the browser paints to prevent flashes
  // of old animation states when the mode, tonic, or view changes.
  useLayoutEffect(() => {
    setAnimationTriggers(new Map())
    noteAnimationTimeouts.current.forEach((timeout) => clearTimeout(timeout))
    noteAnimationTimeouts.current.clear()
  }, [activeModeIndex, tonic, viewMode])

  const onNotesAnimate = useCallback((notes: Note[]) => {
    const semitonesToAnimate = notes.map((n) => n.semitone)
    const animationDuration = 400

    setAnimationTriggers((prev) => {
      const next = new Map(prev)
      semitonesToAnimate.forEach((semitone) => {
        if (noteAnimationTimeouts.current.has(semitone)) {
          clearTimeout(noteAnimationTimeouts.current.get(semitone)!)
        }
        const currentName = prev.get(semitone)
        next.set(
          semitone,
          currentName === 'note-pop-a' ? 'note-pop-b' : 'note-pop-a'
        )
      })
      return next
    })

    semitonesToAnimate.forEach((semitone) => {
      const timeoutId = setTimeout(() => {
        setAnimationTriggers((prev) => {
          const next = new Map(prev)
          next.delete(semitone)
          noteAnimationTimeouts.current.delete(semitone)
          return next
        })
      }, animationDuration)
      noteAnimationTimeouts.current.set(semitone, timeoutId)
    })
  }, [])

  const handleSingleNotePlay = (note: Note) => {
    const frequency = getFrequencyFromSemitone(note.semitone)
    playNote(frequency, 0.4)
    onNotesAnimate([note])
  }

  const handleChordPlay = useCallback((degree: number) => {
    if (chordAnimationTimeouts.current.has(degree)) {
      clearTimeout(chordAnimationTimeouts.current.get(degree)!)
    }

    setAnimatingChordIndices((prev) => {
      const next = new Map(prev)
      const currentName = prev.get(degree)
      next.set(
        degree,
        currentName === 'note-pop-a' ? 'note-pop-b' : 'note-pop-a'
      )
      return next
    })

    const timeoutId = setTimeout(() => {
      setAnimatingChordIndices((prev) => {
        const next = new Map(prev)
        next.delete(degree)
        return next
      })
      chordAnimationTimeouts.current.delete(degree)
    }, 400) // Animation duration

    chordAnimationTimeouts.current.set(degree, timeoutId)
  }, [])

  const handleModeChange = useCallback((modeIndex: number, newTonic?: Note) => {
    setActiveModeIndex(modeIndex)
    if (newTonic) {
      setTonic(newTonic)
    }
  }, [])

  const handleSelectMode = useCallback(
    (modeName: string, tonicName: string) => {
      const modeIndex = MODES.findIndex((m) => m.name === modeName)
      const tonic = COMMON_TONICS.find((t) => t.name === tonicName)

      if (modeIndex !== -1 && tonic) {
        setActiveModeIndex(modeIndex)
        setTonic(tonic)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    []
  )

  useKeyboardShortcuts({
    mode: activeMode,
    tonic,
    setActiveModeIndex,
    setTonic,
    onNotesAnimate,
    onChordPlay: handleChordPlay,
  })

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col items-center gap-6">
            {/* Row 1: Title and Tonic Selector */}
            <div className="w-full flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
              <div className="flex items-center gap-3">
                <TbMusic className="w-8 h-8 text-sky-500" />
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                  Music Modes
                </h1>
              </div>
              <TonicSelector activeTonic={tonic} onTonicChange={setTonic} />
            </div>

            {/* Row 2: Mode Selector */}
            <div className="w-full">
              <ModeSelector
                activeMode={activeMode}
                tonic={tonic}
                onModeChange={handleModeChange}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <div className="h-[160px] sm:h-[200px]">
          {viewMode === 'piano' ? (
            <Piano
              mode={activeMode}
              tonic={tonic}
              scaleNotes={scaleNotes}
              animationTriggers={animationTriggers}
              onNoteClick={handleSingleNotePlay}
            />
          ) : (
            <DistanceView
              mode={activeMode}
              tonic={tonic}
              scaleNotes={scaleNotes}
              animationTriggers={animationTriggers}
              onNoteClick={handleSingleNotePlay}
            />
          )}
        </div>

        <ViewModeSwitcher currentView={viewMode} onViewChange={setViewMode} />

        <div className="mt-4">
          <ModeInfo
            mode={activeMode}
            tonic={tonic}
            onNotesAnimate={onNotesAnimate}
            animatingChordIndices={animatingChordIndices}
            onChordPlay={handleChordPlay}
            onSelectMode={handleSelectMode}
          />
        </div>
      </main>
      <KeyboardShortcutsGuide />
    </div>
  )
}

export default App
