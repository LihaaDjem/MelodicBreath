const { useState } = React;

function Step7Arrangement({ melodyData, updateMelodyData, prevStep }) {
    const [voiceType, setVoiceType] = useState(melodyData.voiceType || 'female');
    const [isPlaying, setIsPlaying] = useState(false);
    const [savedMelodies, setSavedMelodies] = useState([]);
    const [saveStatus, setSaveStatus] = useState('');

    React.useEffect(() => {
        loadSavedMelodies();
    }, []);

    const loadSavedMelodies = async () => {
        try {
            const melodies = await window.StorageService.getSavedMelodies();
            setSavedMelodies(melodies);
        } catch (err) {
            console.error('Failed to load saved melodies:', err);
        }
    };

    const playWithVoice = async () => {
        if (melodyData.melody.length === 0) return;
        
        setIsPlaying(true);
        try {
            await window.AudioService.playMelodyWithVoice(
                melodyData.melody, 
                melodyData.chordProgression,
                melodyData.tempo,
                voiceType
            );
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

    const saveMelody = async () => {
        try {
            const melodyToSave = {
                ...melodyData,
                voiceType,
                createdAt: new Date().toISOString(),
                id: Date.now()
            };
            
            await window.StorageService.saveMelody(melodyToSave);
            setSaveStatus('Melody saved successfully!');
            setTimeout(() => setSaveStatus(''), 3000);
            loadSavedMelodies();
        } catch (err) {
            setSaveStatus('Failed to save melody');
            setTimeout(() => setSaveStatus(''), 3000);
            console.error('Save error:', err);
        }
    };

    const shareMelody = async () => {
        try {
            const shareData = {
                title: `My Melodic Breath - ${melodyData.emotion}`,
                text: `I created a melody expressing "${melodyData.emotion}" using The Melodic Breath app!`,
                url: window.location.href
            };

            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback for browsers without native sharing
                const shareText = `${shareData.text}\n\nMelody details:\n` +
                    `Emotion: ${melodyData.emotion}\n` +
                    `Tempo: ${melodyData.tempo} BPM\n` +
                    `Chords: ${melodyData.chordProgression}\n` +
                    `Notes: ${melodyData.melody.length}`;
                
                navigator.clipboard.writeText(shareText);
                setSaveStatus('Melody details copied to clipboard!');
                setTimeout(() => setSaveStatus(''), 3000);
            }
        } catch (err) {
            console.error('Share error:', err);
            setSaveStatus('Failed to share melody');
            setTimeout(() => setSaveStatus(''), 3000);
        }
    };

    const generateNewMelody = () => {
        // Reset to step 1 for a new melody
        window.location.reload();
    };

    const melodyStats = {
        duration: window.MelodyUtils.calculateDuration(melodyData.melody),
        noteCount: melodyData.melody.length,
        key: window.MelodyUtils.detectKey(melodyData.melody),
        range: window.MelodyUtils.getMelodyRange(melodyData.melody)
    };

    return (
        <div className="step-container">
            <div className="step-header">
                <h2>Arrangement and Timbre - The Final Touch</h2>
                <p className="step-description">
                    Your melody is complete! Now let's give it a voice and save your creation.
                </p>
            </div>

            <div className="melody-summary">
                <div className="summary-card">
                    <h3>
                        <i className="fas fa-music"></i>
                        Your Melodic Breath
                    </h3>
                    <div className="melody-details">
                        <div className="detail-row">
                            <span><strong>Emotion:</strong></span>
                            <span>{melodyData.emotion}</span>
                        </div>
                        {melodyData.context && (
                            <div className="detail-row">
                                <span><strong>Context:</strong></span>
                                <span>{melodyData.context}</span>
                            </div>
                        )}
                        <div className="detail-row">
                            <span><strong>Key:</strong></span>
                            <span>{melodyStats.key}</span>
                        </div>
                        <div className="detail-row">
                            <span><strong>Tempo:</strong></span>
                            <span>{melodyData.tempo} BPM</span>
                        </div>
                        <div className="detail-row">
                            <span><strong>Harmony:</strong></span>
                            <span>{melodyData.chordProgression}</span>
                        </div>
                        <div className="detail-row">
                            <span><strong>Duration:</strong></span>
                            <span>~{melodyStats.duration} seconds</span>
                        </div>
                        <div className="detail-row">
                            <span><strong>Notes:</strong></span>
                            <span>{melodyStats.noteCount}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="voice-selection">
                <h4>Choose Voice Type</h4>
                <div className="voice-options">
                    <label className="voice-option">
                        <input
                            type="radio"
                            name="voiceType"
                            value="female"
                            checked={voiceType === 'female'}
                            onChange={(e) => setVoiceType(e.target.value)}
                        />
                        <div className="voice-card">
                            <i className="fas fa-female"></i>
                            <span>Female Voice</span>
                            <small>Higher, brighter tone</small>
                        </div>
                    </label>
                    
                    <label className="voice-option">
                        <input
                            type="radio"
                            name="voiceType"
                            value="male"
                            checked={voiceType === 'male'}
                            onChange={(e) => setVoiceType(e.target.value)}
                        />
                        <div className="voice-card">
                            <i className="fas fa-male"></i>
                            <span>Male Voice</span>
                            <small>Lower, warmer tone</small>
                        </div>
                    </label>
                </div>
            </div>

            <div className="final-melody-preview">
                <MelodyVisualizer 
                    melody={melodyData.melody} 
                    isPlaying={isPlaying}
                    showChords={true}
                    chordProgression={melodyData.chordProgression}
                    showComplete={true}
                />
            </div>

            <div className="playback-controls">
                <button
                    className={`btn btn-success btn-lg ${isPlaying ? 'playing' : ''}`}
                    onClick={isPlaying ? stopPlayback : playWithVoice}
                    disabled={melodyData.melody.length === 0}
                >
                    <i className={`fas ${isPlaying ? 'fa-stop' : 'fa-play'}`}></i>
                    {isPlaying ? 'Stop' : 'Listen in Human Voice'}
                </button>
            </div>

            <div className="action-buttons">
                <button
                    className="btn btn-primary btn-lg"
                    onClick={saveMelody}
                >
                    <i className="fas fa-save"></i>
                    Save My Melody
                </button>

                <button
                    className="btn btn-info btn-lg"
                    onClick={shareMelody}
                >
                    <i className="fas fa-share-alt"></i>
                    Share
                </button>

                <button
                    className="btn btn-outline-primary"
                    onClick={generateNewMelody}
                >
                    <i className="fas fa-plus"></i>
                    Create New Melody
                </button>
            </div>

            {saveStatus && (
                <div className={`alert ${saveStatus.includes('success') ? 'alert-success' : 'alert-info'}`}>
                    <i className="fas fa-info-circle"></i>
                    {saveStatus}
                </div>
            )}

            <div className="saved-melodies">
                <h4>Your Saved Melodies</h4>
                {savedMelodies.length === 0 ? (
                    <p className="no-melodies">No saved melodies yet. Save this one to get started!</p>
                ) : (
                    <div className="melody-list">
                        {savedMelodies.slice(-5).reverse().map((melody, index) => (
                            <div key={melody.id} className="saved-melody-item">
                                <div className="melody-info">
                                    <strong>{melody.emotion}</strong>
                                    <small>{new Date(melody.createdAt).toLocaleDateString()}</small>
                                </div>
                                <div className="melody-stats">
                                    <span>{melody.melody.length} notes</span>
                                    <span>{melody.tempo} BPM</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="congratulations">
                <div className="congrats-card">
                    <h3>
                        <i className="fas fa-trophy"></i>
                        Congratulations!
                    </h3>
                    <p>
                        You've successfully created your melodic breath! You've learned about emotion, 
                        tension and resolution, simplicity, rhythm, harmony, and arrangement. 
                        These are the fundamental building blocks of all great melodies.
                    </p>
                    <p>
                        Keep experimenting and trust your musical instincts. Every melody tells a story, 
                        and you're the storyteller!
                    </p>
                </div>
            </div>
        </div>
    );
}

window.Step7Arrangement = Step7Arrangement;
