import React from 'react'
import { Mode, Note } from '../types'
import { getRelativeModeAndTonic } from '../utils/musicTheory'
import { TbBulb } from 'react-icons/tb'

interface RelativeScaleInfoProps {
  mode: Mode
  tonic: Note
  onSelectMode: (modeName: string, tonicName: string) => void
}

const RelativeScaleInfo: React.FC<RelativeScaleInfoProps> = ({
  mode,
  tonic,
  onSelectMode,
}) => {
  // 确定目标关系调式名称
  const targetModeName = mode.name === 'Ionian' ? 'Aeolian' : 'Ionian'
  const result = getRelativeModeAndTonic(mode, tonic, targetModeName)

  // 如果无法计算关系调式 (例如非大调音阶调式)，则不渲染组件
  if (!result) {
    return null
  }
  const { newMode: relativeMode, newTonic: relativeTonic } = result

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
