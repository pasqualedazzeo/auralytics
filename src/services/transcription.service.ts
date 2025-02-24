// Types for transcription
export interface TranscriptionSegment {
  id: string;
  speaker: string;
  text: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

export interface Transcript {
  id: string;
  title: string;
  segments: TranscriptionSegment[];
  createdAt: Date;
  duration: number;
}

// Mock speaker diarization
// In a real app, this would be handled by a more sophisticated algorithm or service
const assignSpeaker = (previousSpeaker: string | null, pauseDuration: number): string => {
  // If there was a significant pause, we might have a speaker change
  if (!previousSpeaker || pauseDuration > 1.5) {
    // Randomly assign Speaker A or Speaker B
    return Math.random() > 0.5 ? 'Speaker A' : 'Speaker B';
  }
  
  // Otherwise, keep the same speaker with high probability
  return Math.random() > 0.2 ? previousSpeaker : (previousSpeaker === 'Speaker A' ? 'Speaker B' : 'Speaker A');
};

// Class to handle transcription using Web Speech API
export class TranscriptionService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private transcript: TranscriptionSegment[] = [];
  private currentSpeaker: string | null = null;
  private lastResultTimestamp: number = 0;
  private onTranscriptUpdate: ((segments: TranscriptionSegment[]) => void) | null = null;
  private interimResult: string = '';

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    // Check if browser supports SpeechRecognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported in this browser');
      return;
    }

    // Create SpeechRecognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    // Configure recognition
    if (this.recognition) {
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      // Handle results
      this.recognition.onresult = (event) => {
        const now = Date.now() / 1000; // Current time in seconds
        let interimTranscript = '';
        let finalTranscript = '';

        // Process results
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;

          if (result.isFinal) {
            finalTranscript += transcript;
            
            // Calculate pause duration since last result
            const pauseDuration = this.lastResultTimestamp ? now - this.lastResultTimestamp : 0;
            
            // Determine speaker
            this.currentSpeaker = assignSpeaker(this.currentSpeaker, pauseDuration);
            
            // Add segment to transcript
            this.transcript.push({
              id: `segment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              speaker: this.currentSpeaker,
              text: transcript.trim(),
              startTime: this.lastResultTimestamp || now,
              endTime: now,
              confidence: result[0].confidence
            });

            // Update last result timestamp
            this.lastResultTimestamp = now;
            
            // Clear interim result
            this.interimResult = '';
          } else {
            interimTranscript += transcript;
            this.interimResult = interimTranscript;
          }
        }

        // Notify listeners of update
        if (this.onTranscriptUpdate && (finalTranscript || interimTranscript)) {
          // Create a copy of the transcript with the interim result appended
          const updatedTranscript = [...this.transcript];
          
          if (this.interimResult) {
            // Add interim result as a temporary segment
            updatedTranscript.push({
              id: 'interim',
              speaker: this.currentSpeaker || 'Unknown',
              text: this.interimResult.trim(),
              startTime: this.lastResultTimestamp || now,
              endTime: now,
              confidence: 0
            });
          }
          
          this.onTranscriptUpdate(updatedTranscript);
        }
      };

      // Handle errors
      this.recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
      };

      // Restart recognition when it ends
      this.recognition.onend = () => {
        if (this.isListening) {
          this.recognition?.start();
        }
      };
    }
  }

  // Start transcription
  public start(onUpdate: (segments: TranscriptionSegment[]) => void): void {
    if (!this.recognition) {
      console.error('Speech recognition not initialized');
      return;
    }

    this.onTranscriptUpdate = onUpdate;
    this.isListening = true;
    this.transcript = [];
    this.currentSpeaker = null;
    this.lastResultTimestamp = 0;
    this.interimResult = '';

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition', error);
    }
  }

  // Stop transcription
  public stop(): TranscriptionSegment[] {
    if (!this.recognition) {
      console.error('Speech recognition not initialized');
      return [];
    }

    this.isListening = false;
    try {
      this.recognition.stop();
    } catch (error) {
      console.error('Error stopping speech recognition', error);
    }

    // Return the final transcript
    return [...this.transcript];
  }

  // Save transcript
  public saveTranscript(title: string): Transcript {
    // Calculate total duration
    const startTime = this.transcript.length > 0 ? this.transcript[0].startTime : 0;
    const endTime = this.transcript.length > 0 ? this.transcript[this.transcript.length - 1].endTime : 0;
    const duration = endTime - startTime;

    // Create transcript object
    const transcript: Transcript = {
      id: `transcript-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: title || `Transcript ${new Date().toLocaleString()}`,
      segments: [...this.transcript],
      createdAt: new Date(),
      duration: duration
    };

    // In a real app, this would save to a database or API
    // For now, we'll just return the transcript
    return transcript;
  }
}

// Create a singleton instance
const transcriptionService = new TranscriptionService();
export default transcriptionService;
