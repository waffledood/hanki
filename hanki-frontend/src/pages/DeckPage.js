import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Navbar from "../layout/Navbar";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

function DeckPage() {
  const [expandedCardId, setExpandedCardId] = useState();
  const { deckId } = useParams();
  const [deckDetails, setDeckDetails] = useState({});
  const [deckCards, setDeckCards] = useState([]);

  // editing of Deck's details
  const [isEditingDeck, setIsEditingDeck] = useState(false);
  const [deckEditData, setDeckEditData] = useState({});

  // editing of a Card's details
  const [editingCardId, setEditingCardId] = useState();
  const [cardEditData, setCardEditData] = useState({});

  // modal & form for new Card creation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCardQuestion, setNewCardQuestion] = useState("");
  const [newCardAnswer, setNewCardAnswer] = useState("");

  // errors for creation of new Card
  const [errors, setErrors] = useState({ question: "", answer: "" });

  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchDeckDetails = async () => {
      try {
        // fetch details of the specified Deck
        const response = await axiosPrivate.get(`/decks/${deckId}`, {
          signal: controller.signal,
        });

        isMounted && setDeckDetails(response.data);
      } catch (err) {
        // redirect user to login page if the refresh token expires
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    const fetchDeckCards = async () => {
      try {
        // fetch cards of the specified Deck
        const response = await axiosPrivate.get(`decks/${deckId}/cards`, {
          signal: controller.signal,
        });

        isMounted && setDeckCards(response.data);
      } catch (err) {
        // redirect user to login page if the refresh token expires
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    fetchDeckDetails();
    fetchDeckCards();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const clearNewCardModal = () => {
    setIsModalOpen(false);
    setNewCardQuestion("");
    setNewCardAnswer("");
  };

  const handleEditDeck = () => {
    setIsEditingDeck(true);
    setDeckEditData({
      name: deckDetails.name,
      description: deckDetails.description,
    });
  };

  const cancelDeckEdit = () => {
    setIsEditingDeck(false);
    setDeckEditData({
      name: deckDetails.name,
      description: deckDetails.description,
    });
  };

  const saveDeckChanges = () => {
    setDeckDetails({
      ...deckDetails,
      name: deckEditData.name,
      description: deckEditData.description,
    });

    // send PATCH request
    const controller = new AbortController();

    const updateDeckDetails = async () => {
      try {
        const response = await axiosPrivate.patch(`/decks/${deckId}`, {
          signal: controller.signal,
          name: deckEditData.name,
          description: deckEditData.description,
        });
        console.log("updateDeckDetails:", response);
      } catch (err) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    updateDeckDetails();

    controller.abort();

    setIsEditingDeck(false);
  };

  const handleCreateCard = () => {
    // if the User is editing a Card, handle the edits
    if (editingCardId !== null) {
      // update local instance of Card
      setDeckCards(
        deckCards.map((card) =>
          card.id === editingCardId
            ? {
                ...card,
                question: cardEditData.question,
                answer: cardEditData.answer,
              }
            : card
        )
      );

      // send PATCH request
      const controller = new AbortController();
      const updateCardDetails = async () => {
        try {
          const response = await axiosPrivate.patch(`/cards/${editingCardId}`, {
            signal: controller.signal,
            question: cardEditData.question,
            answer: cardEditData.answer,
          });
          console.log(response);
        } catch (err) {
          navigate("/login", { from: location, state: true });
        }
      };
      updateCardDetails();
      controller.abort();

      setEditingCardId(null);
      setCardEditData({ question: "", answer: "" });
    } else {
      let hasError = false;
      const newErrors = { question: "", answer: "" };

      if (!newCardQuestion.trim()) {
        newErrors.question = "Card question is required.";
        hasError = true;
      }

      if (!newCardAnswer.trim()) {
        newErrors.answer = "Card answer is required.";
        hasError = true;
      }

      setErrors(newErrors);

      if (!hasError) {
        const controller = new AbortController();

        axiosPrivate
          .post("cards", {
            question: newCardQuestion,
            answer: newCardAnswer,
            deckId: deckId,
            signal: controller.signal,
          })
          .then((res) => {
            // log new Card
            console.log("New Card created:", res.data);

            // add new Card to existing list of Cards
            setDeckCards((prevDeckCards) => [...prevDeckCards, res.data]);

            // update count of Deck's cards
            setDeckDetails((prev) => ({
              ...prev,
              totalCards: (prev.totalCards ?? 0) + 1,
            }));

            // cleanup by cancelling request
            controller.abort();
          })
          .catch((err) => console.error("Error:", err));
      }
    }

    clearNewCardModal();
  };

  const handleEditCard = (card) => {
    setEditingCardId(card.id);
    setCardEditData({
      question: card.question,
      answer: card.answer,
    });
    setIsModalOpen(true);
  };

  // Sample cards data
  const cards = [
    {
      id: 1,
      question: "What is a closure in JavaScript?",
      answer:
        "A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment). In JavaScript, closures are created every time a function is created, at function creation time.",
    },
    {
      id: 2,
      question: "Explain the difference between let, const, and var",
      answer:
        "var is function-scoped and can be redeclared and updated. let is block-scoped and can be updated but not redeclared. const is block-scoped and cannot be updated or redeclared after initialization.",
    },
    {
      id: 3,
      question: "What is the event loop in JavaScript?",
      answer:
        "The event loop is a programming construct that waits for and dispatches events in a program. It works by making a request to some internal or external event provider, then calls the relevant event handler.",
    },
    {
      id: 4,
      question: "What are Promises in JavaScript?",
      answer:
        "Promises are objects representing the eventual completion or failure of an asynchronous operation. They allow you to attach callbacks to handle the success or failure of the async operation instead of passing callbacks into functions.",
    },
    {
      id: 5,
      question: "Explain prototypal inheritance in JavaScript",
      answer:
        "Prototypal inheritance is a feature in JavaScript where objects can inherit properties and methods from other objects. Each object has an internal link to another object called its prototype. That prototype object has a prototype of its own, and so on.",
    },
    {
      id: 6,
      question: "What is the difference between == and === operators?",
      answer:
        "The == (equality) operator checks for value equality after converting both values to a common type. The === (strict equality) operator checks for both value and type equality without type conversion.",
    },
  ];

  const toggleCardExpansion = (id) => {
    if (expandedCardId === id) {
      setExpandedCardId(null);
    } else {
      setExpandedCardId(id);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const cardsList = (
    <div className="space-y-4">
      {deckCards.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md"
          onClick={() => toggleCardExpansion(card.id)}
        >
          <div className="p-5">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-gray-900">
                {card.question}
              </h3>
              <span className="text-gray-400">
                <i
                  className={`fas ${
                    expandedCardId === card.id
                      ? "fa-chevron-up"
                      : "fa-chevron-down"
                  }`}
                ></i>
              </span>
            </div>
            {expandedCardId === card.id ? (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-700">{card.answer}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center cursor-pointer !rounded-button whitespace-nowrap transition-colors duration-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCard(card);
                    }}
                  >
                    <i className="fas fa-edit mr-1"></i>
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800 text-sm flex items-center cursor-pointer !rounded-button whitespace-nowrap transition-colors duration-500">
                    <i className="fas fa-trash-alt mr-1"></i>
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                {truncateText(card.answer, 100)}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const noCardInfo = (
    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-gray-200">
      <div className="flex flex-col items-center justify-center h-24 w-24 mb-4 text-gray-400">
        <i className="fas fa-layer-group text-6xl"></i>
      </div>
      <h3 className="text-lg font-medium text-gray-900">No cards yet</h3>
      <p className="mt-1 text-gray-500">
        Get started by adding your first flashcard to this deck.
      </p>
      <div className="mt-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md cursor-pointer !rounded-button whitespace-nowrap"
        >
          <i className="fas fa-plus mr-2"></i>
          Add First Card
        </button>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        {/* Deck Information - Fixed/Floating Section */}
        <div className="sticky top-16 bg-gray-50 pt-4 pb-6 z-9">
          {isEditingDeck ? (
            <div className="mb-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="mb-4">
                <label
                  htmlFor="deckName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Deck Title
                </label>
                <input
                  id="deckName"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={deckEditData.name}
                  onChange={(e) =>
                    setDeckEditData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="deckDescription"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="deckDescription"
                  className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  value={deckEditData.description}
                  onChange={(e) =>
                    setDeckEditData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDeckEdit}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={saveDeckChanges}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 cursor-pointer !rounded-button whitespace-nowrap"
                  disabled={!deckEditData?.name?.trim()}
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">
                  {deckDetails.name}
                </h1>
                <button
                  onClick={handleEditDeck}
                  className="text-indigo-600 hover:text-indigo-800 p-1 rounded-md cursor-pointer !rounded-button whitespace-nowrap transition-colors duration-500"
                >
                  <i className="fas fa-edit mr-1"></i>
                  Edit
                </button>
              </div>
              <p className="mt-2 text-gray-600">{deckDetails.description}</p>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <i className="fas fa-layer-group mr-2"></i>
                <span>{deckDetails.totalCards ?? 0} cards</span>
              </div>
            </div>
          )}
          {/* Action Buttons */}
          <div className="mb-2 flex flex-wrap gap-3">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center cursor-pointer !rounded-button whitespace-nowrap transition-colors duration-500">
              <i className="fas fa-book-open mr-2"></i>
              Study Now
            </button>
            <button className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center cursor-pointer !rounded-button whitespace-nowrap transition-colors duration-500">
              <i className="fas fa-random mr-2"></i>
              Shuffle
            </button>
            <button className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center cursor-pointer !rounded-button whitespace-nowrap transition-colors duration-500">
              <i className="fas fa-sort mr-2"></i>
              Sort
            </button>
            <button className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center cursor-pointer !rounded-button whitespace-nowrap transition-colors duration-500">
              <i className="fas fa-filter mr-2"></i>
              Filter
            </button>
          </div>
          <div className="h-2 w-full bg-gradient-to-b from-gray-50 to-transparent"></div>
        </div>

        {/* Card List - Scrollable Section */}
        <div className="flex-1 overflow-auto pt-2">
          {deckCards.length > 0 ? cardsList : noCardInfo}
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center cursor-pointer !rounded-button whitespace-nowrap transition-colors duration-500"
        >
          <i className="fas fa-plus text-xl"></i>
        </button>
      </div>

      {/* Add Card Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingCardId !== null ? "Edit Card" : "Add New Card"}
              </h3>
              <button
                onClick={() => {
                  clearNewCardModal();
                }}
                className="text-gray-400 hover:text-gray-500 !rounded-button whitespace-nowrap"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label
                  htmlFor="question"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Question
                </label>
                <textarea
                  id="question"
                  className={`w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none overflow-y-auto ${
                    errors.question ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  placeholder="Enter your question"
                  value={
                    editingCardId !== null
                      ? cardEditData.question
                      : newCardQuestion
                  }
                  onChange={(e) =>
                    editingCardId !== null
                      ? setCardEditData((prev) => ({
                          ...prev,
                          question: e.target.value,
                        }))
                      : setNewCardQuestion(e.target.value)
                  }
                />
                {errors.question && (
                  <p className="text-red-500 text-sm mt-1">{errors.question}</p>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="answer"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Answer
                </label>
                <textarea
                  id="answer"
                  className={`w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none overflow-y-auto ${
                    errors.answer ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  placeholder="Enter your answer"
                  value={
                    editingCardId !== null ? cardEditData.answer : newCardAnswer
                  }
                  onChange={(e) => {
                    editingCardId !== null
                      ? setCardEditData((prev) => ({
                          ...prev,
                          answer: e.target.value,
                        }))
                      : setNewCardAnswer(e.target.value);
                  }}
                />
                {errors.answer && (
                  <p className="text-red-500 text-sm mt-1">{errors.answer}</p>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  clearNewCardModal();
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 !rounded-button whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCreateCard()}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed !rounded-button whitespace-nowrap cursor-pointer"
                // disabled={!newCardQuestion.trim() || !newCardAnswer.trim()}
              >
                {editingCardId !== null ? "Save Changes" : "Add Card"}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default DeckPage;
