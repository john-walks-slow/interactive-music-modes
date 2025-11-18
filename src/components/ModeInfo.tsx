import React, { useState } from 'react'
import { Mode, Note } from '../types'
import IntervalDetail from './IntervalDetail'
import { playScale } from '../utils/audio'
import { FaPlay } from 'react-icons/fa'
import RelativeScaleInfo from './RelativeScaleInfo'
import DiatonicChords from './DiatonicChords'
import { getScaleNotesWithAbsoluteSemitones } from '../utils/musicTheory'

/**
 * ModeInfo 组件的 props 定义。
 * @property mode - 当前显示的调式。
 * @property tonic - 当前的根音。
 * @property onNotesAnimate - 触发音符动画的回调。
 * @property animatingChordIndices - 正在播放动画的和弦索引 Map。
 * @property onChordPlay - 触发和弦播放的回调。
 * @property onSelectMode - 从提示信息跳转到其他调式的回调。
 */
interface ModeInfoProps {
  mode: Mode
  tonic: Note
  onNotesAnimate: (notes: Note[]) => void
  animatingChordIndices: Map<number, string>
  onChordPlay: (degree: number) => void
  onSelectMode: (modeName: string, tonicName: string) => void
}

/**
 * 一个容器组件，用于展示当前选定调式的详细信息。
 * 包括：
 * - 调式名称、描述和音阶播放按钮。
 * - 关系大小调的提示信息。
 * - 与父级音阶的音程对比分析。
 * - 该调式的顺阶和弦列表。
 */
const ModeInfo: React.FC<ModeInfoProps> = ({
  mode,
  tonic,
  onNotesAnimate,
  animatingChordIndices,
  onChordPlay,
  onSelectMode,
}) => {
  /** 控制播放按钮的状态，防止重复点击 */
  const [isPlaying, setIsPlaying] = useState(false)

  /**
   * 处理音阶播放按钮的点击事件。
   * 它会计算完整的音阶（包含八度音），然后调用音频工具函数来播放，
   * 并在播放期间禁用按钮。
   */
  const handlePlayScale = () => {
    if (isPlaying) return

    const scaleNotes = getScaleNotesWithAbsoluteSemitones(mode, tonic)
    if (scaleNotes.length < 7) return

    // 为播放添加八度音，使音阶听起来更完整
    const octaveNote: Note = {
      ...tonic,
      semitone: tonic.semitone + 12,
      name: tonic.name,
    }
    const finalNotesToPlay = [...scaleNotes, octaveNote]

    setIsPlaying(true)
    const durationMs = playScale(finalNotesToPlay, onNotesAnimate) * 1000

    setTimeout(() => {
      setIsPlaying(false)
    }, durationMs)
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      {/* Top section for name and description */}
      <div className="flex justify-between items-start gap-5">
        <div className="flex-grow">
          <div className="min-h-[2.25rem]">
            <h2
              key={mode.name}
              className="animate-fade-in-up text-xl sm:text-2xl font-bold text-gray-800"
            >
              {mode.name}
            </h2>
          </div>
          <div className="min-h-[3rem] md:min-h-[1.5rem] mt-1">
            <p
              key={mode.description}
              className="animate-fade-in-up text-gray-600"
            >
              {mode.description}
            </p>
          </div>
        </div>
        <button
          onClick={handlePlayScale}
          disabled={isPlaying}
          className="flex-shrink-0 mt-1 flex items-center justify-center w-10 h-10 rounded-full bg-sky-500 text-white transition-all duration-200 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          aria-label="Play scale"
        >
          <FaPlay className="w-5 h-5 ml-0.5" />
        </button>
      </div>

      <RelativeScaleInfo
        mode={mode}
        tonic={tonic}
        onSelectMode={onSelectMode}
      />

      {/* Interval Analysis section */}
      {mode.derivation && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <IntervalDetail mode={mode} />
        </div>
      )}

      {/* Diatonic Chords section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <DiatonicChords
          mode={mode}
          tonic={tonic}
          onNotesAnimate={onNotesAnimate}
          animatingChordIndices={animatingChordIndices}
          onChordPlay={onChordPlay}
        />
      </div>
    </div>
  )
}

export default ModeInfo
