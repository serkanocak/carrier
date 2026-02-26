import './Education.css'

const EDUCATION = [
    {
        degree: 'M.Sc. Management Information Systems & Engineering',
        institution: 'Istanbul Marmara University',
        period: '2019 – 2021',
        icon: '🎓',
        desc: 'Graduate research focus on enterprise information systems, ERP integration methodologies, and organizational digital transformation.',
        color: '#7C3AED',
    },
    {
        degree: 'B.Sc. Business Administration & Management',
        institution: 'Eskişehir Anadolu University',
        period: '2007 – 2011',
        icon: '📚',
        desc: 'Provided the business fundamentals that complement technical expertise — finance, operations, strategic management, and organizational behavior.',
        color: '#3B82F6',
    },
    {
        degree: 'Associate Degree — Computer Technology & Programming',
        institution: 'Çanakkale 18 Mart University',
        period: '2003 – 2005',
        icon: '💻',
        desc: 'Foundational training in programming, computer networks, operating systems, and database management. Starting point of a 20-year tech career.',
        color: '#06B6D4',
    },
]

const LANGUAGES = [
    { name: 'Turkish', flag: '🇹🇷', level: 'Native', pct: 100, color: '#E11D48' },
    { name: 'English', flag: '🇬🇧', level: 'Professional', pct: 88, color: '#3B82F6' },
    { name: 'Russian', flag: '🇷🇺', level: 'Professional', pct: 82, color: '#7C3AED' },
    { name: 'German', flag: '🇩🇪', level: 'B1 (In Progress)', pct: 52, color: '#F59E0B' },
    { name: 'Spanish', flag: '🇪🇸', level: 'Elementary', pct: 25, color: '#10B981' },
]

export default function Education() {
    return (
        <section className="section education-section" id="education">
            <div className="container">
                <div className="section-header">
                    <div className="section-tag">🎓 Background</div>
                    <h2 className="section-title">Education & <span>Languages</span></h2>
                </div>

                <div className="edu-lang-grid">
                    {/* Education */}
                    <div>
                        <h3 className="edu-subsection-title">Academic Background</h3>
                        <div className="education-list">
                            {EDUCATION.map((e, i) => (
                                <div className="edu-card glass-card" key={i}>
                                    <div className="edu-icon" style={{ background: `${e.color}18`, border: `1px solid ${e.color}33` }}>
                                        <span style={{ fontSize: '1.5rem' }}>{e.icon}</span>
                                    </div>
                                    <div className="edu-body">
                                        <div className="edu-header">
                                            <h4 className="edu-degree">{e.degree}</h4>
                                            <span className="edu-period">{e.period}</span>
                                        </div>
                                        <p className="edu-institution" style={{ color: e.color }}>{e.institution}</p>
                                        <p className="edu-desc">{e.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Languages */}
                    <div>
                        <h3 className="edu-subsection-title">Languages Spoken</h3>
                        <div className="languages-card glass-card">
                            {LANGUAGES.map((lang, i) => (
                                <div className="language-item" key={i}>
                                    <div className="lang-info">
                                        <span className="lang-flag">{lang.flag}</span>
                                        <div className="lang-text">
                                            <span className="lang-name">{lang.name}</span>
                                            <span className="lang-level">{lang.level}</span>
                                        </div>
                                        <span className="lang-pct">{lang.pct}%</span>
                                    </div>
                                    <div className="lang-bar-bg">
                                        <div
                                            className="lang-bar-fill"
                                            style={{ width: `${lang.pct}%`, background: lang.color }}
                                        />
                                    </div>
                                </div>
                            ))}

                            <div className="language-note">
                                <span>🎯</span>
                                <span>German B2 exam targeted for May 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
