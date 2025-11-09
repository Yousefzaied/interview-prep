import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse space-y-4 p-4">
      {/* Title placeholder */}
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>

      {/* Multiple lines of text */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-11/12"></div>
        <div className="h-4 bg-gray-200 rounded w-10/12"></div>
      </div>

      {/* Small paragraph blocks */}
      <div className="space-y-2 pt-3">
        <div className="h-3 bg-gray-200 rounded w-9/12"></div>
        <div className="h-3 bg-gray-200 rounded w-8/12"></div>
      </div>

      {/* Footer placeholder */}
      <div className="h-4 bg-gray-200 rounded w-1/3 mt-6"></div>
    </div>
  );
};

export default SkeletonLoader;
