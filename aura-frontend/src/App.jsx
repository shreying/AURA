// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/Home.jsx';
import Quiz from './components/Quiz.jsx';
import PaletteScanner from './components/PaletteScanner.jsx';
import Profile from './components/Profile.jsx';
import Feed from './components/Feed.jsx';
import Aurora from './Aurora/Aurora';
import './App.css';

const paletteAuroraColors = {
    Spring: ["#FFD700", "#FF94B4", "#98FF98"],
    Summer: ["#3A29FF", "#FF94B4", "#87CEEB"],
    Autumn: ["#FF8C00", "#FFD700", "#FF3232"],
    Winter: ["#3A29FF", "#00FFFF", "#FF3232"],
    Default: [
        "#F13AB1", // Frostbite
        "#E72744", // Imperial Red
        "#FD913C", // Royal Orange
        "#F05524"  // Halloween Orange
    ]
};

function AuroraBackground() {
    const location = useLocation();
    const [auroraColors, setAuroraColors] = useState(paletteAuroraColors.Default);

    useEffect(() => {
        let paletteSeason = null;
        if (location.state && location.state.paletteSeason) {
            paletteSeason = location.state.paletteSeason;
        } else {
            paletteSeason = localStorage.getItem('paletteSeason');
        }
        if (paletteSeason && paletteAuroraColors[paletteSeason]) {
            setAuroraColors(paletteAuroraColors[paletteSeason]);
        } else {
            setAuroraColors(paletteAuroraColors.Default);
        }
    }, [location]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 0,
            pointerEvents: 'none'
        }}>
            <Aurora
                colorStops={auroraColors}
                blend={0.5}
                amplitude={1.0}
                speed={0.5}
            />
        </div>
    );
}

function App() {
    return (
        <Router>
            <AuroraBackground />
            <div className="app-container" style={{ position: 'relative', zIndex: 1 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/quiz" element={<Quiz />} />
                    <Route path="/palette-scan" element={<PaletteScanner />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/feed" element={<Feed />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;