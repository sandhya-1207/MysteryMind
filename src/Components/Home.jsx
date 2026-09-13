import { useState } from "react";

function Home({ onStart }) {
  const [theme, setTheme] = useState("Haunted Mansion");
  const [difficulty, setDifficulty] = useState("Easy");
  const [puzzleCount, setPuzzleCount] = useState(3);

  const backgrounds = {
    "Haunted Mansion": "/backgrounds/haunted.mp4",
    "Abandoned Laboratory": "/backgrounds/laboratory.mp4",
    "Ancient Temple": "/backgrounds/temple.mp4",
    "Secret Underground Bunker": "/backgrounds/bunker.mp4",
    "Lost Island": "/backgrounds/island.mp4",
  };

  const startGame = () => {
    onStart({
      theme,
      difficulty,
      puzzleCount,
    });
  };

  return (
    <div className="home">

      <video
        key={backgrounds[theme]}
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src={backgrounds[theme]}
          type="video/mp4"
        />
      </video>

      <div className="content">

        <div className="hero">
          <div className="logo">🔐</div>

          <h1>MysteryMind</h1>

          <p className="subtitle">
            AI-Powered Interactive Escape Room
          </p>
        </div>

        <div className="card">

          <label>Choose a Mystery</label>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="Haunted Mansion">
              Haunted Mansion
            </option>

            <option value="Abandoned Laboratory">
              Abandoned Laboratory
            </option>

            <option value="Ancient Temple">
              Ancient Temple
            </option>

            <option value="Secret Underground Bunker">
              Secret Underground Bunker
            </option>

            <option value="Lost Island">
              Lost Island
            </option>
          </select>

          <label>Difficulty</label>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <label>Number of Puzzles</label>

          <select
            value={puzzleCount}
            onChange={(e) =>
              setPuzzleCount(Number(e.target.value))
            }
          >
            <option value={3}>3 Puzzles</option>
            <option value={5}>5 Puzzles</option>
            <option value={7}>7 Puzzles</option>
            <option value={10}>10 Puzzles</option>
          </select>

          <button onClick={startGame}>
            🕵️ Generate Mystery
          </button>

        </div>

      </div>

    </div>
  );
}

export default Home;