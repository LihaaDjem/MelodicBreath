const { useState, useEffect } = React;

function Step5Rhythm({ melodyData, updateMelodyData, nextStep, prevStep }) {
    const [tempo, setTempo] = useState(melodyData.tempo || 120);
    const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [previewMelody, setPreviewMelody] = useState(melodyData.melody);

    useEffect(() => {
        updateMelodyData({ tempo });
    }, [tempo]);

    const tempoLabels = {
        60: 'Very Slow (Ballad)',
        80: 'Slow (Adagio)',
        100: 'Moderate (Andante)',
        120: 'Walking Pace (Moderato)',
        140: 'Quick (Allegro)',
        160: 'Fast (Vivace)',
        180: 'Very Fast (Presto)'
    };

    const getTempoLabel = (bpm) => {
        const closest = Object.keys(tempoLabels).reduce((prev, curr) => 
            Math.abs(curr - bpm) < Math.abs(prev - bpm) ? curr : prev
        );
        return tempoLabels[closest];
    };

    const playWithTempo = async () => {
        if (previewMelody.length === 0) return;
        
        setIsPlaying(true);
        try {
            await window.AudioService.playMelody(previewMelody, tempo);
        } catch (err) {
            console.error('Playback error:', err);
        } finally {
            setIsPlaying(false);
        }
    };

    const stopPlayback = () => {
        window.AudioService.stopAll();
        setIsPlaying(false);
    };

    const lengthenNote = (index) => {
        const newMelody = [...previewMelody];
        const note = newMelody[index];
        const newDuration = window.MelodyUtils.lengthenDuration(note.duration);
        newMelody[index] = { ...note, duration: newDuration };
        setPreviewMelody(newMelody);
    };

    const shortenNote = (index) => {
        const newMelody = [...previewMelody];
        const note = newMelody[index];
        const newDuration = window.MelodyUtils.shortenDuration(note.duration);
        newMelody[index] = { ...note, duration: newDuration };
        setPreviewMelody(newMelody);
    };

    const applyRhythmPattern = (pattern) => {
        const newMelody = window.MelodyUtils.applyRhythmPattern(previewMelody, pattern);
        setPreviewMelody(newMelody);
    };

    const applyChanges = () => {
        updateMelodyData({ 
            melody: previewMelody, 
            tempo 
        });
        nextStep();
    };

    const rhythmPatterns = [
        { name: 'Steady', pattern: ['4n', '4n', '4n', '4n'], icon: 'fa-equals' },
        { name: 'Dotted', pattern: ['4n.', '8n', '4n', '4n'], icon: 'fa-circle' },
        { name: 'Syncopated', pattern: ['8n', '4n', '8n', '4n'], icon: 'fa-wave-square' },
        { name: 'Triplets', pattern: ['8t', '8t', '8t', '4n'], icon: 'fa-grip-horizontal' }
    ];

    return (
        <div className="step-container">
            <div className="step-header">
                <h2>Rhythm and Breath - The Beat of Life</h2>
                <p className="step-description">
                    Rhythm gives your melody its heartbeat. Adjust the tempo and note durations 
                    to match the energy of your emotion.
                </p>
            </div>

            <div className="tempo-section">
                <div className="tempo-control">
                    <label htmlFor="tempo-slider">
                        <i className="fas fa-tachometer-alt"></i>
                        Tempo: {tempo} BPM
                    </label>
                    <div className="tempo-label">{getTempoLabel(tempo)}</div>
                    <input
                        id="tempo-slider"
                        type="range"
                        min="60"
                        max="180"
                        step="10"
                        value={tempo}
                        onChange={(e) => setTempo(parseInt(e.target.value))}
                        className="slider tempo-slider"
                    />
                    <div className="tempo-markers">
                        <span>60 BPM</span>
                        <span>120 BPM</span>
                        <span>180 BPM</span>
                    </div>
                </div>
            </div>

            <div className="rhythm-patterns">
                <h4>Rhythm Patterns</h4>
                <div className="pattern-buttons">
                    {rhythmPatterns.map((pattern, index) => (
                        <button
                            key={index}
                            className="btn btn-outline-primary pattern-btn"
                            onClick={() => applyRhythmPattern(pattern.pattern)}
                        >
                            <i className={`fas ${pattern.icon}`}></i>
                            {pattern.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="melody-editor">
                <h4>Note Duration Editor</h4>
                <div className="note-grid">
                    {previewMelody.map((note, index) => (
                        <div 
                            key={index}
                            className={`note-item ${selectedNoteIndex === index ? 'selected' : ''}`}
                            onClick={() => setSelectedNoteIndex(index)}
                        >
                            <div className="note-display">
                                <div className="note-name">{note.note}</div>
                                <div className="note-duration">{note.duration}</div>
                            </div>
                            <div className="note-controls">
                                <button
                                    className="btn btn-sm btn-outline-success"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        lengthenNote(index);
                                    }}
                                >
                                    <i className="fas fa-plus"></i>
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        shortenNote(index);
                                    }}
                                >
                                    <i className="fas fa-minus"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rhythm-visualizer">
                <MelodyVisualizer 
                    melody={previewMelody} 
                    isPlaying={isPlaying}
                    showRhythm={true}
                    tempo={tempo}
                />
            </div>

            <div className="playback-controls">
                <button
                    className={`btn btn-success ${isPlaying ? 'playing' : ''}`}
                    onClick={isPlaying ? stopPlayback : playWithTempo}
                    disabled={previewMelody.length === 0}
                >
                    <i className={`fas ${isPlaying ? 'fa-stop' : 'fa-play'}`}></i>
                    {isPlaying ? 'Stop' : 'Listen'}
                </button>

                <button
                    className="btn btn-outline-secondary"
                    onClick={() => setPreviewMelody(melodyData.melody)}
                >
                    <i className="fas fa-undo"></i>
                    Reset Rhythm
                </button>
            </div>

            <div className="action-section">
                <button
                    className="btn btn-primary"
                    onClick={applyChanges}
                >
                    <i className="fas fa-check"></i>
                    Apply Rhythm Changes
                </button>
            </div>

            <div className="education-section">
                <div className="rhythm-concepts">
                    <h4><i className="fas fa-graduation-cap"></i> Rhythm Basics</h4>
                    <div className="concept-grid">
                        <div className="concept">
                            <strong>Tempo:</strong> How fast or slow the music feels
                        </div>
                        <div className="concept">
                            <strong>Duration:</strong> How long each note lasts
                        </div>
                        <div className="concept">
                            <strong>Pattern:</strong> The repeated rhythm structure
                        </div>
                        <div className="concept">
                            <strong>Feel:</strong> How the rhythm makes you want to move
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

window.Step5Rhythm = Step5Rhythm;
