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
  const handleAnalyze = async (type: 'summary' | 'keyPoints' | 'sentiment' | 'topics') => {
    if (!selectedTranscript) return;
    
    setIsAnalyzing(true);
    setActiveAiTab(type);
    
    try {
      let result: AIAnalysisResult;
      
      // Check if we already have this analysis
      const existingResult = aiResults.find(r => r.type === type);
      if (existingResult) {
        // Use existing result
        setIsAnalyzing(false);
        return;
      }
      
      // Perform the requested analysis
      switch (type) {
        case 'summary':
          result = await aiService.summarize(selectedTranscript);
          break;
        case 'keyPoints':
          result = await aiService.extractKeyPoints(selectedTranscript);
          break;
        case 'sentiment':
          result = await aiService.analyzeSentiment(selectedTranscript);
          break;
        case 'topics':
          result = await aiService.identifyTopics(selectedTranscript);
          break;
      }
      
      // Add result to state
      setAiResults(prev => [...prev, result]);
    } catch (error) {
      console.error('Error analyzing transcript:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Get current AI result
  const getCurrentAiResult = () => {
    return aiResults.find(result => result.type === activeAiTab);
  };

  // Render AI result content
  const renderAiResultContent = () => {
    const result = getCurrentAiResult();
    
    if (isAnalyzing) {
      return (
        <div className="flex items-center justify-center py-8">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
    
    switch (result.type) {
      case 'summary':
        return (
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-700">{result.content as string}</p>
          </div>
        );
      
      case 'keyPoints':
        return (
          <ul className="bg-white p-4 rounded-lg shadow space-y-2">
            {(result.content as string[]).map((point, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 text-indigo-500 mr-2">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        );
      
      case 'sentiment':
        const sentiment = result.content as Record<string, any>;
        return (
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500">Overall Sentiment</h4>
              <p className="text-lg font-semibold text-gray-900 capitalize">{sentiment.overall}</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ width: `${sentiment.score * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500">Sentiment Breakdown</h4>
              <div className="mt-2 space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Positive</span>
                    <span>{Math.round(sentiment.breakdown.positive * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-green-500 h-1.5 rounded-full" 
                      style={{ width: `${sentiment.breakdown.positive * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Neutral</span>
                    <span>{Math.round(sentiment.breakdown.neutral * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-gray-500 h-1.5 rounded-full" 
                      style={{ width: `${sentiment.breakdown.neutral * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Negative</span>
                    <span>{Math.round(sentiment.breakdown.negative * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-red-500 h-1.5 rounded-full" 
                      style={{ width: `${sentiment.breakdown.negative * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Speaker Sentiment</h4>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {Object.entries(sentiment.perSpeaker).map(([speaker, sentiment]) => (
                  <div key={speaker} className="bg-gray-50 p-2 rounded">
                    <span className="text-xs font-medium text-gray-500">{speaker}</span>
                    <p className="text-sm font-medium capitalize">{sentiment as string}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'topics':
        return (
          <div className="bg-white p-4 rounded-lg shadow">
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
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Transcript list */}
        <div className="md:col-span-1">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Your Transcripts</h3>
              <Link
                to="/transcribe"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                New Transcription
              </Link>
            </div>
            <ul className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
              {transcripts.length > 0 ? (
                transcripts.map((transcript) => (
                  <li key={transcript.id}>
                    <button
                      onClick={() => handleSelectTranscript(transcript)}
                      className={`block w-full text-left hover:bg-gray-50 px-4 py-4 ${
                        selectedTranscript?.id === transcript.id ? 'bg-indigo-50' : ''
                      }`}
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
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            {transcript.segments.length > 0 ? 
                              `${new Set(transcript.segments.map(s => s.speaker)).size} speakers` : 
                              'No speakers'
                            }
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <p>
                            <time dateTime={transcript.createdAt.toString()}>
                              {formatDate(transcript.createdAt)}
                            </time>
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-6 text-center text-gray-500">
                  No transcripts found. Start a new transcription to create one.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Transcript details and AI analysis */}
        <div className="md:col-span-2">
          {selectedTranscript ? (
            <div className="space-y-6">
              {/* Transcript details */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedTranscript.title}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {formatDate(selectedTranscript.createdAt)} • {formatTime(selectedTranscript.duration)}
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="space-y-4">
                      {selectedTranscript.segments.map((segment) => (
                        <div key={segment.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {segment.speaker}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">
                              {formatTime(segment.startTime)}
                            </span>
                          </div>
                          <p className="text-gray-900">{segment.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI analysis */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">AI Analysis</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Insights generated from your transcript
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  {/* Tabs */}
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex" aria-label="Tabs">
                      <button
                        onClick={() => {
                          setActiveAiTab('summary');
                          if (!aiResults.find(r => r.type === 'summary')) {
                            handleAnalyze('summary');
                          }
                        }}
                        className={`${
                          activeAiTab === 'summary'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex-1 text-center`}
                      >
                        Summary
                      </button>
                      <button
                        onClick={() => {
                          setActiveAiTab('keyPoints');
                          if (!aiResults.find(r => r.type === 'keyPoints')) {
                            handleAnalyze('keyPoints');
                          }
                        }}
                        className={`${
                          activeAiTab === 'keyPoints'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex-1 text-center`}
                      >
                        Key Points
                      </button>
                      <button
                        onClick={() => {
                          setActiveAiTab('sentiment');
                          if (!aiResults.find(r => r.type === 'sentiment')) {
                            handleAnalyze('sentiment');
                          }
                        }}
                        className={`${
                          activeAiTab === 'sentiment'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex-1 text-center`}
                      >
                        Sentiment
                      </button>
                      <button
                        onClick={() => {
                          setActiveAiTab('topics');
                          if (!aiResults.find(r => r.type === 'topics')) {
                            handleAnalyze('topics');
                          }
                        }}
                        className={`${
                          activeAiTab === 'topics'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex-1 text-center`}
                      >
                        Topics
                      </button>
                    </nav>
                  </div>
                  
                  {/* Tab content */}
                  <div className="px-4 py-5 sm:p-6">
                    {renderAiResultContent()}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6 text-center">
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
