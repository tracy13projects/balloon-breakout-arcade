import React, { useEffect, useRef, useState } from "react";

export default function BalloonBreakout() {
  const canvasRef = useRef(null);
  const productUrl = "https://www.goodnewslifestyle.shop/products/%F0%9F%8E%88-balloon-challenge-pack";
  const creatorKitUrl = "https://www.goodnewslifestyle.shop/products/%F0%9F%8E%A5-balloon-creator-kit";
  const [activeProductUrl, setActiveProductUrl] = useState(productUrl);

  function copyProductLink(url = productUrl) {
    setActiveProductUrl(url);
    setShowProductLink(true);
  }

  function openProductPage(url = productUrl) {
    setActiveProductUrl(url);
    setShowProductLink(true);
  }

  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [powerUp, setPowerUp] = useState("");
  const [achievement, setAchievement] = useState("");
  const particlesRef = useRef([]);
  const [roundKey, setRoundKey] = useState(0);
  const [lastRoundLost, setLastRoundLost] = useState(false);

  const [showEmail, setShowEmail] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [showProductLink, setShowProductLink] = useState(false);

  function closeAllPopups() {
    setShowEmail(false);
    setShowOffer(false);
    setShowUpsell(false);
    setShowProductLink(false);
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
    if (!started) return;

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
        particlesRef.current.push({
          x,
          y,
          dx: (Math.random() - 0.5) * 5,
          dy: (Math.random() - 0.5) * 5,
          life: 30,
          color,
        });
      }
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
      paddleGradient.addColorStop(0, '#f59e0b');
      paddleGradient.addColorStop(1, '#fde047');
      ctx.fillStyle = paddleGradient;
      ctx.shadowColor = "#f59e0b";
      ctx.shadowBlur = 12;
      ctx.fillRect(paddle.x, 380, paddle.w, 10);
      ctx.shadowBlur = 0;

      bricks.forEach((b) => {
        if (!b.hit) drawBalloon(b);
      });

      // draw particles
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
        ctx.fillText('Round Complete', 210, 190);
        ctx.font = '18px Arial';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText('Get ready for the next challenge...', 175, 225);
      }
    }

    function showAchievement(text) {
      setAchievement(text);
      setTimeout(() => setAchievement(''), 2500);
    }

    function hitBalloon(b) {
      const particleColor = b.type === 'gold' ? '#fde047' : b.type === 'steel' ? '#94a3b8' : '#ec4899';
      createParticles(b.x, b.y, particleColor);
      b.hits -= 1;

      if (b.hits <= 0) {
        b.hit = true;

        if (b.type === "gold") {
          showAchievement('💥 Explosion Balloon!');
          bricks.forEach((other) => {
            if (!other.hit && Math.abs(other.x - b.x) < 60 && Math.abs(other.y - b.y) < 60) {
              other.hit = true;
            }
          });
          setPowerUp("💥 Balloon Explosion!");
          setTimeout(() => setPowerUp(""), 1500);
        }
      }

      setCombo((c) => {
        const newCombo = c + 1;

        if (newCombo === 5) showAchievement('🔥 Combo Master!');
        if (newCombo === 10) showAchievement('⚡ Combo Legend!');

        return newCombo;
      });
      setScore((s) => s + 1 + Math.floor(combo / 3));

      if (Math.random() > 0.9) {
        showAchievement('🟡 Power Up!');
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
          dy *= -1;
          hitBalloon(b);
          canvas.style.transform = "translateX(2px)";
          setTimeout(() => (canvas.style.transform = "translateX(0px)"), 40);
        }
      });

      if (bricks.every((b) => b.hit)) {
        if (level % 5 === 0) {
          showAchievement('👑 Boss Crusher!');
        } else {
          showAchievement('🎈 Level Cleared!');
        }
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
  }, [started, level, roundKey]);

  return (
    <div style={{
      textAlign: 'center',
      color: 'white',
      background: 'radial-gradient(circle at top, #1e293b, #0f172a 60%)',
      minHeight: '100vh',
      paddingTop: 30,
      overflow: 'hidden'
    }}>
      {!started && (
        <div style={{ paddingTop: 100 }}>
          <h1
            style={{
              fontSize: 48,
              marginBottom: 10,
              textShadow: '0 0 25px rgba(96,165,250,.55)'
            }}
          >
            🎈 Balloon Breakout Arcade
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: 18 }}>
            Pop balloons, unlock power ups, survive boss rounds.
          </p>
          <button
            onClick={() => setStarted(true)}
            style={{
              padding: "14px 24px",
              borderRadius: 14,
              border: 0,
              fontWeight: "bold",
              fontSize: 18,
              background: "#22c55e",
              cursor: "pointer",
              boxShadow: "0 0 25px rgba(34,197,94,.45)",
            }}
          >
            Play Free
          </button>
        </div>
      )}

      {started && (
        <div>
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            style={{
              border: "4px solid #334155",
              borderRadius: 16,
              boxShadow: "0 0 35px rgba(96,165,250,.25)",
              background: 'linear-gradient(#111827,#0f172a)',
              backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,.06), transparent 20%), radial-gradient(circle at 80% 30%, rgba(96,165,250,.08), transparent 20%)',
              transition: "transform .05s ease",
            }}
          />
          <p>
            Level: {level} {level % 5 === 0 ? "🔥 BOSS" : ""} | Score: {score} | High: {highScore} | Combo: {combo} | Lives: {lives}
          </p>
          {powerUp && <p style={{ color: '#fde047', fontWeight: 'bold', fontSize: 18 }}>{powerUp}</p>}

          {achievement && (
            <div
              style={{
                position: 'fixed',
                top: 30,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(15,23,42,.92)',
                color: '#fff',
                padding: '14px 22px',
                borderRadius: 14,
                fontWeight: 'bold',
                fontSize: 20,
                boxShadow: '0 0 30px rgba(96,165,250,.45)',
                zIndex: 50,
                animation: 'pulse 0.3s ease'
              }}
            >
              {achievement}
            </div>
          )}
          <button
            onClick={() => openProductPage(productUrl)}
            style={{
              display: 'inline-block',
              marginTop: 10,
              padding: '12px 18px',
              borderRadius: 12,
              border: 0,
              background: 'linear-gradient(90deg,#22c55e,#4ade80)',
              color: '#052e16',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(34,197,94,.35)',
              textDecoration: 'none'
            }}
          >
            🎈 Unlock Balloon Challenges
          </button>
          <div
            onClick={() => copyProductLink(productUrl)}
            style={{ marginTop: 10, color: '#cbd5e1', cursor: 'pointer', textDecoration: 'underline', fontSize: 14 }}
          >
            Copy product link
          </div>
        </div>
      )}

      {showProductLink && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20 }}>
          <div style={{ background: "white", color: "black", padding: 24, borderRadius: 14, width: 520 }}>
            <h2>Open Your Challenge Pack</h2>
            <p>Copy this link and paste it into a normal browser tab:</p>
            <textarea
              readOnly
              value={activeProductUrl}
              style={{ width: "100%", minHeight: 80, padding: 12, borderRadius: 10, border: "1px solid #cbd5e1" }}
              onFocus={(e) => e.target.select()}
            />
            <div style={{ marginTop: 12 }}>
              <button onClick={() => setShowProductLink(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showEmail && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
          <div style={{ background: "white", color: "black", padding: 24, borderRadius: 14, width: 420 }}>
            <h2>Save score + unlock more</h2>
            <input placeholder="email" style={{ padding: 12, width: "100%", marginBottom: 12 }} />
            <button
              onClick={() => { setShowEmail(false); setShowOffer(true); }}
              style={{
                padding: '12px 18px',
                borderRadius: 12,
                border: 0,
                background: 'linear-gradient(90deg,#22c55e,#4ade80)',
                color: '#052e16',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'block',
                width: '100%',
                marginTop: 8
              }}
            >
              Unlock More
            </button>
            <div onClick={continuePlaying} style={{ marginTop: 16, cursor: "pointer", color: "#475569", textDecoration: "underline" }}>
              Continue Playing Free
            </div>
          </div>
        </div>
      )}

      {showOffer && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
          <div style={{ background: "white", color: "black", padding: 24, borderRadius: 14, width: 420 }}>
            <h2>🎈 Unlock Balloon Challenges</h2>
            <p>Unlock 25 real world balloon challenges, creator ideas, and party style games.</p>
            <button
              onClick={() => openProductPage(productUrl)}
              style={{
                padding: '14px 18px',
                borderRadius: 12,
                border: 0,
                background: 'linear-gradient(90deg,#22c55e,#4ade80)',
                color: '#052e16',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'block',
                width: '100%',
                marginTop: 12,
                boxShadow: '0 0 18px rgba(34,197,94,.35)',
                textDecoration: 'none'
              }}
            >
              Unlock Challenges — $7
            </button>
            <div
              onClick={() => copyProductLink(productUrl)}
              style={{ marginTop: 10, cursor: 'pointer', color: '#475569', textDecoration: 'underline', fontSize: 14 }}
            >
              Copy product link
            </div>
            <button
              onClick={() => setShowUpsell(true)}
              style={{
                padding: '12px 18px',
                borderRadius: 12,
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#0f172a',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'block',
                width: '100%',
                marginTop: 10
              }}
            >
              See Balloon Creator Kit
            </button>
            <div onClick={continuePlaying} style={{ marginTop: 16, cursor: "pointer", color: "#475569", textDecoration: "underline" }}>
              Continue Playing Free
            </div>
          </div>
        </div>
      )}

      {showUpsell && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
          <div style={{ background: "white", color: "black", padding: 24, borderRadius: 14, width: 420 }}>
            <h2>Want more?</h2>
            <button
              onClick={() => openProductPage(creatorKitUrl)}
              style={{
                padding: '14px 18px',
                borderRadius: 12,
                border: 0,
                background: 'linear-gradient(90deg,#f59e0b,#fde047)',
                color: '#422006',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'block',
                width: '100%',
                marginTop: 12,
                boxShadow: '0 0 18px rgba(245,158,11,.35)'
              }}
            >
              Add Balloon Creator Kit — $19
            </button>
            <div onClick={continuePlaying} style={{ marginTop: 16, cursor: "pointer", color: "#475569", textDecoration: "underline" }}>
              No Thanks, Continue Playing
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
