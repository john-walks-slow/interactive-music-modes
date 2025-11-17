export type IntervalQuality = 'P' | 'M' | 'm' | 'A' | 'd';
export type IntervalNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Interval {
  quality: IntervalQuality;
  number: IntervalNumber;
}

export interface Derivation {
  parent: string; // The key/name of the parent scale
  name: string; // The display name of the parent scale category (e.g., "Major Scale")
}

export interface Mode {
  name: string;
  formula: string;
  description: string;
  characteristic: string;
  intervals: Interval[];
  category: string;
  derivation?: Derivation;
  characteristicIntervals?: IntervalNumber[];
}

export interface Note {
  name:string;
  isBlack: boolean;
  semitone: number;
}

export type ViewMode = 'piano' | 'distance';

export type ChordType = 'triad' | 'seventh';

export interface Chord {
  name: string;
  romanNumeral: string;
  quality: string;
  notes: Note[];
}
