import React, { useState, useEffect, useRef } from 'react'
import { MODES, UI_GROUPS } from '../constants/music'
import { FiChevronDown } from 'react-icons/fi'
import { getRelativeModeAndTonic } from '../utils/musicTheory'
import { Mode, Note } from '../types'

interface ModeSelectorProps {
  activeMode: Mode
  tonic: Note
  onModeChange: (modeIndex: number, newTonic?: Note) => void
}

const ModeSelector: React.FC<ModeSelectorProps> = ({
  activeMode,
  tonic,
  onModeChange,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSelect = (
    targetModeName: string,
    event?: React.MouseEvent<HTMLElement>
  ) => {
    if (event?.shiftKey) {
      const result = getRelativeModeAndTonic(activeMode, tonic, targetModeName)
      if (result) {
        const { newMode, newTonic } = result
        const newModeIndex = MODES.findIndex((m) => m.name === newMode.name)
        if (newModeIndex !== -1) {
          onModeChange(newModeIndex, newTonic)
          setOpenDropdown(null)
          return
        }
      }
    }

    const globalIndex = MODES.findIndex((m) => m.name === targetModeName)
    if (globalIndex !== -1) {
      onModeChange(globalIndex)
    }
    setOpenDropdown(null)
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const activeModeName = activeMode.name

  return (
    <div
      className="flex flex-wrap justify-center gap-2 md:gap-3"
      ref={dropdownRef}
    >
      {UI_GROUPS.map((group) => {
        const hasVariants = group.variants.length > 0
        const isGroupActive =
          group.name === activeModeName ||
          group.variants.includes(activeModeName)

        if (!hasVariants) {
          return (
            <button
              key={group.name}
              onClick={(e) => handleSelect(group.name, e)}
              className={`px-3 sm:px-4 py-2 text-sm md:text-base font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${
                isGroupActive
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {group.name}
            </button>
          )
        }

        // Button with Dropdown
        const buttonLabel = isGroupActive ? activeModeName : group.name
        const dropdownOptions = [group.name, ...group.variants]

        return (
          <div key={group.name} className="relative inline-block text-left">
            <div className="flex rounded-full border border-gray-300 bg-white">
              <button
                onClick={(e) => handleSelect(buttonLabel, e)}
                className={`pl-3 sm:pl-4 pr-3 py-2 text-sm md:text-base font-semibold transition-colors duration-300 rounded-l-full focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-1 focus:ring-sky-500 ${
                  isGroupActive
                    ? 'bg-sky-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {buttonLabel}
              </button>

              <button
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === group.name ? null : group.name
                  )
                }
                className={`px-2 py-2 rounded-r-full transition-colors duration-300 border-l border-gray-300 focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-1 focus:ring-sky-500 ${
                  isGroupActive
                    ? 'bg-sky-500 hover:bg-sky-600'
                    : 'hover:bg-gray-100'
                }`}
                aria-haspopup="true"
                aria-expanded={openDropdown === group.name}
              >
                <FiChevronDown
                  className={`w-5 h-5 transition-transform duration-200 ${
                    openDropdown === group.name ? 'rotate-180' : ''
                  } ${isGroupActive ? 'text-white' : 'text-gray-500'}`}
                />
              </button>
            </div>
            {openDropdown === group.name && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {dropdownOptions.map((variantName) => (
                    <a
                      key={variantName}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        handleSelect(variantName, e)
                      }}
                      className={`block px-4 py-2 text-sm ${
                        activeModeName === variantName
                          ? 'font-semibold text-sky-600 bg-sky-50'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      role="menuitem"
                    >
                      {variantName}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ModeSelector
