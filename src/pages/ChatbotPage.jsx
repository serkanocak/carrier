import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiShield, FiAlertTriangle, FiSend, FiUser } from 'react-icons/fi'
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import './ChatbotPage.css'

const SUGGESTIONS = [
    { emoji: '👨‍💻', text: "Tell me about Serkan's experience" },
    { emoji: '⚙️', text: 'What are his technical skills?' },
    { emoji: '🏢', text: 'Which companies has he worked at?' },
    { emoji: '🎓', text: 'What is his education background?' },
    { emoji: '🌍', text: 'What languages does he speak?' },
    { emoji: '🚀', text: 'Tell me about his projects' },
]

const CHAT_API = import.meta.env.DEV ? '/api/chat' : '/api/chat'

function ChatbotUI() {
    const { executeRecaptcha } = useGoogleReCaptcha()
    const [verified, setVerified] = useState(false)
    const [verifying, setVerifying] = useState(true)
    const [errorMsg, setErrorMsg] = useState('')

    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showWelcome, setShowWelcome] = useState(true)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    // Handle initial reCAPTCHA verification
    const handleVerify = useCallback(async () => {
        if (!executeRecaptcha) return

        try {
            const token = await executeRecaptcha('chatbot_init')

            if (import.meta.env.DEV) {
                console.log('Dev mode: Bypassing reCAPTCHA verification', token)
                setVerified(true)
                setVerifying(false)
                return
            }

            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            })

            const data = await response.json()

            if (response.ok && data.success) {
                setVerified(true)
            } else {
                setErrorMsg('Bot activity detected. Access denied.')
            }
        } catch (err) {
            console.error('reCAPTCHA error:', err)
            setErrorMsg('Verification system failed to respond. Please try again later.')
        } finally {
            setVerifying(false)
        }
    }, [executeRecaptcha])

    useEffect(() => {
        handleVerify()
    }, [handleVerify])

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isLoading])

    // Focus input after verification
    useEffect(() => {
        if (verified && !showWelcome) {
            inputRef.current?.focus()
        }
    }, [verified, showWelcome])

    const sendMessage = async (text) => {
        if (!text.trim() || isLoading) return

        const userMsg = { role: 'user', content: text }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsLoading(true)
        setShowWelcome(false)

        // Build history for API (only user/assistant messages)
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
                    content: '⚠️ Sorry, I could not get a response right now. Please try again.',
                    isError: true,
                }])
            }
        } catch (err) {
            console.error('Chat error:', err)
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '⚠️ Connection error. Please check your internet and try again.',
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

    // Simple markdown-like formatting for bold, italic, bullet points
    const formatMessage = (text) => {
        if (!text) return ''

        // Split by lines to handle bullet points
        const lines = text.split('\n')
        const formatted = lines.map((line, i) => {
            // Bold
            let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Bullet points
            if (processed.match(/^[•\-]\s/)) {
                processed = `<span class="chat-bullet">›</span> ${processed.replace(/^[•\-]\s/, '')}`
                return `<div class="chat-bullet-line" key="${i}">${processed}</div>`
            }
            return processed
        }).join('<br/>')

        return formatted
    }

    return (
        <div className="chatbot-page">
            <div className="chatbot-page-header">
                <Link to="/" className="back-link">
                    <FiArrowLeft size={16} /> Back to Portfolio
                </Link>
                <div className="chatbot-page-title">
                    <span className="chatbot-ai-badge">🤖 AI</span>
                    <h1>Career Assistant</h1>
                </div>
                <p className="chatbot-page-desc">
                    Ask me anything about Serkan's experience, skills, projects, or background.
                </p>
            </div>

            <div className="chatbot-page-body">
                {verifying && (
                    <div className="chatbot-page-loading">
                        <FiShield className="loading-spinner" size={40} style={{ margin: 'auto' }} />
                        <h3>Secure Verification...</h3>
                        <p>Checking if you are human.</p>
                    </div>
                )}

                {!verifying && errorMsg && (
                    <div className="chatbot-page-error">
                        <FiAlertTriangle size={50} color="#EF4444" />
                        <h3>Access Blocked</h3>
                        <p>{errorMsg}</p>
                    </div>
                )}

                {/* Welcome screen */}
                {verified && showWelcome && (
                    <div className="chatbot-page-welcome">
                        <div className="welcome-avatar-lg">🤖</div>
                        <h2 className="welcome-title-lg">Hi! I'm Serkan's AI Career Assistant</h2>
                        <p className="welcome-text-lg">
                            I know everything about Serkan's professional background, skills, and experience.
                            Pick a question or type your own below.
                        </p>
                        <div className="welcome-grid">
                            {SUGGESTIONS.map((s, i) => (
                                <button
                                    key={i}
                                    className="suggestion-chip-lg"
                                    onClick={() => handleSuggestion(s.text)}
                                >
                                    <span className="chip-emoji">{s.emoji}</span>
                                    <span>{s.text}</span>
                                </button>
                            ))}
                        </div>
                        <button className="welcome-dismiss-lg" onClick={() => setShowWelcome(false)}>
                            Skip — I'll type my own question
                        </button>
                    </div>
                )}

                {/* Chat messages area */}
                {verified && !showWelcome && (
                    <div className="chat-messages-area">
                        <div className="chat-messages-scroll">
                            {messages.length === 0 && !isLoading && (
                                <div className="chat-empty-state">
                                    <span className="chat-empty-icon">💬</span>
                                    <p>Start a conversation by typing a message below</p>
                                    <div className="chat-quick-chips">
                                        {SUGGESTIONS.slice(0, 3).map((s, i) => (
                                            <button key={i} className="quick-chip" onClick={() => handleSuggestion(s.text)}>
                                                {s.emoji} {s.text}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((msg, i) => (
                                <div key={i} className={`chat-message chat-message-${msg.role} ${msg.isError ? 'chat-message-error' : ''}`}>
                                    <div className="chat-avatar">
                                        {msg.role === 'assistant' ? '🤖' : <FiUser size={16} />}
                                    </div>
                                    <div className="chat-bubble">
                                        <div
                                            className="chat-text"
                                            dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                                        />
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="chat-message chat-message-assistant">
                                    <div className="chat-avatar">🤖</div>
                                    <div className="chat-bubble">
                                        <div className="chat-typing">
                                            <span className="typing-dot" />
                                            <span className="typing-dot" />
                                            <span className="typing-dot" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input area */}
                        <form className="chat-input-area" onSubmit={handleSubmit}>
                            <div className="chat-input-wrapper">
                                <textarea
                                    ref={inputRef}
                                    className="chat-input"
                                    placeholder="Type your message..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    rows={1}
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    className="chat-send-btn"
                                    disabled={!input.trim() || isLoading}
                                    aria-label="Send message"
                                >
                                    <FiSend size={18} />
                                </button>
                            </div>
                            <p className="chat-disclaimer">
                                AI-powered assistant • Responses may not be 100% accurate
                            </p>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

// Wrapper to provide reCAPTCHA context
export default function ChatbotPage() {
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY

    if (!siteKey) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>
                System configuration error: Missing reCAPTCHA key.
            </div>
        )
    }

    return (
        <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
            <ChatbotUI />
        </GoogleReCaptchaProvider>
    )
}
