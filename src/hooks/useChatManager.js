import { useState, useRef, useEffect, useCallback } from 'react';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || "",
  dangerouslyAllowBrowser: true // Required for client-side API usage
});

export const openAiModels = [
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
];

const generateId = () => Math.random().toString(36).substring(2, 9);

export function useChatManager() {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('chatSessions');
    if (saved) return JSON.parse(saved);
    return [{ id: generateId(), title: 'New Chat', messages: [], updatedAt: Date.now() }];
  });
  const [activeSessionId, setActiveSessionId] = useState(() => {
    const saved = localStorage.getItem('activeChatSessionId');
    if (saved) return saved;
    return sessions[0]?.id || generateId();
  });
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState(openAiModels[0].id);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('activeChatSessionId', activeSessionId);
  }, [activeSessionId]);

  const updateSessionMessages = useCallback((sessionId, updaterFn) => {
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
  }, []);

  const createNewChat = useCallback(() => {
    const newSession = { id: generateId(), title: 'New Chat', messages: [], updatedAt: Date.now() };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  }, []);

  const deleteChat = useCallback((id) => {
    setSessions(prev => {
        const filtered = prev.filter(s => s.id !== id);
        if (filtered.length === 0) {
            const newSession = { id: generateId(), title: 'New Chat', messages: [], updatedAt: Date.now() };
            setActiveSessionId(newSession.id);
            return [newSession];
        }
        if (activeSessionId === id && filtered.length > 0) {
            setActiveSessionId(filtered[0].id);
        }
        return filtered;
    });
  }, [activeSessionId]);

  const handleSendMessage = useCallback(async (content) => {
    const currentSessionId = activeSessionId;

    const newUserMessage = { role: 'user', content, id: generateId() };
    let currentMessages = [];

    updateSessionMessages(currentSessionId, (prev) => {
      currentMessages = [...prev, newUserMessage];
      return currentMessages;
    });

    setIsTyping(true);

    try {
      const formattedHistory = currentMessages.map(msg => ({
        role: msg.role === 'ai' ? 'assistant' : 'user',
        content: msg.content
      }));

      const completion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a highly capable AI assistant engaged in conversation.' },
          ...formattedHistory
        ],
        model: selectedModel,
      });

      const aiResponse = {
        role: 'ai',
        content: completion.choices[0].message.content,
        id: generateId()
      };

      updateSessionMessages(currentSessionId, (prev) => [...prev, aiResponse]);

    } catch (error) {
      console.error("OpenAI API Error:", error);

      let errorMessage = `Sorry, I encountered an error communicating with the API: ${String(error?.message || error)}`;
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        errorMessage = "Error: Please check your VITE_OPENAI_API_KEY in the .env.local file. To test out the UI, provide a valid API key!";
      }

      updateSessionMessages(currentSessionId, (prev) => [...prev, {
        role: 'ai',
        content: errorMessage,
        isError: true,
        id: generateId()
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [activeSessionId, selectedModel, updateSessionMessages]);

  return {
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
  };
}
