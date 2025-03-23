"use client"; // Required because error.tsx needs to use client-side error boundaries.

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error occurred:", error);
  }, [error]);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h2 className="text-xl font-bold text-red-600">
        Oops! Something went wrong.
      </h2>
      <p className="text-gray-700">{error.message}</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        onClick={() => reset()}
      >
        Try Again
      </button>
    </div>
  );
}
