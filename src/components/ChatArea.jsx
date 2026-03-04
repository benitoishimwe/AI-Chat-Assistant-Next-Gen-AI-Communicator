import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './ChatArea.css';

const ChatArea = ({ messages, messagesEndRef }) => {
    return (
        <div className="chat-area">
            <div className="messages-container">
                {messages.length === 0 ? (
                    <div className="empty-state">
                        <h2>What are you working on?</h2>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`message-row ${msg.role}`}>
                            <div className="message-bubble">
                                {msg.role === 'ai' && <div className="avatar ai-avatar">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                </div>}
                                <div className="message-content">
                                    {msg.role === 'ai' ? (
                                        typeof msg.content === 'string' && msg.content.length > 0 ? (
                                            <div className="markdown-body">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        code({ node, inline, className, children, ...props }) {
                                                            const match = /language-(\w+)/.exec(className || '')
                                                            return !inline && match ? (
                                                                <SyntaxHighlighter
                                                                    {...props}
                                                                    children={String(children).replace(/\n$/, '')}
                                                                    style={vscDarkPlus}
                                                                    language={match[1]}
                                                                    PreTag="div"
                                                                    customStyle={{
                                                                        margin: 0,
                                                                        borderRadius: '8px',
                                                                        background: 'var(--bg-secondary)',
                                                                    }}
                                                                />
                                                            ) : (
                                                                <code {...props} className={className}>
                                                                    {children}
                                                                </code>
                                                            )
                                                        }
                                                    }}
                                                >
                                                    {String(msg.content)}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <div className="error-message">
                                                {String(msg.content || 'An unknown error occurred.')}
                                            </div>
                                        )
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default ChatArea;
