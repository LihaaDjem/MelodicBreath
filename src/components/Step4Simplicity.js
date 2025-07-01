const { useState } = React;

function Step4Simplicity({ melodyData, updateMelodyData, nextStep, prevStep }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [previewMelody, setPreviewMelody] = useState(melodyData.melody);

    const simplifyMelody = () => {
        const simplified = window.MelodyUtils.simplifyMelody(melodyData.melody);
        setPreviewMelody(simplified);
    };

    const addVariations = () => {
        const withVariations = window.MelodyUtils.addVariations(melodyData.melody);
        setPreviewMelody(withVariations);
    };

    const restoreOriginal = () => {
        setPreviewMelody(melodyData.melody);
    };

    const playPreview = async () => {
        if (previewMelody.length === 0) return;
        
        setIsPlaying(true);
        try {
            await window.AudioService.playMelody(previewMelody, melodyData.tempo);
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

    const applyChanges = () => {
        updateMelodyData({ melody: previewMelody });
        nextStep();
    };

    const melodyStats = {
        original: {
            notes: melodyData.melody.length,
            uniqueNotes: window.MelodyUtils.getUniqueNotes(melodyData.melody).length,
            avgDuration: window.MelodyUtils.getAverageDuration(melodyData.melody)
        },
        current: {
            notes: previewMelody.length,
            uniqueNotes: window.MelodyUtils.getUniqueNotes(previewMelody).length,
            avgDuration: window.MelodyUtils.getAverageDuration(previewMelody)
        }
    };

    return (
        <div className="step-container">
            <div className="step-header">
                <h2>Ingenious Simplicity - Less Is Often More</h2>
                <p className="step-description">
                    Sometimes the most beautiful melodies are the simplest ones. 
                    Let's refine your melody to make it more memorable and easier to sing.
                </p>
            </div>

            <div className="melody-comparison">
                <div className="melody-section">
                    <h4>Current Melody</h4>
                    <MelodyVisualizer 
                        melody={previewMelody} 
                        isPlaying={isPlaying}
                    />
                </div>
            </div>

            <div className="simplification-tools">
                <div className="tool-group">
                    <h4>Simplification Tools</h4>
                    <div className="tool-buttons">
                        <button
                            className="btn btn-outline-primary tool-btn"
                            onClick={simplifyMelody}
                        >
                            <i className="fas fa-compress-alt"></i>
                            Simplify Melody
                            <small>Remove complex rhythms and reduce note count</small>
                        </button>

                        <button
                            className="btn btn-outline-success tool-btn"
                            onClick={addVariations}
                        >
                            <i className="fas fa-clone"></i>
                            Repeat with Variations
                            <small>Duplicate sections with small changes</small>
                        </button>

                        <button
                            className="btn btn-outline-secondary tool-btn"
                            onClick={restoreOriginal}
                        >
                            <i className="fas fa-undo"></i>
                            Restore Original
                            <small>Go back to the previous version</small>
                        </button>
                    </div>
                </div>
            </div>

            <div className="melody-stats">
                <div className="stats-comparison">
                    <div className="stat-card">
                        <h5>Original Melody</h5>
                        <ul>
                            <li>Notes: {melodyStats.original.notes}</li>
                            <li>Unique pitches: {melodyStats.original.uniqueNotes}</li>
                            <li>Avg note length: {melodyStats.original.avgDuration}</li>
                        </ul>
                    </div>
                    <div className="stat-card current">
                        <h5>Current Version</h5>
                        <ul>
                            <li>Notes: {melodyStats.current.notes}</li>
                            <li>Unique pitches: {melodyStats.current.uniqueNotes}</li>
                            <li>Avg note length: {melodyStats.current.avgDuration}</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="playback-controls">
                <button
                    className={`btn btn-success ${isPlaying ? 'playing' : ''}`}
                    onClick={isPlaying ? stopPlayback : playPreview}
                    disabled={previewMelody.length === 0}
                >
                    <i className={`fas ${isPlaying ? 'fa-stop' : 'fa-play'}`}></i>
                    {isPlaying ? 'Stop' : 'Listen'}
                </button>
            </div>

            <div className="action-section">
                <button
                    className="btn btn-primary"
                    onClick={applyChanges}
                >
                    <i className="fas fa-check"></i>
                    Continue with This Version
                </button>
            </div>

            <div className="education-section">
                <div className="simplicity-tips">
                    <h4><i className="fas fa-star"></i> The Art of Simplicity</h4>
                    <div className="tip-list">
                        <div className="tip">
                            <i className="fas fa-memory"></i>
                            <strong>Memorable:</strong> Simple melodies are easier to remember and sing along to.
                        </div>
                        <div className="tip">
                            <i className="fas fa-repeat"></i>
                            <strong>Repetition:</strong> Repeating patterns with small variations creates familiarity.
                        </div>
                        <div className="tip">
                            <i className="fas fa-balance-scale"></i>
                            <strong>Balance:</strong> Not too simple (boring) or too complex (confusing).
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

window.Step4Simplicity = Step4Simplicity;
