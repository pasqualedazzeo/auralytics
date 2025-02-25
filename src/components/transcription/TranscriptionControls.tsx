import React from 'react';

interface TranscriptionControlsProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isProcessing: boolean;
  recordingTime: number;
}

const TranscriptionControls: React.FC<TranscriptionControlsProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  isProcessing,
  recordingTime
}) => {
  // Format recording time (seconds) to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Recording timer */}
      <div className="mb-6 text-center">
        {isRecording && (
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white shadow-md border border-neutral-200">
            <div className="mr-2 h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-lg font-mono font-medium text-neutral-800">
              {formatTime(recordingTime)}
            </span>
          </div>
        )}
      </div>
      
      {/* Control buttons */}
      <div className="flex items-center justify-center space-x-6">
        {!isRecording ? (
          <button
            onClick={onStartRecording}
            disabled={isProcessing}
            className="group relative flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Start recording"
          >
            {/* Ripple effect */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 animate-ping opacity-20 group-hover:opacity-30"></span>
            
            {/* Microphone icon */}
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            
            {isProcessing && (
              <div className="absolute -bottom-10 whitespace-nowrap">
                <div className="flex items-center space-x-1">
                  <div className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </button>
        ) : (
          <button
            onClick={onStopRecording}
            disabled={isProcessing}
            className="group relative flex items-center justify-center h-20 w-20 rounded-full bg-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Stop recording"
          >
            {/* Stop icon */}
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="6" width="12" height="12" strokeWidth={2} />
            </svg>
          </button>
        )}
      </div>
      
      {/* Instructions */}
      <div className="mt-8 text-center">
        <p className="text-neutral-500">
          {isRecording 
            ? "Speak clearly into your microphone. Click stop when you're finished."
            : "Click the microphone button to start recording your conversation."}
        </p>
      </div>
    </div>
  );
};

export default TranscriptionControls;