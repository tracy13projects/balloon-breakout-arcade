import React, { useEffect, useRef, useState } from "react";

const productUrl = "https://www.goodnewslifestyle.shop/products/%F0%9F%8E%88-balloon-challenge-pack";
const creatorKitUrl = "https://www.goodnewslifestyle.shop/products/%F0%9F%8E%A5-balloon-creator-kit";

function openExternalUrl(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

const modalBackdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 30,
};

const modalCard = {
  background: "white",
  color: "black",
  padding: 24,
  borderRadius: 14,
  width: 420,
  maxWidth: "92vw",
};

const greenButton = {
  display: "inline-block",
  marginTop: 10,
  padding: "12px 18px",
  borderRadius: 12,
  border: 0,
  background: "linear-gradient(90deg,#22c55e,#4ade80)",
  color: "#052e16",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 0 20px rgba(34,197,94,.35)",
};

const greenWideButton = {
  padding: "14px 18px",
  borderRadius: 12,
  border: 0,
  background: "linear-gradient(90deg,#22c55e,#4ade80)",
  color: "#052e16",
  fontWeight: "bold",
  cursor: "pointer",
  display: "block",
  width: "100%",
  marginTop: 12,
  boxShadow: "0 0 18px rgba(34,197,94,.35)",
};

const goldWideButton = {
  padding: "14px 18px",
  borderRadius: 12,
  border: 0,
  background: "linear-gradient(90deg,#f59e0b,#fde047)",
  color: "#422006",
  fontWeight: "bold",
  cursor: "pointer",
  display: "block",
  width: "100%",
  marginTop: 12,
  boxShadow: "0 0 18px rgba(245,158,11,.35)",
};

const whiteWideButton = {
  padding: "12px 18px",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  background: "#f8fafc",
  color: "#0f172a",
  fontWeight: "bold",
  cursor: "pointer",
  display: "block",
  width: "100%",
  marginTop: 10,
};

const linkStyle = {
  marginTop: 16,
  cursor: "pointer",
  color: "#475569",
  textDecoration: "underline",
};

const smallCloseButton = {
  marginTop: 12,
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #cbd5e1",
  background: "#fff",
  cursor: "pointer",
};

const backButton = {
  position: "absolute",
  top: 18,
  left: 18,
  padding: "9px 12px",
  borderRadius: 10,
  border: "1px solid #334155",
  background: "#1e293b",
  color: "white",
  cursor: "pointer",
};

const gameTitle = {
  fontSize: 44,
  marginBottom: 8,
  textShadow: "0 0 25px rgba(96,165,250,.55)",
};

const gameSubtitle = {
  color: "#cbd5e1",
  fontSize: 18,
};

const achievementStyle = {
  position: "fixed",
  top: 30,
  left: "50%",
  transform: "translateX(-50%)",
  background: "rgba(15,23,42,.92)",
  color: "#fff",
  padding: "14px 22px",
  borderRadius: 14,
  fontWeight: "bold",
  fontSize: 20,
  boxShadow: "0 0 30px rgba(96,165,250,.45)",
  zIndex: 50,
};

const cardStyle = {
  background: "rgba(15,23,42,.8)",
  border: "1px solid #334155",
  borderRadius: 18,
  padding: 24,
  boxShadow: "0 0 30px rgba(96,165,250,.14)",
};

function ProductOffer({ showOffer, setShowOffer, setShowUpsell, continuePlaying }) {
  if (!showOffer) return null;
  return (
    <div style={modalBackdrop}>
      <div style={modalCard}>
        <h2>🎈 Unlock Balloon Challenges</h2>
        <p>Unlock 25 real world balloon challenges, creator ideas, and party style games.</p>
        <button onClick={() => openExternalUrl(productUrl)} style={greenWideButton}>
          Unlock Challenges — $7
        </button>
        <button onClick={() => setShowUpsell(true)} style={whiteWideButton}>
          See Balloon Creator Kit
        </button>
        <div onClick={continuePlaying} style={linkStyle}>
          Continue Playing Free
        </div>
        <button onClick={() => setShowOffer(false)} style={smallCloseButton}>Close</button>
      </div>
    </div>
  );
}

function CreatorUpsell({ showUpsell, setShowUpsell, continuePlaying }) {
  if (!showUpsell) return null;
  return (
    <div style={modalBackdrop}>
      <div style={modalCard}>
        <h2>Want more?</h2>
        <p>Turn balloon challenges into content ideas, filming prompts, and replayable party moments.</p>
        <button onClick={() => openExternalUrl(creatorKitUrl)} style={goldWideButton}>
          Add Balloon Creator Kit — $19
        </button>
        <div onClick={continuePlaying} style={linkStyle}>
          No Thanks, Continue Playing
        </div>
        <button onClick={() => setShowUpsell(false)} style={smallCloseButton}>Close</button>
      </div>
    </div>
  );
}

function EmailModal({ showEmail, setShowEmail, setShowOffer, continuePlaying }) {
  if (!showEmail) return null;
  return (
    <div style={modalBackdrop}>
      <div style={modalCard}>
        <h2>Save score + unlock more</h2>
        <input placeholder="email" style={{ padding: 12, width: "100%", marginBottom: 12 }} />
        <button
          onClick={() => {
            setShowEmail(false);
            setShowOffer(true);
          }}
          style={greenWideButton}
        >
          Unlock More
        </button>
        <div onClick={continuePlaying} style={linkStyle}>
          Continue Playing Free
        </div>
      </div>
    </div>
  );
}

function GameShell({ title, subtitle, goHome, children }) {
  return (
    <div>
      <button onClick={goHome} style={backButton}>
        ← Arcade Menu
      </button>
      <h1 style={gameTitle}>{title}</h1>
      <p style={gameSubtitle}>{subtitle}</p>
      {children}
    </div>
  );
}

function MainOfferButton() {
  return (
    <button onClick={() => openExternalUrl(productUrl)} style={greenButton}>
      🎈 Unlock Balloon Challenges
    </button>
  );
}

function Achievement({ text }) {
  return <div style={achievementStyle}>{text}</div>;
}

