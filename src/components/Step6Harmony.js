const { useState } = React;

function Step6Harmony({ melodyData, updateMelodyData, nextStep, prevStep }) {
    const [selectedProgression, setSelectedProgression] = useState(melodyData.chordProgression || 'C-G-Am-F');
    const [isPlaying, setIsPlaying] = useState(false);
    const [playingMelodyOnly, setPlayingMelodyOnly] = useState(false);

    const chordProgressions = [
        {
            name: 'Joyful Pop',
            chords: 'C-G-Am-F',
            mood: 'Happy, Uplifting',
            description: 'Classic pop progression that sounds bright and positive',
            icon: 'fa-smile'
        },
        {
            name: 'Emotional Ballad',
            chords: 'Am-F-C-G',
            mood: 'Touching, Heartfelt',
            description: 'Perfect for expressing deep emotions and storytelling',
            icon: 'fa-heart'
        },
        {
            name: 'Mysterious',
            chords: 'Am-Dm-G-C',
            mood: 'Intriguing, Thoughtful',
            description: 'Creates a sense of mystery and contemplation',
            icon: 'fa-search'
        },
        {
            name: 'Peaceful',
            chords: 'C-F-Am-G',
            mood: 'Calm, Serene',
            description: 'Gentle and soothing, like a quiet moment',
            icon: 'fa-leaf'
        },
        {
            name: 'Dramatic',
            chords: 'Dm-Bb-F-C',
            mood: 'Intense, Powerful',
            description: 'Strong emotions and dramatic moments',
            icon: 'fa-bolt'
        },
        {
            name: 'Folk Simple',
            chords: 'G-C-D-G',
            mood: 'Traditional, Warm',
            description: 'Simple and familiar, like a campfire song',
            icon: 'fa-campground'
        }
    ];

    const playMelodyWithChords = async () => {
        if (melodyData.melody.length === 0) return;
        
        setIsPlaying(true);
        try {
            await window.AudioService.playMelodyWithChords(
                melodyData.melody, 
                selectedProgression, 
                melodyData.tempo
            );
        } catch (err) {
            console.error('Playback error:', err);
        } finally {
            setIsPlaying(false);
        }
    };

    const playMelodyOnly = async () => {
        if (melodyData.melody.length === 0) return;
        
        setPlayingMelodyOnly(true);
        try {
            await window.AudioService.playMelody(melodyData.melody, melodyData.tempo);
        } catch (err) {
            console.error('Playback error:', err);
        } finally {
            setPlayingMelodyOnly(false);
        }
    };

    const stopPlayback = () => {
        window.AudioService.stopAll();
        setIsPlaying(false);
        setPlayingMelodyOnly(false);
    };

    const applyHarmony = () => {
        updateMelodyData({ chordProgression: selectedProgression });
        nextStep();
    };

    const getCurrentProgression = () => {
        return chordProgressions.find(p => p.chords === selectedProgression) || chordProgressions[0];
    };

    return (
        <div className="step-container">
            <div className="step-header">
                <h2>Subtle Harmony - The Sound Carpet</h2>
                <p className="step-description">
                    Harmony supports your melody like a soft carpet of sound. 
                    Choose chord progressions that enhance the emotion of your melody.
                </p>
            </div>

            <div className="current-selection">
                <div className="selected-progression">
                    <h4>
                        <i className={`fas ${getCurrentProgression().icon}`}></i>
                        Current: {getCurrentProgression().name}
                    </h4>
                    <p><strong>Chords:</strong> {getCurrentProgression().chords}</p>
                    <p><strong>Mood:</strong> {getCurrentProgression().mood}</p>
                    <p>{getCurrentProgression().description}</p>
                </div>
            </div>

            <div className="chord-progressions">
                <h4>Choose Your Harmony</h4>
                <div className="progression-grid">
                    {chordProgressions.map((progression, index) => (
                        <div
                            key={index}
                            className={`progression-card ${selectedProgression === progression.chords ? 'selected' : ''}`}
                            onClick={() => setSelectedProgression(progression.chords)}
                        >
                            <div className="progression-header">
                                <i className={`fas ${progression.icon}`}></i>
                                <h5>{progression.name}</h5>
                            </div>
                            <div className="progression-chords">{progression.chords}</div>
                            <div className="progression-mood">{progression.mood}</div>
                            <p className="progression-description">{progression.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="melody-preview">
                <MelodyVisualizer 
                    melody={melodyData.melody} 
                    isPlaying={isPlaying || playingMelodyOnly}
                    showChords={true}
                    chordProgression={selectedProgression}
                />
            </div>

            <div className="playback-controls">
                <button
                    className={`btn btn-success ${isPlaying ? 'playing' : ''}`}
                    onClick={isPlaying ? stopPlayback : playMelodyWithChords}
                    disabled={melodyData.melody.length === 0}
                >
                    <i className={`fas ${isPlaying ? 'fa-stop' : 'fa-play'}`}></i>
                    {isPlaying ? 'Stop' : 'Listen with Chords'}
                </button>

                <button
                    className={`btn btn-outline-primary ${playingMelodyOnly ? 'playing' : ''}`}
                    onClick={playingMelodyOnly ? stopPlayback : playMelodyOnly}
                    disabled={melodyData.melody.length === 0}
                >
                    <i className={`fas ${playingMelodyOnly ? 'fa-stop' : 'fa-music'}`}></i>
                    {playingMelodyOnly ? 'Stop' : 'Melody Only'}
                </button>
            </div>

            <div className="harmony-analysis">
                <div className="analysis-card">
                    <h4><i className="fas fa-chart-line"></i> Harmony Analysis</h4>
                    <div className="analysis-content">
                        <p><strong>Your melody emotion:</strong> {melodyData.emotion}</p>
                        <p><strong>Recommended harmony:</strong> {getCurrentProgression().mood}</p>
                        <p><strong>Why this works:</strong> The {getCurrentProgression().name} progression 
                        complements melodies that express {melodyData.emotion.toLowerCase()} by providing 
                        {getCurrentProgression().description.toLowerCase()}.</p>
                    </div>
                </div>
            </div>

            <div className="action-section">
                <button
                    className="btn btn-primary"
                    onClick={applyHarmony}
                >
                    <i className="fas fa-check"></i>
                    Continue with This Harmony
                </button>
            </div>

            <div className="education-section">
                <div className="harmony-concepts">
                    <h4><i className="fas fa-graduation-cap"></i> Understanding Harmony</h4>
                    <div className="concept-list">
                        <div className="concept-item">
                            <i className="fas fa-layer-group"></i>
                            <div>
                                <strong>Chords:</strong> Multiple notes played together that support the melody
                            </div>
                        </div>
                        <div className="concept-item">
                            <i className="fas fa-route"></i>
                            <div>
                                <strong>Progression:</strong> A sequence of chords that creates movement and emotion
                            </div>
                        </div>
                        <div className="concept-item">
                            <i className="fas fa-palette"></i>
                            <div>
                                <strong>Color:</strong> Harmony adds emotional color and depth to your melody
                            </div>
                        </div>
                        <div className="concept-item">
                            <i className="fas fa-balance-scale"></i>
                            <div>
                                <strong>Support:</strong> Good harmony supports without overwhelming the melody
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

window.Step6Harmony = Step6Harmony;
