const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// API Routes
app.post('/api/gemini/generate', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        console.log('Generating melody with prompt:', prompt);

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        
        const result = await model.generateContent({
            contents: [{
                role: 'user',
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        });

        const response = await result.response;
        const melodyText = response.text();
        
        console.log('Gemini response:', melodyText);

        // Try to parse the melody from the response
        let melody;
        try {
            // Clean the response text
            let cleanedResponse = melodyText.trim();
            
            // Remove any markdown code blocks
            cleanedResponse = cleanedResponse.replace(/```json\s*|\s*```/g, '');
            cleanedResponse = cleanedResponse.replace(/```\s*|\s*```/g, '');
            
            // Try to find JSON array in the response
            const jsonMatch = cleanedResponse.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                cleanedResponse = jsonMatch[0];
            }

            melody = JSON.parse(cleanedResponse);
            
            // Validate the melody structure
            if (!Array.isArray(melody) || melody.length === 0) {
                throw new Error('Invalid melody structure');
            }

            // Ensure all notes have the required properties
            melody = melody.filter(note => 
                note.note && note.duration && 
                typeof note.note === 'string' && 
                typeof note.duration === 'string'
            );

            if (melody.length === 0) {
                throw new Error('No valid notes in melody');
            }

        } catch (parseError) {
            console.error('Failed to parse melody, generating fallback:', parseError);
            melody = generateFallbackMelody();
        }

        res.json({ 
            success: true, 
            melody: melody,
            original_response: melodyText 
        });

    } catch (error) {
        console.error('Gemini API error:', error);
        
        // Return fallback melody on any error
        const fallbackMelody = generateFallbackMelody();
        
        res.json({ 
            success: true, 
            melody: fallbackMelody,
            fallback: true,
            error: error.message 
        });
    }
});

// Fallback melody generator
function generateFallbackMelody() {
    const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
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

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        gemini_api_configured: !!process.env.GEMINI_API_KEY
    });
});

// Serve the main app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch all handler for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎵 The Melodic Breath app is running on port ${PORT}`);
    console.log(`📱 Open http://localhost:${PORT} to start creating melodies`);
    console.log(`🤖 Gemini API configured: ${!!process.env.GEMINI_API_KEY}`);
    
    if (!process.env.GEMINI_API_KEY) {
        console.log('⚠️  Warning: GEMINI_API_KEY not found. The app will use fallback melodies.');
        console.log('   Set GEMINI_API_KEY environment variable for AI-powered melody generation.');
    }
});
