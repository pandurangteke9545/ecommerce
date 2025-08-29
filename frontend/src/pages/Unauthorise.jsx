import React from "react";
import { Lock } from "lucide-react"; // lock icon for better UI

function Unauthorise() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-lg w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <Lock className="text-red-600 w-12 h-12" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
          Access Denied
        </h1>

        {/* Message */}
        <p className="text-gray-600 text-lg mb-6">
          You are not an authorized person to view this page.
        </p>

        {/* Back Button */}
        <a
          href="/"
          className="inline-block px-6 py-3 text-lg font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition-transform transform hover:scale-105"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}

export default Unauthorise;

