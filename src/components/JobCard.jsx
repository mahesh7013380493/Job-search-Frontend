/*import { useNavigate } from 'react-router-dom';

export default function JobCard({ job, onApply }) {
  const navigate = useNavigate();

  const openOr404 = () => {
    const link = job?.apply_link?.trim();
    if (link) {
      try {
        const u = new URL(link);
        window.open(u.toString(), '_blank', 'noopener,noreferrer');
      } catch {
        navigate('/not-found');
      }
    } else {
      navigate('/not-found');
    }
  };

  const handleApply = () => {
    if (typeof onApply === 'function') onApply(job);
    else openOr404();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between border border-gray-200 hover:border-blue-200 transition">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{job.title || 'Untitled role'}</h3>
        <p className="text-sm text-gray-600 mt-1">{job.company_name || 'Company confidential'}</p>
        <p className="text-sm text-gray-600">{job.location || 'Location not specified'}</p>
        {job.via && <p className="text-xs text-gray-500 mt-1">Source: {job.via}</p>}
        {job.posted_at && <p className="text-xs text-gray-500">Posted: {job.posted_at}</p>}

        {job.description && (
          <p className="text-sm text-gray-700 mt-3 line-clamp-3">
            {job.description}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={handleApply}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition"
        >
          Apply now
        </button>

        {job.apply_link ? (
          <a
            href={job.apply_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-700 hover:underline"
            title="Open apply link in new tab"
          >
            Open link
          </a>
        ) : (
          <span className="text-sm text-gray-400">No direct link</span>
        )}
      </div>
    </div>
  );
}
*/
import { useNavigate } from 'react-router-dom';

export default function JobCard({ job, onApply }) {
  const navigate = useNavigate();

  const openOr404 = () => {
    const link = job?.apply_link?.trim();
    if (link) {
      try {
        const u = new URL(link);
        window.open(u.toString(), '_blank', 'noopener,noreferrer');
      } catch {
        navigate('/not-found');
      }
    } else {
      navigate('/not-found');
    }
  };

  const handleApply = () => {
    if (typeof onApply === 'function') onApply(job);
    else openOr404();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between border border-gray-200 hover:border-blue-200 transition">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{job.title || 'Untitled role'}</h3>
        {/* ✅ THIS LINE IS UPDATED */}
        <p className="text-sm text-gray-600 mt-1">{job.company || job.company_name || 'Company confidential'}</p>
        <p className="text-sm text-gray-600">{job.location || 'Location not specified'}</p>
        
        {job.via && <p className="text-xs text-gray-500 mt-1">Source: {job.via}</p>}
        {job.posted_at && <p className="text-xs text-gray-500">Posted: {job.posted_at}</p>}

        {job.description && (
          <p className="text-sm text-gray-700 mt-3 line-clamp-3">
            {job.description}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={handleApply}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition"
        >
          Apply now
        </button>

        {job.apply_link ? (
          <a
            href={job.apply_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-700 hover:underline"
            title="Open apply link in new tab"
          >
            Open link
          </a>
        ) : (
          <span className="text-sm text-gray-400">No direct link</span>
        )}
      </div>
    </div>
  );
}