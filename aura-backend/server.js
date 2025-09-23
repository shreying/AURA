const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const {
    personaGrid,
    personaFusionMap,
    quizQuestions,
    mockProductCatalog
} = require('./data.js'); // Import data from the new file

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- Multer Configuration ---
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- AI Service Configuration ---
const AI_SERVICE_URL = 'http://localhost:5001/predict';

// --- Helper Function for Archetype Logic ---
const getArchetypeFromScores = (scores) => {
    // 1. Determine primary quadrant axes
    const traditionAxis = scores.tradition <= 0 ? 'Classic' : 'Experimental';
    const functionAxis = scores.function <= 0 ? 'Functional' : 'Expressive';
    const quadrantKey = `${traditionAxis}-${functionAxis}`;

    // 2. Determine secondary sub-type axes within the quadrant
    const detailAxis = scores.detail <= 0 ? 'Minimal' : 'Statement';
    const formalityAxis = scores.formality <= 0 ? 'Casual' : 'Polished';
    const subTypeKey = `${detailAxis}-${formalityAxis}`;

    // 3. Look up the final archetype in the grid
    return personaGrid[quadrantKey]?.[subTypeKey];
};


// --- API ENDPOINTS ---

app.get('/api/quiz', (req, res) => {
    res.json(quizQuestions);
});

app.post('/api/persona-fusion', (req, res) => {
    const { answers, paletteSeason } = req.body;

    if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: 'Quiz answers are missing or invalid.' });
    }

    // Calculate scores on all four axes
    const totalScores = { tradition: 0, function: 0, detail: 0, formality: 0 };
    answers.forEach(answer => {
        totalScores.tradition += answer.tradition || 0;
        totalScores.function += answer.function || 0;
        totalScores.detail += answer.detail || 0;
        totalScores.formality += answer.formality || 0;
    });

    const archetype = getArchetypeFromScores(totalScores);

    if (!archetype) {
        console.error("Could not determine archetype for scores:", totalScores);
        return res.status(500).json({ error: 'Could not determine archetype.' });
    }

    const fusedPersonaName = personaFusionMap[archetype.name]?.[paletteSeason] || `${paletteSeason} ${archetype.name}`;

    res.json({
        fusedPersona: fusedPersonaName,
        archetype: archetype.name,
        palette: paletteSeason
    });
});

app.get('/api/feed', (req, res) => {
    const { archetype, context } = req.query;
    if (!archetype || !context) {
        return res.status(400).json({ error: 'Archetype and context are required.' });
    }
    
    // Find the tags for the given archetype name
    let archetypeTags = [];
    for (const quadrant in personaGrid) {
        for (const subType in personaGrid[quadrant]) {
            if (personaGrid[quadrant][subType].name === archetype) {
                archetypeTags = personaGrid[quadrant][subType].tags;
                break;
            }
        }
        if (archetypeTags.length > 0) break;
    }

    if (archetypeTags.length === 0) {
        return res.status(404).json({ error: 'Archetype definition not found.' });
    }

    const curatedProducts = mockProductCatalog.filter(product => {
        const hasMatchingStyle = product.style_tags.some(tag => archetypeTags.includes(tag));
        const hasMatchingOccasion = product.occasion_tags.includes(context);
        return hasMatchingStyle && hasMatchingOccasion;
    });

    res.json(curatedProducts);
});

app.post('/api/analyze-season', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    try {
        const form = new FormData();
        form.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });
        const aiResponse = await axios.post(AI_SERVICE_URL, form, {
            headers: { ...form.getHeaders() },
        });
        res.json(aiResponse.data);
    } catch (error) {
        console.error('Error forwarding request to AI service:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to communicate with the AI service.' });
    }
});

app.get('/api/suggestions', (req, res) => {
    const { archetype } = req.query;

    if (!archetype) {
        return res.status(400).json({ error: 'Archetype query parameter is required.' });
    }

    let suggestions = [];

    // First, search personaGrid for tags
    for (const key1 in personaGrid) {
        for (const key2 in personaGrid[key1]) {
            const persona = personaGrid[key1][key2];
            if (persona.name === archetype) {
                suggestions = persona.tags;
                break;
            }
        }
        if (suggestions.length > 0) break;
    }

    // If not found, try to reverse lookup from personaFusionMap
    if (suggestions.length === 0) {
        for (const base in personaFusionMap) {
            for (const season in personaFusionMap[base]) {
                if (personaFusionMap[base][season] === archetype) {
                    // Now find tags for the base archetype
                    for (const key1 in personaGrid) {
                        for (const key2 in personaGrid[key1]) {
                            const persona = personaGrid[key1][key2];
                            if (persona.name === base) {
                                suggestions = persona.tags;
                                break;
                            }
                        }
                        if (suggestions.length > 0) break;
                    }
                }
                if (suggestions.length > 0) break;
            }
            if (suggestions.length > 0) break;
        }
    }

    if (suggestions.length === 0) {
        return res.status(404).json({ error: 'Archetype not found.' });
    }

    res.json(suggestions);
});

// --- Server Startup ---
app.listen(PORT, () => {
    console.log(`Myntra AURA server is running on http://localhost:${PORT}`);
});