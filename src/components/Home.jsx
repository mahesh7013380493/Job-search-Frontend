import { useState } from 'react';
import SearchBar from './SearchBar';
import JobCard from './JobCard';
import VendorsTab from './VendorsTab';

const Home = ({
  loading,
  error,
  count,
  jobs,
  suggestions,
  handleSearch,
  onApply,                 // receives a job object
  hasSearched,
  lastSearch,
}) => {
  const [activeTab, setActiveTab] = useState('google'); // 'google' | 'vendors'

  return (
    <main className="container mx-auto px-4 py-8 bg-white shadow-xl rounded-2xl">
      <SearchBar onSearch={handleSearch} loading={loading} />

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="text-gray-600 mt-2">Searching for jobs...</p>
        </div>
      )}

      {error && <div className="text-red-600 text-center py-4">{error}</div>}

      {suggestions.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Suggestions to improve your search:
              </h3>
              <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                {suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tabs header (replaces the "Found X jobs" chip) */}
      {!loading && !error && hasSearched && (
        <div className="mt-4">
          <div className="flex items-center gap-2 border-b border-gray-200">
            <button
              className={`px-4 py-2 -mb-px border-b-2 ${
                activeTab === 'google'
                  ? 'border-blue-600 text-blue-700 font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('google')}
            >
              Google Jobs {count > 0 ? `(${count})` : ''}
            </button>
            <button
              className={`px-4 py-2 -mb-px border-b-2 ${
                activeTab === 'vendors'
                  ? 'border-blue-600 text-blue-700 font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('vendors')}
            >
              Vendors List
            </button>
          </div>

          {/* Google Jobs tab content */}
          {activeTab === 'google' && (
            <div className="mt-6">
              {count > 0 ? (
                <div className="space-y-6">
                  {jobs.map((job, i) => (
                    <JobCard
                      key={job.job_id || job.id || i}
                      job={job}
                      onApply={() => onApply(job)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  No jobs found on Google Jobs.
                </div>
              )}
            </div>
          )}

          {/* Vendors List tab content */}
          {activeTab === 'vendors' && (
            <VendorsTab
              q={lastSearch?.q || ''}
              location={lastSearch?.location || ''}
              onApply={onApply}
            />
          )}
        </div>
      )}

      {/* Initial empty state (before first search) */}
      {!loading && !error && !hasSearched && (
        <div className="text-center py-8">
          <p className="text-gray-600">Start by entering a job title and location.</p>
        </div>
      )}
    </main>
  );
};

export default Home;
