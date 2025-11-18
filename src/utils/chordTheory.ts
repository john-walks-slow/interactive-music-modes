import { Mode, Note, Chord, ChordType } from '../types'
import { getScaleNotes } from './musicTheory'

/**
 * 构建一个音阶的全音阶和弦。
 * @param mode - 当前调式。
 * @param tonic - 根音。
 * @param type - 和弦类型 ('triad' 或 'seventh')。
 * @returns 一个包含7个和弦对象的数组。
 */
export const getDiatonicChords = (
  mode: Mode,
  tonic: Note,
  type: ChordType
): Chord[] => {
  const scaleNotes = getScaleNotes(mode, tonic)
  const chords: Chord[] = []

  for (let i = 0; i < 7; i++) {
    const rootNote = scaleNotes[i]
    const thirdNote = scaleNotes[(i + 2) % 7]
    const fifthNote = scaleNotes[(i + 4) % 7]
    const seventhNote = type === 'seventh' ? scaleNotes[(i + 6) % 7] : null

    if (
      !rootNote ||
      !thirdNote ||
      !fifthNote ||
      (type === 'seventh' && !seventhNote)
    ) {
      // 如果音阶中的某个音符无法解析，则跳过
      chords.push({
        name: '?',
        romanNumeral: '?',
        quality: 'Unknown',
        notes: [],
      })
      continue
    }

    const chordNotes = [rootNote, thirdNote, fifthNote]
    if (seventhNote) {
      chordNotes.push(seventhNote)
    }

    const { quality, name, romanNumeral } = determineChordQuality(
      i,
      rootNote,
      thirdNote,
      fifthNote,
      seventhNote
    )

    chords.push({
      name,
      romanNumeral,
      quality,
      notes: chordNotes as Note[],
    })
  }

  return chords
}

/**
 * 通过分析其音程来确定和弦的质量、名称和罗马数字。
 * @param degree - 音阶的度数 (0-6)。
 * @param root - 和弦的根音。
 * @param third - 和弦的三音。
 * @param fifth - 和弦的五音。
 * @param seventh - 和弦的七音 (可选)。
 * @returns 包含质量、名称和罗马数字的对象。
 */
const determineChordQuality = (
  degree: number,
  root: Note,
  third: Note,
  fifth: Note,
  seventh: Note | null
) => {
  const intervalToThird = (third.semitone - root.semitone + 12) % 12
  const intervalToFifth = (fifth.semitone - root.semitone + 12) % 12
  const intervalToSeventh = seventh
    ? (seventh.semitone - root.semitone + 12) % 12
    : -1

  let quality = ''
  let triadQuality: 'Major' | 'minor' | 'diminished' | 'augmented' = 'Major'

  // 确定三和弦质量
  if (intervalToThird === 4 && intervalToFifth === 7) triadQuality = 'Major'
  else if (intervalToThird === 3 && intervalToFifth === 7)
    triadQuality = 'minor'
  else if (intervalToThird === 3 && intervalToFifth === 6)
    triadQuality = 'diminished'
  else if (intervalToThird === 4 && intervalToFifth === 8)
    triadQuality = 'augmented'

  let roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][degree]
  let nameSuffix = ''

  if (seventh) {
    // 七和弦
    if (triadQuality === 'Major' && intervalToSeventh === 11) {
      quality = 'Major Seventh'
      nameSuffix = 'maj7'
      roman += 'maj7'
    } else if (triadQuality === 'Major' && intervalToSeventh === 10) {
      quality = 'Dominant Seventh'
      nameSuffix = '7'
      roman += '7'
    } else if (triadQuality === 'minor' && intervalToSeventh === 10) {
      quality = 'minor Seventh'
      nameSuffix = 'm7'
      roman = roman.toLowerCase() + '7'
    } else if (triadQuality === 'diminished' && intervalToSeventh === 10) {
      quality = 'Half-Diminished'
      nameSuffix = 'm7b5'
      roman = roman.toLowerCase() + 'ø7'
    } else if (triadQuality === 'diminished' && intervalToSeventh === 9) {
      quality = 'Diminished Seventh'
      nameSuffix = 'dim7'
      roman = roman.toLowerCase() + '°7'
    } else {
      quality = 'Seventh Chord'
      nameSuffix = '7'
    } // Fallback
  } else {
    // 三和弦
    quality = triadQuality
    if (quality === 'minor') {
      roman = roman.toLowerCase()
      nameSuffix = 'm'
    } else if (quality === 'diminished') {
      roman = roman.toLowerCase() + '°'
      nameSuffix = 'dim'
    } else if (quality === 'augmented') {
      roman += '+'
      nameSuffix = 'aug'
    }
  }

  return { quality, name: `${root.name}${nameSuffix}`, romanNumeral: roman }
}
