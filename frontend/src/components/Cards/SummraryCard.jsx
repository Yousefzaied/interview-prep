
import React from 'react'
import { LuTrash } from 'react-icons/lu';
import { getInitials } from '../../Utils/helper';

const SummraryCard = ({
  colors,
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
  onSelect,
  onDelete,
}) => {
  return (
    <div
      onClick={onSelect}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Header gradient section */}
      <div
        className="p-4 flex items-start justify-between"
        style={{
          background: colors || "linear-gradient(to right, #ff9324, #e99a4b)"
        }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white text-[#ff9324] rounded-lg flex items-center justify-center text-lg font-bold shadow">
            {getInitials(role)}
          </div>
          <div>
            <h2 className="text-gray-600 font-bold text-lg capitalize">{role}</h2>
            <p className="text-gray-400 text-sm">{topicsToFocus}</p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="bg-white text-[#ff9324] px-3 py-1 rounded-md text-sm font-semibold hover:bg-red-500 hover:text-white transition-all duration-300"
        >
          <LuTrash />
        </button>
      </div>

      {/* Body section */}
      <div className="p-4 space-y-3">
        <div className="text-gray-700 text-sm flex justify-between">
          <span className="font-medium">
            Experience: {experience} {experience == 1 ? "Year" : "Years"}
          </span>
          <span className="text-gray-500 text-xs">
            Last Updated: {lastUpdated}
          </span>
        </div>

        {/* Questions count section */}
        <div className="bg-gray-50 border border-gray-100 rounded-md p-3 text-sm text-gray-700">
          <h4 className="font-semibold text-[#ff9324] mb-1">Questions:</h4>
          <p>Total Questions: {Array.isArray(questions) ? questions.length : 0}</p>
        </div>

        {/* Description section */}
        <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
          {description || "No description provided."}
        </p>
      </div>
    </div>
  )
}

export default SummraryCard
