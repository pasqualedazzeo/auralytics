import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/shared/Layout';
import transcriptionService, { TranscriptionSegment } from '../services/transcription.service';
import storageService from '../services/storage.service';

const TranscriptionPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptSegments, setTranscriptSegments] = useState<TranscriptionSegment[]>([]);
  const [transcriptTitle, setTranscriptTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const navigate = useNavigate();

  // Start recording
  const startRecording = () => {
    setIsRecording(true);
    setTranscriptSegments([]);
    setSaveSuccess(false);
    
    transcriptionService.start((segments) => {
      setTranscriptSegments(segments);
    });
  };

  // Stop recording
  const stopRecording = () => {
    setIsRecording(false);
    const finalSegments = transcriptionService.stop();
    setTranscriptSegments(finalSegments);
  };

  // Save transcript
  const saveTranscript = () => {
    if (transcriptSegments.length === 0) return;
    
    setIsSaving(true);
    
    try {
      const title = transcriptTitle || `Transcript ${new Date().toLocaleString()}`;
      const savedTranscript = transcriptionService.saveTranscript(title);
      
      // Save to storage service
      storageService.saveTranscript(savedTranscript);
      
      console.log('Saved transcript:', savedTranscript);
      setSaveSuccess(true);
      
      // After a short delay, navigate to the transcript viewer
      setTimeout(() => {
        navigate('/transcripts');
      }, 1500);
    } catch (error) {
      console.error('Error saving transcript:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Format time (seconds) to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate total duration
  const calculateDuration = (): string => {
    if (transcriptSegments.length === 0) return '00:00';
    
    const startTime = transcriptSegments[0].startTime;
    const endTime = transcriptSegments[transcriptSegments.length - 1].endTime;
    return formatTime(endTime - startTime);
  };

  return (
    <Layout>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
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
                    <p className={`text-gray-900 ${segment.id === 'interim' ? 'italic text-gray-600' : ''}`}>
                      {segment.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No transcription yet</h3>
                <p className="mt-1 text-sm text-gray-500">Click the Start Recording button to begin transcribing.</p>
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
