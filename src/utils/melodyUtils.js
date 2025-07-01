class MelodyUtils {
    static detectKey(melody) {
        if (!melody || melody.length === 0) return 'C Major';
        
        const noteCounts = {};
        melody.forEach(note => {
            const baseName = note.note.replace(/\d+/, '');
            noteCounts[baseName] = (noteCounts[baseName] || 0) + 1;
        });

        const mostCommon = Object.keys(noteCounts).reduce((a, b) => 
            noteCounts[a] > noteCounts[b] ? a : b
        );

        // Simple key detection based on most common note
        const majorKeys = {
            'C': 'C Major', 'D': 'D Major', 'E': 'E Major', 'F': 'F Major',
            'G': 'G Major', 'A': 'A Major', 'B': 'B Major'
        };

        return majorKeys[mostCommon] || 'C Major';
    }

    static calculateDuration(melody) {
        if (!melody || melody.length === 0) return 0;
        
        const durationValues = {
            '1n': 4, '2n': 2, '4n': 1, '8n': 0.5, '16n': 0.25,
            '4n.': 1.5, '8n.': 0.75, '8t': 0.33
        };

        const totalBeats = melody.reduce((sum, note) => {
            return sum + (durationValues[note.duration] || 1);
        }, 0);

        return Math.round((totalBeats * 60) / 120); // Assuming 120 BPM
    }

    static getUniqueNotes(melody) {
        if (!melody || melody.length === 0) return [];
        return [...new Set(melody.map(note => note.note.replace(/\d+/, '')))];
    }

    static getAverageDuration(melody) {
        if (!melody || melody.length === 0) return '4n';
        
        const durationCounts = {};
        melody.forEach(note => {
            durationCounts[note.duration] = (durationCounts[note.duration] || 0) + 1;
        });

        return Object.keys(durationCounts).reduce((a, b) => 
            durationCounts[a] > durationCounts[b] ? a : b
        );
    }

    static getMelodyRange(melody) {
        if (!melody || melody.length === 0) return 'Unknown';
        
        const noteNumbers = melody.map(note => this.noteToNumber(note.note));
        const min = Math.min(...noteNumbers);
        const max = Math.max(...noteNumbers);
        
        return `${this.numberToNote(min)} - ${this.numberToNote(max)}`;
    }

    static noteToNumber(note) {
        const noteMap = { 'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11 };
        const octave = parseInt(note.slice(-1)) || 4;
        const noteName = note.replace(/\d+/, '');
        return (octave * 12) + (noteMap[noteName] || 0);
    }

    static numberToNote(number) {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const octave = Math.floor(number / 12);
        const noteIndex = number % 12;
        return `${notes[noteIndex]}${octave}`;
    }

    static applyTensionResolution(melody, tension, resolution) {
        if (!melody || melody.length === 0) return melody;
        
        const newMelody = [...melody];
        const tensionFactor = (tension - 50) / 50; // -1 to 1
        const resolutionFactor = (resolution - 50) / 50; // -1 to 1

        newMelody.forEach((note, index) => {
            const noteNumber = this.noteToNumber(note.note);
            let newNoteNumber = noteNumber;

            // Apply tension (higher = more ascending movement)
            if (tensionFactor > 0 && index > 0) {
                const prevNoteNumber = this.noteToNumber(newMelody[index - 1].note);
                if (noteNumber <= prevNoteNumber) {
                    newNoteNumber += Math.floor(tensionFactor * 3);
                }
            }

            // Apply resolution (higher = more movement toward tonic)
            if (resolutionFactor > 0) {
                const tonicNumber = this.noteToNumber('C4'); // Assume C as tonic
                const distance = noteNumber - tonicNumber;
                if (Math.abs(distance) > 7) { // More than an octave
                    newNoteNumber -= Math.sign(distance) * Math.floor(resolutionFactor * 2);
                }
            }

            // Ensure note stays in reasonable range
            newNoteNumber = Math.max(36, Math.min(84, newNoteNumber)); // C3 to C6
            newMelody[index] = { ...note, note: this.numberToNote(newNoteNumber) };
        });

        return newMelody;
    }

    static simplifyMelody(melody) {
        if (!melody || melody.length === 0) return melody;
        
        const simplified = [];
        let i = 0;

        while (i < melody.length) {
            const currentNote = melody[i];
            
            // Check if next note has same pitch but shorter duration
            if (i + 1 < melody.length) {
                const nextNote = melody[i + 1];
                if (currentNote.note === nextNote.note && 
                    this.getDurationValue(nextNote.duration) < this.getDurationValue(currentNote.duration)) {
                    // Combine into longer note
                    simplified.push({
                        note: currentNote.note,
                        duration: this.lengthenDuration(currentNote.duration)
                    });
                    i += 2; // Skip next note
                    continue;
                }
            }

            // Simplify very short notes to quarter notes
            if (this.getDurationValue(currentNote.duration) < 0.5) {
                simplified.push({ ...currentNote, duration: '4n' });
            } else {
                simplified.push(currentNote);
            }
            
            i++;
        }

        return simplified;
    }

    static addVariations(melody) {
        if (!melody || melody.length === 0) return melody;
        
        const withVariations = [...melody];
        
        // Add the melody again with small variations
        melody.forEach((note, index) => {
            if (index % 2 === 0) { // Vary every other note
                const noteNumber = this.noteToNumber(note.note);
                const variation = Math.random() > 0.5 ? 1 : -1; // Up or down
                const newNoteNumber = noteNumber + variation;
                
                withVariations.push({
                    note: this.numberToNote(newNoteNumber),
                    duration: note.duration
                });
            } else {
                withVariations.push(note);
            }
        });

        return withVariations;
    }

    static lengthenDuration(duration) {
        const durationOrder = ['16n', '8n', '4n', '2n', '1n'];
        const currentIndex = durationOrder.indexOf(duration);
        return currentIndex < durationOrder.length - 1 ? 
            durationOrder[currentIndex + 1] : duration;
    }

    static shortenDuration(duration) {
        const durationOrder = ['16n', '8n', '4n', '2n', '1n'];
        const currentIndex = durationOrder.indexOf(duration);
        return currentIndex > 0 ? 
            durationOrder[currentIndex - 1] : duration;
    }

    static getDurationValue(duration) {
        const values = {
            '1n': 4, '2n': 2, '4n': 1, '8n': 0.5, '16n': 0.25,
            '4n.': 1.5, '8n.': 0.75, '8t': 0.33
        };
        return values[duration] || 1;
    }

    static applyRhythmPattern(melody, pattern) {
        if (!melody || melody.length === 0) return melody;
        
        const newMelody = [...melody];
        
        newMelody.forEach((note, index) => {
            const patternIndex = index % pattern.length;
            newMelody[index] = { ...note, duration: pattern[patternIndex] };
        });

        return newMelody;
    }
}

window.MelodyUtils = MelodyUtils;
