import React, { useEffect, useRef, useState } from "react";

const productUrl = "https://www.goodnewslifestyle.shop/products/%F0%9F%8E%88-balloon-challenge-pack";
const creatorKitUrl = "https://www.goodnewslifestyle.shop/products/%F0%9F%8E%A5-balloon-creator-kit";

const pageStyle = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top, #1e293b, #0f172a 62%)",
  color: "white",
  textAlign: "center",
  padding: "28px 16px",
  fontFamily: "Arial, sans-serif",
};

const cardStyle = {
  background: "rgba(15,23,42,.78)",
  border: "1px solid #334155",
  borderRadius: 22,
  padding: 28,
  boxShadow: "0 0 30px rgba(96,165,250,.16)",
};

const greenButton = {
  padding: "14px 22px",
  borderRadius: 14,
  border: 0,
  background: "linear-gradient(90deg,#22c55e,#4ade80)",
  color: "#052e16",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 0 22px rgba(34,197,94,.36)",
  fontSize: 16,
};

const goldButton = {
  ...greenButton,
  background: "linear-gradient(90deg,#f59e0b,#fde047)",
  color: "#422006",
};

const ghostButton = {
  padding: "13px 18px",
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  background: "#f8fafc",
  color: "#0f172a",
  fontWeight: "bold",
  cursor: "pointer",
  width: "100%",
  marginTop: 10,
};

const modalBackdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.72)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50,
  padding: 16,
};

const modalCard = {
  background: "white",
  color: "black",
  padding: 24,
  borderRadius: 18,
  width: 460,
  maxWidth: "94vw",
  boxShadow: "0 20px 60px rgba(0,0,0,.32)",
};

