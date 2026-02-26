import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FiMessageSquare, FiX, FiExternalLink, FiSend } from 'react-icons/fi'
import './ChatbotFloat.css'

const GRADIO_SRC = 'https://gradio.s3-us-west-2.amazonaws.com/5.49.1/gradio.js'
const SPACE_URL = 'https://serkanocak-career-conversation.hf.space'

const SUGGESTIONS = [
    { emoji: '👨‍💻', text: 'Tell me about Serkan\'s experience' },
    { emoji: '⚙️', text: 'What are his technical skills?' },
    { emoji: '🏢', text: 'Which companies has he worked at?' },
    { emoji: '🎓', text: 'What is his education background?' },
    { emoji: '🌍', text: 'What languages does he speak?' },
    { emoji: '🚀', text: 'Tell me about his projects' },
]

// Load the Gradio script once globally
let scriptLoaded = false
function loadGradioScript() {
    if (scriptLoaded || document.querySelector(`script[src="${GRADIO_SRC}"]`)) {
        scriptLoaded = true
        return
    }
    const script = document.createElement('script')
    script.type = 'module'
    script.src = GRADIO_SRC
    document.head.appendChild(script)
    scriptLoaded = true
}

function sendToGradio(container, text) {
    const textarea = container.querySelector('textarea')
    if (textarea) {
        const nativeSet = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set
        nativeSet.call(textarea, text)
        textarea.dispatchEvent(new Event('input', { bubbles: true }))
        setTimeout(() => {
            const btn = container.querySelector('button[aria-label="Submit"]') ||
                container.querySelector('button.submit') ||
                [...container.querySelectorAll('button')].find(b => b.querySelector('svg'))
            if (btn) btn.click()
        }, 200)
    }
}

export default function ChatbotFloat() {
    const [open, setOpen] = useState(false)
    const [showWelcome, setShowWelcome] = useState(true)
    const embedRef = useRef(null)

    useEffect(() => {
        loadGradioScript()
    }, [])

    useEffect(() => {
        if (open && embedRef.current && !embedRef.current.querySelector('gradio-app')) {
            const app = document.createElement('gradio-app')
            app.setAttribute('src', SPACE_URL)
            app.setAttribute('eager', 'true')
            app.style.height = '100%'
            embedRef.current.appendChild(app)
        }
    }, [open])

    const handleSuggestion = (text) => {
        setShowWelcome(false)
        if (embedRef.current) {
            sendToGradio(embedRef.current, text)
        }
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

            {/* Chat panel — always in DOM so gradio-app persists */}
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

                <div className="chatbot-embed" ref={embedRef} />
            </div>
        </>
    )
}

