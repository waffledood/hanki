// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from "react";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const decks = [
    {
      id: 1,
      name: "Advanced JavaScript Concepts",
      totalCards: 245,
      dueCards: 12,
      lastStudied: "2025-03-22",
      progress: 85,
      category: "Programming",
    },
    {
      id: 2,
      name: "World History - Ancient Civilizations",
      totalCards: 180,
      dueCards: 25,
      lastStudied: "2025-03-21",
      progress: 70,
      category: "History",
    },
    {
      id: 3,
      name: "Medical Terminology",
      totalCards: 320,
      dueCards: 45,
      lastStudied: "2025-03-20",
      progress: 60,
      category: "Medicine",
    },
    {
      id: 4,
      name: "French Vocabulary - Advanced",
      totalCards: 500,
      dueCards: 30,
      lastStudied: "2025-03-22",
      progress: 90,
      category: "Language",
    },
    {
      id: 5,
      name: "Organic Chemistry Fundamentals",
      totalCards: 275,
      dueCards: 15,
      lastStudied: "2025-03-21",
      progress: 75,
      category: "Science",
    },
    {
      id: 6,
      name: "Machine Learning Algorithms",
      totalCards: 150,
      dueCards: 20,
      lastStudied: "2025-03-20",
      progress: 65,
      category: "Programming",
    },
  ];

  const categories = [
    "All",
    "Programming",
    "History",
    "Medicine",
    "Language",
    "Science",
  ];

  const handleCreateDeck = () => {
    if (newDeckName.trim()) {
      setShowCreateModal(false);
      setNewDeckName("");
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const filteredDecks = decks
    .filter(
      (deck) =>
        deck.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "All" || deck.category === selectedCategory)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "dueCards":
          return b.dueCards - a.dueCards;
        case "lastStudied":
          return (
            new Date(b.lastStudied).getTime() -
            new Date(a.lastStudied).getTime()
          );
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/logo512.png" alt="Anki Logo" className="h-10 w-10" />
            <h1 className="text-2xl font-bold text-gray-800">Anki</h1>
          </div>
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Dashboard
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Statistics
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Settings
              </a>
            </nav>
            <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
              <i className="fas fa-user text-gray-600"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <button
            onClick={() => setShowCreateModal(true)}
            className="!rounded-button bg-blue-600 text-white px-6 py-3 flex items-center space-x-2 hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="fas fa-plus"></i>
            <span>Create New Deck</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search decks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="dueCards">Sort by Due Cards</option>
              <option value="lastStudied">Sort by Last Studied</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Decks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDecks.map((deck) => (
            <div
              key={deck.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {deck.name}
                </h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <i className="fas fa-ellipsis-h"></i>
                </button>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <i className="fas fa-layer-group text-gray-400"></i>
                  <span className="text-sm text-gray-600">
                    {deck.totalCards} cards
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <i className="fas fa-clock text-gray-400"></i>
                  <span className="text-sm text-gray-600">
                    {deck.dueCards} due
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(
                      deck.progress
                    )}`}
                    style={{ width: `${deck.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Last studied:{" "}
                  {new Date(deck.lastStudied).toLocaleDateString()}
                </span>
                <button className="!rounded-button bg-green-500 text-white px-4 py-2 text-sm hover:bg-green-600 transition-colors whitespace-nowrap">
                  Study Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Create Deck Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Deck</h2>
            <input
              type="text"
              placeholder="Deck name"
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="!rounded-button px-4 py-2 text-gray-600 hover:text-gray-800 whitespace-nowrap cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDeck}
                className="!rounded-button bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 whitespace-nowrap cursor-pointer"
              >
                Create Deck
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
