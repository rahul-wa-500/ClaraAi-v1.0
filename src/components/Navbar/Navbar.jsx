import "./Navbar.css";

/**
 * Navbar component:
 * - Sidebar toggle (hamburger)
 * - Clara logo & branding
 * - Active chat pill
 * - Voice settings button
 * - Dark / Light mode toggle
 * - New Chat button
 */
const Navbar = ({
  onToggleSidebar,
  isSidebarOpen,
  onNewChat,
  activeChatTitle,
  onOpenVoiceSettings,
  speechSettings,
  activeSpeakingId,
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <header className="navbar">
      <div className="nav-left">
        {/* Sidebar hamburger toggle */}
        <button
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Logo */}
        <div className="logo">
          <div className="logo-badge">C</div>
          <span className="logo-name">Clara</span>
        </div>

        {/* Active chat pill */}
        {activeChatTitle && (
          <div className="nav-chat-pill" title={activeChatTitle}>
            <span className="pill-dot" />
            <span className="pill-text">{activeChatTitle}</span>
          </div>
        )}
      </div>

      <div className="nav-right">
        {/* Voice / Speech Settings button */}
        <button
          className={`nav-btn nav-voice-btn ${speechSettings?.autoSpeak ? "auto-on" : ""} ${activeSpeakingId ? "playing" : ""}`}
          onClick={onOpenVoiceSettings}
          title={
            activeSpeakingId
              ? "Speech is playing — click for voice settings"
              : speechSettings?.autoSpeak
              ? "Voice & Speech (Auto-Speak ON)"
              : "Voice & Speech settings"
          }
          type="button"
        >
          {activeSpeakingId ? (
            <span className="equalizer-bars">
              <span className="bar bar1" />
              <span className="bar bar2" />
              <span className="bar bar3" />
            </span>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
          <span>{speechSettings?.autoSpeak ? "Voice (Auto)" : "Voice"}</span>
        </button>

        {/* Dark / Light mode toggle */}
        <button
          className="nav-btn theme-toggle-btn"
          onClick={onToggleTheme}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          type="button"
        >
          {isDarkMode ? (
            /* Sun icon for "switch to light" */
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            /* Moon icon for "switch to dark" */
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
          <span>{isDarkMode ? "Light" : "Dark"}</span>
        </button>

        {/* New Chat */}
        <button
          className="nav-btn"
          onClick={onNewChat}
          title="Start a new conversation"
          type="button"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>New Chat</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
