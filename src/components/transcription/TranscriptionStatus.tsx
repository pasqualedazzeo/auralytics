import React from 'react';
import { TranscriptionStatus as Status, TranscriptionError } from '../../services/transcription.service';

interface TranscriptionStatusProps {
  status: Status;
  error: TranscriptionError | null;
}

const TranscriptionStatus: React.FC<TranscriptionStatusProps> = ({ status, error }) => {
  const getStatusColor = (): string => {
    switch (status) {
      case Status.LISTENING:
        return 'bg-green-100 text-green-800';
      case Status.INITIALIZING:
      case Status.REQUESTING_PERMISSION:
      case Status.PROCESSING:
        return 'bg-blue-100 text-blue-800';
      case Status.ERROR:
      case Status.PERMISSION_DENIED:
        return 'bg-red-100 text-red-800';
      case Status.UNSUPPORTED:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (): string => {
    switch (status) {
      case Status.IDLE:
        return 'Ready';
      case Status.INITIALIZING:
        return 'Initializing...';
      case Status.REQUESTING_PERMISSION:
        return 'Requesting Microphone...';
      case Status.PERMISSION_DENIED:
        return 'Microphone Access Denied';
      case Status.LISTENING:
        return 'Recording';
      case Status.PROCESSING:
        return 'Processing...';
      case Status.ERROR:
        return error ? error.message : 'Error';
      case Status.UNSUPPORTED:
        return 'Browser Not Supported';
      default:
        return 'Unknown Status';
    }
  };

  const getStatusIcon = (): React.ReactElement => {
    switch (status) {
      case Status.LISTENING:
        return (
          <svg className="w-3 h-3 mr-1 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
      case Status.INITIALIZING:
      case Status.REQUESTING_PERMISSION:
      case Status.PROCESSING:
        return (
          <svg className="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case Status.ERROR:
      case Status.PERMISSION_DENIED:
        return (
          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case Status.UNSUPPORTED:
        return (
          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {getStatusIcon()}
      {getStatusText()}
    </span>
  );
};

export default TranscriptionStatus;
