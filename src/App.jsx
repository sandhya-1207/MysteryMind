import { useState } from "react";
import axios from "axios";
import Home from "./components/Home";
import "./App.css";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSettings, setGameSettings] = useState(null);
  const [mystery, setMystery] = useState(null);

  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [solved, setSolved] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Generate mystery using Gemini
  const startGame = async (settings) => {
    setGameSettings(settings);
    setLoading(true);
    setError("");
    setMystery(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/generate-mystery",
        {
          theme: settings.theme,
          difficulty: settings.difficulty,
          puzzleCount: settings.puzzleCount,
        }
      );

      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      setMystery(response.data);
      setGameStarted(true);
      setCurrentPuzzle(0);
      setAnswer("");
      setMessage("");
      setShowHint(false);
      setSolved(false);

    } catch (err) {
      console.error(err);
      setError(
        "Could not connect to the MysteryMind backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // Check the user's answer
  const checkAnswer = () => {
    const puzzle = mystery.puzzles[currentPuzzle];

    if (!answer.trim()) {
      setMessage("⚠️ Please enter an answer.");
      return;
    }

    const userAnswer = answer.trim().toLowerCase();
    const correctAnswer = String(puzzle.answer)
      .trim()
      .toLowerCase();

    if (userAnswer === correctAnswer) {
      setMessage("✅ Correct! You solved the puzzle!");
      setSolved(true);
    } else {
      setMessage("❌ That's not correct. Try again!");
    }
  };

  // Move to next puzzle
  const nextPuzzle = () => {
    if (currentPuzzle < mystery.puzzles.length - 1) {
      setCurrentPuzzle(currentPuzzle + 1);
      setAnswer("");
      setMessage("");
      setShowHint(false);
      setSolved(false);
    }
  };

  // Start a completely new game
  const backToHome = () => {
    setGameStarted(false);
    setMystery(null);
    setGameSettings(null);
    setCurrentPuzzle(0);
    setAnswer("");
    setMessage("");
    setShowHint(false);
    setSolved(false);
    setError("");
  };

  // Loading screen
  if (loading) {
    return (
      <div className="game-started">
        <div className="game-card">

          <div className="game-icon">🔐</div>

          <h1>Generating Mystery...</h1>

          <p>
            Gemini is creating your{" "}
            <strong>{gameSettings?.theme}</strong> mystery.
          </p>

          <p>🤖 Please wait...</p>

        </div>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="game-started">
        <div className="game-card">

          <div className="game-icon">⚠️</div>

          <h1>Oops!</h1>

          <p>{error}</p>

          <button onClick={backToHome}>
            ← Back to Home
          </button>

        </div>
      </div>
    );
  }

  // Home screen
  if (!gameStarted) {
    return <Home onStart={startGame} />;
  }

  // Final escape screen
  if (
    mystery &&
    currentPuzzle === mystery.puzzles.length - 1 &&
    solved
  ) {
    return (
      <div className="game-started">
        <div className="game-card">

          <div className="game-icon">🎉</div>

          <h1>You Escaped!</h1>

          <p>
            Congratulations! You solved all the puzzles
            and escaped the mystery.
          </p>

          <h2>{mystery.title}</h2>

          <p>
            🔐 All {mystery.puzzles.length} puzzles solved!
          </p>

          <button onClick={backToHome}>
            🕵️ Play Another Mystery
          </button>

        </div>
      </div>
    );
  }

  // Current puzzle
  const puzzle = mystery.puzzles[currentPuzzle];

  return (
    <div className="game-started">

      <div className="game-card">

        <div className="game-icon">🔐</div>

        <h1>{mystery.title}</h1>

        <p>{mystery.story}</p>

        <hr />

        <p>
          <strong>Theme:</strong>{" "}
          {gameSettings.theme}
        </p>

        <p>
          <strong>Difficulty:</strong>{" "}
          {gameSettings.difficulty}
        </p>

        <p>
          🧩 Puzzle {currentPuzzle + 1} of{" "}
          {mystery.puzzles.length}
        </p>

        <hr />

        <h2>🧩 Puzzle {currentPuzzle + 1}</h2>

        <p>
          {puzzle.question}
        </p>

        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !solved) {
              checkAnswer();
            }
          }}
          placeholder="Enter your answer..."
          disabled={solved}
        />

        <button
          onClick={checkAnswer}
          disabled={solved}
        >
          🔓 Submit Answer
        </button>

        <button
          onClick={() => setShowHint(!showHint)}
        >
          💡 {showHint ? "Hide Hint" : "Show Hint"}
        </button>

        {showHint && (
          <div className="hint-box">
            💡 <strong>Hint:</strong>
            <br />
            {puzzle.hint}
          </div>
        )}

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        {solved &&
          currentPuzzle < mystery.puzzles.length - 1 && (
            <button onClick={nextPuzzle}>
              ➡️ Next Puzzle
            </button>
          )}

        <button onClick={backToHome}>
          🏠 Exit Game
        </button>

      </div>

    </div>
  );
}

export default App;