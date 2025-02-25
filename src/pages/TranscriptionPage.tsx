import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/shared/Layout';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import AudioVisualizer from '../components/transcription/AudioVisualizer';
import TranscriptionControls from '../components/transcription/TranscriptionControls';
import TranscriptionStatus from '../components/transcription/TranscriptionStatus';
import { useTranscription } from '../hooks/useTranscription';
import { TranscriptionStatus as Status, TranscriptionSegment } from '../services/transcription.service';
import { formatTime } from '../utils/formatters';

const TranscriptionPage: React.FC = () => {
  const {
    transcript,
    status,
    error,
    startRecording,
    stopRecording,
    isRecording,
    saveTranscript,
    resetTranscription,
    audioContext,
    analyser
  } = useTranscription();
  
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);
  
  // Reset timer when starting new recording
  useEffect(() => {
    if (status === Status.IDLE) {
      setRecordingTime(0);
    }
  }, [status]);
  
  // Show save form when transcript is ready
  useEffect(() => {
    if (transcript.length > 0 && status === Status.IDLE) {
      setShowSaveForm(true);
    } else {
      setShowSaveForm(false);
    }
  }, [transcript, status]);
  
  const handleSaveTranscript = async () => {
    if (!title.trim()) return;
    
    setIsSaving(true);
    try {
      await saveTranscript(title);
      setTitle('');
      setShowSaveForm(false);
    } catch (error) {
      console.error('Failed to save transcript:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleStartNewTranscription = () => {
    resetTranscription();
    setTitle('');
    setShowSaveForm(false);
    setRecordingTime(0);
  };
  
  const isProcessing = status === Status.INITIALIZING || status === Status.PROCESSING;
  
  return (
    <Layout 
      title="Live Transcription" 
      description="Record and transcribe conversations in real-time with speaker diarization."
      centerContent
      showBackground
    >
      <div className="w-full max-w-4xl">
        {/* Main transcription card */}
        <Card className="mb-8 overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-neutral-900">Voice Recording</h2>
            <TranscriptionStatus status={status} error={error} />
          </div>
          
          <div className="p-6">
            {/* Audio visualizer */}
            <AudioVisualizer 
              isRecording={isRecording} 
              audioContext={audioContext}
              analyser={analyser}
            />
            
            {/* Recording controls */}
            <div className="mt-8">
              <TranscriptionControls
                isRecording={isRecording}
                onStartRecording={startRecording}
                onStopRecording={stopRecording}
                isProcessing={isProcessing}
                recordingTime={recordingTime}
              />
            </div>
          </div>
        </Card>
        
        {/* Transcript display */}
        <div className="space-y-6">
          {transcript.length > 0 && (
            <Card className="overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200">
                <h3 className="text-lg font-medium text-neutral-900">Transcript</h3>
              </div>
              <div className="px-6 py-6">
                {transcript.map((segment: TranscriptionSegment, index: number) => (
                  <div key={index} className="mb-4">
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
            </Card>
          )}
        </div>

        {/* Save transcript section */}
        {showSaveForm && (
          <Card className="mt-8">
            <div className="p-6">
              <h3 className="text-lg font-medium text-neutral-900">Save Transcript</h3>
              <div className="mt-4">
                <label htmlFor="transcript-title" className="block text-sm font-medium text-gray-700">
                  Transcript Title
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="transcript-title"
                    id="transcript-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter a title for this transcript"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <Button
                  onClick={handleSaveTranscript}
                  disabled={isSaving}
                  className="!bg-green-600 hover:!bg-green-700"
                >
                  {isSaving ? 'Saving...' : 'Save Transcript'}
                </Button>
                <Button
                  onClick={handleStartNewTranscription}
                  className="!bg-gray-200 hover:!bg-gray-300"
                >
                  Start New Transcription
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default TranscriptionPage;
