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
import IntervalView from './components/IntervalView'
import CircularView from './components/CircularView'
import { TbMusic } from 'react-icons/tb'
import TonicSelector from './components/TonicSelector'
import { playNote } from './utils/audio'
import {
  getFrequencyFromSemitone,
  getScaleNotesWithAbsoluteSemitones,
} from './utils/musicTheory'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import KeyboardShortcutsGuide from './components/KeyboardShortcutsGuide'

/**
 * 音乐调式交互应用的主组件。
 * 管理了应用的核心状态，包括当前调式、根音、视图模式以及动画效果。
 */
const App: React.FC = () => {
  // --- 核心状态 ---
  /** 当前激活的调式在 `MODES` 数组中的索引 */
  const [activeModeIndex, setActiveModeIndex] = useState(0)
  /** 当前视图模式 ('piano' 或 'distance') */
  const [viewMode, setViewMode] = useState<ViewMode>('circular')
  /** 当前根音 */
  const [tonic, setTonic] = useState<Note>(COMMON_TONICS[0])

  // --- 动画状态 ---
  /**
   * 触发单个音符动画的状态。
   * Map<semitone: number, animationName: string>
   * 使用 'note-pop-a' 和 'note-pop-b' 来重复触发动画。
   */
  const [animationTriggers, setAnimationTriggers] = useState(
    new Map<number, string>()
  )
  /**
   * 触发和弦卡片动画的状态。
   * Map<degree: number, animationName: string>
   */
  const [animatingChordIndices, setAnimatingChordIndices] = useState(
    new Map<number, string>()
  )

  /** 用于存储音符动画的 setTimeout ID，以便可以清除它们 */
  const noteAnimationTimeouts = useRef(new Map<number, NodeJS.Timeout>())
  /** 用于存储和弦动画的 setTimeout ID */
  const chordAnimationTimeouts = useRef(new Map<number, NodeJS.Timeout>())

  // --- 派生状态 ---
  /** 当前激活的调式对象 */
  const activeMode = MODES[activeModeIndex]
  /** 根据当前调式和根音计算出的音阶音符数组 (包含绝对半音值) */
  const scaleNotes = useMemo(
    () => getScaleNotesWithAbsoluteSemitones(activeMode, tonic),
    [activeMode, tonic]
  )

  /**
   * 在浏览器绘制前同步清除所有动画状态。
   * 这可以防止在切换调式、根音或视图时出现旧动画状态的闪烁。
   */
  useLayoutEffect(() => {
    setAnimationTriggers(new Map())
    noteAnimationTimeouts.current.forEach((timeout) => clearTimeout(timeout))
    noteAnimationTimeouts.current.clear()
  }, [activeModeIndex, tonic, viewMode])

  /**
   * 触发一个或多个音符的视觉动画。
   * @param notes - 需要播放动画的音符数组。
   */
  const onNotesAnimate = useCallback((notes: Note[]) => {
    const semitonesToAnimate = notes.map((n) => n.semitone)
    const animationDuration = 400 // 动画持续时间 (ms)

    // 触发动画
    setAnimationTriggers((prev) => {
      const next = new Map(prev)
      semitonesToAnimate.forEach((semitone) => {
        // 如果已存在计时器，先清除
        if (noteAnimationTimeouts.current.has(semitone)) {
          clearTimeout(noteAnimationTimeouts.current.get(semitone)!)
        }
        // 通过在两个动画名称之间切换来重复触发 CSS 动画
        const currentName = prev.get(semitone)
        next.set(
          semitone,
          currentName === 'note-pop-a' ? 'note-pop-b' : 'note-pop-a'
        )
      })
      return next
    })

    // 在动画结束后清除状态
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

  /**
   * 处理单个音符的播放和动画。
   * @param note - 被点击或触发的音符。
   */
  const handleSingleNotePlay = (note: Note) => {
    console.debug(`播放音符: ${note.name} (半音: ${note.semitone})`)
    const frequency = getFrequencyFromSemitone(note.semitone)
    playNote(frequency, 0.4)
    onNotesAnimate([note])
  }

  /**
   * 处理和弦的播放（通过快捷键）和卡片动画。
   * @param degree - 和弦的音阶度数 (1-7)。
   */
  const handleChordPlay = useCallback((degree: number) => {
    console.debug(`播放和弦，度数: ${degree}`)
    // 清除之前的动画计时器
    if (chordAnimationTimeouts.current.has(degree)) {
      clearTimeout(chordAnimationTimeouts.current.get(degree)!)
    }

    // 触发动画
    setAnimatingChordIndices((prev) => {
      const next = new Map(prev)
      const currentName = prev.get(degree)
      next.set(
        degree,
        currentName === 'note-pop-a' ? 'note-pop-b' : 'note-pop-a'
      )
      return next
    })

    // 动画结束后移除
    const timeoutId = setTimeout(() => {
      setAnimatingChordIndices((prev) => {
        const next = new Map(prev)
        next.delete(degree)
        return next
      })
      chordAnimationTimeouts.current.delete(degree)
    }, 400) // 动画持续时间

    chordAnimationTimeouts.current.set(degree, timeoutId)
  }, [])

  /**
   * 处理调式变化，由 ModeSelector 调用。
   * @param modeIndex - 新调式的索引。
   * @param newTonic - （可选）关系调式跳转时附带的新根音。
   */
  const handleModeChange = useCallback((modeIndex: number, newTonic?: Note) => {
    console.log(`改变调式: ${MODES[modeIndex].name}`)
    setActiveModeIndex(modeIndex)
    if (newTonic) {
      setTonic(newTonic)
    }
  }, [])

  /**
   * 处理从提示信息中选择并跳转到指定调式和根音。
   * @param modeName - 目标调式名称。
   * @param tonicName - 目标根音名称。
   */
  const handleSelectMode = useCallback(
    (modeName: string, tonicName: string) => {
      console.log(`跳转到模式: ${tonicName} ${modeName}`)
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

  // 注册键盘快捷键
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

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 ">
        <div
          className={`transition-all duration-300 flex justify-center  bg-white border border-gray-200 rounded-lg shadow-sm  ${
            viewMode === 'circular' ? '' : 'h-[160px] sm:h-[200px]'
          }`}
        >
          {viewMode === 'piano' ? (
            <Piano
              mode={activeMode}
              tonic={tonic}
              scaleNotes={scaleNotes}
              animationTriggers={animationTriggers}
              onNoteClick={handleSingleNotePlay}
            />
          ) : viewMode === 'distance' ? (
            <IntervalView
              mode={activeMode}
              tonic={tonic}
              scaleNotes={scaleNotes}
              animationTriggers={animationTriggers}
              onNoteClick={handleSingleNotePlay}
            />
          ) : (
            <CircularView
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
