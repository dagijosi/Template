// src/pages/ErrorPage.tsx
import React from 'react';
import { BiError } from 'react-icons/bi';
import { Link } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <BiError className="text-red-600 text-6xl mb-4" />
      <h1 className="text-5xl font-bold mb-4 text-red-600">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="mb-6 text-center">
        The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default ErrorPage;
