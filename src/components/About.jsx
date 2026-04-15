import { useState, useEffect, useRef } from 'react'
import { FiBriefcase, FiCode, FiUsers, FiGlobe } from 'react-icons/fi'
import './About.css'

const TERMINAL_LINES = [
    { delay: 100, prefix: '$ ', text: 'whoami', type: 'cmd' },
    { delay: 400, text: 'serkan_ocak — Senior Software Developer & Agentic AI Researcher', type: 'output' },
    { delay: 700, prefix: '$ ', text: 'cat location.txt', type: 'cmd' },
    { delay: 950, text: '📍 Frankfurt, Germany', type: 'output' },
    { delay: 1200, prefix: '$ ', text: 'cat experience.json', type: 'cmd' },
    { delay: 1450, text: '{', type: 'output' },
    { delay: 1550, text: '  "years": 15,', type: 'output-key' },
    { delay: 1650, text: '  "lastRole": "Software Tech Lead @ Mastra GmbH (until 02/2026)",', type: 'output-key' },
    { delay: 1750, text: '  "status": "Open to opportunities",', type: 'output-key' },
    { delay: 1850, text: '  "expertise": [".NET", "SAP ABAP", "DDD/CQRS", "ERP", "AI/Automation"],', type: 'output-key' },
    { delay: 1950, text: '  "projects": "20+ enterprise systems built"', type: 'output-key' },
    { delay: 2050, text: '}', type: 'output' },
    { delay: 2350, prefix: '$ ', text: 'cat languages.sh', type: 'cmd' },
    { delay: 2600, text: '🇹🇷 TR (Native) | 🇬🇧 EN (Pro) | 🇷🇺 RU (Limited) | 🇩🇪 DE (A2) | 🇪🇸 ES (Elementary)', type: 'output' },
    { delay: 2900, prefix: '$ ', text: '_', type: 'cmd' },
]

const STATS = [
    { icon: FiBriefcase, value: '15+', label: 'Years Experience' },
    { icon: FiCode, value: '20+', label: 'Enterprise Systems' },
    { icon: FiUsers, value: '5+', label: 'Teams Led' },
    { icon: FiGlobe, value: '5', label: 'Languages Spoken' },
]

export default function About() {
    const [visibleLines, setVisibleLines] = useState([])
    const sectionRef = useRef(null)
    const started = useRef(false)

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !started.current) {
                started.current = true
                TERMINAL_LINES.forEach(line => {
                    setTimeout(() => {
                        setVisibleLines(prev => [...prev, line])
                    }, line.delay * 1.2)
                })
            }
        }, { threshold: 0.3 })
        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <section className="section about-section" id="about" ref={sectionRef}>
            <div className="container">
                <div className="section-header">
                    <div className="section-tag">✦ About Me</div>
                    <h2 className="section-title">The Person <span>Behind The Code</span></h2>
                </div>

                <div className="about-grid">
                    {/* Bio */}
                    <div className="about-bio">
                        <p className="about-text">
                            I'm a <strong>Senior Software Developer, Tech Lead & Agentic AI Researcher</strong> with
                            over 15 years of experience designing and building robust, scalable enterprise software.
                            My journey has taken me through major holding companies and consulting firms across
                            Turkey and Germany.
                        </p>
                        <p className="about-text">
                            I specialize in the <strong>.NET ecosystem</strong> (Core, 6, 8), cloud platforms
                            (<strong>AWS & Docker</strong>), and complex <strong>SAP/ERP integrations</strong>.
                            I have led multi-tenant SaaS platform development, optimized CI/CD pipelines, and
                            led software projects that power mission-critical business operations using
                            <strong> DDD, CQRS, and Clean Architecture</strong> principles.
                        </p>
                        <p className="about-text">
                            I actively research and prototype with <strong>OpenAI Agents SDK, LangGraph, CrewAI,
                            AutoGen, and RAG architectures</strong> — combining deep enterprise engineering
                            expertise with cutting-edge AI to build intelligent automation solutions.
                        </p>
                        <p className="about-text">
                            Based in <strong>Frankfurt, Germany</strong>, I bridge teams across cultures with
                            multilingual communication in Turkish, English, Russian, German, and Spanish.
                        </p>

                        <div className="about-stats">
                            {STATS.map(({ icon: Icon, value, label }) => (
                                <div className="about-stat glass-card" key={label}>
                                    <div className="about-stat-icon">
                                        <Icon size={20} />
                                    </div>
                                    <span className="about-stat-value">{value}</span>
                                    <span className="about-stat-label">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Terminal */}
                    <div className="terminal-card">
                        <div className="terminal-header">
                            <div className="terminal-dots">
                                <span className="dot dot-red" />
                                <span className="dot dot-yellow" />
                                <span className="dot dot-green" />
                            </div>
                            <span className="terminal-title">serkan@portfolio ~ </span>
                        </div>
                        <div className="terminal-body">
                            {visibleLines.map((line, i) => (
                                <div key={i} className={`terminal-line ${line.type}`}>
                                    {line.prefix && <span className="terminal-prefix">{line.prefix}</span>}
                                    <span className={line.type === 'cmd' ? 'terminal-cmd' : 'terminal-out'}>
                                        {line.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
