import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/shared/Layout';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock data for dashboard
  const stats = [
    { name: 'Total Transcriptions', value: '12', icon: (
      <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ) },
    { name: 'Total Minutes', value: '145', icon: (
      <svg className="h-6 w-6 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ) },
    { name: 'Last Transcription', value: '2 days ago', icon: (
      <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ) },
  ];

  const recentTranscripts = [
    { id: 1, title: 'Team Meeting', date: '2025-02-22', duration: '32 min' },
    { id: 2, title: 'Client Interview', date: '2025-02-20', duration: '45 min' },
    { id: 3, title: 'Product Brainstorm', date: '2025-02-18', duration: '28 min' },
  ];

  return (
    <Layout>
      {/* User Profile Card */}
      <div className="bg-white shadow-soft rounded-xl overflow-hidden mb-8 transition-all duration-300 hover:shadow-lg">
        <div className="px-6 py-5 border-b border-neutral-100">
          <h3 className="text-xl font-semibold text-neutral-800">User Profile</h3>
          <p className="mt-1 text-sm text-neutral-500">Personal details and application settings.</p>
        </div>
        <div className="divide-y divide-neutral-100">
          <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 hover:bg-neutral-50 transition-colors duration-200">
            <dt className="text-sm font-medium text-neutral-500">Full name</dt>
            <dd className="text-sm text-neutral-800 sm:col-span-2">{user?.name || 'User'}</dd>
          </div>
          <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 hover:bg-neutral-50 transition-colors duration-200">
            <dt className="text-sm font-medium text-neutral-500">Email address</dt>
            <dd className="text-sm text-neutral-800 sm:col-span-2">{user?.email || 'user@example.com'}</dd>
          </div>
          <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 hover:bg-neutral-50 transition-colors duration-200">
            <dt className="text-sm font-medium text-neutral-500">Account type</dt>
            <dd className="flex items-center text-sm sm:col-span-2">
              <span className="text-neutral-800">Free</span>
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary-100 text-primary-800">
                Basic
              </span>
            </dd>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold text-neutral-800 mb-5">Statistics</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <div 
              key={stat.name} 
              className="bg-white overflow-hidden shadow-soft rounded-xl transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
            >
              <div className="px-6 py-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-lg p-3 bg-gradient-to-br from-primary-50 to-secondary-50">
                    {stat.icon}
                  </div>
                  <div className="ml-5">
                    <dt className="text-sm font-medium text-neutral-500 truncate">{stat.name}</dt>
                    <dd className="mt-1 text-2xl font-bold text-neutral-800">{stat.value}</dd>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transcripts Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-semibold text-neutral-800">Recent Transcripts</h3>
          <Link 
            to="/transcripts" 
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200 flex items-center"
          >
            View all
            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="bg-white shadow-soft rounded-xl overflow-hidden">
          <ul className="divide-y divide-neutral-100">
            {recentTranscripts.map((transcript) => (
              <li key={transcript.id} className="transition-colors duration-200 hover:bg-neutral-50">
                <Link to={`/transcripts/${transcript.id}`} className="block">
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                          <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-primary-600">{transcript.title}</p>
                          <div className="mt-1 flex items-center text-xs text-neutral-500">
                            <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <time dateTime={transcript.date}>{transcript.date}</time>
                          </div>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {transcript.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {recentTranscripts.length === 0 && (
            <div className="px-6 py-8 text-center">
              <svg className="mx-auto h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="mt-2 text-sm text-neutral-500">No transcripts yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Call to Action Button */}
      <div className="mt-10 flex justify-center">
        <Link
          to="/transcribe"
          className="group relative inline-flex items-center px-8 py-3.5 rounded-xl text-base font-medium text-white overflow-hidden transition-all duration-300"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-600 to-secondary-600 group-hover:from-primary-700 group-hover:to-secondary-700"></span>
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-secondary-400 transition-all duration-300 group-hover:h-2"></span>
          <span className="relative flex items-center">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Start New Transcription
          </span>
        </Link>
      </div>
    </Layout>
  );
};

export default DashboardPage;
