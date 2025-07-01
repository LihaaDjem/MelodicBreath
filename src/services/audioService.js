class AudioService {
    constructor() {
        this.synth = null;
        this.chordSynth = null;
        this.voiceSynth = null;
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;
        
        await Tone.start();
        
        // Main melody synth
        this.synth = new Tone.Synth({
            oscillator: {
                type: 'triangle'
            },
            envelope: {
                attack: 0.1,
                decay: 0.2,
                sustain: 0.5,
                release: 0.8
            }
        }).toDestination();

        // Chord synth for harmony
        this.chordSynth = new Tone.PolySynth(Tone.Synth, {
            oscillator: {
                type: 'sawtooth'
            },
            envelope: {
                attack: 0.2,
                decay: 0.3,
                sustain: 0.3,
                release: 1.5
            }
        }).toDestination();

        // Voice-like synth
        this.voiceSynth = new Tone.Synth({
            oscillator: {
                type: 'sine'
            },
            envelope: {
                attack: 0.05,
                decay: 0.1,
                sustain: 0.8,
                release: 0.5
            }
        }).toDestination();

        // Apply some reverb for richness
        const reverb = new Tone.Reverb(2).toDestination();
        this.synth.connect(reverb);
        this.voiceSynth.connect(reverb);

        this.isInitialized = true;
    }

    async playMelody(melody, tempo = 120) {
        await this.initialize();
        
        if (!melody || melody.length === 0) return;

        this.stopAll();
        
        Tone.Transport.bpm.value = tempo;
        
        const sequence = new Tone.Sequence((time, note) => {
            this.synth.triggerAttackRelease(note.note, note.duration, time);
        }, melody, "4n");

        sequence.start(0);
        Tone.Transport.start();

        // Stop after the melody duration
        const totalDuration = this.calculateSequenceDuration(melody);
        setTimeout(() => {
            sequence.dispose();
            Tone.Transport.stop();
        }, totalDuration * 1000);
    }

    async playMelodyWithChords(melody, chordProgression, tempo = 120) {
        await this.initialize();
        
        if (!melody || melody.length === 0) return;

        this.stopAll();
        
        Tone.Transport.bpm.value = tempo;
        
        // Set up melody
        const melodySequence = new Tone.Sequence((time, note) => {
            this.synth.triggerAttackRelease(note.note, note.duration, time);
        }, melody, "4n");

        // Set up chords
        const chords = this.parseChordProgression(chordProgression);
        const chordDuration = "1n"; // Each chord lasts one measure
        
        const chordSequence = new Tone.Sequence((time, chord) => {
            this.chordSynth.triggerAttackRelease(chord, chordDuration, time);
        }, chords, "1n");

        melodySequence.start(0);
        chordSequence.start(0);
        Tone.Transport.start();

        // Stop after the melody duration
        const totalDuration = Math.max(
            this.calculateSequenceDuration(melody),
            chords.length * (60 / tempo) * 4 // 4 beats per chord
        );
        
        setTimeout(() => {
            melodySequence.dispose();
            chordSequence.dispose();
            Tone.Transport.stop();
        }, totalDuration * 1000);
    }

    async playMelodyWithVoice(melody, chordProgression, tempo = 120, voiceType = 'female') {
        await this.initialize();
        
        if (!melody || melody.length === 0) return;

        this.stopAll();
        
        Tone.Transport.bpm.value = tempo;
        
        // Configure voice synth based on type
        const baseFreq = voiceType === 'female' ? 1.5 : 0.8;
        this.voiceSynth.oscillator.frequency.value = this.voiceSynth.oscillator.frequency.value * baseFreq;
        
        // Play melody with voice-like timbre
        const voiceSequence = new Tone.Sequence((time, note) => {
            // Convert musical note to "la" sound
            this.voiceSynth.triggerAttackRelease(note.note, note.duration, time);
        }, melody, "4n");

        // Add harmony if available
        let chordSequence = null;
        if (chordProgression) {
            const chords = this.parseChordProgression(chordProgression);
            chordSequence = new Tone.Sequence((time, chord) => {
                // Play chords softer as accompaniment
                const volume = this.chordSynth.volume.value;
                this.chordSynth.volume.value = volume - 10; // Reduce chord volume
                this.chordSynth.triggerAttackRelease(chord, "1n", time);
                this.chordSynth.volume.value = volume; // Restore volume
            }, chords, "1n");
            chordSequence.start(0);
        }

        voiceSequence.start(0);
        Tone.Transport.start();

        // Stop after the melody duration
        const totalDuration = this.calculateSequenceDuration(melody);
        setTimeout(() => {
            voiceSequence.dispose();
            if (chordSequence) chordSequence.dispose();
            Tone.Transport.stop();
        }, totalDuration * 1000);
    }

    parseChordProgression(progression) {
        const chordMap = {
            'C': ['C3', 'E3', 'G3'],
            'G': ['G3', 'B3', 'D4'],
            'Am': ['A3', 'C4', 'E4'],
            'F': ['F3', 'A3', 'C4'],
            'Dm': ['D3', 'F3', 'A3'],
            'Em': ['E3', 'G3', 'B3'],
            'Bb': ['Bb3', 'D4', 'F4']
        };

        return progression.split('-').map(chord => chordMap[chord] || chordMap['C']);
    }

    calculateSequenceDuration(melody) {
        if (!melody || melody.length === 0) return 0;
        
        const durationValues = {
            '1n': 4,
            '2n': 2,
            '4n': 1,
            '8n': 0.5,
            '16n': 0.25,
            '4n.': 1.5,
            '8n.': 0.75,
            '8t': 0.33
        };

        const totalBeats = melody.reduce((sum, note) => {
            return sum + (durationValues[note.duration] || 1);
        }, 0);

        // Convert beats to seconds (assuming 120 BPM)
        return (totalBeats * 60) / (Tone.Transport.bpm.value || 120);
    }

    stopAll() {
        Tone.Transport.stop();
        Tone.Transport.cancel();
        
        if (this.synth) this.synth.releaseAll();
        if (this.chordSynth) this.chordSynth.releaseAll();
        if (this.voiceSynth) this.voiceSynth.releaseAll();
    }
}

window.AudioService = new AudioService();
