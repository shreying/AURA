import React, { useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import axios from 'axios';

// Helper function to convert base64 image to a File object
const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};

const PaletteScanner = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        setResult(null);
        setError('');
    }, [webcamRef, setImgSrc]);

    const handleAnalyze = async () => {
        if (!imgSrc) {
            setError('Please capture a photo first.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResult(null);

        try {
            const imageFile = dataURLtoFile(imgSrc, 'selfie.jpg');
            const formData = new FormData();
            formData.append('file', imageFile);

            // Send to backend API
            const response = await axios.post('http://localhost:3001/api/analyze-season', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setResult(response.data);

            // Save detected season for global Aurora background
            localStorage.setItem('paletteSeason', response.data.predictions[0].label_friendly);

            // Optionally, navigate to profile with result
            const { quizAnswers } = location.state || {};
            setTimeout(() => {
                navigate('/profile', { state: { quizAnswers, paletteSeason: response.data.predictions[0].label_friendly } });
            }, 2000);
        } catch (err) {
            setError('Analysis failed. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-center">
            <div className="scanner-container">
                <h2>Find Your Color Palette</h2>
                <p>Natural, even lighting works best.</p>
                <div className="camera-view">
                    {imgSrc ? (
                        <img src={imgSrc} alt="Captured selfie" width={320} height={240} />
                    ) : (
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{
                                width: 320,
                                height: 240, // Request a 4:3 aspect ratio
                                facingMode: 'user'
                            }}
                        />
                    )}
                </div>
                <div style={{ marginTop: '20px' }}>
                    {imgSrc ? (
                        <>
                            <button className="cta-button" onClick={() => setImgSrc(null)}>Retake Photo</button>
                            <button className="cta-button" onClick={handleAnalyze} disabled={isLoading} style={{ marginLeft: '10px' }}>
                                {isLoading ? 'Analyzing...' : 'Analyze My Palette'}
                            </button>
                        </>
                    ) : (
                        <button className="cta-button" onClick={capture}>Capture Photo</button>
                    )}
                </div>
                {error && <p className="status-text" style={{ color: 'red' }}>{error}</p>}
                {result && (
                    <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px' }}>
                        <h3>Analysis Complete!</h3>
                        <p>Your predicted season is: <strong>{result.predictions[0].label_friendly}</strong></p>
                        <p>Confidence: {Math.round(result.predictions[0].probability * 100)}%</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaletteScanner;