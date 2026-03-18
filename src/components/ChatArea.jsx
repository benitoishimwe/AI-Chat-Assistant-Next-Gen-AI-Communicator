import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './ChatArea.css';

function ChatArea({ messages, messagesEndRef }) {
  return (
    <div className="chat-area-container">
      {messages.length === 0 ? (
        <div className="chat-welcome">
          <div className="chat-welcome-icon">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </div>
          <h2>How can I help you today?</h2>
          <p>Send a message to start the conversation.</p>
        </div>
      ) : (
        <div className="message-list">
          {messages.map((msg, idx) => (
            <div key={msg.id || idx} className={`message-wrapper ${msg.role}`}>
              <div className={`message-bubble ${msg.role} ${msg.isError ? 'error' : ''}`}>
                <div className="message-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} style={{ height: '1px' }} />
        </div>
      )}
    </div>
  );
}

export default ChatArea;
