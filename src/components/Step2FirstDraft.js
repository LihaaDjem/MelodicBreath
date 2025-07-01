const { useState, useEffect } = React;

function Step2FirstDraft({ melodyData, updateMelodyData, nextStep, prevStep }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (melodyData.melody.length === 0) {
            generateFirstDraft();
        }
    }, []);

    const generateFirstDraft = async () => {
        setIsGenerating(true);
        setError('');
        
        try {
            const melody = await window.GeminiService.generateMelody(melodyData.emotion, melodyData.context);
            updateMelodyData({ melody });
        } catch (err) {
            setError('Failed to generate melody. Please try again.');
            console.error('Melody generation error:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const playMelody = async () => {
        if (melodyData.melody.length === 0) return;
        
        setIsPlaying(true);
        try {
            await window.AudioService.playMelody(melodyData.melody, melodyData.tempo);
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

    if (isGenerating) {
        return (
            <div className="step-container">
                <div className="loading-section">
                    <div className="loading-spinner">
                        <i className="fas fa-music fa-spin"></i>
                    </div>
                    <h3>Creating your melodic breath...</h3>
                    <p>AI is composing a melody based on "{melodyData.emotion}"</p>
                </div>
            </div>
        );
    }

    return (
        <div className="step-container">
            <div className="step-header">
                <h2>The Intuitive Draft - The First Take</h2>
                <p className="step-description">
                    Here's your first melodic breath! This melody was created to express "{melodyData.emotion}".
                </p>
            </div>

            {error && (
                <div className="alert alert-danger">
                    <i className="fas fa-exclamation-triangle"></i>
                    {error}
                    <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={generateFirstDraft}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {melodyData.melody.length > 0 && (
                <>
                    <div className="melody-preview">
                        <MelodyVisualizer 
                            melody={melodyData.melody} 
                            isPlaying={isPlaying}
                        />
                    </div>

                    <div className="playback-controls">
                        <button
                            className={`btn btn-success btn-lg ${isPlaying ? 'playing' : ''}`}
                            onClick={isPlaying ? stopPlayback : playMelody}
                            disabled={melodyData.melody.length === 0}
                        >
                            <i className={`fas ${isPlaying ? 'fa-stop' : 'fa-play'}`}></i>
                            {isPlaying ? 'Stop' : 'Listen to First Draft'}
                        </button>

                        <button
                            className="btn btn-outline-primary"
                            onClick={generateFirstDraft}
                            disabled={isGenerating}
                        >
                            <i className="fas fa-sync-alt"></i>
                            Generate New Draft
                        </button>
                    </div>

                    <div className="melody-info">
                        <div className="info-card">
                            <h4>Your Melody Details</h4>
                            <ul>
                                <li><strong>Emotion:</strong> {melodyData.emotion}</li>
                                <li><strong>Number of Notes:</strong> {melodyData.melody.length}</li>
                                <li><strong>Key:</strong> {window.MelodyUtils.detectKey(melodyData.melody)}</li>
                                <li><strong>Duration:</strong> ~{window.MelodyUtils.calculateDuration(melodyData.melody)} seconds</li>
                            </ul>
                        </div>
                    </div>

                    <div className="action-section">
                        <button
                            className="btn btn-primary"
                            onClick={nextStep}
                        >
                            <i className="fas fa-edit"></i>
                            Modify First Draft
                        </button>
                    </div>
                </>
            )}

            <div className="inspiration-section">
                <div className="inspiration-card">
                    <h4><i className="fas fa-lightbulb"></i> Understanding Your First Draft</h4>
                    <p>
                        This melody was created by AI based on your emotion. Notice how it makes you feel - 
                        does it capture what you wanted to express? In the next steps, you'll be able to 
                        adjust it to make it perfect!
                    </p>
                </div>
            </div>
        </div>
    );
}

window.Step2FirstDraft = Step2FirstDraft;
