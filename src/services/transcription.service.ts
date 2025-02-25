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

export enum TranscriptionStatus {
  IDLE = 'idle',
  INITIALIZING = 'initializing',
  REQUESTING_PERMISSION = 'requesting_permission',
  PERMISSION_DENIED = 'permission_denied',
  LISTENING = 'listening',
  PROCESSING = 'processing',
  ERROR = 'error',
  UNSUPPORTED = 'unsupported'
}

export interface TranscriptionError {
  code: string;
  message: string;
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

// Add these type declarations at the top of the file
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
    webkitAudioContext: typeof AudioContext;
  }
}

// Class to handle transcription using Web Speech API
export class TranscriptionService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private transcript: TranscriptionSegment[] = [];
  private currentSpeaker: string | null = null;
  private lastResultTimestamp: number = 0;
  private startTime: number = 0; // Add this line to track when recording started
  private onTranscriptUpdate: ((segments: TranscriptionSegment[]) => void) | null = null;
  private interimResult: string = '';
  private restartTimeout: NodeJS.Timeout | null = null;

  // Add reconnection attempt counter
  private reconnectionAttempts: number = 0;
  private readonly MAX_RECONNECTION_ATTEMPTS = 3;
  
  // Audio visualization properties
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private mediaStream: MediaStream | null = null;
  
  // Status tracking
  private status: TranscriptionStatus = TranscriptionStatus.IDLE;
  private error: TranscriptionError | null = null;
  public _onStatusChange: ((status: TranscriptionStatus, error?: TranscriptionError) => void) | null = null;

  constructor() {
    this.initRecognition();
  }
  
  // Get current status
  public getStatus(): TranscriptionStatus {
    return this.status;
  }
  
  // Get current error
  public getError(): TranscriptionError | null {
    return this.error;
  }
  
  // Get audio context and analyser for visualization
  public getAudioVisualizationData(): { audioContext: AudioContext | null, analyser: AnalyserNode | null } {
    return {
      audioContext: this.audioContext,
      analyser: this.analyser
    };
  }

  // Set status and notify listeners
  private setStatus(status: TranscriptionStatus, error?: TranscriptionError): void {
    this.status = status;
    this.error = error || null;
    
    if (this._onStatusChange) {
      this._onStatusChange(status, error);
    }
    
    console.log(`Transcription status: ${status}`, error ? `Error: ${error.message}` : '');
  }
  
  // Initialize audio context for visualization
  private async initAudioContext(): Promise<boolean> {
    try {
      // Create audio context with type assertion
      const AudioContextConstructor = (window.AudioContext || window.webkitAudioContext) as typeof AudioContext;
      this.audioContext = new AudioContextConstructor();
      
      // Create analyser node
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      
      return true;
    } catch (error) {
      console.error('Error initializing audio context:', error);
      this.setStatus(TranscriptionStatus.ERROR, {
        code: 'audio_context_error',
        message: 'Failed to initialize audio context'
      });
      return false;
    }
  }
  
  // Request microphone access
  private async requestMicrophoneAccess(): Promise<MediaStream> {
    try {
      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted, setting up audio context...');
      
      // Set up audio context and analyzer with type assertion
      const AudioContextConstructor = (window.AudioContext || window.webkitAudioContext) as typeof AudioContext;
      this.audioContext = new AudioContextConstructor();
      this.analyser = this.audioContext.createAnalyser();
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyser);
      this.mediaStream = stream;
      
      console.log('Audio context and analyser set up successfully');
      return stream;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      this.setStatus(TranscriptionStatus.PERMISSION_DENIED, {
        code: 'permission_denied',
        message: 'Failed to access microphone'
      });
      throw error;
    }
  }

  private async initRecognition() {
    try {
      console.log('Initializing speech recognition...');
      if (this.recognition) {
        console.log('Cleaning up existing recognition instance...');
        // Properly clean up existing instance
        this.recognition.onend = null;
        this.recognition.onerror = null;
        this.recognition.onresult = null;
        try {
          this.recognition.abort();
        } catch (e) {
          console.log('Error aborting existing recognition:', e);
        }
        this.recognition = null;
      }

      this.setStatus(TranscriptionStatus.INITIALIZING);
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error('Speech recognition not supported in this browser');
        this.setStatus(TranscriptionStatus.UNSUPPORTED, {
          code: 'unsupported_browser',
          message: 'Speech recognition is not supported in this browser'
        });
        return false;
      }

      this.recognition = new SpeechRecognition();
      
      if (this.recognition) {
        console.log('Configuring speech recognition...');
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 1;

        // Bind event handlers
        this.recognition.onresult = this.handleRecognitionResult.bind(this);
        this.recognition.onerror = this.handleRecognitionError.bind(this);
        this.recognition.onend = this.handleRecognitionEnd.bind(this);
        this.recognition.onstart = () => {
          console.log('Recognition started');
          this.reconnectionAttempts = 0;
          this.setStatus(TranscriptionStatus.LISTENING);
        };

        this.setStatus(TranscriptionStatus.IDLE);
        console.log('Speech recognition initialized successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error initializing recognition:', error);
      this.setStatus(TranscriptionStatus.ERROR, {
        code: 'init_error',
        message: 'Failed to initialize speech recognition'
      });
      return false;
    }
  }

  private handleRecognitionResult(event: SpeechRecognitionEvent) {
    const now = Date.now() / 1000;
    let interimTranscript = '';
    let finalText = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const transcript = result[0].transcript;

      if (result.isFinal) {
        console.log('Final transcript:', transcript);
        finalText = transcript;
        
        const pauseDuration = this.lastResultTimestamp ? now - this.lastResultTimestamp : 0;
        this.currentSpeaker = assignSpeaker(this.currentSpeaker, pauseDuration);
        
        const newSegment = {
          id: `segment-${Date.now()}`,
          speaker: this.currentSpeaker,
          text: transcript.trim(),
          startTime: (this.lastResultTimestamp - this.startTime) || 0, // Adjust to relative time
          endTime: now - this.startTime, // Adjust to relative time
          confidence: result[0].confidence
        };
        
        console.log('Adding new segment:', newSegment);
        this.transcript.push(newSegment);
        this.lastResultTimestamp = now;
      } else {
        interimTranscript += transcript;
      }
    }

    this.interimResult = interimTranscript;

    if (this.onTranscriptUpdate) {
      const updatedTranscript = [...this.transcript];
      if (this.interimResult) {
        updatedTranscript.push({
          id: 'interim',
          speaker: this.currentSpeaker || 'Speaker A',
          text: this.interimResult.trim(),
          startTime: (this.lastResultTimestamp - this.startTime) || 0, // Adjust to relative time
          endTime: now - this.startTime, // Adjust to relative time
          confidence: 0
        });
      }
      console.log('Updating transcript with segments:', updatedTranscript);
      this.onTranscriptUpdate(updatedTranscript);
    }
  }

  private handleRecognitionError(event: SpeechRecognitionErrorEvent) {
    console.error('Speech recognition error', event.error);
    
    switch (event.error) {
      case 'not-allowed':
        this.setStatus(TranscriptionStatus.PERMISSION_DENIED, {
          code: 'permission_denied',
          message: 'Microphone access was denied'
        });
        this.isListening = false;
        break;
      case 'network':
        if (this.reconnectionAttempts < this.MAX_RECONNECTION_ATTEMPTS) {
          this.reconnectionAttempts++;
          this.restartRecognition();
        } else {
          this.setStatus(TranscriptionStatus.ERROR, {
            code: 'network',
            message: 'Network connection failed'
          });
          this.isListening = false;
        }
        break;
      default:
        if (this.isListening) {
          this.restartRecognition();
        }
        break;
    }
  }

  private handleRecognitionEnd() {
    console.log('Recognition ended, isListening:', this.isListening);
    
    // Only attempt to restart if we're still supposed to be listening
    if (this.isListening) {
      if (this.reconnectionAttempts < this.MAX_RECONNECTION_ATTEMPTS) {
        console.log(`Attempting to restart recognition (attempt ${this.reconnectionAttempts + 1}/${this.MAX_RECONNECTION_ATTEMPTS})`);
        this.restartRecognition();
      } else {
        console.log('Max reconnection attempts reached, stopping transcription');
        this.isListening = false;
        this.setStatus(TranscriptionStatus.ERROR, {
          code: 'max_reconnections',
          message: 'Maximum reconnection attempts reached'
        });
      }
    } else {
      console.log('Recognition ended normally, not restarting');
      this.setStatus(TranscriptionStatus.IDLE);
    }
  }

  private restartRecognition() {
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
    }

    this.restartTimeout = setTimeout(() => {
      if (this.isListening) {
        try {
          console.log('Restarting recognition...');
          if (this.recognition) {
            this.recognition.start();
            this.reconnectionAttempts++;
          } else {
            console.error('Recognition object is null during restart');
            this.initRecognition().then(success => {
              if (success && this.recognition && this.isListening) {
                this.recognition.start();
                this.reconnectionAttempts++;
              }
            });
          }
        } catch (error) {
          console.error('Error restarting recognition:', error);
          this.setStatus(TranscriptionStatus.ERROR, {
            code: 'restart_error',
            message: 'Failed to restart recognition'
          });
          this.isListening = false;
        }
      }
    }, 1000);
  }

  // Register status change listener
  public onStatus(callback: (status: TranscriptionStatus, error?: TranscriptionError) => void): void {
    this._onStatusChange = callback;
  }

  // Start transcription
  public async start(onUpdate: (segments: TranscriptionSegment[]) => void): Promise<boolean> {
    try {
      console.log('Starting transcription service...');
      if (this.isListening) {
        console.log('Already listening, stopping current session first');
        this.stop();
      }

      // Always re-initialize recognition to ensure a clean state
      console.log('Initializing recognition...');
      const initSuccess = await this.initRecognition();
      if (!initSuccess) {
        console.error('Failed to initialize recognition');
        return false;
      }

      this.setStatus(TranscriptionStatus.REQUESTING_PERMISSION);

      console.log('Requesting microphone access...');
      await this.requestMicrophoneAccess();

      console.log('Setting up transcription...');
      this.onTranscriptUpdate = onUpdate;
      this.isListening = true;
      this.transcript = [];
      this.currentSpeaker = null;
      this.startTime = Date.now() / 1000;
      this.lastResultTimestamp = this.startTime;
      this.interimResult = '';
      this.reconnectionAttempts = 0;

      console.log('Starting recognition...');
      if (this.recognition) {
        this.recognition.start();
        return true;
      } else {
        throw new Error('Recognition not initialized');
      }
    } catch (error) {
      console.error('Error starting recognition:', error);
      this.setStatus(TranscriptionStatus.ERROR, {
        code: 'start_error',
        message: 'Failed to start recognition'
      });
      this.isListening = false;
      return false;
    }
  }

  // Stop transcription
  public stop(): TranscriptionSegment[] {
    console.log('Stopping transcription service...');
    this.isListening = false;
    
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }

    // Clean up audio resources
    this.cleanupAudioResources();

    // Stop recognition
    if (this.recognition) {
      // Remove all event listeners before stopping
      this.recognition.onresult = null;
      this.recognition.onerror = null;
      this.recognition.onend = null;
      this.recognition.onstart = null;

      try {
        this.recognition.abort(); // Use abort() instead of stop() to immediately terminate
        // Re-initialize recognition to ensure a clean state for next use
        this.initRecognition();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }

    this.setStatus(TranscriptionStatus.IDLE);
    return [...this.transcript];
  }
  
  // Clean up audio resources
  private cleanupAudioResources(): void {
    try {
      if (this.microphone) {
        this.microphone.disconnect();
        this.microphone = null;
      }
      
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => {
          track.stop();
        });
        this.mediaStream = null;
      }
      
      if (this.audioContext && this.audioContext.state !== 'closed') {
        this.audioContext.suspend().catch(console.error);
      }
      
      this.analyser = null;
    } catch (error) {
      console.error('Error cleaning up audio resources:', error);
    }
  }

  // Save transcript
  public saveTranscript(title: string): Transcript {
    const now = Date.now() / 1000;
    const duration = now - this.startTime; // Calculate total duration

    const transcript: Transcript = {
      id: `transcript-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: title || `Transcript ${new Date().toLocaleString()}`,
      segments: [...this.transcript],
      createdAt: new Date(),
      duration: duration
    };

    console.log('Saving transcript:', transcript);
    return transcript;
  }
}

// Create a singleton instance
const transcriptionService = new TranscriptionService();
export default transcriptionService;
