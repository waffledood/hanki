import React from "react";

function StudyCompletePage({ children, totalCards, stats }) {
  const handleRestartSession = () => {
    // TODO - implement handleRestartSession
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <i className="fas fa-check-circle text-3xl text-green-500"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Study Session Complete!
          </h2>
          <p className="text-gray-600">
            You've reviewed all {totalCards} cards in this deck
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-red-50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {stats.hard}
            </div>
            <div className="text-sm font-medium text-red-800">Hard</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {stats.good}
            </div>
            <div className="text-sm font-medium text-yellow-800">Good</div>
          </div>
          <div className="bg-green-50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.easy}
            </div>
            <div className="text-sm font-medium text-green-800">Easy</div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRestartSession}
            className="!rounded-button whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 font-medium transition-all duration-200 flex items-center justify-center"
          >
            <i className="fas fa-redo mr-2"></i>
            Study Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudyCompletePage;
