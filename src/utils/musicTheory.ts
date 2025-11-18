import { Mode, Note } from '../types'
import {
  C4_FREQUENCY,
  COMMON_TONICS,
  ENHARMONIC_NOTES,
  getIntervalSemitone,
  MODES,
} from '../constants/music'

/**
 * 根据音符的半音数计算其频率。
 * 在此应用中，所有音符都在第四个八度内播放。
 * @param semitone - 从 C (C=0, C#=1) 开始的绝对半音数。
 * @returns 频率 (Hz)。
 */
export const getFrequencyFromSemitone = (semitone: number): number => {
  // 频率公式: F = F_base * 2^(n/12)，其中 n 是半音数差。
  return C4_FREQUENCY * Math.pow(2, semitone / 12)
}

/** 定义了标准的自然音阶字母顺序。 */
const DIATONIC_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

/**
 * 计算给定调式音阶的七个音符，确保使用理论上正确的音名。
 *
 * 核心原则是，一个全音阶的每个音级（degree）都应该对应一个唯一的字母（A-G）。
 * 此函数通过查找与目标半音数和目标音级字母都匹配的音符名称来实现这一点。
 *
 * @param mode - 音乐调式 (例如 Ionian, Dorian)。
 * @param tonic - 音阶的起始音。
 * @returns 一个包含七个 Note 对象的数组，代表该音阶。如果任何音符无法解析，则对应位置为 null。
 */
export const getScaleNotes = (mode: Mode, tonic: Note): (Note | null)[] => {
  const tonicLetter = tonic.name.charAt(0).toUpperCase()
  const tonicLetterIndex = DIATONIC_LETTERS.indexOf(tonicLetter)

  if (tonicLetterIndex === -1) {
    console.error('无效的根音:', tonic)
    return Array(7).fill(null)
  }

  return mode.intervals.map((interval, i) => {
    // 1. 计算当前音级的目标绝对半音值 (0-11)。
    const targetSemitone = (tonic.semitone + getIntervalSemitone(interval)) % 12

    // 2. 确定该音级的预期字母 (例如 G 大调的第三个音应该是 'B')。
    const targetLetter = DIATONIC_LETTERS[(tonicLetterIndex + i) % 7]

    // 3. 从 ENHARMONIC_NOTES 中查找所有可能的拼写。
    const candidates = ENHARMONIC_NOTES[targetSemitone]
    if (!candidates) return null

    // 4. 找到与目标字母匹配的正确拼写 (例如 B vs B# vs Bb)。
    const correctName = candidates.names.find(
      (name) => name.charAt(0).toUpperCase() === targetLetter
    )

    if (!correctName) return null

    return {
      name: correctName,
      isBlack: candidates.isBlack,
      semitone: targetSemitone, // 注意：这里是相对半音 (0-11)
    }
  })
}

/** 将大调的调式名称映射到其相对于主音阶 (Ionian) 的半音偏移量。 */
const MODE_OFFSETS: Record<string, number> = {
  Ionian: 0,
  Dorian: 2,
  Phrygian: 4,
  Lydian: 5,
  Mixolydian: 7,
  Aeolian: 9,
  Locrian: 11,
}

/**
 * 计算从当前调式和根音跳转到另一个关系调式时，新的调式和根音应该是什么。
 * (目前仅支持大调音阶内的调式)
 *
 * @param currentMode - 当前的调式。
 * @param currentTonic - 当前的根音。
 * @param targetModeName - 目标调式的名称。
 * @returns 返回一个包含 { newMode, newTonic } 的对象，如果无法计算则返回 null。
 */
export const getRelativeModeAndTonic = (
  currentMode: Mode,
  currentTonic: Note,
  targetModeName: string
): { newMode: Mode; newTonic: Note } | null => {
  const currentModeOffset = MODE_OFFSETS[currentMode.name]
  const targetModeOffset = MODE_OFFSETS[targetModeName]

  // 该逻辑目前仅适用于大调的七个调式。
  if (currentModeOffset === undefined || targetModeOffset === undefined) {
    return null
  }

  // 1. 找到当前音阶所属的父级 Ionian (大调) 音阶的根音。
  const parentIonianTonicSemitone =
    (currentTonic.semitone - currentModeOffset + 12) % 12

  // 2. 根据目标调式的偏移量，计算出新调式的根音。
  const newTonicSemitone = (parentIonianTonicSemitone + targetModeOffset) % 12

  const newTonic = COMMON_TONICS.find((n) => n.semitone === newTonicSemitone)
  const newMode = MODES.find((m) => m.name === targetModeName)

  if (!newTonic || !newMode) {
    return null
  }

  return { newMode, newTonic }
}

/**
 * 计算给定调式从指定根音开始的七个音符，并为每个音符赋予绝对且递增的半音值。
 *
 * `getScaleNotes` 返回的是理论上正确的音名和相对半音 (0-11)，
 * 而这个函数则将这些相对半音转换成绝对半音 (例如，根音是 D(2)，那么音阶的第五个音 A 的半音值将是 2 + 7 = 9，而不是单纯的 9 % 12)。
 * 这对于音频播放和区分不同八度的音符（虽然此应用简化了八度）至关重要。
 *
 * @param mode - 音乐调式 (例如 Ionian, Dorian)。
 * @param tonic - 音阶的起始音。
 * @returns 一个包含七个 Note 对象的数组，每个对象都有唯一的、绝对的半音值。
 */
export const getScaleNotesWithAbsoluteSemitones = (
  mode: Mode,
  tonic: Note
): Note[] => {
  // 首先获取理论正确的音名
  const namedNotes = getScaleNotes(mode, tonic)

  return mode.intervals
    .map((interval, i) => {
      const noteInfo = namedNotes[i]
      if (!noteInfo) return null

      const intervalSemitones = getIntervalSemitone(interval)
      if (intervalSemitones === -1) return null

      // 基于根音的半音值和音程的半音数，计算出绝对半音值
      return {
        ...noteInfo,
        semitone: tonic.semitone + intervalSemitones,
      }
    })
    .filter((note): note is Note => note !== null)
}
