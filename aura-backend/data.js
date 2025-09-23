// AURA Persona Grid - The 16 Base Archetypes
const personaGrid = {
    "Classic-Functional": {
        "Minimal-Casual": { name: "Minimal Classic", tags: ['minimalist', 'classic', 'timeless', 'simple'] },
        "Minimal-Polished": { name: "Sleek Professional", tags: ['professional', 'classic', 'sharp', 'modern'] },
        "Statement-Casual": { name: "Casual Pragmatist", tags: ['casual', 'functional', 'comfortable', 'practical'] },
        "Statement-Polished": { name: "Elegant Traditionalist", tags: ['elegant', 'traditional', 'refined', 'classic'] }
    },
    "Classic-Expressive": {
        "Minimal-Casual": { name: "Dreamy Romantic", tags: ['romantic', 'soft', 'dreamy', 'classic'] },
        "Minimal-Polished": { name: "Polished Visionary", tags: ['polished', 'aspirational', 'visionary', 'refined'] },
        "Statement-Casual": { name: "Glam Socialite", tags: ['glam', 'socialite', 'luxe', 'expressive'] },
        "Statement-Polished": { name: "Statement Maker", tags: ['statement', 'bold', 'classic', 'impactful'] }
    },
    "Experimental-Functional": {
        "Minimal-Casual": { name: "Street Minimalist", tags: ['street', 'minimalist', 'urban', 'effortless'] },
        "Minimal-Polished": { name: "Soft Creative", tags: ['creative', 'soft', 'artistic', 'modern'] },
        "Statement-Casual": { name: "Trend Surfer", tags: ['trendy', 'current', 'playful', 'casual'] },
        "Statement-Polished": { name: "Edgy Rebel", tags: ['edgy', 'rebel', 'bold', 'experimental'] }
    },
    "Experimental-Expressive": {
        "Minimal-Casual": { name: "Ethereal Nomad", tags: ['ethereal', 'nomad', 'bohemian', 'free-spirited'] },
        "Minimal-Polished": { name: "Futurist", tags: ['futurist', 'tech', 'innovative', 'sleek'] },
        "Statement-Casual": { name: "Playful Aestheticist", tags: ['playful', 'aesthetic', 'whimsical', 'creative'] },
        "Statement-Polished": { name: "Bold Innovator", tags: ['innovator', 'bold', 'avant-garde', 'experimental'] }
    }
};

// Persona Fusion Map - All 64 Final Personas
const personaFusionMap = {
    "Minimal Classic": { "Spring": "Soft Dawn Minimalist", "Summer": "Silver Mist Minimalist", "Autumn": "Amber Stone Minimalist", "Winter": "Midnight Steel Minimalist" },
    "Sleek Professional": { "Spring": "Golden Hour Executive", "Summer": "Icy Quartz Executive", "Autumn": "Crimson Oak Executive", "Winter": "Onyx Power Executive" },
    "Casual Pragmatist": { "Spring": "Sunlit Comfort Seeker", "Summer": "Ocean Breeze Pragmatist", "Autumn": "Harvest Cozy Pragmatist", "Winter": "Frosted Denim Pragmatist" },
    "Elegant Traditionalist": { "Spring": "Blush Pearl Traditionalist", "Summer": "Powder Sky Traditionalist", "Autumn": "Maple Glow Traditionalist", "Winter": "Ivory Noir Traditionalist" },
    "Polished Visionary": { "Spring": "Golden Visionary", "Summer": "Crystal Visionary", "Autumn": "Cedar Visionary", "Winter": "Eclipse Visionary" },
    "Statement Maker": { "Spring": "Radiant Flame Maker", "Summer": "Icy Crown Maker", "Autumn": "Ruby Ember Maker", "Winter": "Sable Crown Maker" },
    "Dreamy Romantic": { "Spring": "Peach Blossom Romantic", "Summer": "Lilac Whisper Romantic", "Autumn": "Amber Rose Romantic", "Winter": "Snow Veil Romantic" },
    "Glam Socialite": { "Spring": "Rosé Glow Socialite", "Summer": "Pearl Shine Socialite", "Autumn": "Champagne Flame Socialite", "Winter": "Crystal Noir Socialite" },
    "Street Minimalist": { "Spring": "Desert Sand Minimalist", "Summer": "Cloudline Minimalist", "Autumn": "Olive Terrain Minimalist", "Winter": "Shadow Core Minimalist" },
    "Edgy Rebel": { "Spring": "Solar Flare Rebel", "Summer": "Electric Ice Rebel", "Autumn": "Rust Flame Rebel", "Winter": "Obsidian Rebel" },
    "Soft Creative": { "Spring": "Terracotta Muse", "Summer": "Pastel Drift Muse", "Autumn": "Earthsong Muse", "Winter": "Moonlight Muse" },
    "Trend Surfer": { "Spring": "Coral Wave Surfer", "Summer": "Sky Pop Surfer", "Autumn": "Amber Rush Surfer", "Winter": "Neon Frost Surfer" },
    "Futurist": { "Spring": "Solar Prism Futurist", "Summer": "Ice Matrix Futurist", "Autumn": "Copper Tech Futurist", "Winter": "Neon Void Futurist" },
    "Bold Innovator": { "Spring": "Carnival Innovator", "Summer": "Ocean Pop Innovator", "Autumn": "Harvest Clash Innovator", "Winter": "Lunar Clash Innovator" },
    "Ethereal Nomad": { "Spring": "Coral Sand Nomad", "Summer": "Azure Drift Nomad", "Autumn": "Amber Dust Nomad", "Winter": "Frostpath Nomad" },
    "Playful Aestheticist": { "Spring": "Sunbeam Aestheticist", "Summer": "Bubble Pop Aestheticist", "Autumn": "Spice Pop Aestheticist", "Winter": "Aurora Pop Aestheticist" }
};

