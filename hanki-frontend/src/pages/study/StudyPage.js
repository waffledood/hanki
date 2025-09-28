import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import StudyCompletePage from "./StudyCompletePage";

function StudyPage() {
  const [loading, setLoading] = useState(true);

  const { deckId } = useParams();

  const [deckDetails, setDeckDetails] = useState({});

  const [currentCardIdZeroIndex, setCurrentCardIdZeroIndex] = useState(0);
  const currentCardIdOneIndex = currentCardIdZeroIndex + 1;

  const [deckCards, setDeckCards] = useState([]);

  const totalCards = deckCards.length;

  const cardQuestion = loading
    ? null
    : totalCards === 0
    ? null
    : deckCards[currentCardIdZeroIndex].question;
  const cardAnswer = loading
    ? null
    : totalCards === 0
    ? null
    : deckCards[currentCardIdZeroIndex].answer;

  const progress = (currentCardIdOneIndex / totalCards) * 100;

  const [completedStudying, setCompletedStudying] = useState(false);

  const [showAnswer, setShowAnswer] = useState(false);

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

    const fetchData = async () => {
      try {
        await Promise.all([fetchDeckDetails(), fetchDeckCards()]);
      } catch (err) {
        // Handle any errors that might occur during the fetch
        console.error(err);
      } finally {
        // This will always run after both fetches have either succeeded or failed
        isMounted && setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {}, [currentCardIdZeroIndex]);

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleRating = (rating) => {
    // TODO - handle rating set for current Card

    // Move to next Card id
    setCurrentCardIdZeroIndex((prev) => {
      const nextId = prev + 1;

      // TODO - handle current Card id if it is the last in the index
      if (nextId === totalCards) {
        console.log("Completed studying Deck!");
        setCompletedStudying(true);

        return prev;
      }

      return nextId;
    });
    setShowAnswer(false);
  };

  const exitStudyPage = () => {
    // when a user has completed studying a Deck, redirect them to the homepage
    console.log(`Exiting Study mode for Deck ${deckId}`);
    navigate("/");
  };

  // display a "No Cards Yet" page if the Deck has no cards
  if (totalCards === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
            <i className="fas fa-layer-group text-3xl text-gray-400"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            No Cards Yet
          </h2>
          <p className="text-gray-600 mb-8">
            You can't study with an empty Deck! <br />
            Add some cards to start studying!
          </p>
          <Link to={`/decks/${deckId}`}>
            <div className="rounded-xl whitespace-nowrap inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 font-medium transition-all duration-200">
              <i className="fas fa-plus mr-2"></i>
              Add Cards
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {completedStudying ? (
        // TODO - remove hardcoded stats
        <StudyCompletePage
          totalNumberOfCards={totalCards}
          stats={{ hard: 10, good: 2, easy: 7 }}
          deckId={deckId}
        />
      ) : (
        <React.Fragment>
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-lg font-semibold text-gray-800">
                  {deckDetails.name}
                </h1>
                <div className="text-sm text-gray-500">
                  {loading ? (
                    <p>Loading</p>
                  ) : (
                    <p>
                      {currentCardIdOneIndex} / {totalCards} cards
                    </p>
                  )}
                </div>
              </div>
              <button
                id="closeStudyPage"
                className="flex items-center p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                onClick={exitStudyPage}
              >
                <i className="fas fa-times text-gray-600 text-xl"></i>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-1">
              <div
                className="bg-indigo-600 h-1 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                {/* Study Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
                    <div className="flex items-center justify-between">
                      <div className="text-white text-sm font-medium opacity-90">
                        Question {currentCardIdOneIndex}
                      </div>
                      <div className="text-white text-sm opacity-75">
                        <i className="fas fa-brain mr-2"></i>
                        Study Mode
                      </div>
                    </div>
                  </div>

                  {/* Question Section */}
                  <div className="px-8 py-12">
                    <div className="text-center">
                      <div className="text-3xl font-light text-gray-800 leading-relaxed mb-8">
                        {cardQuestion}
                      </div>

                      {/* Show Answer Button or Answer */}
                      {!showAnswer ? (
                        <button
                          onClick={handleShowAnswer}
                          className="rounded-xl whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
                        >
                          <i className="fas fa-eye mr-3"></i>
                          Show Answer
                        </button>
                      ) : (
                        <div className="space-y-8">
                          {/* Answer Display */}
                          <div className="border-t border-gray-200 pt-8">
                            <div className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
                              Answer
                            </div>
                            <div className="text-2xl font-semibold text-green-700 mb-8">
                              {cardAnswer}
                            </div>
                          </div>

                          {/* Rating Buttons */}
                          <div className="space-y-4">
                            <div className="text-sm font-medium text-gray-600 mb-4">
                              How well did you know this?
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                              <button
                                onClick={() => handleRating("hard")}
                                className="rounded-xl whitespace-nowrap bg-red-500 hover:bg-red-600 text-white px-6 py-3 font-medium transition-colors cursor-pointer flex items-center justify-center"
                              >
                                <i className="fas fa-times-circle mr-2"></i>
                                Hard
                              </button>
                              <button
                                onClick={() => handleRating("good")}
                                className="rounded-xl whitespace-nowrap bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 font-medium transition-colors cursor-pointer flex items-center justify-center"
                              >
                                <i className="fas fa-check-circle mr-2"></i>
                                Good
                              </button>
                              <button
                                onClick={() => handleRating("easy")}
                                className="rounded-xl whitespace-nowrap bg-green-500 hover:bg-green-600 text-white px-6 py-3 font-medium transition-colors cursor-pointer flex items-center justify-center"
                              >
                                <i className="fas fa-star mr-2"></i>
                                Easy
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Study Tips */}
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center space-x-6 text-sm text-gray-500">
                    {/* TODO - Implement logic for clicking Space to reveal cardAnswer */}
                    <div className="flex items-center">
                      <i className="fas fa-keyboard mr-2"></i>
                      Press Space to reveal Answer
                    </div>

                    {/* TODO - Implement logic to go to next & previous Cards*/}
                    <div className="flex items-center">
                      <i className="fas fa-arrow-left mr-2"></i>
                      <i className="fas fa-arrow-right mr-2"></i>
                      Navigate cards
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default StudyPage;
