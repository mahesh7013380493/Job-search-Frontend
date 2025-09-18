import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h1 className="text-7xl font-extrabold text-gray-900 tracking-tight">404</h1>
        <p className="mt-4 text-2xl font-semibold text-gray-800">Page not found</p>
        <p className="mt-2 text-gray-600">
          The page you’re looking for doesn’t exist or the apply link was unavailable.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700 transition"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}