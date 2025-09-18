import { useState } from 'react';

const SearchBar = ({ onSearch, loading = false }) => {
  const [searchData, setSearchData] = useState({
    q: '',
    location: '',
    hl: 'en',
    gl: 'us'
  });
  const [validation, setValidation] = useState({ q: true, location: true });

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = {
      q: searchData.q.trim().length > 0,
      location: searchData.location.trim().length > 0
    };

    setValidation(isValid);

    if (isValid.q && isValid.location) {
      onSearch({
        ...searchData,
        q: searchData.q.trim().replace(/\s+/g, ' '),
        location: searchData.location.trim().replace(/\s+/g, ' ')
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
    setValidation(prev => ({
      ...prev,
      [name]: true
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl p-6 border border-gray-2 00">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <input
              type="text"
              name="q"
              aria-label="Job title"
              value={searchData.q}
              onChange={handleChange}
              placeholder="Job Title (e.g., Python Developer)"
              className={`w-full px-4 py-3 rounded-lg border ${!validation.q ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400`}
              required
            />
            {!validation.q && (
              <p className="text-red-500 text-sm mt-1">Please enter a job title</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="location"
              aria-label="Location"
              value={searchData.location}
              onChange={handleChange}
              placeholder="Location (e.g., Hyderabad)"
              className={`w-full px-4 py-3 rounded-lg border ${!validation.location ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400`}
              required
            />
            {!validation.location && (
              <p className="text-red-500 text-sm mt-1">Please enter a location</p>
            )}
          </div>
        </div>
        <div className="mt-6 text-center">
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition duration-300 font-semibold shadow-md"
          >
            {loading ? 'Searching…' : 'Search Jobs'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
