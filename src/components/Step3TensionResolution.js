const { useState, useEffect } = React;

function Step3TensionResolution({ melodyData, updateMelodyData, nextStep, prevStep }) {
    const [tension, setTension] = useState(melodyData.tension || 50);
    const [resolution, setResolution] = useState(melodyData.resolution || 50);
    const [isPlaying, setIsPlaying] = useState(false);
    const [previewMelody, setPreviewMelody] = useState([]);

    useEffect(() => {
        updatePreviewMelody();
    }, [tension, resolution, melodyData.melody]);

    const updatePreviewMelody = () => {
        if (melodyData.melody.length === 0) return;
        
        const modified = window.MelodyUtils.applyTensionResolution(
            melodyData.melody, 
            tension, 
            resolution
        );
        setPreviewMelody(modified);
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
        updateMelodyData({ 
            melody: previewMelody, 
            tension, 
            resolution 
        });
        nextStep();
    };

    const handleTensionChange = (value) => {
        setTension(value);
        updateMelodyData({ tension: value });
    };

    const handleResolutionChange = (value) => {
        setResolution(value);
        updateMelodyData({ resolution: value });
    };

    return (
        <div className="step-container">
            <div className="step-header">
                <h2>The Invisible Structure - Tension and Resolution</h2>
                <p className="step-description">
                    Music comes alive through tension and resolution. Adjust these sliders to shape 
                    the emotional journey of your melody.
                </p>
            </div>

            <div className="melody-preview">
                <MelodyVisualizer 
                    melody={previewMelody} 
                    isPlaying={isPlaying}
                    showComparison={true}
                    originalMelody={melodyData.melody}
                />
            </div>

            <div className="controls-section">
                <div className="control-group">
                    <label htmlFor="tension-slider">
                        <i className="fas fa-arrow-up"></i>
                        Melodic Tension: {tension}%
                    </label>
                    <input
                        id="tension-slider"
                        type="range"
                        min="0"
                        max="100"
                        value={tension}
                        onChange={(e) => handleTensionChange(parseInt(e.target.value))}
                        className="slider tension-slider"
                    />
                    <div className="slider-description">
                        <span>Calm, Low</span>
                        <span>Dramatic, High</span>
                    </div>
                </div>

                <div className="control-group">
                    <label htmlFor="resolution-slider">
                        <i className="fas fa-home"></i>
                        Resolution/Rest: {resolution}%
                    </label>
                    <input
                        id="resolution-slider"
                        type="range"
                        min="0"
                        max="100"
                        value={resolution}
                        onChange={(e) => handleResolutionChange(parseInt(e.target.value))}
                        className="slider resolution-slider"
                    />
                    <div className="slider-description">
                        <span>Wandering</span>
                        <span>Settling, Resolved</span>
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
                    {isPlaying ? 'Stop' : 'Listen to Changes'}
                </button>

                <button
                    className="btn btn-outline-secondary"
                    onClick={() => {
                        setTension(50);
                        setResolution(50);
                    }}
                >
                    <i className="fas fa-undo"></i>
                    Reset
                </button>
            </div>

            <div className="action-section">
                <button
                    className="btn btn-primary"
                    onClick={applyChanges}
                >
                    <i className="fas fa-check"></i>
                    Apply Changes & Continue
                </button>
            </div>

            <div className="education-section">
                <div className="concept-cards">
                    <div className="concept-card">
                        <h4><i className="fas fa-chart-line"></i> Tension</h4>
                        <p>
                            Higher tension creates excitement and drama by using higher pitches 
                            and larger intervals between notes.
                        </p>
                    </div>
                    <div className="concept-card">
                        <h4><i className="fas fa-anchor"></i> Resolution</h4>
                        <p>
                            Resolution brings the melody "home" to stable, comfortable notes 
                            that feel like a natural resting place.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

window.Step3TensionResolution = Step3TensionResolution;
