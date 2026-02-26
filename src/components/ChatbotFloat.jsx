import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FiMessageSquare, FiX, FiExternalLink } from 'react-icons/fi'
import './ChatbotFloat.css'

const GRADIO_SRC = 'https://gradio.s3-us-west-2.amazonaws.com/5.49.1/gradio.js'
const SPACE_URL = 'https://serkanocak-career-conversation.hf.space'

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

export default function ChatbotFloat() {
    const [open, setOpen] = useState(false)
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
                <div className="chatbot-embed" ref={embedRef} />
            </div>
        </>
    )
}
