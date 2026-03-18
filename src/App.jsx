import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import './components/TypingIndicator.css';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import { useChatManager, openAiModels } from './hooks/useChatManager';

function App() {
  const {
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId,
    isTyping,
    selectedModel,
    setSelectedModel,
    createNewChat,
    deleteChat,
    handleSendMessage
  } = useChatManager();

  const messagesEndRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession.messages, isTyping]);

  return (
    <div className="app-container">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="main-content">
        <header className="main-header">
          <div className="header-left">
            <button className="toggle-sidebar-btn" onClick={() => setIsSidebarOpen(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div className="model-selector-wrapper">
              <button className="model-selector-btn">
                <span>{openAiModels.find(m => m.id === selectedModel)?.name || 'GPT-4o'}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <select
                className="model-select-native"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {openAiModels.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="header-right">
            <div className="profile-avatar">AI</div>
          </div>
        </header>

        <ChatArea messages={activeSession.messages} messagesEndRef={messagesEndRef} />
        
        {isTyping && (
          <div className="typing-indicator-container">
             <div style={{width: '100%', maxWidth: '840px', padding: '0 24px'}}>
                <div className="typing-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
             </div>
          </div>
        )}
        
        <InputArea onSendMessage={handleSendMessage} isTyping={isTyping} />
      </main>
    </div>
  );
}

export default App;
