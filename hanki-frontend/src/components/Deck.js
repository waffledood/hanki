import { getProgressColor } from "../utils/color";

function Deck({ id, name, totalCards, dueCards, progress, lastStudied }) {
  return (
    <div
      key={id}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <i className="fas fa-ellipsis-h"></i>
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-1">
          <i className="fas fa-layer-group text-gray-400"></i>
          <span className="text-sm text-gray-600">{totalCards} cards</span>
        </div>
        <div className="flex items-center space-x-1">
          <i className="fas fa-clock text-gray-400"></i>
          <span className="text-sm text-gray-600">{dueCards} due</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className={`h-2 rounded-full ${getProgressColor(progress)}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Last studied: {new Date(lastStudied).toLocaleDateString()}
        </span>
        <button className="!rounded-lg bg-green-500 text-white px-4 py-2 text-sm hover:bg-green-600 transition-colors whitespace-nowrap">
          Study Now
        </button>
      </div>
    </div>
  );
}

export default Deck;