// Expanded Quiz with 4-Axis Scoring
const quizQuestions = [
    {
        id: 1,
        question: "Your ideal weekend getaway involves:",
        options: [
            { text: "A quiet cabin retreat with a curated library and nature walks.", scores: { tradition: -1, function: -1, detail: -1, formality: -1 } },
            { text: "A glamorous city hotel opening with a packed social calendar.", scores: { tradition: 1, function: 1, detail: 1, formality: 1 } }
        ]
    },
    {
        id: 2,
        question: "You're choosing a piece of art for your living room. You select:",
        options: [
            { text: "A timeless, structured black-and-white photograph.", scores: { tradition: -1, function: -1, detail: -1, formality: 0 } },
            { text: "A large, abstract canvas with a burst of expressive color.", scores: { tradition: 1, function: 1, detail: 1, formality: 0 } }
        ]
    },
    {
        id: 3,
        question: "When approaching a new project, you prefer:",
        options: [
            { text: "A well-defined plan with clear, practical steps.", scores: { tradition: -1, function: -1, detail: 0, formality: 1 } },
            { text: "Spitballing creative ideas and seeing where inspiration takes you.", scores: { tradition: 1, function: 1, detail: 0, formality: -1 } }
        ]
    },
    {
        id: 4,
        question: "The atmosphere you feel most comfortable in is:",
        options: [
            { text: "Polished and refined, where every detail is considered.", scores: { tradition: -1, function: 0, detail: 0, formality: 1 } },
            { text: "Relaxed and spontaneous, with an energetic, creative buzz.", scores: { tradition: 1, function: 0, detail: 0, formality: -1 } }
        ]
    },
    {
        id: 5,
        question: "A movie's visual style that appeals to you most is:",
        options: [
            { text: "Clean, symmetrical, and intentionally composed.", scores: { tradition: -1, function: 0, detail: -1, formality: 0 } },
            { text: "Lush, vibrant, and delightfully unconventional.", scores: { tradition: 1, function: 0, detail: 1, formality: 0 } }
        ]
    },
    {
        id: 6,
        question: "Your go-to source of inspiration is:",
        options: [
            { text: "Architectural magazines and historical documentaries.", scores: { tradition: -1, function: -1, detail: 0, formality: 0 } },
            { text: "Modern art galleries and street style blogs.", scores: { tradition: 1, function: 1, detail: 0, formality: 0 } }
        ]
    },
    {
        id: 7,
        question: "The 'perfect' accessory is one that is:",
        options: [
            { text: "Subtle, versatile, and impeccably crafted.", scores: { tradition: 0, function: 0, detail: -1, formality: 1 } },
            { text: "A unique, conversation-starting piece.", scores: { tradition: 0, function: 0, detail: 1, formality: -1 } }
        ]
    },
    {
        id: 8,
        question: "You'd rather invest in:",
        options: [
            { text: "A timeless trench coat you'll wear for decades.", scores: { tradition: -1, function: 0, detail: -1, formality: 1 } },
            { text: "The 'it' designer bag of the current season.", scores: { tradition: 1, function: 0, detail: 1, formality: -1 } }
        ]
    }
];