function BreakoutGame({ goHome }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [powerUp, setPowerUp] = useState("");
  const [achievement, setAchievement] = useState("");
  const [roundKey, setRoundKey] = useState(0);
  const [lastRoundLost, setLastRoundLost] = useState(false);

  const [showEmail, setShowEmail] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);

  function closeAllPopups() {
    setShowEmail(false);
    setShowOffer(false);
    setShowUpsell(false);
  }

  function continuePlaying() {
    closeAllPopups();
    setLives(3);
    if (lastRoundLost) setScore(0);
    setCombo(0);
    setPowerUp("");
    setRoundKey((r) => r + 1);
  }

  function finishRound(lost = false) {
    setLastRoundLost(lost);
    setHighScore((h) => Math.max(h, score));
    if (!lost) setLevel((l) => l + 1);
    setShowEmail(true);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let cancelled = false;
    let animationId;
    let x = 300;
    let y = 220;
    let dx = 3 + level * 0.35;
    let dy = -3 - level * 0.35;
    let paddle = { x: 250, w: 100 };
    let bricks = [];
    let localLives = 3;
    let roundFinished = false;

    const totalBalloons = level % 5 === 0 ? 12 : 20 + level * 2;

    for (let i = 0; i < totalBalloons; i++) {
      const rand = Math.random();
      let type = "normal";
      if (level % 5 === 0) type = "steel";
      else if (rand > 0.9) type = "gold";
      else if (rand > 0.8) type = "steel";

      bricks.push({
        x: 50 + (i % 10) * 50,
        y: 45 + Math.floor(i / 10) * 40,
        hit: false,
        hits: type === "steel" ? 2 : 1,
        type,
      });
    }

    function drawBalloon(b) {
      if (b.type === "gold") ctx.fillStyle = "#fde047";
      else if (b.type === "steel") ctx.fillStyle = "#94a3b8";
      else ctx.fillStyle = "#ec4899";
      ctx.beginPath();
      ctx.ellipse(b.x, b.y, 14, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.45)";
      ctx.beginPath();
      ctx.arc(b.x - 5, b.y - 6, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    function createParticles(x, y, color) {
      for (let i = 0; i < 12; i++) {
        particlesRef.current.push({ x, y, dx: (Math.random() - 0.5) * 5, dy: (Math.random() - 0.5) * 5, life: 30, color });
      }
    }

    function showAchievement(text) {
      setAchievement(text);
      setTimeout(() => setAchievement(""), 2500);
    }

    function draw() {
      ctx.clearRect(0, 0, 600, 400);

      if (level % 5 === 0) {
        ctx.fillStyle = "rgba(239,68,68,.15)";
        ctx.fillRect(0, 0, 600, 400);
      }

      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 4;
      ctx.strokeRect(0, 0, 600, 400);

      const glow = ctx.createRadialGradient(x, y, 2, x, y, 18);
      glow.addColorStop(0, "#ffffff");
      glow.addColorStop(1, "#60a5fa");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();

      const paddleGradient = ctx.createLinearGradient(paddle.x, 0, paddle.x + paddle.w, 0);
      paddleGradient.addColorStop(0, "#f59e0b");
      paddleGradient.addColorStop(1, "#fde047");
      ctx.fillStyle = paddleGradient;
      ctx.shadowColor = "#f59e0b";
      ctx.shadowBlur = 12;
      ctx.fillRect(paddle.x, 380, paddle.w, 10);
      ctx.shadowBlur = 0;

      bricks.forEach((b) => {
        if (!b.hit) drawBalloon(b);
      });

      particlesRef.current.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      if (roundFinished) {
        ctx.fillStyle = "rgba(15,23,42,.75)";
        ctx.fillRect(0, 0, 600, 400);
        ctx.fillStyle = "white";
        ctx.font = "28px Arial";
        ctx.fillText("Round Complete", 210, 190);
        ctx.font = "18px Arial";
        ctx.fillStyle = "#cbd5e1";
        ctx.fillText("Get ready for the next challenge...", 175, 225);
      }
    }

    function hitBalloon(b) {
      const particleColor = b.type === "gold" ? "#fde047" : b.type === "steel" ? "#94a3b8" : "#ec4899";
      createParticles(b.x, b.y, particleColor);
      b.hits -= 1;

      if (b.hits <= 0) {
        b.hit = true;
        if (b.type === "gold") {
          showAchievement("💥 Explosion Balloon!");
          bricks.forEach((other) => {
            if (!other.hit && Math.abs(other.x - b.x) < 60 && Math.abs(other.y - b.y) < 60) other.hit = true;
          });
          setPowerUp("💥 Balloon Explosion!");
          setTimeout(() => setPowerUp(""), 1500);
        }
      }

      setCombo((c) => {
        const newCombo = c + 1;
        if (newCombo === 5) showAchievement("🔥 Combo Master!");
        if (newCombo === 10) showAchievement("⚡ Combo Legend!");
        return newCombo;
      });
      setScore((s) => s + 1 + Math.floor(combo / 3));

      if (Math.random() > 0.9) {
        showAchievement("🟡 Power Up!");
        paddle.w = 150;
        setPowerUp("🟡 Big Paddle Active!");
        setTimeout(() => {
          paddle.w = 100;
          setPowerUp("");
        }, 5000);
      }
    }

    function updateParticles() {
      particlesRef.current.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        p.life -= 1;
      });
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
    }

    function update() {
      if (roundFinished) return;

      updateParticles();
      x += dx;
      y += dy;

      if (x < 8 || x > 592) dx *= -1;
      if (y < 8) dy *= -1;

      if (y > 400) {
        localLives -= 1;
        setLives(localLives);
        setCombo(0);

        if (localLives <= 0) {
          roundFinished = true;
          finishRound(true);
          return;
        }

        x = 300;
        y = 220;
        dx = 3 + level * 0.35;
        dy = -3 - level * 0.35;
      }

      if (y > 370 && x > paddle.x && x < paddle.x + paddle.w) {
        const hitPos = (x - paddle.x) / paddle.w;
        dx = (hitPos - 0.5) * 7;
        dy = -Math.abs(dy);
      }

     bricks.forEach((b) => {
  if (!b.hit && Math.abs(x - b.x) < 18 && Math.abs(y - b.y) < 22) {
    // move ball away from balloon so it does not get stuck re-hitting the same spot
    y += dy > 0 ? -10 : 10;

  
    hitBalloon(b);

    canvas.style.transform = "translateX(2px)";
    setTimeout(() => (canvas.style.transform = "translateX(0px)"), 40);
  }
});
  

  // reverse direction with a tiny angle change for smoother arcade feel
  dy *= -1;
  dx += (Math.random() - 0.5) * 1.2;

  hitBalloon(b);

  canvas.style.transform = "translateX(2px)";
  setTimeout(() => (canvas.style.transform = "translateX(0px)"), 40);
}
        }
      });

      if (bricks.every((b) => b.hit)) {
        showAchievement(level % 5 === 0 ? "👑 Boss Crusher!" : "🎈 Level Cleared!");
        roundFinished = true;
        finishRound(false);
      }
    }

    function loop() {
      if (cancelled) return;
      update();
      draw();
      animationId = requestAnimationFrame(loop);
    }

    function move(e) {
      const rect = canvas.getBoundingClientRect();
      paddle.x = (e.clientX - rect.left) * (600 / rect.width) - paddle.w / 2;
      if (paddle.x < 0) paddle.x = 0;
      if (paddle.x > 600 - paddle.w) paddle.x = 600 - paddle.w;
    }

    window.addEventListener("mousemove", move);
    loop();

    return () => {
      cancelled = true;
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", move);
    };
  }, [level, roundKey, combo, score]);

  return (
    <GameShell title="🎈 Balloon Breakout Arcade" subtitle="Pop balloons, unlock power ups, survive boss rounds." goHome={goHome}>
      <canvas ref={canvasRef} width={600} height={400} style={{ border: "4px solid #334155", borderRadius: 16, boxShadow: "0 0 35px rgba(96,165,250,.25)", background: "linear-gradient(#111827,#0f172a)", transition: "transform .05s ease", maxWidth: "94vw" }} />
      <p>Level: {level} {level % 5 === 0 ? "🔥 BOSS" : ""} | Score: {score} | High: {highScore} | Combo: {combo} | Lives: {lives}</p>
      {powerUp && <p style={{ color: "#fde047", fontWeight: "bold", fontSize: 18 }}>{powerUp}</p>}
      {achievement && <Achievement text={achievement} />}
      <MainOfferButton />
      <EmailModal showEmail={showEmail} setShowEmail={setShowEmail} setShowOffer={setShowOffer} continuePlaying={continuePlaying} />
      <ProductOffer showOffer={showOffer} setShowOffer={setShowOffer} setShowUpsell={setShowUpsell} continuePlaying={continuePlaying} />
      <CreatorUpsell showUpsell={showUpsell} setShowUpsell={setShowUpsell} continuePlaying={continuePlaying} />
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
  const [showUpsell, setShowUpsell] = useState(false);

  function startRound() {
    setShowOffer(false);
    setShowUpsell(false);
    setRunning(true);
    setTime(30);
    setScore(0);
    setCombo(0);
    setMessage("Go! Tap the balloons before they float away.");
    setBalloons([]);
  }

  function finishRound(finalScore = score) {
    setRunning(false);
    setHighScore((h) => Math.max(h, finalScore));
    setMessage("Round complete! Want more balloon challenges?");
    setShowOffer(true);
  }

  function continuePlaying() {
    setShowOffer(false);
    setShowUpsell(false);
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
      setBalloons((b) => [...b, { id: Date.now() + Math.random(), left: Math.random() * 82 + 6, bottom: -70, speed: 1.2 + Math.random() * 1.6, type }]);
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
      <button onClick={startRound} style={greenButton}>Start Pop Rush</button>
      <div style={{ position: "relative", width: 600, maxWidth: "94vw", height: 400, margin: "20px auto", border: "4px solid #334155", borderRadius: 18, overflow: "hidden", background: "radial-gradient(circle at top, #1e293b, #0f172a 65%)", boxShadow: "0 0 35px rgba(236,72,153,.22)" }}>
        {balloons.map((b) => (
          <button key={b.id} onClick={() => popBalloon(b)} style={{ position: "absolute", left: `${b.left}%`, bottom: b.bottom, width: 52, height: 68, borderRadius: "50%", border: 0, cursor: "pointer", background: b.type === "gold" ? "#fde047" : b.type === "trap" ? "#ef4444" : "#ec4899", boxShadow: "inset -8px -10px rgba(0,0,0,.14), 0 8px 16px rgba(0,0,0,.25)" }} />
        ))}
        {!running && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,23,42,.58)", padding: 24 }}>
            <div>
              <h2>{time === 0 ? "Round Complete" : "Ready?"}</h2>
              <p style={{ color: "#cbd5e1" }}>{message}</p>
            </div>
          </div>
        )}
      </div>
      <p>Time: {time}s | Score: {score} | High: {highScore} | Combo: {combo}</p>
      <p style={{ color: "#cbd5e1" }}>{message}</p>
      <MainOfferButton />
      <ProductOffer showOffer={showOffer} setShowOffer={setShowOffer} setShowUpsell={setShowUpsell} continuePlaying={continuePlaying} />
      <CreatorUpsell showUpsell={showUpsell} setShowUpsell={setShowUpsell} continuePlaying={continuePlaying} />
    </GameShell>
  );
}

