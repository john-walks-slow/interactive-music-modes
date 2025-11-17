
import React, { useState, useEffect, useRef } from 'react';
import { Mode } from '../types';
import { SCALES, MODES, getIntervalSemitone } from '../constants/music';
import { FiChevronDown } from 'react-icons/fi';

interface IntervalDetailProps {
    mode: Mode;
}

const AlterationIndicator: React.FC<{ change: 'raised' | 'lowered' }> = ({ change }) => {
    const symbol = change === 'raised' ? '▲' : '▼';
    return <span className={`ml-1 text-xs font-sans`}>{symbol}</span>;
}

const IntervalDetail: React.FC<IntervalDetailProps> = ({ mode }) => {
    const [comparisonTarget, setComparisonTarget] = useState<'auto' | string>('auto');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // Handle clicks outside the dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!mode.derivation) return null;

    const autoParentMode = SCALES[mode.derivation.parent];
    if (!autoParentMode) return null;

    const parentModeKey = comparisonTarget === 'auto' ? mode.derivation.parent : comparisonTarget;
    if (!parentModeKey) return null;

    const parentMode = SCALES[parentModeKey];
    if (!parentMode) return null;
    
    const comparisonName = parentMode.name;

    const getAlteration = (currentIndex: number): 'raised' | 'lowered' | null => {
        if (mode.name === parentMode.name) return null;
        const currentSemitone = getIntervalSemitone(mode.intervals[currentIndex]);
        const parentSemitone = getIntervalSemitone(parentMode.intervals[currentIndex]);
        
        if (currentSemitone > parentSemitone) return 'raised';
        if (currentSemitone < parentSemitone) return 'lowered';
        return null;
    }

    const handleSelect = (target: string) => {
        setComparisonTarget(target);
        setIsDropdownOpen(false);
    };

    return (
        <div>
            <div className="flex items-baseline mb-4">
                <h3 className="text-base font-semibold text-gray-800">
                    Compared with
                </h3>
                <div className="relative ml-4" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center text-sm font-medium text-sky-600 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 rounded-md"
                        aria-haspopup="true"
                        aria-expanded={isDropdownOpen}
                    >
                        <span>{comparisonName}</span>
                        <FiChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                        <div className="origin-top-left absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20 max-h-60 overflow-y-auto">
                            <div className="py-1" role="menu" aria-orientation="vertical">
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); handleSelect('auto'); }}
                                    className={`block px-4 py-2 text-sm ${comparisonTarget === 'auto' ? 'font-semibold text-sky-600 bg-sky-50' : 'text-gray-700 hover:bg-gray-100'}`}
                                    role="menuitem"
                                >
                                    Auto: {autoParentMode.name}
                                </a>
                                 <div className="border-t border-gray-100 my-1" />
                                {MODES.filter(m => m.name !== mode.name).map(m => (
                                    <a
                                        key={m.name}
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); handleSelect(m.name); }}
                                        className={`block px-4 py-2 text-sm ${comparisonTarget === m.name ? 'font-semibold text-sky-600 bg-sky-50' : 'text-gray-700 hover:bg-gray-100'}`}
                                        role="menuitem"
                                    >
                                        {m.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                {mode.intervals.map((interval, index) => {
                    const alteration = getAlteration(index);
                    const isCharacteristic = mode.characteristicIntervals?.includes(interval.number) && comparisonTarget === 'auto';
                    const isQualityTone = interval.number === 3;
                    const intervalText = `${interval.quality}${interval.number}`;

                    const baseClasses = "px-3 py-1.5 rounded-md text-sm font-mono flex items-center justify-center transition-colors duration-200";
                    let stateClasses = "bg-gray-200 text-gray-700";

                    // Precedence: Altered > Characteristic > Quality > Default
                    if (alteration === 'raised') {
                        stateClasses = 'bg-green-100 text-green-800 border border-green-200';
                    } else if (alteration === 'lowered') {
                        stateClasses = 'bg-red-100 text-red-800 border border-red-200';
                    } else if (isCharacteristic) {
                        stateClasses = 'bg-amber-100 text-amber-800 border border-amber-200';
                    } else if (isQualityTone) {
                        if (interval.quality === 'M') {
                            stateClasses = 'bg-sky-100 text-sky-800 border border-sky-200';
                        } else { // 'm'
                            stateClasses = 'bg-yellow-100 text-yellow-800 border border-yellow-200';
                        }
                    }

                    return (
                        <div key={index} className="flex flex-col items-center gap-1">
                             <span className="text-xs text-gray-500 font-sans">{['R', '2', '3', '4', '5', '6', '7'][index]}</span>
                             <div className={`${baseClasses} ${stateClasses}`}>
                                {intervalText}
                                {alteration && <AlterationIndicator change={alteration} />}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default IntervalDetail;
