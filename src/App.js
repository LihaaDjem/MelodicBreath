const { useState, useEffect } = React;

function App() {
    const [currentStep, setCurrentStep] = useState(1);
    const [melodyData, setMelodyData] = useState({
        emotion: '',
        context: '',
        melody: [],
        tempo: 120,
        tension: 50,
        resolution: 50,
        chordProgression: 'C-G-Am-F',
        voiceType: 'female'
    });

    const steps = [
        { number: 1, title: "The Initial Breath", component: Step1EmotionInput },
        { number: 2, title: "The Intuitive Draft", component: Step2FirstDraft },
        { number: 3, title: "The Invisible Structure", component: Step3TensionResolution },
        { number: 4, title: "Ingenious Simplicity", component: Step4Simplicity },
        { number: 5, title: "Rhythm and Breath", component: Step5Rhythm },
        { number: 6, title: "Subtle Harmony", component: Step6Harmony },
        { number: 7, title: "Arrangement and Timbre", component: Step7Arrangement }
    ];

    const updateMelodyData = (updates) => {
        setMelodyData(prev => ({ ...prev, ...updates }));
    };

    const nextStep = () => {
        if (currentStep < 7) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const goToStep = (step) => {
        setCurrentStep(step);
    };

    const CurrentStepComponent = steps[currentStep - 1].component;

    return (
        <div className="app-container">
            <header className="app-header">
                <h1 className="app-title">
                    <i className="fas fa-music"></i>
                    The Melodic Breath
                </h1>
                <div className="step-progress">
                    {steps.map((step, index) => (
                        <div 
                            key={step.number}
                            className={`step-indicator ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
                            onClick={() => goToStep(step.number)}
                        >
                            <div className="step-number">{step.number}</div>
                            <div className="step-title">{step.title}</div>
                        </div>
                    ))}
                </div>
            </header>

            <main className="app-main">
                <div className="step-content">
                    <CurrentStepComponent
                        melodyData={melodyData}
                        updateMelodyData={updateMelodyData}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        currentStep={currentStep}
                    />
                </div>

                <div className="navigation-controls">
                    {currentStep > 1 && (
                        <button 
                            className="btn btn-secondary"
                            onClick={prevStep}
                        >
                            <i className="fas fa-arrow-left"></i>
                            Previous
                        </button>
                    )}
                    {currentStep < 7 && melodyData.melody.length > 0 && (
                        <button 
                            className="btn btn-primary"
                            onClick={nextStep}
                        >
                            Next
                            <i className="fas fa-arrow-right"></i>
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
