import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiShield, FiAlertTriangle } from 'react-icons/fi'
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3'
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

function ChatbotUI() {
    const { executeRecaptcha } = useGoogleReCaptcha()
    const [verified, setVerified] = useState(false)
    const [verifying, setVerifying] = useState(true)
    const [errorMsg, setErrorMsg] = useState('')

    const [showWelcome, setShowWelcome] = useState(true)
    const embedRef = useRef(null)

    // Handle initial reCAPTCHA verification verification
    const handleVerify = useCallback(async () => {
        if (!executeRecaptcha) return

        try {
            const token = await executeRecaptcha('chatbot_init')

            // Backend validation (only works in Vercel production to check the secret key)
            if (import.meta.env.DEV) {
                // Bypass actual api call in local dev environment
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

    // Load Gradio only if verified
    useEffect(() => {
        if (!verified) return

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
    }, [verified])

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

                {/* Only display interactions if not verifying and successfully verified */}
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

                {/* Gradio Embed Container — Only show structure if verified */}
                {verified && <div className="chatbot-page-embed" ref={embedRef} />}
            </div>
        </div>
    )
}

// Wrapper to provide reCAPTCHA context
export default function ChatbotPage() {
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY

    // Fallback if siteKey is missing to prevent total crash
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