// Mock Product Catalog
const mockProductCatalog = [
    { id: 1, name: 'Crimson Slip Dress', brand: 'H&M', imageUrl: 'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', style_tags: ['edgy', 'rebel'], color_palette: 'Autumn', occasion_tags: ['partywear'] },
    { id: 2, name: 'Faux Leather Trousers', brand: 'ZARA', imageUrl: 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', style_tags: ['edgy', 'rebel', 'statement'], color_palette: 'Winter', occasion_tags: ['partywear', 'formalwear'] },
    { id: 5, name: 'Lavender Sequin Dress', brand: 'MANGO', imageUrl: 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', style_tags: ['romantic', 'glam', 'statement'], color_palette: 'Summer', occasion_tags: ['partywear'] },
    { id: 8, name: 'Black Cashmere Sweater', brand: 'Massimo Dutti', imageUrl: 'https://images.pexels.com/photos/8390141/pexels-photo-8390141.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', style_tags: ['minimalist', 'classic', 'timeless'], color_palette: 'Winter', occasion_tags: ['loungewear', 'casualwear', 'formalwear'] },
    { id: 9, name: 'White Tailored Trousers', brand: 'Marks & Spencer', imageUrl: 'https://images.pexels.com/photos/5638268/pexels-photo-5638268.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', style_tags: ['minimalist', 'classic', 'professional'], color_palette: 'Winter', occasion_tags: ['formalwear'] },
];

const paletteDetailsMap = {
    Spring: {
        colors: [
            { name: "Warm Peach", hex: "#FFDAB9" },
            { name: "Light Coral", hex: "#F08080" },
            { name: "Ivory", hex: "#FFFFF0" },
            { name: "Bright Aqua", hex: "#00FFFF" },
            { name: "Leaf Green", hex: "#7CFC00" }
        ],
        description: "Spring palettes are warm, light, and bright. Your best colors are clear and vibrant."
    },
    Summer: {
        colors: [
            { name: "Powder Blue", hex: "#B0E0E6" },
            { name: "Lavender", hex: "#E6E6FA" },
            { name: "Soft Pink", hex: "#FFB6C1" },
            { name: "Cool Grey", hex: "#D3D3D3" },
            { name: "Muted Plum", hex: "#DDA0DD" }
        ],
        description: "Summer palettes are cool, light, and muted. Your best colors are soft and gentle."
    },
    Autumn: {
        colors: [
            { name: "Mustard Yellow", hex: "#FFDB58" },
            { name: "Olive Green", hex: "#808000" },
            { name: "Burnt Orange", hex: "#CC5500" },
            { name: "Terracotta", hex: "#E2725B" },
            { name: "Rich Brown", hex: "#8B4513" }
        ],
        description: "Autumn palettes are warm, deep, and muted. Your best colors are rich and earthy."
    },
    Winter: {
        colors: [
            { name: "Royal Blue", hex: "#4169E1" },
            { name: "Magenta", hex: "#FF00FF" },
            { name: "Pure White", hex: "#FFFFFF" },
            { name: "Black", hex: "#000000" },
            { name: "Emerald Green", hex: "#009B77" }
        ],
        description: "Winter palettes are cool, deep, and bright. Your best colors are bold and high-contrast."
    }
};


module.exports = {
    personaGrid,
    personaFusionMap,
    quizQuestions,
    mockProductCatalog,
    paletteDetailsMap
};