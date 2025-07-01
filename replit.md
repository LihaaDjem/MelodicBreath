# The Melodic Breath - Music Composition Web App

## Overview

The Melodic Breath is a web-based music composition application that guides users through a 7-step process to create personalized melodies based on emotions and musical preferences. The app combines AI-powered melody generation with interactive music theory concepts to help users explore music composition in an intuitive way.

## System Architecture

### Frontend Architecture
- **Framework**: Pure React (via CDN) with Babel for JSX compilation
- **UI Framework**: Bootstrap 5.1.3 for responsive design
- **Audio Engine**: Tone.js 14.7.77 for Web Audio API abstraction
- **Icons**: Font Awesome 6.0.0 for visual elements
- **Build System**: No bundler - direct script loading in browser

### Backend Architecture
- **Runtime**: Node.js with Express 5.1.0
- **Server**: Simple static file server with API endpoints
- **AI Integration**: Google Gemini API for melody generation
- **CORS**: Custom middleware for cross-origin requests

### Data Storage
- **Client-side**: Browser localStorage for melody persistence
- **No Database**: Simple file-based storage approach
- **Data Format**: JSON objects for melody data structure

## Key Components

### Core Application Flow
1. **Step1EmotionInput**: Captures user emotion and context
2. **Step2FirstDraft**: AI-generated initial melody using Gemini API
3. **Step3TensionResolution**: Musical tension and resolution adjustments
4. **Step4Simplicity**: Melody simplification and variation tools
5. **Step5Rhythm**: Tempo and rhythm pattern modifications
6. **Step6Harmony**: Chord progression selection and preview
7. **Step7Arrangement**: Voice type selection and final composition

### Audio Services
- **AudioService**: Manages Tone.js synthesizers and playback
- **Multiple Synths**: Separate synthesizers for melody, chords, and voice-like sounds
- **Real-time Playback**: Live audio feedback for user modifications

### AI Integration
- **GeminiService**: Handles API communication with Google Gemini
- **Fallback System**: Local melody generation when API fails
- **Prompt Engineering**: Structured prompts for consistent musical output

### Utility Functions
- **MelodyUtils**: Music theory calculations and melody manipulations
- **StorageService**: localStorage abstraction for data persistence
- **MelodyVisualizer**: Visual representation of musical notes and progressions

## Data Flow

1. **User Input**: Emotion and context captured in Step 1
2. **AI Generation**: Gemini API generates initial melody based on emotion
3. **Progressive Refinement**: Each step modifies melody through different musical aspects
4. **Real-time Preview**: Audio playback at each step for immediate feedback
5. **Final Storage**: Completed melody saved to localStorage with metadata

### Melody Data Structure
```javascript
{
  emotion: string,
  context: string,
  melody: [{ note: "C4", duration: "4n" }],
  tempo: number,
  tension: number,
  resolution: number,
  chordProgression: string,
  voiceType: string
}
```

## External Dependencies

### CDN Dependencies
- React 18 (development build)
- React DOM 18
- Babel Standalone (JSX compilation)
- Bootstrap 5.1.3 (CSS framework)
- Font Awesome 6.0.0 (icons)
- Tone.js 14.7.77 (audio synthesis)

### NPM Dependencies
- `@google/genai`: Direct Gemini API integration
- `@google/generative-ai`: Alternative Gemini client
- `express`: Web server framework
- `tone`: Audio synthesis (server-side reference)

### API Integration
- **Google Gemini API**: Requires `GEMINI_API_KEY` environment variable
- **Model**: Uses `gemini-2.0-flash-exp` for melody generation
- **Fallback**: Local algorithm when API unavailable

## Deployment Strategy

### Development Setup
- Single HTML file entry point (`index.html`)
- Static file serving via Express
- Environment variable for Gemini API key
- Port configuration via `PORT` environment variable (default: 5000)

### Production Considerations
- **Static Hosting**: Can be deployed to any static host (frontend only)
- **Server Hosting**: Express server needed for Gemini API proxy
- **Environment Variables**: Secure API key management required
- **CORS Configuration**: Wildcard CORS for development (needs restriction for production)

### File Structure
```
/
├── index.html (entry point)
├── server.js (Express server)
├── package.json (dependencies)
├── src/
│   ├── components/ (React components)
│   ├── services/ (API and utility services)
│   ├── utils/ (helper functions)
│   └── styles/ (CSS styling)
```

## Changelog
- July 01, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.