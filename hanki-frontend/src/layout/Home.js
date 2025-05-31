import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import MainLayout from "./MainLayout";
import Navbar from "./Navbar";
import Deck from "../components/Deck";

import { apiRequest } from "../utils/fetch";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");
  const [newDeckDescription, setNewDeckDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [errors, setErrors] = useState({ name: "", description: "" });

  const [decks, setDecks] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getDecks = async () => {
      try {
        const response = await axiosPrivate.get("/decks", {
          signal: controller.signal,
        });

        isMounted && setDecks(response.data);
      } catch (err) {
        console.error(err);

        // redirect user to login page if the refresh token expires
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getDecks();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // const decks = [
  //   {
  //     id: 1,
  //     name: "Advanced JavaScript Concepts",
  //     totalCards: 245,
  //     dueCards: 12,
  //     lastStudied: "2025-03-22",
  //     progress: 85,
  //     category: "Programming",
  //   },
  //   {
  //     id: 2,
  //     name: "World History - Ancient Civilizations",
  //     totalCards: 180,
  //     dueCards: 25,
  //     lastStudied: "2025-03-21",
  //     progress: 70,
  //     category: "History",
  //   },
  //   {
  //     id: 3,
  //     name: "Medical Terminology",
  //     totalCards: 320,
  //     dueCards: 45,
  //     lastStudied: "2025-03-20",
  //     progress: 60,
  //     category: "Medicine",
  //   },
  //   {
  //     id: 4,
  //     name: "French Vocabulary - Advanced",
  //     totalCards: 500,
  //     dueCards: 30,
  //     lastStudied: "2025-03-22",
  //     progress: 90,
  //     category: "Language",
  //   },
  //   {
  //     id: 5,
  //     name: "Organic Chemistry Fundamentals",
  //     totalCards: 275,
  //     dueCards: 15,
  //     lastStudied: "2025-03-21",
  //     progress: 75,
  //     category: "Science",
  //   },
  //   {
  //     id: 6,
  //     name: "Machine Learning Algorithms",
  //     totalCards: 150,
  //     dueCards: 20,
  //     lastStudied: "2025-03-20",
  //     progress: 65,
  //     category: "Programming",
  //   },
  // ];

  const categories = [
    "All",
    "Programming",
    "History",
    "Medicine",
    "Language",
    "Science",
  ];

  const createDeck = async () => {
    const controller = new AbortController();

    try {
      const response = await axiosPrivate.post("/decks", {
        name: newDeckName,
        description: newDeckDescription,
        signal: controller.signal,
      });

      // log new Deck
      console.log("New Deck created:", response.data);

      // add new Deck to list of Decks
      setDecks((prevDecks) => [...prevDecks, response.data]);

      // cleanup by cancelling request
      controller.abort();
    } catch (err) {
      switch (err.status) {
        case 400:
          console.error("400 Error:", err);
      }
    }
  };

  const handleShowCreateModal = (show) => {
    if (!show) {
      // Close modal
      setShowCreateModal(false);

      // Clean up
      setNewDeckName("");
      setNewDeckDescription("");
      setErrors({ name: "", description: "" });
    }
  };

  const handleCreateDeck = () => {
    let hasError = false;
    const newErrors = { name: "", description: "" };

    if (!newDeckName.trim()) {
      newErrors.name = "Deck name is required.";
      hasError = true;
    } else if (newDeckName.trim().length > 255) {
      newErrors.name = "Deck name can only have a maximum of 255 characters.";
      hasError = true;
    }

    if (!newDeckDescription.trim()) {
      newErrors.description = "Deck description is required.";
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      // Proceed with creating the deck
      createDeck();

      // Close modal
      setShowCreateModal(false);

      // Clean up
      setNewDeckName("");
      setNewDeckDescription("");
      setErrors({ name: "", description: "" });
    }
  };

  const noDeckInfo = (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex flex-col items-center justify-center h-24 w-24 mb-4 text-gray-400">
        <i className="fas fa-folder-open text-6xl"></i>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        No Decks Available
      </h3>
      <p className="text-gray-600 text-center mb-8 max-w-md">
        You haven't created any decks yet.
        <br />
        Start your learning journey by creating your first deck!
      </p>
      <button
        onClick={() => setShowCreateModal(true)}
        className="!rounded-lg bg-indigo-600 text-white px-6 py-3 flex items-center space-x-2 hover:bg-indigo-700 transition-colors duration-500 cursor-pointer whitespace-nowrap"
      >
        <i className="fas fa-plus"></i>
        <span>Create Your First Deck</span>
      </button>
    </div>
  );

  const renderDeckGrid = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks
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
          })
          .map(
            ({
              id,
              name,
              totalCards,
              dueCards,
              lastStudied,
              progress,
              category,
            }) => (
              <Link to={`/decks/${id}`} key={id}>
                <Deck
                  id={id}
                  name={name}
                  totalCards={totalCards}
                  dueCards={dueCards}
                  lastStudied={lastStudied}
                  progress={progress}
                  category={category}
                />
              </Link>
            )
          )}
      </div>
    );
  };

  return (
    <MainLayout>
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <button
            onClick={() => setShowCreateModal(true)}
            className="!rounded-lg bg-indigo-600 text-white px-6 py-3 flex items-center space-x-2 hover:bg-indigo-700 transition-colors duration-500 cursor-pointer whitespace-nowrap"
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
        {decks.length > 0 ? renderDeckGrid() : noDeckInfo}
      </main>

      {/* Create Deck Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Deck</h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Deck name"
                value={newDeckName}
                onChange={(e) => setNewDeckName(e.target.value)}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }
                `}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Deck description"
                value={newDeckDescription}
                onChange={(e) => setNewDeckDescription(e.target.value)}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    errors.description
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }
                `}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => handleShowCreateModal(false)}
                className="!rounded-lg bg-gray-100 text-gray-600 px-4 py-2 hover:bg-gray-200 transition-colors duration-500 whitespace-nowrap cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDeck}
                className="!rounded-lg bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition-colors duration-500 whitespace-nowrap cursor-pointer"
              >
                Create Deck
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default Home;
