import './Sidebar.css';

const Sidebar = ({ sessions, activeSessionId, onSelectSession, onNewChat, models, selectedModel, onModelChange }) => {
    // Sort sessions by recently updated
    const sortedSessions = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);

    return (
        <aside className="sidebar">
            <div className="sidebar-header-top">
                <div className="sidebar-icons">
                    <button className="icon-btn tooltip-btn" title="Close sidebar">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                    </button>
                    <button className="icon-btn tooltip-btn" title="New chat" onClick={onNewChat}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                </div>
            </div>

            <div className="sidebar-nav">
                <button className="nav-item active" onClick={onNewChat}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span>New chat</span>
                </button>
            </div>

            <div className="sidebar-history">
                <div className="history-group">
                    <div className="history-label">Your chats</div>
                    {sortedSessions.map(session => (
                        <button
                            key={session.id}
                            className={`history-item ${session.id === activeSessionId ? 'active' : ''}`}
                            onClick={() => onSelectSession(session.id)}
                        >
                            {session.title}
                        </button>
                    ))}
                </div>
            </div>

            <div className="sidebar-footer">
                <button className="user-profile-btn">
                    <div className="user-profile-info">
                        <div className="avatar">U</div>
                        <div className="user-text">
                            <span className="user-name">Benito Ishimwe</span>
                            <span className="user-plan">Free</span>
                        </div>
                    </div>
                </button>
                <button className="upgrade-btn">
                    Upgrade
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
