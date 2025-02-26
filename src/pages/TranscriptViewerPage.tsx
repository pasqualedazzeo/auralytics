import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/shared/Layout';
import storageService from '../services/storage.service';
import { Transcript } from '../services/transcription.service';
import aiService, { AIAnalysisResult } from '../services/ai.service';

const TranscriptViewerPage: React.FC = () => {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [selectedTranscript, setSelectedTranscript] = useState<Transcript | null>(null);
  const [aiResults, setAiResults] = useState<AIAnalysisResult[]>([]);
  const [activeAiTab, setActiveAiTab] = useState<string>('summary');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load transcripts on mount
  useEffect(() => {
    // Add mock transcripts for demo purposes
    storageService.addMockTranscripts();
    
    // Load transcripts
    const loadedTranscripts = storageService.getAllTranscripts();
    setTranscripts(loadedTranscripts);
  }, []);

  // Format time (seconds) to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Format date
  const formatDate = (date: Date): string => {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle transcript selection
  const handleSelectTranscript = (transcript: Transcript) => {
    setSelectedTranscript(transcript);
    setAiResults([]);
    setActiveAiTab('summary');
  };

  // Handle AI analysis
  const handleAnalyze = async () => {
    if (!selectedTranscript) return;
    
    setIsAnalyzing(true);
    try {
      const result = await aiService.analyzeTranscript(selectedTranscript, activeAiTab);
      
      // Update or add the result
      setAiResults(prev => {
        const existingIndex = prev.findIndex(r => r.type === activeAiTab);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = result;
          return updated;
        } else {
          return [...prev, result];
        }
      });
    } catch (error) {
      console.error('Error analyzing transcript:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Get the current AI result based on active tab
  const getCurrentAiResult = () => {
    return aiResults.find(result => result.type === activeAiTab);
  };

  // Render AI result content based on type
  const renderAiResultContent = () => {
    const result = getCurrentAiResult();
    
    if (isAnalyzing) {
      return (
        <div className="flex items-center justify-center py-8 space-x-2">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Analyzing transcript...</span>
        </div>
      );
    }
    
    if (!result) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">Click the analyze button to generate {activeAiTab}.</p>
        </div>
      );
    }
    
    // Render based on result type
    switch (result.type) {
      case 'summary':
        return (
          <div className="prose max-w-none">
            <p className="text-gray-700">{result.content as string}</p>
          </div>
        );
      
      case 'keyPoints':
        return (
          <ul className="space-y-2 list-disc pl-5">
            {(result.content as string[]).map((point, index) => (
              <li key={index} className="text-gray-700">{point}</li>
            ))}
          </ul>
        );
      
      case 'sentiment':
        const sentimentData = result.content as Record<string, any>;
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Overall Sentiment</h4>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  sentimentData.overall === 'positive' ? 'bg-green-100 text-green-800' :
                  sentimentData.overall === 'negative' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {sentimentData.overall.charAt(0).toUpperCase() + sentimentData.overall.slice(1)}
                </span>
                <span className="text-sm text-gray-500">Score: {sentimentData.score.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Sentiment Breakdown</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-24 text-sm text-gray-500">Positive:</div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${sentimentData.breakdown.positive * 100}%` }}
                    ></div>
                  </div>
                  <div className="ml-2 text-sm text-gray-500">{(sentimentData.breakdown.positive * 100).toFixed(0)}%</div>
                </div>
                <div className="flex items-center">
                  <div className="w-24 text-sm text-gray-500">Neutral:</div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-500 rounded-full" 
                      style={{ width: `${sentimentData.breakdown.neutral * 100}%` }}
                    ></div>
                  </div>
                  <div className="ml-2 text-sm text-gray-500">{(sentimentData.breakdown.neutral * 100).toFixed(0)}%</div>
                </div>
                <div className="flex items-center">
                  <div className="w-24 text-sm text-gray-500">Negative:</div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full" 
                      style={{ width: `${sentimentData.breakdown.negative * 100}%` }}
                    ></div>
                  </div>
                  <div className="ml-2 text-sm text-gray-500">{(sentimentData.breakdown.negative * 100).toFixed(0)}%</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Sentiment by Speaker</h4>
              <div className="space-y-2">
                {Object.entries(sentimentData.perSpeaker).map(([speaker, sentiment]) => (
                  <div key={speaker} className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-700">{speaker}:</div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      String(sentiment).includes('positive') ? 'bg-green-100 text-green-800' :
                      String(sentiment).includes('negative') ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {String(sentiment).charAt(0).toUpperCase() + String(sentiment).slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'topics':
        return (
          <div className="flex flex-wrap gap-2">
            {(result.content as string[]).map((topic, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
              >
                {topic}
              </span>
            ))}
          </div>
        );
      
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Unknown analysis type.</p>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 pointer-events-auto">
        {/* Transcript list */}
        <div className="md:col-span-1 pointer-events-auto">
          <div className="bg-white shadow overflow-hidden sm:rounded-md pointer-events-auto">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center pointer-events-auto">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Your Transcripts</h3>
              <Link
                to="/transcribe"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 pointer-events-auto"
                style={{ pointerEvents: 'auto' }}
              >
                New Transcription
              </Link>
            </div>
            <ul className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto pointer-events-auto">
              {transcripts.length > 0 ? (
                transcripts.map((transcript) => (
                  <li key={transcript.id} className="pointer-events-auto">
                    <button
                      onClick={() => handleSelectTranscript(transcript)}
                      className={`block w-full text-left hover:bg-gray-50 px-4 py-4 pointer-events-auto ${
                        selectedTranscript?.id === transcript.id ? 'bg-indigo-50' : ''
                      }`}
                      style={{ pointerEvents: 'auto' }}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">{transcript.title}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {formatTime(transcript.duration)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {transcript.segments.length} segments
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <p>
                            {formatDate(transcript.createdAt)}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-6 text-center text-gray-500 pointer-events-auto">
                  No transcripts found. Start a new transcription to create one.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Transcript details and AI analysis */}
        <div className="md:col-span-2 pointer-events-auto">
          {selectedTranscript ? (
            <div className="space-y-6 pointer-events-auto">
              {/* Transcript details */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg pointer-events-auto">
                <div className="px-4 py-5 sm:px-6 pointer-events-auto">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedTranscript.title}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {formatDate(selectedTranscript.createdAt)} • {formatTime(selectedTranscript.duration)}
                  </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0 pointer-events-auto">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Transcript</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="space-y-4">
                          {selectedTranscript.segments.map((segment, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-md">
                              <div className="flex items-center mb-1">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                  {segment.speaker}
                                </span>
                                <span className="ml-2 text-xs text-gray-500">
                                  {formatTime(segment.startTime)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{segment.text}</p>
                            </div>
                          ))}
                        </div>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              {/* AI Analysis */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg pointer-events-auto">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center pointer-events-auto">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">AI Analysis</h3>
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
                    style={{ pointerEvents: 'auto' }}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                  </button>
                </div>
                
                <div className="border-t border-gray-200 pointer-events-auto">
                  <div className="px-4 py-3 bg-gray-50 pointer-events-auto">
                    <nav className="flex space-x-4 pointer-events-auto">
                      {['summary', 'keyPoints', 'sentiment', 'topics'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveAiTab(tab)}
                          className={`px-3 py-2 text-sm font-medium rounded-md pointer-events-auto ${
                            activeAiTab === tab
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                          style={{ pointerEvents: 'auto' }}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </nav>
                  </div>
                  
                  <div className="px-4 py-5 sm:p-6 pointer-events-auto">
                    {renderAiResultContent()}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg pointer-events-auto">
              <div className="px-4 py-5 sm:p-6 text-center pointer-events-auto">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No transcript selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a transcript from the list to view its details and AI analysis.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TranscriptViewerPage;
