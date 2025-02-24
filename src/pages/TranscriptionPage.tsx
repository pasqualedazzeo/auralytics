import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/shared/Layout';
import transcriptionService, { 
  TranscriptionSegment, 
  TranscriptionStatus, 
  TranscriptionError 
} from '../services/transcription.service';
import storageService from '../services/storage.service';
import TranscriptionStatusComponent from '../components/transcription/TranscriptionStatus';

const TranscriptionPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptSegments, setTranscriptSegments] = useState<TranscriptionSegment[]>([]);
  const [transcriptTitle, setTranscriptTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [status, setStatus] = useState<TranscriptionStatus>(TranscriptionStatus.IDLE);
  const [error, setError] = useState<TranscriptionError | null>(null);
  const [audioVisualizationData, setAudioVisualizationData] = useState<{
    audioContext: AudioContext | null;
    analyser: AnalyserNode | null;
  }>({ audioContext: null, analyser: null });
  
  const navigate = useNavigate();

  // Memoize functions to avoid stale closures in useEffect
  const startRecording = useCallback(async () => {
    setSaveSuccess(false);
    setError(null);
    
    try {
      const success = await transcriptionService.start((segments) => {
        setTranscriptSegments(segments);
      });
      
      if (success) {
        setIsRecording(true);
        setTranscriptSegments([]);
        
        const { audioContext, analyser } = transcriptionService.getAudioVisualizationData();
        setAudioVisualizationData({ audioContext, analyser });
      } else {
        setError({
          code: 'start_error',
          message: 'Failed to start recording'
        });
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      setError({
        code: 'start_error',
        message: 'Failed to start recording'
      });
    }
  }, []);

  // Stop recording
  const stopRecording = useCallback(() => {
    try {
      setIsRecording(false);
      const finalSegments = transcriptionService.stop();
      setTranscriptSegments(finalSegments);
      setAudioVisualizationData({ audioContext: null, analyser: null });
    } catch (error) {
      console.error('Error stopping recording:', error);
      setError({
        code: 'stop_error',
        message: 'Failed to stop recording'
      });
    }
  }, []);

  // Save transcript
  const saveTranscript = useCallback(() => {
    if (transcriptSegments.length === 0) {
      console.warn('No segments to save'); // Debug log
      return;
    }
    
    setIsSaving(true);
    
    try {
      const title = transcriptTitle || `Transcript ${new Date().toLocaleString()}`;
      const savedTranscript = transcriptionService.saveTranscript(title);
      
      console.log('Saving transcript:', savedTranscript); // Debug log
      storageService.saveTranscript(savedTranscript);
      
      setSaveSuccess(true);
      
      setTimeout(() => {
        navigate('/transcripts');
      }, 1500);
    } catch (error) {
      console.error('Error saving transcript:', error);
      setError({
        code: 'save_error',
        message: 'Failed to save transcript'
      });
    } finally {
      setIsSaving(false);
    }
  }, [transcriptSegments.length, transcriptTitle, navigate]);

  // Register status change listener
  useEffect(() => {
    transcriptionService.onStatus((newStatus, newError) => {
      setStatus(newStatus);
      setError(newError || null);
      
      // If there's an error, stop recording
      if (newStatus === TranscriptionStatus.ERROR || 
          newStatus === TranscriptionStatus.PERMISSION_DENIED ||
          newStatus === TranscriptionStatus.UNSUPPORTED) {
        setIsRecording(false);
      }
    });
  }, []);
  
  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Shift+R to start/stop recording
      if (event.ctrlKey && event.shiftKey && event.key === 'R') {
        event.preventDefault();
        if (isRecording) {
          stopRecording();
        } else {
          startRecording();
        }
      }
      
      // Ctrl+Shift+S to save transcript (only when not recording and has segments)
      if (event.ctrlKey && event.shiftKey && event.key === 'S' && !isRecording && transcriptSegments.length > 0) {
        event.preventDefault();
        saveTranscript();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRecording, transcriptSegments.length, startRecording, stopRecording, saveTranscript]);

  // Format time (seconds) to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate total duration
  const calculateDuration = (): string => {
    if (transcriptSegments.length === 0) return '00:00';
    
    const lastSegment = transcriptSegments[transcriptSegments.length - 1];
    return formatTime(lastSegment.endTime);
  };

  return (
    <Layout>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Live Transcription</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {isRecording ? 'Recording in progress...' : 'Start recording to begin transcription'}
              </p>
            </div>
            <div className="flex items-center">
              {isRecording ? (
                <button
                  onClick={stopRecording}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="6" width="12" height="12" strokeWidth="2" />
                  </svg>
                  Stop Recording
                </button>
              ) : (
                <button
                  onClick={startRecording}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="6" fill="currentColor" />
                  </svg>
                  Start Recording
                </button>
              )}
            </div>
          </div>
          
          {/* Transcription Status */}
          <div className="mt-4">
            <TranscriptionStatusComponent status={status} error={error} />
          </div>
          
          {/* Simple Audio Level Indicator */}
          {isRecording && (
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                </div>
                <div className="ml-2 flex items-center">
                  <svg className="w-5 h-5 text-indigo-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Recording in progress... Speak clearly into your microphone.</p>
            </div>
          )}
        </div>

        {/* Transcript display */}
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            {transcriptSegments.length > 0 ? (
              <div className="space-y-4">
                {transcriptSegments.map((segment) => (
                  <div key={segment.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {segment.speaker}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        {formatTime(segment.startTime)}
                      </span>
                    </div>
                    {segment.id === 'interim' ? (
                      <div className="relative">
                        <p className="italic text-gray-600">
                          {segment.text}
                        </p>
                        <div className="absolute right-0 bottom-0">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            <svg className="w-3 h-3 mr-1 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" />
                            </svg>
                            Listening...
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-900">
                        {segment.text}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No transcription yet</h3>
                <p className="mt-1 text-sm text-gray-500">Click the Start Recording button to begin transcribing.</p>
                
                {/* Keyboard shortcuts help */}
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-900">Keyboard Shortcuts</h4>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div className="flex items-center">
                      <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md mr-2">Ctrl+Shift+R</kbd>
                      <span>Start/Stop Recording</span>
                    </div>
                    <div className="flex items-center">
                      <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md mr-2">Ctrl+Shift+S</kbd>
                      <span>Save Transcript</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save transcript section */}
        {transcriptSegments.length > 0 && !isRecording && (
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Save Transcript</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Duration: {calculateDuration()} | Segments: {transcriptSegments.length}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <button
                  onClick={saveTranscript}
                  disabled={isSaving || transcriptSegments.length === 0}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Transcript'}
                </button>
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="transcript-title" className="block text-sm font-medium text-gray-700">
                Transcript Title
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="transcript-title"
                  id="transcript-title"
                  value={transcriptTitle}
                  onChange={(e) => setTranscriptTitle(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter a title for this transcript"
                />
              </div>
            </div>
            {saveSuccess && (
              <div className="mt-4 rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Transcript saved successfully! Redirecting to transcripts page...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TranscriptionPage;
