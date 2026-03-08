import { useState, useEffect } from 'react'
import { FiDownload, FiCode, FiServer, FiCloud } from 'react-icons/fi'
import './Hero.css'

const TITLES = [
    'Senior Software Developer',
    'Tech Lead',
    '.NET & SAP ABAP Expert',
    'Software Project Manager',
    'Product Owner',
    'Enterprise Systems Builder',
]

export default function Hero() {
    const [titleIndex, setTitleIndex] = useState(0)
    const [displayed, setDisplayed] = useState('')
    const [typing, setTyping] = useState(true)

    useEffect(() => {
        const current = TITLES[titleIndex]
        let timeout

        if (typing) {
            if (displayed.length < current.length) {
                timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80)
            } else {
                timeout = setTimeout(() => setTyping(false), 2200)
            }
        } else {
            if (displayed.length > 0) {
                timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
            } else {
                setTitleIndex((titleIndex + 1) % TITLES.length)
                setTyping(true)
            }
        }
        return () => clearTimeout(timeout)
    }, [displayed, typing, titleIndex])

    return (
        <section className="hero" id="home">
            {/* Background blobs */}
            <div className="hero-blob hero-blob-1" />
            <div className="hero-blob hero-blob-2" />
            <div className="hero-blob hero-blob-3" />

            {/* Floating tech badges */}
            <div className="floating-badge badge-1">
                <FiCode size={14} /> .NET Core
            </div>
            <div className="floating-badge badge-2">
                <FiCloud size={14} /> AWS & Docker
            </div>
            <div className="floating-badge badge-3">
                <FiServer size={14} /> Project Management
            </div>

            <div className="container hero-content">
                <div className="hero-status">
                    <span className="status-dot" />
                    <span>Available for Senior Roles</span>
                </div>

                <h1 className="hero-name">
                    Serkan <span className="gradient-text">Ocak</span>
                </h1>

                <div className="hero-typewriter">
                    <span>{displayed}</span>
                    <span className="cursor">|</span>
                </div>

                <p className="hero-desc">
                    15+ years building scalable enterprise systems with expertise in .NET, SAP ABAP,
                    ERP integrations, AWS & Docker. Based in <strong>Frankfurt, Germany</strong>.
                </p>

                <div className="hero-stats">
                    <div className="hero-stat">
                        <span className="stat-number">15+</span>
                        <span className="stat-label">Years Experience</span>
                    </div>
                    <div className="hero-stat-divider" />
                    <div className="hero-stat">
                        <span className="stat-number">20+</span>
                        <span className="stat-label">Enterprise Projects</span>
                    </div>
                    <div className="hero-stat-divider" />
                    <div className="hero-stat">
                        <span className="stat-number">5</span>
                        <span className="stat-label">Languages Spoken</span>
                    </div>
                    <div className="hero-stat-divider" />
                    <div className="hero-stat">
                        <span className="stat-number">5+</span>
                        <span className="stat-label">Tech Stacks Mastered</span>
                    </div>
                </div>

            </div>

            <div className="hero-scroll-indicator">
                <div className="scroll-line" />
                <span>scroll</span>
            </div>
        </section>
    )
}
