import { useState, useRef, useEffect } from 'react';
import OpenAI from 'openai';
import './App.css';
import './components/TypingIndicator.css';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || "",
  dangerouslyAllowBrowser: true // Required for client-side API usage
});

const openAiModels = [
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
];

const generateId = () => Math.random().toString(36).substring(2, 9);

function App() {
  const [sessions, setSessions] = useState([
    { id: generateId(), title: 'New Chat', messages: [], updatedAt: Date.now() }
  ]);
  const [activeSessionId, setActiveSessionId] = useState(sessions[0].id);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState(openAiModels[0].id);
  const messagesEndRef = useRef(null);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession.messages, isTyping]);

  const updateSessionMessages = (sessionId, updaterFn) => {
    setSessions(prevSessions => prevSessions.map(session => {
      if (session.id === sessionId) {
        const newMessages = updaterFn(session.messages);

        // Auto-generate title on first user message
        let newTitle = session.title;
        if (session.messages.length === 0 && newMessages.length > 0) {
          newTitle = newMessages[0].content.slice(0, 30) + (newMessages[0].content.length > 30 ? '...' : '');
        }

        return { ...session, messages: newMessages, title: newTitle, updatedAt: Date.now() };
      }
      return session;
    }));
  };

  const handleSendMessage = async (content) => {
    const currentSessionId = activeSessionId;

    // 1. Add user message
    const newUserMessage = { role: 'user', content };
    let currentMessages = [];

    updateSessionMessages(currentSessionId, (prev) => {
      currentMessages = [...prev, newUserMessage];
      return currentMessages;
    });

    // 2. Set typing state
    setIsTyping(true);

    try {
      // 3. Call OpenAI API with conversation history
      const formattedHistory = currentMessages.map(msg => ({
        role: msg.role === 'ai' ? 'assistant' : 'user',
        content: msg.content
      }));

      const completion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a helpful, concise AI assistant.' },
          ...formattedHistory
        ],
        model: selectedModel,
      });

      const aiResponse = {
        role: 'ai',
        content: completion.choices[0].message.content
      };

      updateSessionMessages(currentSessionId, (prev) => [...prev, aiResponse]);

    } catch (error) {
      console.error("OpenAI API Error:", error);

      let errorMessage = `Sorry, I encountered an error communicating with the API: ${String(error?.message || error)}`;
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        errorMessage = "Error: Please check your VITE_OPENAI_API_KEY in the .env.local file.";
      }

      updateSessionMessages(currentSessionId, (prev) => [...prev, {
        role: 'ai',
        content: errorMessage
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const createNewChat = () => {
    const newSession = { id: generateId(), title: 'New Chat', messages: [], updatedAt: Date.now() };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  return (
    <div className="app-container">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewChat={createNewChat}
      />
      <main className="main-content">
        <header className="main-header">
          <div className="header-left">
            <div className="chatgpt-dropdown-container">
              <button className="chatgpt-dropdown-btn">
                <span>ChatGPT {openAiModels.find(m => m.id === selectedModel)?.name.replace('GPT-', '') || '4o'}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <select
                className="header-model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {openAiModels.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="header-center">
            {/* Kept empty to maintain flex layout balance */}
          </div>
          <div className="header-right">
            <button className="icon-btn profile-icon-btn">
              <div className="avatar-small">U</div>
            </button>
          </div>
        </header>

        <ChatArea messages={activeSession.messages} messagesEndRef={messagesEndRef} />
        {isTyping && (
          <div className="typing-indicator-container">
            <div className="typing-indicator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <InputArea onSendMessage={handleSendMessage} isTyping={isTyping} />
      </main>
    </div>
  );
}

export default App;
