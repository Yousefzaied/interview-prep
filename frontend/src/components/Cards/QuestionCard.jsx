
import React, { useEffect, useRef, useState } from "react";
import { LuChevronDown, LuPin, LuPinOff, LuSparkles } from "react-icons/lu";
import AIResponsePreview from "../../pages/InterViewPrep/components/AIResponsePreview";

const QuestionCard = ({
  question,
  answer,
  onLearnMore,
  isPinned,
  onTogglePin,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(contentHeight + 10);
    } else {
      setHeight(0);
    }
  }, [isExpanded, answer]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-2xl mb-5 overflow-hidden py-5 px-8 shadow-lg shadow-gray-100 border border-gray-100 group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ml-3 md:ml-5">
      <div className="flex items-start justify-between cursor-pointer">
        {/* Left Section: Question */}
        <div className="flex items-start gap-4">
          <span className="text-sm md:text-[15px] font-semibold text-gray-400 leading-[18px]">
            Q
          </span>

          <h3
            className="text-sm md:text-[15px] font-medium text-gray-800 mr-0 md:mr-20 leading-[20px] group-hover:text-indigo-600 transition-colors duration-200"
            onClick={toggleExpand}
          >
            {question}
          </h3>
        </div>

        {/* Right Section: Buttons */}
        <div className="flex items-center justify-end ml-4 relative">
          <div
            className={`flex ${
              isExpanded ? "md:flex" : "md:hidden group-hover:flex"
            }`}
          >
            <button
              className="flex items-center gap-2 text-xs text-indigo-800 font-medium bg-indigo-50 px-3 py-1.5 mr-2 rounded-lg border border-indigo-50 hover:border-indigo-200 hover:bg-indigo-100 transition-all duration-200"
              onClick={onTogglePin}
            >
              {isPinned ? (
                <LuPinOff className="text-xs" />
              ) : (
                <LuPin className="text-xs" />
              )}
            </button>

            <button
              className="flex items-center gap-2 text-xs text-cyan-800 font-medium bg-cyan-50 px-3 py-1.5 mr-2 rounded-lg border border-cyan-50 hover:border-cyan-200 hover:bg-cyan-100 transition-all duration-200"
              onClick={() => {
                setIsExpanded(true);
                onLearnMore();
              }}
            >
              <LuSparkles />
              <span className="hidden md:block">Learn More</span>
            </button>
          </div>

          <button
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
            onClick={toggleExpand}
          >
            <LuChevronDown
              size={20}
              className={`transform transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Expandable Answer Section */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? "mt-3" : "mt-0"
        }`}
        style={{
          maxHeight: isExpanded ? `${height}px` : "0px",
          overflow: "hidden",
        }}
      >
        <div
          ref={contentRef}
          className="text-gray-600 text-sm md:text-[14px] leading-relaxed px-1"
        >
          <AIResponsePreview content={answer} />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
