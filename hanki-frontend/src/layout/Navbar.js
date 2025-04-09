import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/logo512.png" alt="Anki Logo" className="h-10 w-10" />
          <h1 className="text-2xl font-bold text-gray-800">Hanki</h1>
        </div>
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              Dashboard
            </Link>
            <Link
              to="/statistics"
              className="text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              Statistics
            </Link>
            <Link
              to="/settings"
              className="text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              Settings
            </Link>
          </nav>
          <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
            <i className="fas fa-user text-gray-600"></i>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
