
import { Mode, Note, Interval } from '../types';

export const SCALES: { [key: string]: Mode } = {
  // Major Scale Modes
  'Ionian': {
    name: 'Ionian',
    formula: 'W-W-H-W-W-W-H',
    description: 'The standard major scale. Bright, happy, and conclusive.',
    characteristic: 'Major 3rd, Major 7th',
    intervals: [
      { number: 1, quality: 'P' }, { number: 2, quality: 'M' }, { number: 3, quality: 'M' },
      { number: 4, quality: 'P' }, { number: 5, quality: 'P' }, { number: 6, quality: 'M' }, { number: 7, quality: 'M' },
    ],
    category: 'Major Scale Modes',
    derivation: { parent: 'Ionian', name: 'Major Scale' },
    characteristicIntervals: [],
  },
  'Dorian': {
    name: 'Dorian',
    formula: 'W-H-W-W-W-H-W',
    description: 'A minor scale with a major 6th. Jazzy, melancholic, yet hopeful.',
    characteristic: 'Minor 3rd, Major 6th',
    intervals: [
      { number: 1, quality: 'P' }, { number: 2, quality: 'M' }, { number: 3, quality: 'm' },
      { number: 4, quality: 'P' }, { number: 5, quality: 'P' }, { number: 6, quality: 'M' }, { number: 7, quality: 'm' },
    ],
    category: 'Major Scale Modes',
    derivation: { parent: 'Aeolian', name: 'Natural Minor' },
    characteristicIntervals: [6],
  },
  'Phrygian': {
    name: 'Phrygian',
    formula: 'H-W-W-W-H-W-W',
    description: 'A minor scale with a minor 2nd. Dark, Spanish, and dramatic.',
    characteristic: 'Minor 2nd',
    intervals: [
      { number: 1, quality: 'P' }, { number: 2, quality: 'm' }, { number: 3, quality: 'm' },
      { number: 4, quality: 'P' }, { number: 5, quality: 'P' }, { number: 6, quality: 'm' }, { number: 7, quality: 'm' },
    ],
    category: 'Major Scale Modes',
    derivation: { parent: 'Aeolian', name: 'Natural Minor' },
    characteristicIntervals: [2],
  },
  'Lydian': {
    name: 'Lydian',
    formula: 'W-W-W-H-W-W-H',
    description: 'A major scale with a raised 4th. Dreamy, magical, and ethereal.',
    characteristic: 'Augmented 4th',
    intervals: [
      { number: 1, quality: 'P' }, { number: 2, quality: 'M' }, { number: 3, quality: 'M' },
      { number: 4, quality: 'A' }, { number: 5, quality: 'P' }, { number: 6, quality: 'M' }, { number: 7, quality: 'M' },
    ],
    category: 'Major Scale Modes',
    derivation: { parent: 'Ionian', name: 'Major Scale' },
    characteristicIntervals: [4],
  },
  'Mixolydian': {
    name: 'Mixolydian',
    formula: 'W-W-H-W-W-H-W',
    description: 'A major scale with a minor 7th. Bluesy, rock-oriented, and dominant.',
    characteristic: 'Minor 7th',
    intervals: [
      { number: 1, quality: 'P' }, { number: 2, quality: 'M' }, { number: 3, quality: 'M' },
      { number: 4, quality: 'P' }, { number: 5, quality: 'P' }, { number: 6, quality: 'M' }, { number: 7, quality: 'm' },
    ],
    category: 'Major Scale Modes',
    derivation: { parent: 'Ionian', name: 'Major Scale' },
    characteristicIntervals: [7],
  },
  'Aeolian': {
    name: 'Aeolian',
    formula: 'W-H-W-W-H-W-W',
    description: 'The natural minor scale. Sad, emotional, and serious.',
    characteristic: 'Minor 3rd, Minor 6th, Minor 7th',
    intervals: [
      { number: 1, quality: 'P' }, { number: 2, quality: 'M' }, { number: 3, quality: 'm' },
      { number: 4, quality: 'P' }, { number: 5, quality: 'P' }, { number: 6, quality: 'm' }, { number: 7, quality: 'm' },
    ],
    category: 'Major Scale Modes',
    derivation: { parent: 'Aeolian', name: 'Natural Minor' },
    characteristicIntervals: [],
  },
  'Locrian': {
    name: 'Locrian',
    formula: 'H-W-W-H-W-W-W',
    description: 'A diminished scale with a minor 2nd. Tense, unstable, and unresolved.',
    characteristic: 'Diminished 5th',
    intervals: [
      { number: 1, quality: 'P' }, { number: 2, quality: 'm' }, { number: 3, quality: 'm' },
      { number: 4, quality: 'P' }, { number: 5, quality: 'd' }, { number: 6, quality: 'm' }, { number: 7, quality: 'm' },
    ],
    category: 'Major Scale Modes',
    derivation: { parent: 'Aeolian', name: 'Natural Minor' },
    characteristicIntervals: [5],
  },
  'Harmonic Minor': {
    name: 'Harmonic Minor',
    formula: 'W-H-W-W-H-WH-H',
    description: 'A minor scale with a raised 7th, creating a strong pull to the tonic.',
    characteristic: 'Major 7th, Augmented 2nd',
    intervals: [
      { number: 1, quality: 'P' }, { number: 2, quality: 'M' }, { number: 3, quality: 'm' },
      { number: 4, quality: 'P' }, { number: 5, quality: 'P' }, { number: 6, quality: 'm' }, { number: 7, quality: 'M' },
    ],
    category: 'Minor Scales',
    derivation: { parent: 'Aeolian', name: 'Natural Minor' },
    characteristicIntervals: [7],
  },
  'Melodic Minor': {
    name: 'Melodic Minor',
    formula: 'W-H-W-W-W-W-H',
    description: 'A minor scale with a raised 6th and 7th (ascending). Often used in jazz.',
    characteristic: 'Major 6th, Major 7th',
    intervals: [
      { number: 1, quality: 'P' }, { number: 2, quality: 'M' }, { number: 3, quality: 'm' },
      { number: 4, quality: 'P' }, { number: 5, quality: 'P' }, { number: 6, quality: 'M' }, { number: 7, quality: 'M' },
    ],
    category: 'Minor Scales',
    derivation: { parent: 'Aeolian', name: 'Natural Minor' },
    characteristicIntervals: [6, 7],
  },
  'Acoustic Scale': {
    name: 'Acoustic Scale',
    formula: 'W-W-W-H-W-H-W',
    description: 'Also known as Lydian Dominant. A bright, bluesy scale with a unique sound.',
    characteristic: 'Augmented 4th, Minor 7th',
    intervals: [
        { number: 1, quality: 'P' }, { number: 2, quality: 'M' }, { number: 3, quality: 'M' },
        { number: 4, quality: 'A' }, { number: 5, quality: 'P' }, { number: 6, quality: 'M' }, { number: 7, quality: 'm' },
    ],
    category: 'Other Scales',
    derivation: { parent: 'Lydian', name: 'Lydian' },
    characteristicIntervals: [7],
  },
};

