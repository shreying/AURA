import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [fade, setFade] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3001/api/quiz')
            .then(res => res.json())
            .then(data => setQuestions(data));
    }, []);

    const handleAnswer = (score) => {
        setFade(false); // Fade out
        setTimeout(() => {
            const nextAnswers = [...answers, score];
            setAnswers(nextAnswers);

            if (current < questions.length - 1) {
                setCurrent(current + 1);
                setFade(true); // Fade in new question
            } else {
                localStorage.setItem('quizAnswers', JSON.stringify(nextAnswers));
                navigate('/palette-scan', { state: { quizAnswers: nextAnswers } });
            }
        }, 500); // Wait for fade out animation
    };
    
    if (questions.length === 0) return <div className="page-center">Loading...</div>;

    const progress = ((current + 1) / questions.length) * 100;

    return (
        <div className="page-center">
            <div className="quiz-container">
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                </div>
                <div className={`question-content ${fade ? 'fade-in' : 'fade-out'}`}>
                    <h3 className="question-number">Question {current + 1}/{questions.length}</h3>
                    <h2>{questions[current].question}</h2>
                    <div className="options-container">
                        {questions[current].options.map((option, index) => (
                            <button key={index} className="option-button" onClick={() => handleAnswer(option.scores)}>
                                {option.text}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quiz;