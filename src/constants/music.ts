import { Mode, Note, Interval } from '../types'

/**
 * `SCALES` 对象储存了所有音乐调式的核心数据。
 * 每个调式都包含其名称、音阶公式、描述、特征、音程、分类等信息。
 * 这是整个应用中关于音乐理论定义的主要数据源。
 */
export const SCALES: { [key: string]: Mode } = {
  // Major Scale Modes
  Ionian: {
    name: 'Ionian',
    formula: 'W-W-H-W-W-W-H',
    description: 'The standard major scale. Bright, happy, and conclusive.',
    characteristic: 'Major 3rd, Major 7th',
    intervals: [
      { number: 1, quality: 'P' },
      { number: 2, quality: 'M' },
      { number: 3, quality: 'M' },
      { number: 4, quality: 'P' },
      { number: 5, quality: 'P' },
      { number: 6, quality: 'M' },
      { number: 7, quality: 'M' },
    ],
    category: 'Major Scale Modes',
    derivation: { parent: 'Aeolian', name: 'Natural Minor' },
    characteristicIntervals: [],
  },
  Dorian: {
    name: 'Dorian',
    formula: 'W-H-W-W-W-H-W',
    description:
      'A minor scale with a major 6th. Jazzy, melancholic, yet hopeful.',
    characteristic: 'Minor 3rd, Major 6th',
    intervals: [
      { number: 1, quality: 'P' },
      { number: 2, quality: 'M' },
      { number: 3, quality: 'm' },
      { number: 4, quality: 'P' },
      { number: 5, quality: 'P' },
      { number: 6, quality: 'M' },
      { number: 7, quality: 'm' },
    ],
    category: 'Major Scale Modes',
    derivation: { parent: 'Aeolian', name: 'Natural Minor' },
    characteristicIntervals: [6],
  },
  Phrygian: {
    name: 'Phrygian',
    formula: 'H-W-W-W-H-W-W',
    description: 'A minor scale with a minor 2nd. Dark, Spanish, and dramatic.',
    characteristic: 'Minor 2nd',
    intervals: [
      { number: 1, quality: 'P' },
      { number: 2, quality: 'm' },
      { number: 3, quality: 'm' },
      { number: 4, quality: 'P' },
      { number: 5, quality: 'P' },
      { number: 6, quality: 'm' },
      { number: 7, quality: 'm' },
    ],
    category: 'Major Scale Modes',
    derivation: { parent: 'Aeolian', name: 'Natural Minor' },
    characteristicIntervals: [2],
  },
  Lydian: {
    name: 'Lydian',
    formula: 'W-W-W-H-W-W-H',
    description:
      'A major scale with a raised 4th. Dreamy, magical, and ethereal.',
    characteristic: 'Augmented 4th',
    intervals: [
      { number: 1, quality: 'P' },
      { number: 2, quality: 'M' },
      { number: 3, quality: 'M' },
      { number: 4, quality: 'A' },
      { number: 5, quality: 'P' },
      { number: 6, quality: 'M' },
      { number: 7, quality: 'M' },
    ],
    category: 'Major Scale Modes',
    derivation: { parent: 'Ionian', name: 'Major Scale' },
    characteristicIntervals: [4],
  },
  Mixolydian: {
    name: 'Mixolydian',
    formula: 'W-W-H-W-W-H-W',
    description:
      'A major scale with a minor 7th. Bluesy, rock-oriented, and dominant.',
    characteristic: 'Minor 7th',
    intervals: [
      { number: 1, quality: 'P' },
      { number: 2, quality: 'M' },
      { number: 3, quality: 'M' },
      { number: 4, quality: 'P' },
      { number: 5, quality: 'P' },
      { number: 6, quality: 'M' },
      { number: 7, quality: 'm' },
    ],
    category: 'Major Scale Modes',
    derivation: { parent: 'Ionian', name: 'Major Scale' },
    characteristicIntervals: [7],
  },
  Aeolian: {
    name: 'Aeolian',
    formula: 'W-H-W-W-H-W-W',
    description: 'The natural minor scale. Sad, emotional, and serious.',
    characteristic: 'Minor 3rd, Minor 6th, Minor 7th',
    intervals: [
      { number: 1, quality: 'P' },
      { number: 2, quality: 'M' },
      { number: 3, quality: 'm' },
      { number: 4, quality: 'P' },
      { number: 5, quality: 'P' },
      { number: 6, quality: 'm' },
      { number: 7, quality: 'm' },
    ],
    category: 'Major Scale Modes',
    derivation: { parent: 'Ionian', name: 'Major Scale' },
    characteristicIntervals: [],
  },
  Locrian: {
    name: 'Locrian',
    formula: 'H-W-W-H-W-W-W',
    description:
      'A diminished scale with a minor 2nd. Tense, unstable, and unresolved.',
    characteristic: 'Diminished 5th',
    intervals: [
      { number: 1, quality: 'P' },
      { number: 2, quality: 'm' },
      { number: 3, quality: 'm' },
      { number: 4, quality: 'P' },
      { number: 5, quality: 'd' },
      { number: 6, quality: 'm' },
      { number: 7, quality: 'm' },
    ],
    category: 'Major Scale Modes',
    derivation: { parent: 'Aeolian', name: 'Natural Minor' },
    characteristicIntervals: [5],
  },
  // Minor Scales
  'Harmonic Minor': {
    name: 'Harmonic Minor',
    formula: 'W-H-W-W-H-WH-H',
    description:
      'A minor scale with a raised 7th, creating a strong pull to the tonic.',
    characteristic: 'Major 7th, Augmented 2nd',
    intervals: [
      { number: 1, quality: 'P' },
      { number: 2, quality: 'M' },
      { number: 3, quality: 'm' },
      { number: 4, quality: 'P' },
      { number: 5, quality: 'P' },
      { number: 6, quality: 'm' },
      { number: 7, quality: 'M' },
    ],
    category: 'Minor Scales',
    derivation: { parent: 'Aeolian', name: 'Natural Minor' },
    characteristicIntervals: [7],
  },
  'Melodic Minor': {
    name: 'Melodic Minor',
    formula: 'W-H-W-W-W-W-H',
    description:
      'A minor scale with a raised 6th and 7th (ascending). Often used in jazz.',
    characteristic: 'Major 6th, Major 7th',
    intervals: [
      { number: 1, quality: 'P' },
      { number: 2, quality: 'M' },
      { number: 3, quality: 'm' },
      { number: 4, quality: 'P' },
      { number: 5, quality: 'P' },
      { number: 6, quality: 'M' },
      { number: 7, quality: 'M' },
    ],
    category: 'Minor Scales',
    derivation: { parent: 'Aeolian', name: 'Natural Minor' },
    characteristicIntervals: [6, 7],
  },
  // Other Scales
  'Acoustic Scale': {
    name: 'Acoustic Scale',
    formula: 'W-W-W-H-W-H-W',
    description:
      'Also known as Lydian Dominant. A bright, bluesy scale with a unique sound.',
    characteristic: 'Augmented 4th, Minor 7th',
    intervals: [
      { number: 1, quality: 'P' },
      { number: 2, quality: 'M' },
      { number: 3, quality: 'M' },
      { number: 4, quality: 'A' },
      { number: 5, quality: 'P' },
      { number: 6, quality: 'M' },
      { number: 7, quality: 'm' },
    ],
    category: 'Other Scales',
    derivation: { parent: 'Lydian', name: 'Lydian' },
    characteristicIntervals: [7],
  },
}