function openShopify(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function OfferModal({ isOpen, onClose, onContinue, title = "🎈 Unlock Balloon Challenges" }) {
  const [showCreator, setShowCreator] = useState(false);
  if (!isOpen) return null;

  return (
    <div style={modalBackdrop}>
      <div style={modalCard}>
        {!showCreator ? (
          <>
            <h2>{title}</h2>
            <p style={{ fontSize: 18 }}>
              Unlock 25 real world balloon challenges, creator ideas, and party style games.
            </p>
            <button onClick={() => openShopify(productUrl)} style={{ ...greenButton, width: "100%" }}>
              Unlock Challenges — $7
            </button>
            <button onClick={() => setShowCreator(true)} style={ghostButton}>
              See Balloon Creator Kit
            </button>
            <div
              onClick={onContinue}
              style={{ marginTop: 18, cursor: "pointer", color: "#475569", textDecoration: "underline", fontSize: 18 }}
            >
              Continue Playing Free
            </div>
            <button onClick={onClose} style={{ marginTop: 14, padding: "9px 14px", borderRadius: 10 }}>
              Close
            </button>
          </>
        ) : (
          <>
            <h2>🎥 Balloon Creator Kit</h2>
            <p style={{ fontSize: 18 }}>
              Add creator prompts, filming ideas, advanced challenge variations, and replayable party formats.
            </p>
            <button onClick={() => openShopify(creatorKitUrl)} style={{ ...goldButton, width: "100%" }}>
              Add Balloon Creator Kit — $19
            </button>
            <button onClick={() => setShowCreator(false)} style={ghostButton}>
              Back To $7 Challenge Pack
            </button>
            <div
              onClick={onContinue}
              style={{ marginTop: 18, cursor: "pointer", color: "#475569", textDecoration: "underline", fontSize: 18 }}
            >
              No Thanks, Continue Playing
            </div>
            <button onClick={onClose} style={{ marginTop: 14, padding: "9px 14px", borderRadius: 10 }}>
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function GameShell({ title, subtitle, goHome, children }) {
  return (
    <div style={{ maxWidth: 980, margin: "0 auto", position: "relative" }}>
      <button
        onClick={goHome}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          padding: "9px 12px",
          borderRadius: 10,
          border: "1px solid #334155",
          background: "#1e293b",
          color: "white",
          cursor: "pointer",
        }}
      >
        ← Arcade Menu
      </button>
      <h1 style={{ fontSize: 44, marginBottom: 8, textShadow: "0 0 25px rgba(96,165,250,.55)" }}>{title}</h1>
      <p style={{ color: "#cbd5e1", fontSize: 18 }}>{subtitle}</p>
      {children}
    </div>
  );
}

function BreakoutGame({ goHome }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const mouseXRef = useRef(300);
  const gameRef = useRef(null);
  const [stats, setStats] = useState({ level: 1, score: 0, high: 0, combo: 0, lives: 3 });
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("Move your mouse or finger to control the paddle.");
  const [showOffer, setShowOffer] = useState(false);

  function createLevel(level, score = 0, high = stats.high) {
    const balloons = [];
    const rows = level % 5 === 0 ? 2 : 3;
    const cols = 10;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const rand = Math.random();
        const type = level % 5 === 0 ? "steel" : rand > 0.9 ? "gold" : rand > 0.8 ? "steel" : "normal";
        balloons.push({
          x: 55 + c * 54,
          y: 48 + r * 44,
          hit: false,
          type,
          hits: type === "steel" ? 2 : 1,
        });
      }
    }
    gameRef.current = {
      x: 300,
      y: 250,
      dx: 3 + level * 0.18,
      dy: -3.6 - level * 0.12,
      paddleX: 250,
      paddleW: 112,
      level,
      score,
      high,
      combo: 0,
      lives: 3,
      balloons,
      particles: [],
      over: false,
    };
    setStats({ level, score, high, combo: 0, lives: 3 });
  }

  function startGame() {
    setShowOffer(false);
    setRunning(true);
    setMessage("Pop the balloons and protect your lives.");
    createLevel(stats.level || 1, stats.score || 0, stats.high || 0);
  }

  function continuePlaying() {
    setShowOffer(false);
    setRunning(true);
    createLevel(stats.level || 1, stats.score || 0, stats.high || 0);
  }

  function finishRound(lost) {
    const g = gameRef.current;
    if (!g || g.over) return;
    g.over = true;
    const high = Math.max(g.high, g.score);
    const nextLevel = lost ? 1 : g.level + 1;
    const nextScore = lost ? 0 : g.score;
    setStats({ level: nextLevel, score: nextScore, high, combo: 0, lives: lost ? 0 : g.lives });
    setRunning(false);
    setMessage(lost ? "Game over. Try again or unlock more challenges." : "Level cleared! Ready for the next challenge?");
    setShowOffer(true);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function drawBalloon(b) {
      ctx.fillStyle = b.type === "gold" ? "#fde047" : b.type === "steel" ? "#94a3b8" : "#ec4899";
      ctx.beginPath();
      ctx.ellipse(b.x, b.y, 14, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.5)";
      ctx.beginPath();
      ctx.arc(b.x - 5, b.y - 7, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    function addParticles(x, y, color) {
      const g = gameRef.current;
      for (let i = 0; i < 10; i++) {
        g.particles.push({ x, y, dx: (Math.random() - 0.5) * 5, dy: (Math.random() - 0.5) * 5, life: 24, color });
      }
    }

    function hitBalloon(g, b) {
      b.hits -= 1;
      addParticles(b.x, b.y, b.type === "gold" ? "#fde047" : b.type === "steel" ? "#94a3b8" : "#ec4899");
      if (b.hits <= 0) {
        b.hit = true;
        const add = b.type === "gold" ? 5 : 1 + Math.floor(g.combo / 4);
        g.score += add;
        g.combo += 1;
        if (b.type === "gold") {
          g.balloons.forEach((other) => {
            if (!other.hit && Math.abs(other.x - b.x) < 60 && Math.abs(other.y - b.y) < 60) other.hit = true;
          });
        }
      }
    }

    function draw() {
      const g = gameRef.current;
      ctx.clearRect(0, 0, 600, 400);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, 600, 400);
      if (g?.level % 5 === 0) {
        ctx.fillStyle = "rgba(239,68,68,.14)";
        ctx.fillRect(0, 0, 600, 400);
      }
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 4;
      ctx.strokeRect(0, 0, 600, 400);
      if (!g) return;
      g.balloons.forEach((b) => { if (!b.hit) drawBalloon(b); });
      g.particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      const glow = ctx.createRadialGradient(g.x, g.y, 2, g.x, g.y, 18);
      glow.addColorStop(0, "#ffffff");
      glow.addColorStop(1, "#60a5fa");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(g.x, g.y, 8, 0, Math.PI * 2);
      ctx.fill();
      const grad = ctx.createLinearGradient(g.paddleX, 0, g.paddleX + g.paddleW, 0);
      grad.addColorStop(0, "#f59e0b");
      grad.addColorStop(1, "#fde047");
      ctx.fillStyle = grad;
      ctx.fillRect(g.paddleX, 380, g.paddleW, 10);
      if (!running) {
        ctx.fillStyle = "rgba(15,23,42,.62)";
        ctx.fillRect(0, 0, 600, 400);
      }
    }

    function tick() {
      const g = gameRef.current;
      if (running && g && !g.over) {
        g.paddleX = Math.max(0, Math.min(600 - g.paddleW, mouseXRef.current - g.paddleW / 2));
        g.x += g.dx;
        g.y += g.dy;
        if (g.x < 8 || g.x > 592) g.dx *= -1;
        if (g.y < 8) g.dy *= -1;
        if (g.y > 370 && g.y < 392 && g.x > g.paddleX && g.x < g.paddleX + g.paddleW) {
          const hitPos = (g.x - g.paddleX) / g.paddleW;
          g.dx = (hitPos - 0.5) * 7;
          g.dy = -Math.abs(g.dy);
          g.y = 368;
        }
        if (g.y > 408) {
          g.lives -= 1;
          g.combo = 0;
          if (g.lives <= 0) finishRound(true);
          else {
            g.x = 300;
            g.y = 250;
            g.dx = 3 + g.level * 0.18;
            g.dy = -3.6 - g.level * 0.12;
          }
        }
        g.balloons.forEach((b) => {
          if (!b.hit && Math.abs(g.x - b.x) < 20 && Math.abs(g.y - b.y) < 24) {
            g.y += g.dy > 0 ? -12 : 12;
            g.dy *= -1;
            g.dx += (Math.random() - 0.5) * 1.1;
            hitBalloon(g, b);
          }
        });
        g.particles = g.particles.map((p) => ({ ...p, x: p.x + p.dx, y: p.y + p.dy, life: p.life - 1 })).filter((p) => p.life > 0);
        if (g.balloons.every((b) => b.hit)) finishRound(false);
        setStats({ level: g.level, score: g.score, high: Math.max(g.high, g.score), combo: g.combo, lives: g.lives });
      }
      draw();
      rafRef.current = requestAnimationFrame(tick);
    }

    function setPointer(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      mouseXRef.current = (clientX - rect.left) * (600 / rect.width);
    }

    canvas.addEventListener("mousemove", setPointer);
    canvas.addEventListener("touchmove", setPointer, { passive: true });
    if (!gameRef.current) createLevel(1, 0, 0);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", setPointer);
      canvas.removeEventListener("touchmove", setPointer);
    };
  }, [running]);

  return (
    <GameShell title="🎈 Balloon Breakout Arcade" subtitle="Pop balloons, unlock power ups, survive boss rounds." goHome={goHome}>
      <button onClick={startGame} style={greenButton}>{running ? "Restart Breakout" : "Start Breakout"}</button>
      <div style={{ marginTop: 14 }}>
        <canvas ref={canvasRef} width={600} height={400} style={{ border: "4px solid #334155", borderRadius: 16, boxShadow: "0 0 35px rgba(96,165,250,.25)", maxWidth: "94vw", touchAction: "none" }} />
      </div>
      <p>Level: {stats.level} {stats.level % 5 === 0 ? "🔥 BOSS" : ""} | Score: {stats.score} | High: {stats.high} | Combo: {stats.combo} | Lives: {stats.lives}</p>
      <p style={{ color: "#cbd5e1" }}>{message}</p>
      <button onClick={() => setShowOffer(true)} style={greenButton}>🎈 Unlock Balloon Challenges</button>
      <OfferModal isOpen={showOffer} onClose={() => setShowOffer(false)} onContinue={continuePlaying} />
    </GameShell>
  );
}