// The primary list of all modes, used for indexing
export const MODES: Mode[] = Object.values(SCALES);

// Defines the structure of the UI for the mode selector
export const UI_GROUPS = [
  { name: 'Ionian', variants: [] },
  { name: 'Dorian', variants: [] },
  { name: 'Phrygian', variants: [] },
  { name: 'Lydian', variants: ['Acoustic Scale'] },
  { name: 'Mixolydian', variants: [] },
  { name: 'Aeolian', variants: ['Harmonic Minor', 'Melodic Minor'] },
  { name: 'Locrian', variants: [] },
];


export const CHROMATIC_NOTES: Note[] = [
  { name: 'C', isBlack: false, semitone: 0 },
  { name: 'C#', isBlack: true, semitone: 1 },
  { name: 'D', isBlack: false, semitone: 2 },
  { name: 'D#', isBlack: true, semitone: 3 },
  { name: 'E', isBlack: false, semitone: 4 },
  { name: 'F', isBlack: false, semitone: 5 },
  { name: 'F#', isBlack: true, semitone: 6 },
  { name: 'G', isBlack: false, semitone: 7 },
  { name: 'G#', isBlack: true, semitone: 8 },
  { name: 'A', isBlack: false, semitone: 9 },
  { name: 'A#', isBlack: true, semitone: 10 },
  { name: 'B', isBlack: false, semitone: 11 },
];

export const COMMON_TONICS: Note[] = [
  { name: 'C', isBlack: false, semitone: 0 },
  { name: 'Db', isBlack: true, semitone: 1 },
  { name: 'D', isBlack: false, semitone: 2 },
  { name: 'Eb', isBlack: true, semitone: 3 },
  { name: 'E', isBlack: false, semitone: 4 },
  { name: 'F', isBlack: false, semitone: 5 },
  { name: 'F#', isBlack: true, semitone: 6 },
  { name: 'G', isBlack: false, semitone: 7 },
  { name: 'Ab', isBlack: true, semitone: 8 },
  { name: 'A', isBlack: false, semitone: 9 },
  { name: 'Bb', isBlack: true, semitone: 10 },
  { name: 'B', isBlack: false, semitone: 11 },
];

const INTERVAL_SEMITONES: Record<string, number> = {
  'P1': 0, 'm2': 1, 'M2': 2, 'm3': 3, 'M3': 4,
  'P4': 5, 'A4': 6, 'd5': 6, 'P5': 7, 'm6': 8,
  'M6': 9, 'm7': 10, 'M7': 11,
};

export const getIntervalSemitone = (interval: Interval): number => {
  return INTERVAL_SEMITONES[`${interval.quality}${interval.number}`] ?? -1;
};
