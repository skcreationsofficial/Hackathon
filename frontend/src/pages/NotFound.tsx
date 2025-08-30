import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-200">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mt-4">Oops! The page you're looking for doesn't exist.</p>
        <p className="text-lg text-gray-500 mt-2">It might have been moved or deleted.</p>
        <div className="mt-6">
          <button
            onClick={goHome}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;