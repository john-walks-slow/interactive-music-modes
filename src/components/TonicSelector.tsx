import React, { useState, useEffect, useRef } from 'react'
import { Note } from '../types'
import { COMMON_TONICS } from '../constants/music'
import { FiChevronDown } from 'react-icons/fi'

/**
 * TonicSelector 组件的 props 定义。
 * @property activeTonic - 当前激活的根音。
 * @property onTonicChange - 当选择新根音时触发的回调函数。
 */
interface TonicSelectorProps {
  activeTonic: Note
  onTonicChange: (note: Note) => void
}

/**
 * 一个下拉菜单组件，用于选择音阶的根音。
 */
const TonicSelector: React.FC<TonicSelectorProps> = ({
  activeTonic,
  onTonicChange,
}) => {
  /** 控制下拉菜单是否打开的状态 */
  const [isOpen, setIsOpen] = useState(false)
  /** 引用下拉菜单的 DOM 元素，用于检测外部点击 */
  const dropdownRef = useRef<HTMLDivElement>(null)

  /**
   * 处理用户选择新根音的操作。
   * @param note - 被选中的音符对象。
   */
  const handleSelect = (note: Note) => {
    onTonicChange(note)
    setIsOpen(false)
  }

  // Effect：添加全局点击事件监听器，以在点击外部时关闭下拉菜单。
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center w-full rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm md:text-base font-semibold text-sky-600 hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <span className="mr-2 text-sky-700">Tonic:</span>
          <span className="font-bold">{activeTonic.name}</span>
          <FiChevronDown
            className={`-mr-1 ml-2 h-5 w-5 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
          <div
            className="py-1 max-h-60 overflow-y-auto"
            role="menu"
            aria-orientation="vertical"
          >
            {COMMON_TONICS.map((note) => {
              const isActive = note.semitone === activeTonic.semitone
              return (
                <a
                  key={note.name}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handleSelect(note)
                  }}
                  className={`block px-4 py-2 text-sm ${
                    isActive
                      ? 'font-semibold text-sky-600 bg-sky-50'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  role="menuitem"
                >
                  {note.name}
                </a>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default TonicSelector
