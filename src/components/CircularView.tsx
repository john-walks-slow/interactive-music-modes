import React, { useState, useEffect, useMemo } from 'react'
import { Mode, Note } from '../types'
import { COMMON_TONICS } from '../constants/music'
import { getIntervalSemitone } from '../utils/musicTheory'

// --- Constants & Helper Styles ---
const GLIDE_TRANSITION_STYLE =
  'transition-transform duration-[1000ms] ease-[cubic-bezier(0.25,1,0.5,1)]'
const CONTAINER_SIZE = 320
const BASE_RADIUS = 90 // Radius for the stationary notes (outer ring)
const LENS_RADIUS = 135 // Radius for the rotating scale degrees (inner ring)
const RING_RADIUS = 135 // Radius for the rotating scale degrees (inner ring)
const DEGREE_NODE_SIZE = 30 // Size for the inner degree nodes

// Helper function to find the shortest rotational path
const getShortestRotation = (currentDeg: number, targetDeg: number): number => {
  const normalizedCurrent = ((currentDeg % 360) + 360) % 360
  const normalizedTarget = ((targetDeg % 360) + 360) % 360

  let diff = normalizedTarget - normalizedCurrent

  if (diff > 180) {
    diff -= 360
  } else if (diff < -180) {
    diff += 360
  }
  return currentDeg + diff
}

interface CircularViewProps {
  mode: Mode
  tonic: Note
  scaleNotes: Note[]
  animationTriggers: Map<number, string>
  onNoteClick: (note: Note) => void
}

/**
 * The inner, rotating 'lens' that shows the scale degrees (intervals).
 */
const ScaleDegreeLens: React.FC<{
  mode: Mode
  tonic: Note
  scaleNotes: Note[]
  onNoteClick: (note: Note) => void
  animationTriggers: Map<number, string>
}> = ({ mode, tonic, scaleNotes, onNoteClick, animationTriggers }) => {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    // Rotation logic to align the inner '1' degree with the outer tonic note
    const tonicAngleRaw = (tonic.semitone / 12) * 360

    // The target rotation is the amount needed to match the tonic's position on the outer ring.
    // Outer ring C (semitone 0) is at -90 deg. Inner '1' is at 0 deg.
    // To align: rotation = outer_angle - inner_angle = outer_angle - 0
    // The correct angle for the outer ring's tonic note is tonicAngleRaw - 90.
    const targetRotation = tonicAngleRaw

    setRotation((prevRotation) =>
      getShortestRotation(prevRotation, targetRotation)
    )
  }, [tonic])

  const noteMap = useMemo(
    () => new Map(scaleNotes.map((n) => [n.semitone % 12, n])),
    [scaleNotes]
  )

  return (
    // The 'Lens' Container - Glides Smoothly via rotation
    <div
      className={`absolute w-full h-full ${GLIDE_TRANSITION_STYLE}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {mode.intervals.map((interval, i) => {
        const semitoneOffset = getIntervalSemitone(interval)
        if (semitoneOffset === -1) return null

        const absoluteSemitone = (tonic.semitone + semitoneOffset) % 12
        const note = noteMap.get(absoluteSemitone)
        if (!note) return null

        // Angle for the degree's position: 0 degrees is the top/12 o'clock.
        const angle = (semitoneOffset / 12) * 360

        return (
          // Individual Degree Element Container

          <div
            key={i}
            className="absolute top-1/2 left-1/2 cursor-pointer transition-all duration-300"
            style={{
              transform: `rotate(${angle}deg) translateY(-${LENS_RADIUS}px) rotate(${-angle}deg)`,
            }}
            onClick={() => onNoteClick(note)}
          >
            <div
              style={{
                marginLeft: `-${DEGREE_NODE_SIZE / 2}px`,
                marginTop: `-${DEGREE_NODE_SIZE / 2}px`,
                width: `${DEGREE_NODE_SIZE}px`,
                height: `${DEGREE_NODE_SIZE}px`,
              }}
            >
              <div
                className={`w-full h-full bg-white rounded-full
                            flex items-center justify-center text-sky-600 
                            border-2 border-sky-100
                            hover:scale-110 transition-transform duration-200 `}
                // bg-sky-200 shadow-lg shadow-sky-200/30 border border-sky-100
                style={{
                  // Counter-rotate the text to keep it level on the screen.
                  transform: `rotate(${-rotation}deg)`,
                }}
              >
                {/* ******* UPDATE: Use interval quality and number (e.g., 'P1', 'm3') ******* */}
                <span className="text-xs font-bold">
                  {`${interval.quality}${interval.number}`}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const CircularView: React.FC<CircularViewProps> = ({
  mode,
  tonic,
  scaleNotes,
  animationTriggers,
  onNoteClick,
}) => {
  const noteSemitones = useMemo(
    () => new Set(scaleNotes.map((n) => n.semitone % 12)),
    [scaleNotes]
  )

  return (
    <div
      className="relative items-center justify-center text-gray-800 rounded-xl mt-2"
      style={{
        width: CONTAINER_SIZE,
        height: CONTAINER_SIZE,
      }}
    >
      {/* Center Ring (Visual only) */}
      <div
        className="absolute top-1/2 left-1/2 border border-gray-200 rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          width: `${RING_RADIUS * 2}px`,
          height: `${RING_RADIUS * 2}px`,
        }}
      ></div>

      {/* The Rotating Scale Degree 'Lens' */}
      <ScaleDegreeLens
        scaleNotes={scaleNotes}
        mode={mode}
        tonic={tonic}
        onNoteClick={onNoteClick}
        animationTriggers={animationTriggers}
      />

      {/* Base Note Ring (Static Outer Ring) */}
      {COMMON_TONICS.map((note) => {
        // Outer ring positioning: C (semitone 0) is at 12 o'clock (-PI/2 rad / -90 deg).
        const angle = (note.semitone / 12) * 2 * Math.PI - Math.PI / 2
        const x = BASE_RADIUS * Math.cos(angle)
        const y = BASE_RADIUS * Math.sin(angle)

        const isScaleNote = noteSemitones.has(note.semitone % 12)
        const isTonic = note.semitone === tonic.semitone
        const animationName = animationTriggers.get(note.semitone)

        return (
          <div
            key={`base-${note.semitone}`}
            className="absolute top-1/2 left-1/2 flex items-center justify-center"
            style={{
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
            }}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                           transition-all duration-300 hover:scale-110 cursor-pointer 
                           ${
                             isTonic
                               ? 'bg-sky-100 text-sky-600 border-2 border-sky-400 shadow-md'
                               : isScaleNote
                                 ? 'bg-gray-200/80 text-gray-700'
                                 : 'bg-transparent text-gray-400'
                           }`}
              style={{
                animation: animationName
                  ? `${animationName} 0.4s ease-out`
                  : 'none',
              }}
              onClick={() => onNoteClick(note)}
            >
              {note.name}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CircularView
