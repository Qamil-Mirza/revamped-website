import React from "react";
import { FaTools } from "react-icons/fa";
import Link from "next/link";

function Wip() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-3">
      <FaTools className="text-6xl animate-bounce text-yellow-500 mb-4" />
      <h1 className="text-4xl font-bold mb-2">I'm Working on It!</h1>
      <p className="text-lg text-center max-w-md">
        This page is under construction. Please check back soon to see what I
        have in store for you!
      </p>
      <div className="mt-8 flex">
        <Link
          href="/"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default Wip;
