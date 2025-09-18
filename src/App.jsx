import axios from 'axios';
import { useRef, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import NotFound from './components/NotFound';
import './App.css';

function App() {
  const [jobs, setJobs] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastSearch, setLastSearch] = useState({ q: '', location: '' });

  const navigate = useNavigate();
  const reqRef = useRef(null);

  // -------- helpers ----------
  const isGoogleLink = (url = '') => {
    try {
      const u = new URL(url);
      return /(^|\.)google\./i.test(u.hostname);
    } catch {
      return false;
    }
  };

  const normalizeApplyOptions = (apply_options) => {
    if (!Array.isArray(apply_options)) return [];
    return apply_options
      .map((o) => (typeof o === 'string' ? { title: '', link: o } : o))
      .filter((o) => o && typeof o.link === 'string' && o.link.trim() !== '');
  };

  const RANK = ['workday', 'greenhouse', 'lever', 'taleo', 'successfactors', 'myworkdayjobs'];
  const scorePortal = (link = '') => {
    try {
      const u = new URL(link);
      const host = u.hostname.toLowerCase();
      if (!isGoogleLink(link) && /careers|jobs|boards/.test(host) && !/google\./.test(host)) return 100;
      const idx = RANK.findIndex((k) => host.includes(k));
      return idx === -1 ? 0 : 50 - idx;
    } catch {
      return 0;
    }
  };

  const chooseApplyLink = (job) => {
    const options = normalizeApplyOptions(job?.apply_options)
      .filter((o) => !isGoogleLink(o.link))
      .sort((a, b) => scorePortal(b.link) - scorePortal(a.link));
    if (options.length) return options[0].link;

    const fallbacks = [
      job?.apply_link,
      job?.job_apply_link,
      job?.job_link,
      job?.share_link,
      job?.sharelink,
      job?.url,
    ]
      .filter(Boolean)
      .filter((l) => !isGoogleLink(l));
    return fallbacks[0] || null;
  };
  // -----------------------------

  const handleSearch = async (searchData) => {
    setHasSearched(true);
    setLastSearch({ q: searchData.q?.trim() || '', location: searchData.location?.trim() || '' });
    setLoading(true);
    setError(null);
    setSuggestions([]);

    if (reqRef.current) reqRef.current.abort();
    const controller = new AbortController();
    reqRef.current = controller;

    try {
      const payload = {
        q: searchData.q?.trim() || '',
        location: searchData.location?.trim() || '',
        hl: searchData.hl || 'en',
        gl: searchData.gl || 'us',
      };

      const res = await axios.post(
        'https://digitalworker.dataskate.io/webhook/jobs/search',
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
          signal: controller.signal,
        }
      );

      if (res.data && Array.isArray(res.data.jobs) && typeof res.data.count === 'number') {
        setCount(res.data.count);

        const normalized = res.data.jobs.map((job) => ({
          ...job,
          apply_link: chooseApplyLink(job),
        }));
        setJobs(normalized);

        if (payload.q && payload.q.toLowerCase() !== 'mulesoft' && normalized.length > 0) {
          const allMuleSoft = normalized.every((job) => {
            const t = job.title?.toLowerCase() || '';
            const c = job.company_name?.toLowerCase() || '';
            const d = job.description?.toLowerCase() || '';
            return t.includes('mulesoft') || c.includes('mulesoft') || d.includes('mulesoft');
          });
          if (allMuleSoft) {
            setSuggestions([
              'Try broadening your search terms (e.g., "Software Engineer" or "Developer").',
              'Specify a different location or leave it blank for more results.',
              'Use keywords like "Java Developer" or "Full Stack Developer" for varied roles.',
            ]);
          }
        }
      } else {
        setCount(0);
        setJobs([]);
        setError('Invalid response format from the server. Please try again.');
      }
    } catch (e) {
      if (axios.isCancel?.(e) || e.name === 'CanceledError') {
        // aborted
      } else if (e.response) {
        setError(`Server error: ${e.response.status} - ${e.response.data?.message || 'Unknown error'}`);
      } else if (e.request) {
        setError('No response from server. Please check your network connection.');
      } else {
        setError('Failed to fetch jobs. Please try again later.');
      }
    } finally {
      setLoading(false);
      reqRef.current = null;
    }
  };

  const handleApply = (job) => {
    let link = job?.apply_link;
    if (!link) {
      link = chooseApplyLink(job);
    }
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      navigate('/not-found');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-extrabold text-center tracking-tight">
            <span className="bg-gradient-to-r from-white via-sky-100 to-white bg-clip-text text-transparent">
              Job Search Portal
            </span>
          </h1>
          <p className="text-center mt-2 text-indigo-100/90">Find your dream job today</p>
        </div>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <Home
              loading={loading}
              error={error}
              count={count}
              jobs={jobs}
              suggestions={suggestions}
              handleSearch={handleSearch}
              onApply={handleApply}
              hasSearched={hasSearched}
              lastSearch={lastSearch}
            />
          }
        />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" />} />
      </Routes>

      <footer className="mt-12 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-200 py-8 border-t border-slate-700/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">&copy; 2025 Job Search Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
