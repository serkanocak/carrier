import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import './ChatbotPage.css'

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

export default function ChatbotPage() {
    const [showWelcome, setShowWelcome] = useState(true)
    const embedRef = useRef(null)

    useEffect(() => {
        if (!document.querySelector(`script[src="${GRADIO_SRC}"]`)) {
            const script = document.createElement('script')
            script.type = 'module'
            script.src = GRADIO_SRC
            document.head.appendChild(script)
        }

        if (embedRef.current && !embedRef.current.querySelector('gradio-app')) {
            const app = document.createElement('gradio-app')
            app.setAttribute('src', SPACE_URL)
            app.setAttribute('eager', 'true')
            app.setAttribute('theme_mode', 'dark')
            app.style.width = '100%'
            app.style.height = '100%'
            embedRef.current.appendChild(app)
        }
    }, [])

    const handleSuggestion = (text) => {
        setShowWelcome(false)
        if (embedRef.current) {
            sendToGradio(embedRef.current, text)
        }
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
                {/* Welcome overlay */}
                {showWelcome && (
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

                <div className="chatbot-page-embed" ref={embedRef} />
            </div>
        </div>
    )
}