function PopRushGame({ goHome }) {
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(30);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [balloons, setBalloons] = useState([]);
  const [message, setMessage] = useState("Pop as many balloons as you can before the timer ends.");
  const [showOffer, setShowOffer] = useState(false);

  function startRound() {
    setShowOffer(false);
    setRunning(true);
    setTime(30);
    setScore(0);
    setCombo(0);
    setMessage("Go! Tap balloons before they float away.");
    setBalloons([]);
  }

  function finishRound(finalScore) {
    setRunning(false);
    setHighScore((h) => Math.max(h, finalScore));
    setMessage("Round complete! Want more balloon challenges?");
    setShowOffer(true);
  }

  function continuePlaying() {
    setShowOffer(false);
    startRound();
  }

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timer);
          finishRound(score);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running, score]);

  useEffect(() => {
    if (!running) return;
    const spawner = setInterval(() => {
      const rand = Math.random();
      const type = rand > 0.88 ? "gold" : rand < 0.14 ? "trap" : "normal";
      setBalloons((b) => [...b, { id: Date.now() + Math.random(), left: Math.random() * 82 + 6, bottom: -70, speed: 1.2 + Math.random() * 1.7, type }]);
    }, 650);
    return () => clearInterval(spawner);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    const mover = setInterval(() => {
      setBalloons((items) => items.map((b) => ({ ...b, bottom: b.bottom + b.speed })).filter((b) => b.bottom < 420));
    }, 40);
    return () => clearInterval(mover);
  }, [running]);

  function popBalloon(balloon) {
    if (!running) return;
    setBalloons((items) => items.filter((b) => b.id !== balloon.id));
    if (balloon.type === "trap") {
      setScore((s) => Math.max(0, s - 3));
      setCombo(0);
      setMessage("Oops! Red balloon penalty.");
      return;
    }
    const points = balloon.type === "gold" ? 5 : 1 + Math.floor(combo / 4);
    setScore((s) => s + points);
    setCombo((c) => c + 1);
    setMessage(balloon.type === "gold" ? "Gold bonus!" : "Pop! Keep going.");
  }

  return (
    <GameShell title="🎈 Balloon Pop Rush" subtitle="A quick party-style balloon challenge. Tap balloons fast, build combos, and avoid red traps." goHome={goHome}>
      <button onClick={startRound} style={greenButton}>{running ? "Restart Pop Rush" : "Start Pop Rush"}</button>
      <div style={{ position: "relative", width: 600, maxWidth: "94vw", height: 400, margin: "20px auto", border: "4px solid #334155", borderRadius: 18, overflow: "hidden", background: "radial-gradient(circle at top, #1e293b, #0f172a 65%)", boxShadow: "0 0 35px rgba(236,72,153,.22)" }}>
        {balloons.map((b) => (
          <button key={b.id} onClick={() => popBalloon(b)} style={{ position: "absolute", left: `${b.left}%`, bottom: b.bottom, width: 52, height: 68, borderRadius: "50%", border: 0, cursor: "pointer", background: b.type === "gold" ? "#fde047" : b.type === "trap" ? "#ef4444" : "#ec4899", boxShadow: "inset -8px -10px rgba(0,0,0,.14), 0 8px 16px rgba(0,0,0,.25)" }} />
        ))}
        {!running && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,23,42,.58)", padding: 24 }}>
            <div><h2>{time === 0 ? "Round Complete" : "Ready?"}</h2><p style={{ color: "#cbd5e1" }}>{message}</p></div>
      
      <div
  style={{
    background: "rgba(15,23,42,0.92)",
    border: "2px solid #22c55e",
    borderRadius: 20,
    padding: 32,
    maxWidth: 420,
    textAlign: "center",
    boxShadow: "0 0 30px rgba(34,197,94,0.4)"
  }}
>
  <h1 style={{ fontSize: 42, marginBottom: 12 }}>
    🎉 Round Complete!
  </h1>

  <p style={{ fontSize: 24, fontWeight: "bold" }}>
    Score: {score}
  </p>

  <p style={{ color: "#cbd5e1", marginTop: 8 }}>
    High Score: {highScore}
  </p>

  <p style={{ color: "#22c55e", marginTop: 18, fontWeight: "bold" }}>
    🔥 Combo Power: {combo}
  </p>

  <p style={{ color: "#cbd5e1", marginTop: 16 }}>
    {message}
  </p>

  <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
    <button
      onClick={startRound}
      style={{
        background: "#22c55e",
        color: "#04130a",
        border: "none",
        borderRadius: 12,
        padding: "12px 22px",
        fontWeight: "bold",
        cursor: "pointer"
      }}
    >
      ▶ Play Again
    </button>

    <button
      onClick={() => setShowOffer(true)}
      style={{
        background: "#f59e0b",
        color: "#111827",
        border: "none",
        borderRadius: 12,
        padding: "12px 22px",
        fontWeight: "bold",
        cursor: "pointer"
      }}
    >
      🎈 Unlock Challenges
    </button>
  </div>
</div>
        )}
      </div>
      <p>Time: {time}s | Score: {score} | High: {highScore} | Combo: {combo}</p>
      <p style={{ color: "#cbd5e1" }}>{message}</p>
      <button onClick={() => setShowOffer(true)} style={greenButton}>🎈 Unlock Balloon Challenges</button>
      <OfferModal isOpen={showOffer} onClose={() => setShowOffer(false)} onContinue={continuePlaying} />
    </GameShell>
  );
}

