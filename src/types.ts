/** 音程的性质，例如：'P' (Perfect), 'M' (Major), 'm' (Minor) */
export type IntervalQuality = 'P' | 'M' | 'm' | 'A' | 'd'

/** 音程的度数，例如：1 (一度), 2 (二度) */
export type IntervalNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7

/**
 * 代表一个音程
 * @property quality - 音程的性质
 * @property number - 音程的度数
 */
export interface Interval {
  quality: IntervalQuality
  number: IntervalNumber
}

/**
 * 描述一个调式是如何从另一个调式派生出来的
 * @property parent - 父级调式的 key (例如 'Aeolian')
 * @property name - 父级调式分类的显示名称 (例如 'Natural Minor')
 */
export interface Derivation {
  parent: string
  name: string
}

/**
 * 代表一个音乐调式 (Mode)
 * @property name - 调式名称 (例如 'Ionian', 'Dorian')
 * @property formula - 音阶公式 (例如 'W-W-H-W-W-W-H')
 * @property description - 调式描述
 * @property characteristic - 调式特点
 * @property intervals - 构成调式的音程数组
 * @property category - 调式分类 (例如 'Major Scale Modes')
 * @property derivation - 派生关系 (可选)
 * @property characteristicIntervals - 特征音程的度数数组 (可选)
 */
export interface Mode {
  name: string
  formula: string
  description: string
  characteristic: string
  intervals: Interval[]
  category: string
  derivation?: Derivation
  characteristicIntervals?: IntervalNumber[]
}

/**
 * 代表一个音符
 * @property name - 音名 (例如 'C', 'F#', 'Db')
 * @property isBlack - 是否为黑键
 * @property semitone - 从 C 开始的半音数 (0-11)
 */
export interface Note {
  name: string
  isBlack: boolean
  semitone: number
}

/** 视图模式：钢琴视图或音程距离视图 */
export type ViewMode = 'piano' | 'distance'

/** 和弦类型：三和弦或七和弦 */
export type ChordType = 'triad' | 'seventh'

/**
 * 代表一个和弦
 * @property name - 和弦名称 (例如 'C Major', 'G7')
 * @property romanNumeral - 罗马数字标记 (例如 'I', 'V7')
 * @property quality - 和弦性质 (例如 'Major', 'Minor', 'Dominant')
 * @property notes - 构成和弦的音符数组
 */
export interface Chord {
  name: string
  romanNumeral: string
  quality: string
  notes: Note[]
}
