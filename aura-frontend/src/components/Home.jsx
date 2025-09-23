import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Aurora from '../Aurora/Aurora';

const paletteAuroraColors = {
    Spring: ["#FFD700", "#FF94B4", "#98FF98"],      // Gold, Pink, Mint
    Summer: ["#3A29FF", "#FF94B4", "#87CEEB"],      // Blue, Pink, Sky
    Autumn: ["#FF8C00", "#FFD700", "#FF3232"],      // Orange, Gold, Red
    Winter: ["#3A29FF", "#00FFFF", "#FF3232"],      // Blue, Cyan, Red
    Default: [
        "#F13AB1", // Frostbite
        "#E72744", // Imperial Red
        "#FD913C", // Royal Orange
        "#F05524"  // Halloween Orange
    ]
};

const Home = () => {
    const navigate = useNavigate();
    const [auroraColors] = useState(paletteAuroraColors.Default);

    const handlePinterestSignIn = () => {
        alert("Concept: This would start the Pinterest login process.");
        const simulatedPinterestResult = {
            archetype: 'Edgy Rebel',
            palette: 'Winter'
        };
        localStorage.setItem('paletteSeason', simulatedPinterestResult.palette);
        navigate('/feed', { state: { persona: simulatedPinterestResult, paletteSeason: simulatedPinterestResult.palette } });
    };

    return (
        <div className="page-center" style={{ minHeight: '100vh', overflow: 'hidden', position: 'relative' }}>
            {/* Aurora background */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0
            }}>
                <Aurora
                    colorStops={auroraColors}
                    blend={0.5}
                    amplitude={1.0}
                    speed={0.5}
                />
            </div>
            {/* Content above Aurora */}
            <div className="home-container" style={{ position: 'relative', zIndex: 1 }}>
                <h1 className="logo">AURA</h1>
                <h2>Find Your True Style Identity.</h2>
                <p>Choose how you'd like to discover your unique style.</p>
                <div className="home-options">
                    <Link to="/quiz" className="cta-button">Take the Style Quiz</Link>
                    <button onClick={handlePinterestSignIn} className="cta-button pinterest-button">
                        Analyze My Pinterest
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;