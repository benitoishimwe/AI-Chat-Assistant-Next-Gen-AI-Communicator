import { useState, useRef, useEffect } from 'react';
import './InputArea.css';

const InputArea = ({ onSendMessage, isTyping }) => {
    const [inputText, setInputText] = useState('');
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [inputText]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputText.trim() && !isTyping) {
            onSendMessage(inputText);
            setInputText('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="input-area-wrapper">
            <form className="input-form" onSubmit={handleSubmit}>
                <div className="input-container">
                    <button type="button" className="input-icon-btn plus-btn" title="Attach">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>

                    <textarea
                        ref={textareaRef}
                        className="message-input"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything"
                        rows={1}
                        disabled={isTyping}
                    />

                    <div className="input-right-actions">
                        {!inputText.trim() ? (
                            <>
                                <button type="button" className="input-icon-btn action-btn tooltip-btn" title="Voice Input">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                                </button>
                                <button type="button" className="input-icon-btn action-btn headphone-btn tooltip-btn" title="Headphones">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M10 9v6"></path><path d="M14 9v6"></path></svg>
                                </button>
                            </>
                        ) : (
                            <button
                                type="submit"
                                className={`send-button ${!isTyping ? 'active' : ''}`}
                                disabled={isTyping}
                            >
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default InputArea;
