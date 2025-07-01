const { useState } = React;

function Step1EmotionInput({ melodyData, updateMelodyData, nextStep }) {
    const [emotion, setEmotion] = useState(melodyData.emotion || '');
    const [context, setContext] = useState(melodyData.context || '');

    const handleStartMelody = () => {
        if (emotion.trim()) {
            updateMelodyData({ emotion, context });
            nextStep();
        }
    };

    const emotionSuggestions = [
        'Joy', 'Sadness', 'Hope', 'Excitement', 'Calm', 'Melancholy', 
        'Wonder', 'Love', 'Nostalgia', 'Adventure', 'Peace', 'Mystery'
    ];

    return (
        <div className="step-container">
            <div className="step-header">
                <h2>The Initial Breath - Emotion and Intention</h2>
                <p className="step-description">
                    Every melody begins with a feeling. What emotion do you want to express through your music today?
                </p>
            </div>

            <div className="input-section">
                <div className="form-group">
                    <label htmlFor="emotion-input">
                        <i className="fas fa-heart"></i>
                        What emotion do you want to express? *
                    </label>
                    <input
                        id="emotion-input"
                        type="text"
                        className="form-control emotion-input"
                        placeholder="Joy, Sadness, Hope..."
                        value={emotion}
                        onChange={(e) => setEmotion(e.target.value)}
                        required
                    />
                    
                    <div className="emotion-suggestions">
                        <p>Suggestions:</p>
                        <div className="suggestion-chips">
                            {emotionSuggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    className={`suggestion-chip ${emotion === suggestion ? 'active' : ''}`}
                                    onClick={() => setEmotion(suggestion)}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="context-input">
                        <i className="fas fa-book-open"></i>
                        Describe the context or story... (optional)
                    </label>
                    <textarea
                        id="context-input"
                        className="form-control context-input"
                        placeholder="The joy of an unexpected meeting..."
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        rows="3"
                    />
                </div>
            </div>

            <div className="action-section">
                <button
                    className="btn btn-primary btn-lg start-melody-btn"
                    onClick={handleStartMelody}
                    disabled={!emotion.trim()}
                >
                    <i className="fas fa-music"></i>
                    Start Melody
                </button>
            </div>

            <div className="inspiration-section">
                <div className="inspiration-card">
                    <h4><i className="fas fa-lightbulb"></i> Tip for Young Musicians</h4>
                    <p>
                        Music is the language of emotions! Think about how this feeling makes your body want to move. 
                        Does it make you want to jump (high notes) or curl up (low notes)? Fast or slow?
                    </p>
                </div>
            </div>
        </div>
    );
}

window.Step1EmotionInput = Step1EmotionInput;
