import { useEffect, useState } from "react";
import JobCard from "./JobCard";
import NotFound from "./NotFound"; // Assuming you have a simple Not Found component

const PAGE_SIZE = 10;
// The URL of the Flask API server we built
// const API_URL = "http://127.0.0.1:5001/api/jobs";
const API_URL = "https://job-search-web-scraping.onrender.com/api/jobs";

export default function VendorsTab({ q, location, onApply }) {
  // State for all jobs fetched from the API
  const [allJobs, setAllJobs] = useState([]);
  // State for the current page number
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const trimmedQ = q?.trim() || "";
  const trimmedLoc = location?.trim() || "";
  const canSearch = trimmedQ.length > 0 || trimmedLoc.length > 0;

  useEffect(() => {
    // This effect runs whenever the search query (q or location) changes
    const fetchVendorJobs = async () => {
      if (!canSearch) {
        setAllJobs([]); // Clear results if search is cleared
        return;
      }

      setLoading(true);
      setError("");
      setCurrentPage(1); // Reset to first page on new search

      try {
        // Use URLSearchParams to correctly build the query string (handles spaces, etc.)
        const params = new URLSearchParams();
        if (trimmedQ) params.append('title', trimmedQ);
        if (trimmedLoc) params.append('location', trimmedLoc);

        const response = await fetch(`${API_URL}?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setAllJobs(Array.isArray(data) ? data : []);

      } catch (e) {
        console.error("Failed to fetch vendor jobs:", e);
        setError("Could not load jobs from the vendor service. Is the Python server running?");
        setAllJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorJobs();
  }, [trimmedQ, trimmedLoc, canSearch]);


  // --- Frontend Pagination Logic ---
  const totalPages = Math.max(1, Math.ceil(allJobs.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const jobsForCurrentPage = allJobs.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };


  return (
    <div className="mt-6">
      {!canSearch && (
        <div className="text-gray-600 text-center py-6">
          Enter a job title and/or location to see vendor listings.
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="text-gray-600 mt-2">Fetching jobs from vendors...</p>
        </div>
      )}

      {error && <div className="text-red-600 text-center py-4">{error}</div>}

      {!loading && !error && canSearch && (
        <>
          {allJobs.length > 0 ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Found {allJobs.length} jobs from vendors
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                      onClick={handlePrevPage}
                      disabled={currentPage <= 1}
                    >
                      Prev
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage} / {totalPages}
                    </span>
                    <button
                      className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                      onClick={handleNextPage}
                      disabled={currentPage >= totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {jobsForCurrentPage.map((job, i) => (
                  <JobCard
                    key={job.job_id || job.url || i}
                    job={job}
                    onApply={() => onApply(job)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-600">
              No jobs found from vendors for this search.
            </div>
          )}
        </>
      )}
    </div>
  );
}