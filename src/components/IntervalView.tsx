import React, { useState, useEffect, useRef } from 'react'
import { Mode, Note } from '../types'

/**
 * IntervalView 组件的 props 定义。
 * @property mode - 当前调式。
 * @property tonic - 当前根音。
 * @property scaleNotes - 音阶音符数组 (含绝对半音)。
 * @property animationTriggers - 触发音符动画的 Map。
 * @property onNoteClick - 点击音符节点时的回调。
 */
interface IntervalViewProps {
  mode: Mode
  tonic: Note
  scaleNotes: Note[]
  animationTriggers: Map<number, string>
  onNoteClick: (note: Note) => void
}

/**
 * 代表音阶中的一个音级节点。
 * @property label - 显示在圆圈内的音程名称 (如 'M3')。
 * @property degreeText - 显示在下方的音名 (如 'E')。
 * @property onClick - 点击事件回调。
 * @property animationName - CSS 动画名称。
 */
const DegreeNode: React.FC<{
  label: string
  degreeText: string
  onClick?: () => void
  animationName?: string
}> = ({ label, degreeText, onClick, animationName }) => {
  return (
    <div
      className={`relative flex-shrink-0 w-6 h-6 md:w-14 md:h-14 transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
      style={{
        animation: animationName ? `${animationName} 0.4s ease-out` : 'none',
      }}
    >
      <div
        className={`w-full h-full rounded-full bg-sky-200 flex items-center justify-center font-bold text-sky-800 text-[9px] md:text-base border border-sky-300 md:border-2 transition-transform ${
          onClick ? 'active:scale-95' : ''
        }`}
      >
        {label}
      </div>
      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[9px] md:text-xs text-gray-500 font-semibold whitespace-nowrap">
        {degreeText}
      </span>
    </div>
  )
}

/**
 * 代表连接两个音级节点的线，表示它们之间的音程关系 (全音/半音)。
 * @property step - 音程步骤 ('W', 'H', 'WH')。
 * @property changeType - 当调式切换时，该音程发生的变化类型 (用于动画效果)。
 * @property isTense - 是否为半音程 (用于特殊高亮)。
 */
const StepConnector: React.FC<{
  step: string
  changeType?: 'increased' | 'decreased'
  isTense?: boolean
}> = ({ step, changeType, isTense = false }) => {
  const getFlexGrow = () => {
    switch (step) {
      case 'W':
        return 2 // 全音
      case 'H':
        return 1 // 半音
      case 'WH':
        return 3 // 增二度
      default:
        return 1
    }
  }

  const flexGrow = getFlexGrow()
  const baseBgColor = isTense ? 'bg-amber-300' : 'bg-sky-100'
  let animationBgColor: string | null = null
  if (changeType === 'increased') {
    animationBgColor = 'bg-green-300' // 音程变大
  } else if (changeType === 'decreased') {
    animationBgColor = 'bg-red-300' // 音程变小
  }
  const bgColor = animationBgColor || baseBgColor

  return (
    <div
      className="flex items-center justify-center h-6 md:h-14 transition-all duration-500 ease-in-out min-w-0"
      style={{ flexGrow }}
    >
      <div className={`w-full h-1 ${bgColor} transition-colors duration-300`} />
    </div>
  )
}

/**
 * “音程距离”视图的主组件。
 * 它通过节点和连接线将音阶的结构（全音和半音的排列）可视化。
 */
const IntervalView: React.FC<IntervalViewProps> = ({
  mode,
  tonic,
  scaleNotes,
  animationTriggers,
  onNoteClick,
}) => {
  /** 存储上一个渲染的调式，用于对比变化 */
  const prevModeRef = useRef<Mode>(mode)
  /** 存储调式切换时发生变化的音程步骤，用于触发动画 */
  const [changedSteps, setChangedSteps] = useState<
    Map<number, 'increased' | 'decreased'>
  >(new Map())

  // Effect：在调式或根音改变时，计算与上一个调式的音程差异，并触发连接线的颜色动画。
  useEffect(() => {
    const prevFormula = prevModeRef.current.formula
    const newStepChanges = new Map<number, 'increased' | 'decreased'>()

    const getStepValue = (step: string): number => {
      if (step === 'H') return 1
      if (step === 'W') return 2
      if (step === 'WH') return 3
      return 0
    }

    const currentSteps = mode.formula.split('-')
    const prevSteps = prevFormula.split('-')
    currentSteps.forEach((step, index) => {
      if (index < prevSteps.length && step !== prevSteps[index]) {
        const currentValue = getStepValue(step)
        const prevValue = getStepValue(prevSteps[index])
        if (currentValue > prevValue) {
          newStepChanges.set(index, 'increased')
        } else if (currentValue < prevValue) {
          newStepChanges.set(index, 'decreased')
        }
      }
    })
    setChangedSteps(newStepChanges)
    prevModeRef.current = mode

    // 动画结束后清除状态
    const timer = setTimeout(() => {
      setChangedSteps(new Map())
    }, 600)

    return () => clearTimeout(timer)
  }, [mode, tonic])

  const steps = mode.formula.split('-')
  const octaveNote: Note = { ...tonic, semitone: tonic.semitone + 12 }

  return (
    <div className="flex items-center justify-center p-6 h-full w-full">
      <div className="flex items-center justify-between w-full">
        {scaleNotes.map((note, index) => {
          if (!note) return null
          const interval = mode.intervals[index]
          const animationName = animationTriggers.get(note.semitone)

          return (
            <React.Fragment key={interval.number}>
              <DegreeNode
                label={`${interval.quality}${interval.number}`}
                degreeText={note.name}
                animationName={animationName}
                onClick={() => onNoteClick(note)}
              />
              {index < steps.length && (
                <StepConnector
                  step={steps[index]}
                  changeType={changedSteps.get(index)}
                  isTense={steps[index] === 'H'}
                />
              )}
            </React.Fragment>
          )
        })}
        {/* Final Root Node (Octave) */}
        <DegreeNode
          label="P8"
          degreeText={tonic.name}
          animationName={animationTriggers.get(octaveNote.semitone)}
          onClick={() => onNoteClick(octaveNote)}
        />
      </div>
    </div>
  )
}

export default IntervalView