function ArcadeMenu({ setScreen, openOffer }) {
  return (
    <div style={{ maxWidth: 980, margin: "0 auto", paddingTop: 56 }}>
      <h1 style={{ fontSize: 58, marginBottom: 8, textShadow: "0 0 28px rgba(96,165,250,.55)" }}>🎈 Balloon Arcade</h1>
      <p style={{ color: "#cbd5e1", fontSize: 20 }}>Play free, chase your score, then unlock real world balloon challenges.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginTop: 38 }}>
        <div style={cardStyle}>
          <h2>🎈 Balloon Breakout</h2>
          <p style={{ color: "#cbd5e1", fontSize: 18 }}>The flagship arcade game. Pop balloons, survive boss rounds, and chase your high score.</p>
          <button onClick={() => setScreen("breakout")} style={greenButton}>Play Breakout</button>
        </div>
        <div style={cardStyle}>
          <h2>🎈 Balloon Pop Rush</h2>
          <p style={{ color: "#cbd5e1", fontSize: 18 }}>A quick party-style challenge. Tap balloons fast, build combos, and avoid red traps.</p>
          <button onClick={() => setScreen("poprush")} style={greenButton}>Play Pop Rush</button>
        </div>
      </div>
      <div style={{ marginTop: 30 }}>
        <button onClick={openOffer} style={greenButton}>🎈 Unlock Balloon Challenges</button>
        <div style={{ marginTop: 12 }}>
          <button onClick={() => openShopify(creatorKitUrl)} style={goldButton}>🎥 Balloon Creator Kit — $19</button>
        </div>
      </div>
    </div>
  );
}

export default function BalloonArcade() {
  const [screen, setScreen] = useState("menu");
  const [showOffer, setShowOffer] = useState(false);

  return (
    <div style={pageStyle}>
      {screen === "menu" && <ArcadeMenu setScreen={setScreen} openOffer={() => setShowOffer(true)} />}
      {screen === "breakout" && <BreakoutGame goHome={() => setScreen("menu")} />}
      {screen === "poprush" && <PopRushGame goHome={() => setScreen("menu")} />}
      <OfferModal isOpen={showOffer} onClose={() => setShowOffer(false)} onContinue={() => setShowOffer(false)} />
    </div>
  );
}


