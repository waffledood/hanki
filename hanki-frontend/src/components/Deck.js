import { getProgressColor } from "../utils/color";
import { Link } from "react-router-dom";

function Deck({ id, name, totalCards, dueCards, progress, lastStudied }) {
  return (
    <div
      key={id}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <Link to={`/decks/${id}`}>
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        </Link>
        <button className="text-gray-400 hover:text-gray-600">
          <i className="fas fa-ellipsis-h"></i>
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-1">
          <i className="fas fa-layer-group text-gray-400"></i>
          <span className="text-sm text-gray-600">{totalCards ?? 0} cards</span>
        </div>
        <div className="flex items-center space-x-1">
          <i className="fas fa-clock text-gray-400"></i>
          <span className="text-sm text-gray-600">{dueCards ?? 0} due</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className={`h-2 rounded-full ${getProgressColor(progress)}`}
            style={{ width: `${progress ?? 0}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Last studied:{" "}
          {lastStudied ?? null
            ? new Date(lastStudied).toLocaleDateString()
            : "Not studied yet"}
        </span>
        <Link to={`/study/${id}`}>
          <button className="!rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-700 transition-colors duration-500 whitespace-nowrap">
            Study Now
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Deck;
