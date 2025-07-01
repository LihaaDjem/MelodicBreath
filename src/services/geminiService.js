class GeminiService {
    constructor() {
        this.baseUrl = '/api/gemini';
    }

    async generateMelody(emotion, context = '') {
        try {
            const scale = this.determineScale(emotion);
            const prompt = this.buildMelodyPrompt(emotion, context, scale);
            
            const response = await fetch(`${this.baseUrl}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return this.parseMelodyResponse(data.melody);
        } catch (error) {
            console.error('Gemini API error:', error);
            // Fallback to a simple generated melody
            return this.generateFallbackMelody(emotion);
        }
    }

    determineScale(emotion) {
        const joyfulEmotions = ['joy', 'happiness', 'excitement', 'hope', 'wonder', 'love'];
        const isJoyful = joyfulEmotions.some(e => 
            emotion.toLowerCase().includes(e.toLowerCase())
        );
        return isJoyful ? 'major' : 'minor';
    }

    buildMelodyPrompt(emotion, context, scale) {
        let prompt = `Generate a simple, memorable melodic sequence of 6 to 8 measures to express the emotion of "${emotion}"`;
        
        if (context.trim()) {
            prompt += ` with a context of "${context}"`;
        }
        
        prompt += `. Use a ${scale} scale. `;
        prompt += `Represent the melody as a JSON array of objects with "note" (like "C4", "D4", "E4") and "duration" (like "4n", "8n", "2n") properties. `;
        prompt += `Make sure the response is only valid JSON with no explanatory text. `;
        prompt += `Example format: [{"note": "C4", "duration": "4n"}, {"note": "D4", "duration": "8n"}]`;
        
        return prompt;
    }

    parseMelodyResponse(responseText) {
        try {
            // Clean the response text
            let cleanedResponse = responseText.trim();
            
            // Remove any markdown code blocks
            cleanedResponse = cleanedResponse.replace(/```json\s*|\s*```/g, '');
            cleanedResponse = cleanedResponse.replace(/```\s*|\s*```/g, '');
            
            // Try to find JSON array in the response
            const jsonMatch = cleanedResponse.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                cleanedResponse = jsonMatch[0];
            }

            const melody = JSON.parse(cleanedResponse);
            
            // Validate the melody structure
            if (Array.isArray(melody) && melody.length > 0) {
                return melody.filter(note => 
                    note.note && note.duration && 
                    typeof note.note === 'string' && 
                    typeof note.duration === 'string'
                );
            }
            
            throw new Error('Invalid melody structure');
        } catch (error) {
            console.error('Failed to parse melody response:', error);
            throw error;
        }
    }

    generateFallbackMelody(emotion) {
        const scale = this.determineScale(emotion);
        const notes = scale === 'major' 
            ? ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']
            : ['C4', 'D4', 'Eb4', 'F4', 'G4', 'Ab4', 'Bb4', 'C5'];
        
        const durations = ['4n', '8n', '4n.', '2n'];
        const melody = [];
        
        // Generate 6-8 notes
        const length = 6 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < length; i++) {
            const note = notes[Math.floor(Math.random() * notes.length)];
            const duration = durations[Math.floor(Math.random() * durations.length)];
            melody.push({ note, duration });
        }
        
        return melody;
    }
}

window.GeminiService = new GeminiService();
