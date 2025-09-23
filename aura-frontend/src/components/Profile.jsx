import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import "./Feed.css";

const paletteDetailsMap = {
  Spring: {
    colors: [
      { name: "Warm Peach", hex: "#FFDAB9" },
      { name: "Light Coral", hex: "#FFB3AB" },
      { name: "Ivory", hex: "#FFFFF0" },
      { name: "Bright Aqua", hex: "#00E6E6" },
      { name: "Leaf Green", hex: "#7CFC00" },
    ],
    description:
      "Spring palettes are warm, light, and bright. Your best colors are clear and vibrant.",
  },
  Summer: {
    colors: [
      { name: "Powder Blue", hex: "#B0C4DE" },
      { name: "Lavender", hex: "#C3B1E1" },
      { name: "Soft Pink", hex: "#FFB6C1" },
      { name: "Cool Grey", hex: "#D3D3D3" },
      { name: "Muted Plum", hex: "#B497BD" },
    ],
    description:
      "Summer palettes are cool, light, and muted. Your best colors are soft and gentle.",
  },
  Autumn: {
    colors: [
      { name: "Mustard Yellow", hex: "#FFD95A" },
      { name: "Olive Green", hex: "#808000" },
      { name: "Burnt Orange", hex: "#CC5500" },
      { name: "Terracotta", hex: "#E2725B" },
      { name: "Rich Brown", hex: "#8B4513" },
    ],
    description:
      "Autumn palettes are warm, deep, and muted. Your best colors are rich and earthy.",
  },
  Winter: {
    colors: [
      { name: "Royal Blue", hex: "#4169E1" },
      { name: "Magenta", hex: "#FF00FF" },
      { name: "Pure White", hex: "#FFFFFF" },
      { name: "Black", hex: "#222222" },
      { name: "Emerald Green", hex: "#009B77" },
    ],
    description:
      "Winter palettes are cool, deep, and bright. Your best colors are bold and high-contrast.",
  },
};

const PalettePopup = ({ paletteInfo, persona, onClose }) => (
  <div
    className="palette-overlay"
    onClick={onClose}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(58,41,255,0.18)",
      backdropFilter: "blur(4px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      className="palette-popup fade-in"
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "rgba(255,255,255,0.98)",
        borderRadius: 24,
        boxShadow: "0 8px 48px #3A29FF33",
        padding: 36,
        maxWidth: 420,
        width: "90vw",
        position: "relative",
        textAlign: "center",
      }}
    >
      <button
        className="popup-close"
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "#3A29FF",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 32,
          height: 32,
          fontWeight: 700,
          fontSize: "1.2rem",
          cursor: "pointer",
          boxShadow: "0 2px 8px #3A29FF22",
        }}
      >
        &times;
      </button>
      <h3 style={{ color: "#3A29FF", marginBottom: 8 }}>
        {persona.palette} Palette
      </h3>
      <p style={{ color: "#444", marginBottom: 18 }}>
        {paletteInfo.description}
      </p>
      <div
        className="palette-swatches"
        style={{
          display: "flex",
          gap: "18px",
          justifyContent: "center",
          marginTop: "12px",
          flexWrap: "wrap",
        }}
      >
        {paletteInfo.colors.map((color, idx) => (
          <div key={idx} className="swatch" style={{ textAlign: "center" }}>
            <div
              className="circle"
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: color.hex,
                border: "3px solid #fff",
                boxShadow: `0 2px 12px ${color.hex}88`,
                margin: "0 auto",
              }}
            />
            <div
              className="label"
              style={{
                fontSize: "1rem",
                marginTop: 8,
                color: color.hex,
                fontWeight: 600,
                textShadow: "0 1px 4px #fff",
              }}
            >
              {color.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [persona, setPersona] = useState(null);
  const [step, setStep] = useState(0);
  const [showPaletteDetails, setShowPaletteDetails] = useState(false);

  useEffect(() => {
    if (showPaletteDetails) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showPaletteDetails]);

  useEffect(() => {
    const { quizAnswers, paletteSeason } = location.state || {};
    if (!persona && quizAnswers && paletteSeason) {
      fetch("http://localhost:3001/api/persona-fusion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: quizAnswers, paletteSeason }),
      })
        .then((res) => res.json())
        .then((data) => {
          setPersona(data);
        });
    }
  }, [location.state, persona]);

  useEffect(() => {
    if (persona) {
      setStep(0);
      const timers = [
        setTimeout(() => setStep(1), 1000),
        setTimeout(() => setStep(2), 2500),
        setTimeout(() => setStep(3), 4000),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [persona]);

  const handleRedirect = () => {
    navigate("/feed", { state: { persona } });
  };

  if (!persona) {
    return (
      <div className="page-center results-bg" style={{ minHeight: "100vh" }}>
        <div className="results-container">
          <div className="wrapped-card step-0">
            <h1>Analyzing your vibe...</h1>
          </div>
        </div>
      </div>
    );
  }

  const paletteInfo = paletteDetailsMap[persona.palette];

  return (
    <div className="page-center results-bg" style={{ minHeight: "100vh" }}>
      <div className="results-container">
        {/* Steps 0–2 */}
        {step < 3 && (
          <div className={`wrapped-card step-${step}`}>
            {step === 0 && <h1>Analyzing your vibe...</h1>}
            {step === 1 && <h1>Decoding your palette...</h1>}
            {step === 2 && <h1>Defining your AURA...</h1>}
          </div>
        )}

        {/* Final Result */}
        {step === 3 && (
          <div className="wrapped-card final-result fade-in">
            <h3 className="logo-small">AURA</h3>
            <h1>{persona.fusedPersona}</h1>

            <div className="persona-details">
              <span>
                ARCHETYPE: <strong>{persona.archetype}</strong>
              </span>
              <span>
                PALETTE: <strong>{persona.palette}</strong>
              </span>
            </div>

            <p>
              This is your unique style identity.
              <br />
              Welcome to a wardrobe that finally feels like you.
            </p>

            <div className="button-row">
              <button className="cta-button" onClick={handleRedirect}>
                Unlock My Capsule Wardrobe
              </button>
              <button
                className="cta-button"
                onClick={() => setShowPaletteDetails(true)}
              >
                Show Palette Details
              </button>
            </div>
          </div>
        )}
      </div>
      {showPaletteDetails &&
        paletteInfo &&
        createPortal(
          <PalettePopup
            paletteInfo={paletteInfo}
            persona={persona}
            onClose={() => setShowPaletteDetails(false)}
          />,
          document.body
        )}
    </div>
  );
};

export default Profile;