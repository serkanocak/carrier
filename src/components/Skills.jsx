import { FiServer, FiCloud, FiCpu, FiLayout } from 'react-icons/fi'
import AuthGate from './AuthGate'
import './Skills.css'

const SKILL_AREAS = [
    {
        icon: FiServer,
        title: '.NET & Backend',
        color: '#7C3AED',
        skills: [
            { name: '.NET Core / 6 / 8', level: 98 },
            { name: 'C#', level: 97 },
            { name: 'SQL Server', level: 90 },
            { name: 'PostgreSQL', level: 85 },
            { name: 'REST APIs / gRPC', level: 90 },
            { name: 'Entity Framework', level: 88 },
        ],
    },
    {
        icon: FiCloud,
        title: 'Cloud & DevOps',
        color: '#3B82F6',
        skills: [
            { name: 'Amazon AWS', level: 80 },
            { name: 'Docker', level: 90 },
            { name: 'Kubernetes', level: 80 },
            { name: 'CI/CD Pipelines', level: 88 },
            { name: 'Linux / Shell', level: 80 },
        ],
    },
    {
        icon: FiCpu,
        title: 'Architecture & ERP',
        color: '#06B6D4',
        skills: [
            { name: 'Microservices', level: 95 },
            { name: 'Multi-tenant SaaS', level: 90 },
            { name: 'SAP ABAP', level: 85 },
            { name: 'SAP Integration', level: 88 },
            { name: 'Agile / Scrum', level: 92 },
            { name: 'Domain-Driven Design', level: 82 },
        ],
    },
    {
        icon: FiLayout,
        title: 'Frontend & AI',
        color: '#A855F7',
        skills: [
            { name: 'React.js', level: 80 },
            { name: 'Angular', level: 78 },
            { name: 'TypeScript', level: 82 },
            { name: 'AI-Driven Apps', level: 75 },
            { name: 'ASP.NET MVC', level: 90 },
            { name: 'SignalR', level: 78 },
        ],
    },
]

export default function Skills() {
    return (
        <section className="section skills-section" id="skills">
            <div className="container">
                <div className="section-header">
                    <div className="section-tag">⚡ Technical Skills</div>
                    <h2 className="section-title">What I <span>Bring to the Table</span></h2>
                    <p className="section-desc">15+ years of hands-on experience across the full enterprise software stack</p>
                </div>

                <AuthGate label="technical skills">
                    <div className="skills-grid">
                        {SKILL_AREAS.map(({ icon: Icon, title, color, skills }) => (
                            <div className="skill-card glass-card" key={title}>
                                <div className="skill-card-header">
                                    <div className="skill-icon" style={{ background: `${color}22`, color }}>
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="skill-card-title">{title}</h3>
                                </div>
                                <div className="skill-bars">
                                    {skills.map(s => (
                                        <div key={s.name} className="skill-bar-item">
                                            <div className="skill-bar-info">
                                                <span className="skill-name">{s.name}</span>
                                                <span className="skill-pct">{s.level}%</span>
                                            </div>
                                            <div className="skill-bar-bg">
                                                <div
                                                    className="skill-bar-fill"
                                                    style={{
                                                        width: `${s.level}%`,
                                                        background: `linear-gradient(90deg, ${color}, ${color}88)`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </AuthGate>
            </div>
        </section>
    )
}
