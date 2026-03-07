import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FiMessageSquare, FiX, FiExternalLink, FiSend, FiUser } from 'react-icons/fi'
import './ChatbotFloat.css'

const SUGGESTIONS = [
    { emoji: '👨‍💻', text: "Tell me about Serkan's experience" },
    { emoji: '⚙️', text: 'What are his technical skills?' },
    { emoji: '🏢', text: 'Which companies has he worked at?' },
    { emoji: '🎓', text: 'What is his education background?' },
    { emoji: '🌍', text: 'What languages does he speak?' },
    { emoji: '🚀', text: 'Tell me about his projects' },
]

const CHAT_API = '/api/chat'

export default function ChatbotFloat() {
    const [open, setOpen] = useState(false)
    const [showWelcome, setShowWelcome] = useState(true)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isLoading])

    // Focus input when panel opens
    useEffect(() => {
        if (open && !showWelcome) {
            setTimeout(() => inputRef.current?.focus(), 300)
        }
    }, [open, showWelcome])

    const sendMessage = async (text) => {
        if (!text.trim() || isLoading) return

        const userMsg = { role: 'user', content: text }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsLoading(true)
        setShowWelcome(false)

        const history = messages.map(m => ({
            role: m.role,
            content: m.content,
        }))

        try {
            const response = await fetch(CHAT_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history }),
            })

            const data = await response.json()

            if (response.ok && data.reply) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: '⚠️ Sorry, I could not get a response right now.',
                    isError: true,
                }])
            }
        } catch (err) {
            console.error('Chat error:', err)
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '⚠️ Connection error. Please try again.',
                isError: true,
            }])
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        sendMessage(input)
    }

    const handleSuggestion = (text) => {
        sendMessage(text)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage(input)
        }
    }

    const formatMessage = (text) => {
        if (!text) return ''
        const lines = text.split('\n')
        const formatted = lines.map((line, i) => {
            let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>')
            if (processed.match(/^[•\-]\s/)) {
                processed = `<span class="chat-bullet">›</span> ${processed.replace(/^[•\-]\s/, '')}`
                return `<div class="chat-bullet-line">${processed}</div>`
            }
            return processed
        }).join('<br/>')
        return formatted
    }

    return (
        <>
            {/* Floating toggle button */}
            <button
                className={`chatbot-toggle ${open ? 'open' : ''}`}
                onClick={() => setOpen(!open)}
                aria-label="Open career chatbot"
            >
                {open ? <FiX size={22} /> : <FiMessageSquare size={22} />}
                {!open && <span className="chatbot-toggle-label">Ask My CV</span>}
            </button>

            {/* Chat panel */}
            <div className={`chatbot-panel ${open ? 'chatbot-panel-visible' : ''}`}>
                <div className="chatbot-panel-header">
                    <div className="chatbot-panel-info">
                        <span className="chatbot-dot" />
                        <span>Serkan's Career Assistant</span>
                    </div>
                    <div className="chatbot-panel-actions">
                        <Link to="/chatbot" className="chatbot-fullscreen" title="Open fullscreen">
                            <FiExternalLink size={15} />
                        </Link>
                        <button className="chatbot-close" onClick={() => setOpen(false)}>
                            <FiX size={16} />
                        </button>
                    </div>
                </div>

                {/* Welcome overlay */}
                {showWelcome && open && (
                    <div className="chatbot-welcome">
                        <div className="welcome-avatar">🤖</div>
                        <h4 className="welcome-title">Hi! I'm Serkan's AI Assistant</h4>
                        <p className="welcome-text">
                            Ask me anything about Serkan's career, skills, or experience. Here are some ideas:
                        </p>
                        <div className="welcome-suggestions">
                            {SUGGESTIONS.map((s, i) => (
                                <button
                                    key={i}
                                    className="suggestion-chip"
                                    onClick={() => handleSuggestion(s.text)}
                                >
                                    <span>{s.emoji}</span> {s.text}
                                </button>
                            ))}
                        </div>
                        <button className="welcome-dismiss" onClick={() => setShowWelcome(false)}>
                            Or type your own question below ↓
                        </button>
                    </div>
                )}

                {/* Chat content */}
                <div className="chatbot-chat-content">
                    <div className="chatbot-messages-scroll">
                        {messages.map((msg, i) => (
                            <div key={i} className={`float-msg float-msg-${msg.role} ${msg.isError ? 'float-msg-error' : ''}`}>
                                <div className="float-msg-avatar">
                                    {msg.role === 'assistant' ? '🤖' : <FiUser size={12} />}
                                </div>
                                <div className="float-msg-bubble">
                                    <div
                                        className="float-msg-text"
                                        dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                                    />
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="float-msg float-msg-assistant">
                                <div className="float-msg-avatar">🤖</div>
                                <div className="float-msg-bubble">
                                    <div className="float-typing">
                                        <span className="float-typing-dot" />
                                        <span className="float-typing-dot" />
                                        <span className="float-typing-dot" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form className="chatbot-float-input-area" onSubmit={handleSubmit}>
                        <div className="chatbot-float-input-wrapper">
                            <textarea
                                ref={inputRef}
                                className="chatbot-float-input"
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={1}
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className="chatbot-float-send"
                                disabled={!input.trim() || isLoading}
                                aria-label="Send message"
                            >
                                <FiSend size={14} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
