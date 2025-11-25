import { getProgressColor } from "../utils/color";
import { useNavigate, Link } from "react-router-dom";

function Deck({ id, name, totalCards, dueCards, progress, lastStudied }) {
  const navigate = useNavigate();

  const cardClickHandler = () => {
    navigate(`/decks/${id}`);
  };

  return (
    <Link to={`/decks/${id}`}>
      <div
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer"
        onClick={cardClickHandler}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-ellipsis-h"></i>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <i className="fas fa-layer-group text-gray-400"></i>
            <span className="text-sm text-gray-600">
              {totalCards ?? 0} cards
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Deck;
