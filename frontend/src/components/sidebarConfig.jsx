import React from 'react';

export const navItems = [
    { id: 'home', label: 'Home', icon: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path> },
    { id: 'anilist', label: 'Anime', icon: <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"></path> },
    { id: 'manga', label: 'Manga', icon: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></> },
    { id: 'tv', label: 'Live TV', icon: <><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></> },
    { id: 'news', label: 'News', icon: <><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path><path d="M18 14h-8"></path><path d="M15 18h-5"></path><path d="M10 6h8v4h-8z"></path></> },
    { id: 'music', label: 'Music', icon: <><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></> },
    { id: 'radio', label: 'Radio', icon: <><rect x="2" y="8" width="20" height="14" rx="2" ry="2"></rect><path d="M12 2v6"></path><circle cx="8" cy="15" r="3"></circle><line x1="16" y1="12" x2="18" y2="12"></line><line x1="16" y1="15" x2="18" y2="15"></line><line x1="16" y1="18" x2="18" y2="18"></line></> },
    { id: 'history', label: 'History', icon: <><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></> }
];