export default function BalloonArcade() {
  const [screen, setScreen] = useState("menu");

  return (
    <div style={{ textAlign: "center", color: "white", background: "radial-gradient(circle at top, #1e293b, #0f172a 60%)", minHeight: "100vh", paddingTop: 30, overflow: "hidden", fontFamily: "Arial, sans-serif" }}>
      {screen === "menu" && (
        <div style={{ paddingTop: 70, maxWidth: 960, margin: "0 auto", paddingLeft: 18, paddingRight: 18 }}>
          <h1 style={{ fontSize: 52, marginBottom: 8, textShadow: "0 0 25px rgba(96,165,250,.55)" }}>🎈 Balloon Arcade</h1>
          <p style={{ color: "#cbd5e1", fontSize: 19 }}>Play free, chase your score, then unlock real world balloon challenges.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginTop: 34 }}>
            <div style={cardStyle}>
              <h2>🎈 Balloon Breakout</h2>
              <p style={{ color: "#cbd5e1" }}>The flagship arcade game. Pop balloons, survive boss rounds, and chase your high score.</p>
              <button onClick={() => setScreen("breakout")} style={greenButton}>Play Breakout</button>
            </div>
            <div style={cardStyle}>
              <h2>🎈 Balloon Pop Rush</h2>
              <p style={{ color: "#cbd5e1" }}>A quick party-style challenge. Tap balloons fast, build combos, and avoid red traps.</p>
              <button onClick={() => setScreen("poprush")} style={greenButton}>Play Pop Rush</button>
            </div>
          </div>
          <div style={{ marginTop: 28 }}><MainOfferButton /></div>
        </div>
      )}
      {screen === "breakout" && <BreakoutGame goHome={() => setScreen("menu")} />}
      {screen === "poprush" && <PopRushGame goHome={() => setScreen("menu")} />}
    </div>
  );
}

