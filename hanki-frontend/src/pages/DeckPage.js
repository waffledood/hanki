import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

function DeckPage() {
  const [expandedCardId, setExpandedCardId] = useState();
  const { deckId } = useParams();

  // Sample deck data
  const deck = {
    name: "Advanced JavaScript Concepts",
    description:
      "Master modern JavaScript features, patterns, and best practices",
    totalCards: 24,
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

  const cardList = (
    <div className="space-y-4">
      {cards.map((card) => (
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
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                    <i className="fas fa-edit mr-1"></i>
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800 text-sm flex items-center cursor-pointer !rounded-button whitespace-nowrap">
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
    <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
      <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
        <i className="fas fa-layer-group text-6xl"></i>
      </div>
      <h3 className="text-lg font-medium text-gray-900">No cards yet</h3>
      <p className="mt-1 text-gray-500">
        Get started by adding your first flashcard to this deck.
      </p>
      <div className="mt-6">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md cursor-pointer !rounded-button whitespace-nowrap">
          <i className="fas fa-plus mr-2"></i>
          Add First Card
        </button>
      </div>
    </div>
  );

  return (
    <MainLayout>
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/">
              <button className="text-gray-600 hover:text-gray-900 cursor-pointer !rounded-button whitespace-nowrap">
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Decks
              </button>
            </Link>
          </div>
          <div className="flex items-center">
            <button className="text-gray-600 hover:text-gray-900 p-2 rounded-full cursor-pointer !rounded-button whitespace-nowrap">
              <i className="fas fa-ellipsis-v"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 flex flex-col">
        {/* Deck Information - Fixed/Floating Section */}
        <div className="sticky top-16 bg-gray-50 pt-4 pb-6 z-9">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{deck.name}</h1>
            <p className="mt-2 text-gray-600">{deck.description}</p>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <i className="fas fa-layer-group mr-2"></i>
              <span>{deck.totalCards} cards</span>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="mb-2 flex flex-wrap gap-3">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center cursor-pointer !rounded-button whitespace-nowrap">
              <i className="fas fa-book-open mr-2"></i>
              Study Now
            </button>
            <button className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center cursor-pointer !rounded-button whitespace-nowrap">
              <i className="fas fa-random mr-2"></i>
              Shuffle
            </button>
            <button className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center cursor-pointer !rounded-button whitespace-nowrap">
              <i className="fas fa-sort mr-2"></i>
              Sort
            </button>
            <button className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center cursor-pointer !rounded-button whitespace-nowrap">
              <i className="fas fa-filter mr-2"></i>
              Filter
            </button>
          </div>
          <div className="h-2 w-full bg-gradient-to-b from-gray-50 to-transparent"></div>
        </div>

        {/* Card List - Scrollable Section */}
        <div className="flex-1 overflow-auto pt-2">
          {cards.length > 0 ? cardList : noCardInfo}
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center cursor-pointer !rounded-button whitespace-nowrap">
          <i className="fas fa-plus text-xl"></i>
        </button>
      </div>
    </MainLayout>
  );
}

export default DeckPage;
