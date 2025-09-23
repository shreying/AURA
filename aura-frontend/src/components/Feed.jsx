import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

const Feed = () => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeContext, setActiveContext] = useState('casual');
    const contexts = ['casual', 'formal', 'party', 'cozy'];

    // If the user navigates here directly without a persona, redirect them home.
    if (!location.state?.persona) {
        return <Navigate to="/" />;
    }
    const { persona } = location.state;
    const { archetype, palette } = persona;

    useEffect(() => {
        setLoading(true);
        const apiUrl = `http://localhost:3001/api/feed?archetype=${encodeURIComponent(archetype)}&palette=${palette}&context=${activeContext}`;

        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            });
    }, [activeContext, archetype, palette]);

    useEffect(() => {
        if (archetype) {
            const suggestionsUrl = `http://localhost:3001/api/suggestions?archetype=${encodeURIComponent(archetype)}`;
            fetch(suggestionsUrl)
                .then(res => res.json())
                .then(data => setSuggestions(data));
        }
    }, [archetype]);

    const createMyntraLink = (query) => {
        const formattedQuery = query.replace(/\s+/g, '-');
        return `https://www.myntra.com/${formattedQuery}`;
    };

    return (
        <div
            className="feed-page"
            style={{
                minHeight: "100vh",
                paddingBottom: 40,
                background: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}
        >
            <div
                style={{
                    width: "90vw",
                    maxWidth: 1200,
                    margin: "2rem auto 0 auto",
                    background: "rgba(255,255,255,0.85)",
                    borderRadius: "2rem",
                    boxShadow: "0 8px 48px #3A29FF22",
                    padding: "2.5rem 2vw",
                    backdropFilter: "blur(8px)",
                    position: "relative"
                }}
            >
                <header className="feed-header" style={{ textAlign: "center" }}>
                    <h1 style={{ fontSize: "2.2rem", fontWeight: 700, color: "#3A29FF", marginBottom: 8 }}>
                        Your <span style={{ color: "#FD913C" }}>{persona.fusedPersona}</span> Capsule
                    </h1>
                    <div className="context-tabs" style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 12 }}>
                        {contexts.map(ctx => (
                            <button
                                key={ctx}
                                className={`tab-button ${activeContext === ctx ? 'active' : ''}`}
                                style={{
                                    padding: "0.6rem 1.4rem",
                                    borderRadius: 24,
                                    border: activeContext === ctx ? "2px solid #3A29FF" : "2px solid #eee",
                                    background: activeContext === ctx ? "#3A29FF" : "#fff",
                                    color: activeContext === ctx ? "#fff" : "#3A29FF",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    fontSize: "1rem",
                                    transition: "all 0.2s"
                                }}
                                onClick={() => setActiveContext(ctx)}
                            >
                                {ctx.charAt(0).toUpperCase() + ctx.slice(1)}
                            </button>
                        ))}
                    </div>
                </header>
                <main className="product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem", marginTop: "2rem" }}>
                    {loading ? (
                        <p style={{ textAlign: "center", fontSize: "1.2rem" }}>Curating your items...</p>
                    ) : products.length > 0 ? (
                        products.map(product => (
                            <a
                                key={product.id}
                                href={createMyntraLink(`${product.brand} ${product.name}`)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="product-card-link"
                                style={{ textDecoration: "none" }}
                            >
                                <div
                                    className="product-card"
                                    style={{
                                        background: "rgba(255,255,255,0.92)",
                                        borderRadius: 18,
                                        boxShadow: "0 2px 16px #3A29FF22",
                                        padding: 18,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        transition: "box-shadow 0.2s",
                                        minHeight: 320
                                    }}
                                >
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="product-image"
                                        style={{
                                            width: "100%",
                                            height: 180,
                                            objectFit: "cover",
                                            borderRadius: 12,
                                            marginBottom: 12
                                        }}
                                    />
                                    <div className="product-info" style={{ textAlign: "center" }}>
                                        <h3 className="product-brand" style={{ fontWeight: 600, color: "#FD913C", marginBottom: 4 }}>{product.brand}</h3>
                                        <p className="product-name" style={{ color: "#3A29FF", fontWeight: 500 }}>{product.name}</p>
                                    </div>
                                    <button
                                        className="cta-button"
                                        style={{
                                            marginTop: 16,
                                            background: "#3A29FF",
                                            color: "#fff",
                                            borderRadius: 8,
                                            padding: "0.6rem 1.2rem",
                                            fontWeight: 500,
                                            fontSize: "1rem",
                                            border: "none",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Shop on Myntra
                                    </button>
                                </div>
                            </a>
                        ))
                    ) : null}
                </main>
                {activeContext === "formal" || activeContext === "cozy" ? (
                    // Render a special section for formal/cozy
                    <section style={{ marginTop: 40 }}>
                        <h2 style={{ textAlign: "center", color: "#3A29FF", marginBottom: 18 }}>
                            {activeContext.charAt(0).toUpperCase() + activeContext.slice(1)} Styles on Myntra
                        </h2>
                        <div className="feed-grid" style={{ display: "flex", flexWrap: "wrap", gap: "18px", justifyContent: "center" }}>
                            {suggestions.map((tag, index) => (
                                <a
                                    key={index}
                                    href={createMyntraLink(`${palette} ${activeContext} ${tag}`)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="feed-card"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "rgba(255,255,255,0.92)",
                                        borderRadius: 12,
                                        boxShadow: "0 2px 8px #3A29FF11",
                                        padding: "0.8rem 1.2rem",
                                        minWidth: 180,
                                        textDecoration: "none"
                                    }}
                                >
                                    <span style={{ color: "#3A29FF", fontWeight: 600, fontSize: "1rem" }}>
                                        {`${palette} ${activeContext} ${tag}`}
                                    </span>
                                    <button className="cta-button" style={{
                                        marginLeft: 12,
                                        background: "#FD913C",
                                        color: "#fff",
                                        borderRadius: 8,
                                        padding: "0.4rem 0.9rem",
                                        fontWeight: 500,
                                        fontSize: "0.95rem",
                                        border: "none",
                                        cursor: "pointer"
                                    }}>
                                        Shop
                                    </button>
                                </a>
                            ))}
                        </div>
                    </section>
                ) : (
                    // Render the default section for casual/party
                    <section className="myntra-suggestions" style={{ marginTop: 40 }}>
                        <h2 style={{ textAlign: "center", color: "#3A29FF", marginBottom: 18 }}>Shop Curated Styles on Myntra</h2>
                        <div className="feed-grid" style={{ display: "flex", flexWrap: "wrap", gap: "18px", justifyContent: "center" }}>
                            {suggestions.map((tag, index) => (
                                <a
                                    key={index}
                                    href={createMyntraLink(`${palette} ${tag}`)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="feed-card"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "rgba(255,255,255,0.92)",
                                        borderRadius: 12,
                                        boxShadow: "0 2px 8px #3A29FF11",
                                        padding: "0.8rem 1.2rem",
                                        minWidth: 180,
                                        textDecoration: "none"
                                    }}
                                >
                                    <span style={{ color: "#3A29FF", fontWeight: 600, fontSize: "1rem" }}>
                                        {`${palette} ${tag}`}
                                    </span>
                                    <button className="cta-button" style={{
                                        marginLeft: 12,
                                        background: "#FD913C",
                                        color: "#fff",
                                        borderRadius: 8,
                                        padding: "0.4rem 0.9rem",
                                        fontWeight: 500,
                                        fontSize: "0.95rem",
                                        border: "none",
                                        cursor: "pointer"
                                    }}>
                                        Shop
                                    </button>
                                </a>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default Feed;