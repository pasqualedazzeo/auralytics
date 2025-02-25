import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  TranscriptionService, 
  TranscriptionStatus, 
  TranscriptionSegment, 
  TranscriptionError,
  Transcript
} from '../services/transcription.service';
import { v4 as uuidv4 } from 'uuid';

export const useTranscription = () => {
  const [transcript, setTranscript] = useState<TranscriptionSegment[]>([]);
  const [status, setStatus] = useState<TranscriptionStatus>(TranscriptionStatus.IDLE);
  const [error, setError] = useState<TranscriptionError | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Use refs to maintain instance across renders
  const transcriptionServiceRef = useRef<TranscriptionService | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  
  // Initialize the transcription service
  useEffect(() => {
    if (!transcriptionServiceRef.current) {
      transcriptionServiceRef.current = new TranscriptionService();
      
      // Get audio visualization data
      const { audioContext, analyser } = transcriptionServiceRef.current.getAudioVisualizationData();
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
    }
    
    return () => {
      // Clean up on unmount
      if (transcriptionServiceRef.current) {
        transcriptionServiceRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Start recording timer
  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setRecordingTime(elapsed);
    }, 1000);
  }, []);
  
  // Stop recording timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  // Add this function to your useTranscription hook
  const ensureAudioVisualization = useCallback(async () => {
    if (!transcriptionServiceRef.current) return;
    
    // Get fresh audio visualization data
    const { audioContext, analyser } = transcriptionServiceRef.current.getAudioVisualizationData();
    
    // If we have an audio context but it's not running, try to resume it
    if (audioContext && audioContext.state !== 'running') {
      try {
        await audioContext.resume();
        console.log('Audio context resumed successfully');
      } catch (err) {
        console.error('Failed to resume audio context:', err);
      }
    }
    
    // Update refs with the latest values
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    
    // Force a re-render to update the visualizer
    setIsRecording(prev => prev);
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    if (!transcriptionServiceRef.current) return;
    
    try {
      setStatus(TranscriptionStatus.REQUESTING_PERMISSION);
      
      // Register status change listener before starting
      transcriptionServiceRef.current._onStatusChange = (newStatus, newError) => {
        setStatus(newStatus);
        if (newError) setError(newError);
      };
      
      // Start the actual transcription service
      const success = await transcriptionServiceRef.current.start((segments) => {
        setTranscript(segments);
      });
      
      if (success) {
        setIsRecording(true);
        startTimer();
        
        // Ensure audio visualization is working
        await ensureAudioVisualization();
      }
    } catch (err) {
      console.error('Error starting recording:', err);
      setStatus(TranscriptionStatus.ERROR);
      setError({
        code: 'MICROPHONE_ACCESS_DENIED',
        message: 'Failed to access microphone. Please check permissions.'
      });
    }
  }, [startTimer, ensureAudioVisualization]);
  
  // Stop recording
  const stopRecording = useCallback(() => {
    if (!transcriptionServiceRef.current) return;
    
    try {
      // Stop the actual transcription service
      const finalSegments = transcriptionServiceRef.current.stop();
      setTranscript(finalSegments);
      setIsRecording(false);
      stopTimer();
      setStatus(TranscriptionStatus.IDLE);
    } catch (err) {
      console.error('Error stopping recording:', err);
      setStatus(TranscriptionStatus.ERROR);
      setError({
        code: 'STOP_ERROR',
        message: 'Failed to stop recording properly.'
      });
    }
  }, [stopTimer]);
  
  // Save transcript
  const saveTranscript = useCallback((title: string): Transcript => {
    if (!transcriptionServiceRef.current) {
      throw new Error('Transcription service not initialized');
    }
    
    // Create a new transcript object
    const savedTranscript: Transcript = {
      id: uuidv4(),
      title,
      segments: transcript.filter(segment => segment.id !== 'interim'), // Remove interim results
      createdAt: new Date(),
      duration: recordingTime
    };
    
    // Here you would typically save to a database or storage service
    console.log('Saving transcript:', savedTranscript);
    
    return savedTranscript;
  }, [transcript, recordingTime]);
  
  // Reset transcription
  const resetTranscription = useCallback(() => {
    setTranscript([]);
    setStatus(TranscriptionStatus.IDLE);
    setError(null);
    setIsRecording(false);
    setRecordingTime(0);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  return {
    transcript,
    status,
    error,
    startRecording,
    stopRecording,
    isRecording,
    saveTranscript,
    resetTranscription,
    recordingTime,
    audioContext: audioContextRef.current,
    analyser: analyserRef.current
  };
};
