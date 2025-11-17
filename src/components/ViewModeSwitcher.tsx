import React from 'react'
import { ViewMode } from '../types'
import { TbPiano, TbRulerMeasure } from 'react-icons/tb'

interface ViewModeSwitcherProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
}

const ViewModeSwitcher: React.FC<ViewModeSwitcherProps> = ({
  currentView,
  onViewChange,
}) => {
  const baseClasses =
    'px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:z-10 focus:ring-2 focus:ring-sky-500 flex items-center gap-2'
  const activeClasses = 'bg-sky-50 text-sky-700'
  const inactiveClasses = 'bg-white text-gray-500 hover:bg-gray-50'

  return (
    <div className="flex justify-center mt-3">
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          onClick={() => onViewChange('piano')}
          className={`${baseClasses} rounded-l-lg border border-gray-200 ${currentView === 'piano' ? activeClasses : inactiveClasses}`}
        >
          <TbPiano className="w-5 h-5" />
          Piano
        </button>
        <button
          type="button"
          onClick={() => onViewChange('distance')}
          className={`${baseClasses} rounded-r-md border-t border-b border-r border-gray-200 ${currentView === 'distance' ? activeClasses : inactiveClasses}`}
        >
          <TbRulerMeasure className="w-5 h-5" />
          Interval
        </button>
      </div>
    </div>
  )
}

export default ViewModeSwitcher
