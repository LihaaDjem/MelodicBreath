function MelodyVisualizer({ 
    melody = [], 
    isPlaying = false, 
    showComparison = false, 
    originalMelody = [], 
    showChords = false, 
    chordProgression = '', 
    showRhythm = false, 
    tempo = 120,
    showComplete = false 
}) {
    const [currentNoteIndex, setCurrentNoteIndex] = React.useState(0);

    React.useEffect(() => {
        let interval;
        if (isPlaying && melody.length > 0) {
            const noteDuration = 60000 / tempo; // Base duration in ms
            interval = setInterval(() => {
                setCurrentNoteIndex(prev => {
                    const next = prev + 1;
                    return next >= melody.length ? 0 : next;
                });
            }, noteDuration);
        } else {
            setCurrentNoteIndex(0);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying, melody.length, tempo]);

    const getNoteColor = (note, index) => {
        const baseNote = note.note.replace(/\d+/, '');
        const colors = {
            'C': '#FF6B6B',
            'C#': '#FF8E53', 'Db': '#FF8E53',
            'D': '#FF6B9D',
            'D#': '#C44569', 'Eb': '#C44569',
            'E': '#F8B500',
            'F': '#6BCF7F',
            'F#': '#4ECDC4', 'Gb': '#4ECDC4',
            'G': '#45B7D1',
            'G#': '#96CEB4', 'Ab': '#96CEB4',
            'A': '#FECA57',
            'A#': '#48CAE4', 'Bb': '#48CAE4',
            'B': '#FF9FF3'
        };
        return colors[baseNote] || '#95A5A6';
    };

    const getNoteHeight = (note) => {
        const octave = parseInt(note.note.slice(-1)) || 4;
        const baseNote = note.note.replace(/\d+/, '');
        const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const noteIndex = noteOrder.indexOf(baseNote);
        const totalHeight = (octave - 2) * 12 + noteIndex;
        return Math.max(20, Math.min(100, (totalHeight * 3) + 20));
    };

    const getDurationWidth = (duration) => {
        const durationMap = {
            '1n': 100,
            '2n': 50,
            '4n': 25,
            '8n': 12.5,
            '16n': 6.25,
            '4n.': 37.5, // dotted quarter
            '8n.': 18.75, // dotted eighth
            '8t': 8.33    // triplet eighth
        };
        return durationMap[duration] || 25;
    };

    if (melody.length === 0) {
        return (
            <div className="melody-visualizer empty">
                <div className="empty-state">
                    <i className="fas fa-music"></i>
                    <p>No melody to display</p>
                </div>
            </div>
        );
    }

    return (
        <div className="melody-visualizer">
            {showChords && chordProgression && (
                <div className="chord-display">
                    <h5>Harmony: {chordProgression}</h5>
                    <div className="chord-progression">
                        {chordProgression.split('-').map((chord, index) => (
                            <div key={index} className="chord-symbol">
                                {chord}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="melody-notes">
                {showComparison && originalMelody.length > 0 && (
                    <div className="original-melody">
                        <h6>Original:</h6>
                        <div className="note-sequence">
                            {originalMelody.map((note, index) => (
                                <div
                                    key={`orig-${index}`}
                                    className="note-dot original"
                                    style={{
                                        backgroundColor: getNoteColor(note, index),
                                        height: `${getNoteHeight(note) * 0.6}px`,
                                        width: showRhythm ? `${getDurationWidth(note.duration)}px` : '20px'
                                    }}
                                    title={`${note.note} (${note.duration})`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="current-melody">
                    {showComparison && <h6>Modified:</h6>}
                    <div className="note-sequence">
                        {melody.map((note, index) => (
                            <div
                                key={index}
                                className={`note-dot ${isPlaying && index === currentNoteIndex ? 'playing' : ''}`}
                                style={{
                                    backgroundColor: getNoteColor(note, index),
                                    height: `${getNoteHeight(note)}px`,
                                    width: showRhythm ? `${getDurationWidth(note.duration)}px` : '25px',
                                    opacity: isPlaying && index !== currentNoteIndex ? 0.6 : 1,
                                    transform: isPlaying && index === currentNoteIndex ? 'scale(1.2)' : 'scale(1)'
                                }}
                                title={`${note.note} (${note.duration})`}
                            >
                                {showComplete && (
                                    <div className="note-label">
                                        {note.note}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showRhythm && (
                <div className="rhythm-grid">
                    <div className="beat-markers">
                        {Array.from({ length: 16 }, (_, i) => (
                            <div key={i} className="beat-line" />
                        ))}
                    </div>
                </div>
            )}

            <div className="visualizer-legend">
                <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#FF6B6B' }}></div>
                    <span>C</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#F8B500' }}></div>
                    <span>E</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#45B7D1' }}></div>
                    <span>G</span>
                </div>
                <span className="legend-text">Height = Pitch, Color = Note</span>
                {showRhythm && <span className="legend-text">Width = Duration</span>}
            </div>
        </div>
    );
}

window.MelodyVisualizer = MelodyVisualizer;
