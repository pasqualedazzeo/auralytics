import React from 'react';
import { TranscriptionStatus as Status, TranscriptionError } from '../../services/transcription.service';

interface TranscriptionStatusProps {
  status: Status;
  error: TranscriptionError | null;
}

const TranscriptionStatus: React.FC<TranscriptionStatusProps> = ({ status, error }) => {
  // Define status messages and icons
  const getStatusInfo = () => {
    switch (status) {
      case Status.IDLE:
        return {
          message: 'Ready to start transcription',
          icon: (
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: 'bg-gray-100 text-gray-800'
        };
      case Status.INITIALIZING:
        return {
          message: 'Initializing transcription service...',
          icon: (
            <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ),
          color: 'bg-blue-100 text-blue-800'
        };
      case Status.REQUESTING_PERMISSION:
        return {
          message: 'Requesting microphone access...',
          icon: (
            <svg className="w-5 h-5 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          ),
          color: 'bg-blue-100 text-blue-800'
        };
      case Status.PERMISSION_DENIED:
        return {
          message: 'Microphone access denied. Please allow microphone access to use transcription.',
          icon: (
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          color: 'bg-red-100 text-red-800'
        };
      case Status.LISTENING:
        return {
          message: 'Listening...',
          icon: (
            <svg className="w-5 h-5 text-green-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          ),
          color: 'bg-green-100 text-green-800'
        };
      case Status.ERROR:
        return {
          message: error ? error.message : 'An error occurred during transcription',
          icon: (
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: 'bg-red-100 text-red-800'
        };
      case Status.UNSUPPORTED:
        return {
          message: 'Speech recognition is not supported in this browser. Please use Chrome or Edge.',
          icon: (
            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          color: 'bg-yellow-100 text-yellow-800'
        };
      default:
        return {
          message: 'Unknown status',
          icon: (
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const { message, icon, color } = getStatusInfo();

  return (
    <div className={`rounded-md p-3 mb-4 flex items-center ${color}`}>
      <div className="flex-shrink-0 mr-3">
        {icon}
      </div>
      <div className="text-sm font-medium">
        {message}
      </div>
    </div>
  );
};

export default TranscriptionStatus;
