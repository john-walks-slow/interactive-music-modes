
import { Mode, Note } from '../types';
import { getIntervalSemitone } from '../constants/music';

/**
 * 定义了标准的自然音阶字母顺序。
 */
const DIATONIC_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

/**
 * 将 12 个半音（0-11）映射到其可能的异名同音拼写。
 * 这包括常见的拼写以及理论上正确的稀有重升/重降音。
 */
const SEMITONE_TO_NAMES: Record<number, string[]> = {
    0: ['C', 'B#', 'Dbb'],
    1: ['C#', 'Db'],
    2: ['D', 'C##', 'Ebb'],
    3: ['D#', 'Eb', 'Fbb'],
    4: ['E', 'D##', 'Fb'],
    5: ['F', 'E#', 'Gbb'],
    6: ['F#', 'Gb'],
    7: ['G', 'F##', 'Abb'],
    8: ['G#', 'Ab'],
    9: ['A', 'G##', 'Bbb'],
    10: ['A#', 'Bb', 'Cbb'],
    11: ['B', 'A##', 'Cb']
};

/**
 * 查找给定半音值所有可能的音符对象。
 * @param semitone - 绝对半音值 (0-11)。
 * @returns 一个可能的音符对象数组（例如，对于半音值 1，返回 C# 和 Db）。
 */
const getNoteCandidates = (semitone: number): Note[] => {
    const names = SEMITONE_TO_NAMES[semitone] ?? [];
    // 如果一个音符不属于C大调的自然音，则认为它是“黑键”。
    const naturalSemitones = [0, 2, 4, 5, 7, 9, 11];
    const isBlack = !naturalSemitones.includes(semitone);
    return names.map(name => ({ name, isBlack, semitone }));
};

/**
 * 计算给定调式音阶的七个音符，从指定的根音开始，
 * 确保使用理论上正确的音名（例如，适当地使用升号或降号）。
 *
 * 核心原则是，一个全音阶应该每个字母音名（A-G）只使用一次。
 *
 * @param mode - 音乐调式（例如，Ionian, Dorian）。
 * @param tonic - 音阶的起始音。
 * @returns 一个包含七个音符对象的数组，代表该音阶。如果任何音符无法解析，则返回 null。
 */
export const getScaleNotes = (mode: Mode, tonic: Note): (Note | null)[] => {
    const tonicLetter = tonic.name.charAt(0).toUpperCase();
    const tonicLetterIndex = DIATONIC_LETTERS.indexOf(tonicLetter);

    if (tonicLetterIndex === -1) {
        // 对于有效的根音输入，不应达到此情况。
        return Array(7).fill(null);
    }
    
    const scaleNotes: (Note | null)[] = [];

    mode.intervals.forEach((interval, i) => {
        // 1. 计算当前音级目标绝对半音。
        const targetSemitone = (tonic.semitone + getIntervalSemitone(interval)) % 12;

        // 2. 确定该音级的预期自然音名（例如，G的第三个音是B）。
        const targetLetter = DIATONIC_LETTERS[(tonicLetterIndex + i) % 7];

        // 3. 找到与半音和字母都匹配的特定音符拼写（例如，B或Bb）。
        const candidates = getNoteCandidates(targetSemitone);
        const correctNote = candidates.find(note => note.name.charAt(0).toUpperCase() === targetLetter);

        scaleNotes.push(correctNote || null);
    });

    return scaleNotes;
};
