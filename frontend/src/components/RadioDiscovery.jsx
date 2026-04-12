import React, { useState, useEffect } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────
const nameStyle = {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 1.3,
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
};

const cardStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '20px 16px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
};

const hoverOn = e => {
    e.currentTarget.style.background = 'rgba(99,102,241,0.15)';
    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
    e.currentTarget.style.transform = 'translateY(-4px)';
};

const hoverOff = e => {
    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
    e.currentTarget.style.transform = 'translateY(0)';
};

const headingStyle = {
    fontSize: '1.8rem',
    fontWeight: 700,
    margin: 0,
    background: 'linear-gradient(90deg,#fff,#a8b2d1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
};

const searchStyle = {
    width: '100%',
    padding: '12px 42px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 12,
    color: 'white',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
};

const backBtnStyle = {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: 10,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: '0.9rem',
    fontWeight: 500,
    flexShrink: 0,
};

const clearBtnStyle = {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    fontSize: '1.1rem',
    lineHeight: 1,
    padding: 2,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const highlightMatch = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
            ? <span key={i} style={{ color: '#6366f1', fontWeight: 800 }}>{part}</span>
            : part
    );
};

// ─── Component ────────────────────────────────────────────────────────────────
const RadioDiscovery = ({ onStream, API_BASE = '' }) => {
    const [viewMode, setViewMode] = useState('countries');
    const [allItems, setAllItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (viewMode === 'countries') {
            fetchCountries();
        }
    }, [viewMode]);

    const fetchCountries = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/radio/countries`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setAllItems(data.results || []);
        } catch (e) {
            setError(`Could not load countries: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchChannels = async (code) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/radio/country/${code}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setAllItems(data.results || []);
        } catch (e) {
            setError(`Could not load stations: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCountryClick = (country) => {
        setSelectedCountry(country);
        setViewMode('channels');
        setSearchQuery('');
        fetchChannels(country.id);
    };

    const items = allItems.filter(item =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const CountryCard = ({ item }) => {
        const flag = item.id.length === 2
            ? [...item.id.toUpperCase()].map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)).join('')
            : '🌍';

        return (
            <div style={cardStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff} onClick={() => handleCountryClick(item)}>
                <div style={{ fontSize: '3rem', marginBottom: 8, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>{flag}</div>
                <span style={nameStyle}>{highlightMatch(item.name, searchQuery)}</span>
            </div>
        );
    };

    const ChannelCard = ({ item }) => {
        const [imgError, setImgError] = useState(false);
        return (
            <div style={cardStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff} onClick={() => onStream(item)}>
                <div style={{ marginBottom: 16 }}>
                    {item.poster_url && !imgError ? (
                        <img src={item.poster_url} alt={item.title} onError={() => setImgError(true)}
                            style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 8 }} />
                    ) : (
                        <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
                            {item.title.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <span style={{ ...nameStyle, fontSize: '0.8rem', textAlign: 'center', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {highlightMatch(item.title, searchQuery)}
                </span>
                <span style={{
                    fontSize: '0.65rem', padding: '2px 8px', borderRadius: 10,
                    background: 'rgba(139,92,246,0.15)',
                    color: '#a78bfa',
                    border: '1px solid rgba(139,92,246,0.3)',
                    fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase',
                }}>📻 Radio</span>
            </div>
        );
    };

    return (
        <div style={{ padding: '20px 40px', minHeight: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
                {viewMode === 'channels' && (
                    <button onClick={() => { setViewMode('countries'); setSelectedCountry(null); }} style={backBtnStyle}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                        Countries
                    </button>
                )}
                <div style={{ flex: 1 }}>
                    <h2 style={headingStyle}>{viewMode === 'countries' ? '📻 Live Radio' : `${selectedCountry?.title} Stations`}</h2>
                    {!loading && allItems.length > 0 && (
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '4px 0 0' }}>
                            {items.length} / {allItems.length} {viewMode === 'countries' ? 'countries' : 'stations'}
                        </p>
                    )}
                </div>
            </div>

            {!loading && allItems.length > 0 && (
                <div style={{ marginBottom: 24, position: 'relative', maxWidth: 480 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"
                        style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text" value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder={viewMode === 'countries' ? 'Search countries…' : 'Search stations…'}
                        style={searchStyle}
                    />
                    {searchQuery && <button onClick={() => setSearchQuery('')} style={clearBtnStyle}>×</button>}
                </div>
            )}

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 80, gap: 16, color: 'rgba(255,255,255,0.4)' }}>
                    <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <span>Loading radio {viewMode}…</span>
                </div>
            ) : error ? (
                <div style={{ textAlign: 'center', color: '#ef4444', padding: 80 }}>
                    <p>{error}</p>
                    <button onClick={() => viewMode === 'countries' ? fetchCountries() : fetchChannels(selectedCountry?.id)}
                        style={{ marginTop: 12, padding: '8px 20px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 8, cursor: 'pointer', color: '#fff' }}>
                        Retry
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 16 }}>
                    {items.map(item => viewMode === 'countries'
                        ? <CountryCard key={item.id} item={item} />
                        : <ChannelCard key={item.id} item={item} />
                    )}
                </div>
            )}
        </div>
    );
};

export default RadioDiscovery;
