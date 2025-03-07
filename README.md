# Auralytics

A modern web application for live speech transcription with speaker diarization and AI-powered analysis.

![Auralytics Screenshot](https://via.placeholder.com/800x450.png?text=Transcription+App)

## Overview

Auralytics is a React-based web application that allows users to record and transcribe conversations in real-time. The application features speaker diarization to distinguish between different speakers, and provides AI-powered analysis tools to extract insights from transcripts.

## Features

### Authentication
- User registration and login system
- Google authentication integration (mocked for demo purposes)
- Protected routes for authenticated users

### Live Transcription
- Real-time speech-to-text conversion using Web Speech API
- Automatic speaker diarization
- Start/stop recording functionality
- Transcript saving with custom titles
- Audio visualization during recording

### Transcript Management
- View all saved transcripts
- Detailed transcript view with speaker segments
- Transcript storage using browser's localStorage

### AI Analysis
- Transcript summarization
- Key points extraction
- Sentiment analysis with speaker breakdown
- Topic identification

### User Interface
- Clean, responsive design using Tailwind CSS
- User dashboard with statistics and recent transcripts
- Intuitive navigation between different sections
- Audio visualization for recording feedback

## Technologies Used

- **Frontend**: React, TypeScript, React Router
- **Styling**: Tailwind CSS
- **Speech Recognition**: Web Speech API
- **Audio Processing**: Web Audio API for visualization
- **State Management**: React Context API
- **Storage**: localStorage
- **Authentication**: Custom mock implementation (for demo)
- **AI Analysis**: Mock implementations (for demo)

## Installation

### Prerequisites
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/transcription-app.git
   cd transcription-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage Guide

### Authentication
- Register a new account or use the mock login with any email/password combination
- Alternatively, click "Sign in with Google" for mock Google authentication

### Recording a Transcription
1. Navigate to the "New Transcription" page
2. Click the "Start Recording" button to begin transcription
3. Speak clearly into your microphone
4. Click "Stop Recording" when finished
5. Enter a title for your transcript
6. Click "Save Transcript" to store it

### Viewing Transcripts
1. Navigate to the "Transcripts" page
2. Select a transcript from the list to view its details
3. Use the AI analysis tabs to generate insights:
   - Summary: Get a concise summary of the transcript
   - Key Points: Extract important points from the conversation
   - Sentiment: Analyze the emotional tone of the conversation
   - Topics: Identify main topics discussed

## Project Structure

```
transcription-app/
├── public/                  # Static files
├── src/                     # Source code
│   ├── components/          # React components
│   │   ├── auth/            # Authentication components
│   │   ├── shared/          # Shared UI components
│   │   └── transcription/   # Transcription-related components
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   ├── services/            # Service modules
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main App component
│   └── index.tsx            # Application entry point
└── package.json             # Project dependencies and scripts
```

## Browser Compatibility

The application uses the Web Speech API and Web Audio API, which have varying levels of support across browsers:
- Chrome: Full support
- Edge: Full support
- Firefox: Partial support
- Safari: Partial support

For the best experience, use Chrome or Edge.

## Limitations

- **Speech Recognition**: The Web Speech API may not work in all browsers and requires an internet connection
- **Speaker Diarization**: The current implementation uses a simplified algorithm and may not be as accurate as professional solutions
- **Storage**: Transcripts are stored in localStorage, which has limited capacity and is cleared when browser data is cleared
- **Authentication**: The current implementation uses mock authentication and is not secure for production use
- **AI Analysis**: The current implementation uses mock data and does not perform actual AI analysis
- **Error Handling**: Some error states may not be properly communicated to the user

## Future Improvements

- Implement a backend server for secure authentication and data storage
- Connect to professional speech-to-text APIs for improved accuracy
- Integrate with real AI services for transcript analysis
- Add export functionality for transcripts (PDF, Word, etc.)
- Implement real-time collaboration features
- Add support for multiple languages
- Improve accessibility features
- Enhance error handling and recovery mechanisms

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Create React App](https://create-react-app.dev/) for the project setup
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for speech recognition capabilities
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) for audio visualization
- [React Router](https://reactrouter.com/) for routing