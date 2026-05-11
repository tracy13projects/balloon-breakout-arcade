import React, { useEffect, useState } from "react";

function BreakoutPlaceholder({ goHome }) {
  return (
    <div>
      <h1>🎈 Balloon Breakout</h1>
      <p>Your breakout game is still here.</p>
      <button onClick={goHome}>Back To Arcade</button>
    </div>
  );
}

function PopRush({ goHome }) {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [running, setRunning] = useState(false);
  const [balloons, setBalloons] = useState([]);

  useEffect(() => {
    if (!running) return;

    const countdown = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(countdown);
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [running]);

  useEffect(() => {
    if (!running) return;

    const spawner = setInterval(() => {
      setBalloons((b) => [
        ...b,
        {
          id: Date.now() + Math.random(),
          left: Math.random() * 85,
          bottom: -60,
          speed: 1 + Math.random() * 2,
          type: Math.random() > 0.9 ? "gold" : Math.random() < 0.15 ? "red" : "pink",
        },
      ]);
    }, 700);

    return () => clearInterval(spawner);
  }, [running]);

  useEffect(() => {
    if (!running) return;

    const mover = setInterval(() => {
      setBalloons((items) =>
        items
          .map((b) => ({ ...b, bottom: b.bottom + b.speed }))
          .filter((b) => b.bottom < 430)
      );
    }, 40);

    return () => clearInterval(mover);
  }, [running]);

  function startGame() {
    setScore(0);
    setTime(30);
    setBalloons([]);
    setRunning(true);
  }

  function popBalloon(balloon) {
    if (!running) return;

    setBalloons((items) => items.filter((b) => b.id !== balloon.id));

    if (balloon.type === "gold") {
      setScore((s) => s + 5);
    } else if (balloon.type === "red") {
      setScore((s) => Math.max(0, s - 3));
    } else {
      setScore((s) => s + 1);
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
      <button onClick={goHome} style={{ marginBottom: 20 }}>
        ← Back To Arcade
      </button>

      <h1>🎈 Balloon Pop Rush</h1>
      <p>Tap balloons before time runs out.</p>

      <button
        onClick={startGame}
        style={{
          padding: "12px 18px",
          borderRadius: 12,
          border: 0,
          background: "#22c55e",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Start Game
      </button>

      <div
        style={{
          position: "relative",
          width: 600,
          height: 400,
          maxWidth: "95vw",
          margin: "20px auto",
          overflow: "hidden",
          borderRadius: 18,
          border: "4px solid #334155",
          background: "#0f172a",
        }}
      >
        {balloons.map((b) => (
          <button
            key={b.id}
            onClick={() => popBalloon(b)}
            style={{
              position: "absolute",
              left: `${b.left}%`,
              bottom: b.bottom,
              width: 50,
              height: 65,
              borderRadius: "50%",
              border: 0,
              cursor: "pointer",
              background:
                b.type === "gold"
                  ? "gold"
                  : b.type === "red"
                  ? "#ef4444"
                  : "#ec4899",
            }}
          />
        ))}
      </div>

      <p>
        ⏰ {time}s | 🎯 Score: {score}
      </p>

      <a
        href="https://www.goodnewslifestyle.shop/products/%F0%9F%8E%A5-balloon-creator-kit"
        target="_blank"
        rel="noreferrer"
      >
        <button
          style={{
            padding: "12px 18px",
            borderRadius: 12,
            border: 0,
            background: "#f59e0b",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🎈 Unlock Balloon Creator Kit
        </button>
      </a>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("menu");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(#1e293b,#0f172a)",
        color: "white",
        textAlign: "center",
        padding: 30,
        fontFamily: "Arial",
      }}
    >
      {screen === "menu" && (
        <div>
          <h1>🎈 Balloon Arcade</h1>
          <p>Choose a game.</p>

          <div style={{ marginTop: 30 }}>
            <button
              onClick={() => setScreen("breakout")}
              style={{
                margin: 10,
                padding: "14px 20px",
                borderRadius: 12,
                border: 0,
                background: "#22c55e",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              🎈 Play Breakout
            </button>

            <button
              onClick={() => setScreen("pop")}
              style={{
                margin: 10,
                padding: "14px 20px",
                borderRadius: 12,
                border: 0,
                background: "#ec4899",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              🎈 Play Pop Rush
            </button>
          </div>
        </div>
      )}

      {screen === "breakout" && (
        <BreakoutPlaceholder goHome={() => setScreen("menu")} />
      )}

      {screen === "pop" && (
        <PopRush goHome={() => setScreen("menu")} />
      )}
    </div>
  );
}
