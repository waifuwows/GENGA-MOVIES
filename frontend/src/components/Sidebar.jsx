import React, { useMemo, useCallback } from 'react';
import styles from './Sidebar.module.css';
import { navItems } from './sidebarConfig';

// Sub-component: Logo
const Logo = React.memo(({ isOpen, onToggle }) => (
    <div className={styles.logoSection}>
        <div className={styles.brand}>
            <h1>GENGA</h1>
            <p>Movies</p>
        </div>
        <button
            type="button"
            className={styles.toggleBtn}
            onClick={onToggle}
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={isOpen}
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {isOpen ? <polyline points="15 18 9 12 15 6"></polyline> : <polyline points="9 18 15 12 9 6"></polyline>}
            </svg>
        </button>
    </div>
));

// Sub-component: Navigation Item
const NavItem = React.memo(({ item, isActive, isOpen, onClick }) => (
    <button
        type="button"
        className={`${styles.navItem} ${isActive ? styles.active : ''}`}
        onClick={() => onClick(item.id)}
        aria-current={isActive ? 'page' : undefined}
    >
        <svg
            className={styles.navIcon}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {item.icon}
        </svg>
        <span className={styles.navLabel}>{item.label}</span>
        {!isOpen && <span className={styles.tooltip}>{item.label}</span>}
    </button>
));

// Sub-component: Status Footer
const StatusFooter = React.memo(({ isOpen, serverStatus, lastUpdate }) => (
    <footer className={styles.footer}>
        <div className={styles.statusContainer}>
            <div className={`${styles.statusDot} ${serverStatus === 'operational' ? styles.online : styles.offline}`} />
            {isOpen && (
                <div className={styles.statusInfo}>
                    <span className={styles.statusText}>
                        {serverStatus === 'operational' ? 'Systems Normal' : 'Service Issue'}
                    </span>
                    <span className={styles.statusUpdate}>Updated {lastUpdate}</span>
                </div>
            )}
        </div>
    </footer>
));

const Sidebar = ({ activeSource, onChangeSource, serverStatus, isOpen, onToggle }) => {
    // Memoize navigation list to prevent unnecessary re-renders
    const navigationList = useMemo(() => (
        <nav className={styles.nav} role="navigation" aria-label="Main Navigation">
            {navItems.map(item => (
                <NavItem
                    key={item.id}
                    item={item}
                    isActive={activeSource === item.id}
                    isOpen={isOpen}
                    onClick={onChangeSource}
                />
            ))}
        </nav>
    ), [activeSource, isOpen, onChangeSource]);

    // Handle clicking outside to close on mobile
    const handleOverlayClick = useCallback(() => {
        if (window.innerWidth <= 1024 && isOpen) {
            onToggle();
        }
    }, [isOpen, onToggle]);

    return (
        <>
            {/* Click-outside overlay for mobile/tablet */}
            <div 
                className={`${styles.overlay} ${isOpen ? styles.visible : ''}`} 
                onClick={handleOverlayClick}
            />
            
            <aside className={`${styles.sidebar} ${!isOpen ? styles.collapsed : ''}`}>
                <Logo isOpen={isOpen} onToggle={onToggle} />
                
                {navigationList}

                <StatusFooter 
                    isOpen={isOpen} 
                    serverStatus={serverStatus} 
                    lastUpdate="just now" 
                />
            </aside>
        </>
    );
};

export default React.memo(Sidebar);