/** `MODES` 是一个由 `SCALES` 对象的值组成的数组，方便按索引访问。 */
export const MODES: Mode[] = Object.values(SCALES)

/**
 * `UI_GROUPS` 定义了调式选择器在界面上的分组结构。
 * 这有助于将相关的调式（如 Aeolian 的变体）组织在一起。
 */
export const UI_GROUPS = [
  { name: 'Ionian', variants: [] },
  { name: 'Dorian', variants: [] },
  { name: 'Phrygian', variants: [] },
  { name: 'Lydian', variants: ['Acoustic Scale'] },
  { name: 'Mixolydian', variants: [] },
  { name: 'Aeolian', variants: ['Harmonic Minor', 'Melodic Minor'] },
  { name: 'Locrian', variants: [] },
]

/**
 * 将 12 个半音（0-11）映射到其所有可能的异名同音（enharmonic）名称。
 * `preferred` 字段指定了在 `COMMON_TONICS` 中使用的最常见的名称。
 */
export const ENHARMONIC_NOTES: Record<
  number,
  { names: string[]; isBlack: boolean; preferred: string }
> = {
  0: { names: ['C', 'B#', 'Dbb'], isBlack: false, preferred: 'C' },
  1: { names: ['C#', 'Db'], isBlack: true, preferred: 'Db' },
  2: { names: ['D', 'C##', 'Ebb'], isBlack: false, preferred: 'D' },
  3: { names: ['D#', 'Eb', 'Fbb'], isBlack: true, preferred: 'Eb' },
  4: { names: ['E', 'D##', 'Fb'], isBlack: false, preferred: 'E' },
  5: { names: ['F', 'E#', 'Gbb'], isBlack: false, preferred: 'F' },
  6: { names: ['F#', 'Gb'], isBlack: true, preferred: 'F#' },
  7: { names: ['G', 'F##', 'Abb'], isBlack: false, preferred: 'G' },
  8: { names: ['G#', 'Ab'], isBlack: true, preferred: 'Ab' },
  9: { names: ['A', 'G##', 'Bbb'], isBlack: false, preferred: 'A' },
  10: { names: ['A#', 'Bb', 'Cbb'], isBlack: true, preferred: 'Bb' },
  11: { names: ['B', 'A##', 'Cb'], isBlack: false, preferred: 'B' },
}

/**
 * `COMMON_TONICS` 是一个常用的根音列表，用于UI选择。
 * 它是通过 `ENHARMONIC_NOTES` 生成的，以确保数据的一致性。
 */
export const COMMON_TONICS: Note[] = Object.entries(ENHARMONIC_NOTES).map(
  ([semitone, { preferred, isBlack }]) => ({
    name: preferred,
    isBlack,
    semitone: parseInt(semitone, 10),
  })
)

/**
 * `INTERVAL_SEMITONES` 将音程的字符串表示（如 'P1', 'm2'）映射到其对应的半音数。
 */
export const INTERVAL_SEMITONES: Record<string, number> = {
  P1: 0,
  m2: 1,
  M2: 2,
  m3: 3,
  M3: 4,
  P4: 5,
  A4: 6,
  d5: 6,
  P5: 7,
  m6: 8,
  M6: 9,
  m7: 10,
  M7: 11,
}

export const C4_FREQUENCY = 261.63
