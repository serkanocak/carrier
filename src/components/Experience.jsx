import { FiCalendar, FiMapPin, FiChevronRight } from 'react-icons/fi'
import './Experience.css'

const JOBS = [
    {
        company: 'Mastra GmbH',
        role: 'Senior Software Developer / Tech Lead',
        period: '02/2025 – 02/2026',
        location: 'Frankfurt, Germany',
        current: true,
        highlights: [
            'Led technical design of a multi-tenant SaaS CRM platform for facility management',
            'Transformed monolithic PHP systems into distributed architecture (30% performance boost)',
            'Engineered high-availability infrastructure using FrankenPHP and AWS',
            'Optimized CI/CD pipelines (60% increase in deployment frequency)',
            'Implemented AI-driven components using Python for automation',
        ],
        tags: ['PHP', 'FrankenPHP', 'AWS', 'SaaS', 'Python', 'Tech Lead'],
    },
    {
        company: 'Temsa Skoda Sabancı Transportation',
        role: 'Senior Software Developer & Team Lead',
        period: '11/2019 – 10/2023',
        location: 'Adana, Turkey',
        highlights: [
            'Led analysis and design of a Dealer Management System (DMS)',
            'Architected TOMS Order Management System using .NET Core, DDD, and CQRS',
            'Migrated legacy monoliths to microservices architecture',
            'Optimized SAP ERP integrations (RFC/BAPI) for production and sales',
            'Developed corporate communication platforms and hybrid mobile apps (Angular, React, .NET)',
        ],
        tags: ['.NET Core', 'DDD', 'CQRS', 'SAP', 'Angular', 'React'],
    },
    {
        company: 'STFA Holding',
        role: 'Management Systems Manager – IT',
        period: '07/2017 – 08/2019',
        location: 'Istanbul, Turkey',
        highlights: [
            'Built a cost control system on .NET for real-time profitability reporting',
            'Integrated SAP RFC for accounting data synchronization',
            'Oversaw training for project teams at domestic and international sites',
        ],
        tags: ['.NET', 'SAP RFC', 'ERP', 'Cost Control'],
    },
    {
        company: 'Logon Consulting',
        role: 'Senior Software Consultant',
        period: '05/2016 – 08/2017',
        location: 'Ankara, Turkey',
        highlights: [
            'Delivered SAP ABAP development and customization for enterprise clients',
            'Resolved SAP performance bottlenecks and enhanced Fiori programs',
            'Mentored junior developers and led technical knowledge transfer',
        ],
        tags: ['SAP ABAP', 'Fiori', 'Consulting', 'Performance'],
    },
    {
        company: 'Rönesans Holding',
        role: 'Software Development Chief – IT',
        period: '03/2014 – 12/2015',
        location: 'Ankara, Turkey',
        highlights: [
            'Developed secure ASP.NET Web Forms applications with SQL optimization',
            'Led delivery of Health, Safety & Environment, Quality Control, and Central Purchasing systems',
        ],
        tags: ['ASP.NET', 'SQL Server', 'Team Lead', 'Enterprise'],
    },
    {
        company: 'Yapı Merkezi Holding',
        role: 'Software Development Specialist – IT',
        period: '03/2010 – 10/2013',
        location: 'Istanbul, Turkey',
        highlights: [
            'Developed full-stack enterprise apps (Cost Control, HR, Purchasing) using ASP.NET and MS-SQL',
            'Participated in full-cycle SAP ABAP development and process optimization',
        ],
        tags: ['.NET', 'SAP ABAP', 'MS-SQL', 'Full-stack'],
    },
    {
        company: 'Enka Construction',
        role: 'System Support Specialist – IT',
        period: '03/2006 – 08/2009',
        location: 'Donetsk, Ukraine',
        highlights: [
            'Managed user accounts, network security, and hardware/software procurement',
            'Provided enterprise IT support in a global construction environment',
        ],
        tags: ['IT Support', 'Network Security', 'Active Directory'],
    },
    {
        company: 'Pricoinsa Co. Inc.',
        role: 'Technical Service Intern',
        period: '11/2005 – 02/2006',
        location: 'Barcelona, Spain',
        highlights: [
            'Supported technical service operations and hardware/software maintenance',
        ],
        tags: ['Internship', 'Technical Service'],
    },
]

export default function Experience() {
    return (
        <section className="section experience-section" id="experience">
            <div className="container">
                <div className="section-header">
                    <div className="section-tag">🏢 Work History</div>
                    <h2 className="section-title">Professional <span>Experience</span></h2>
                    <p className="section-desc">15+ years shaping enterprise software across Turkey and Germany</p>
                </div>

                <div className="experience-timeline">
                    {JOBS.map((job, i) => (
                        <div className="timeline-item" key={i}>
                            <div className="timeline-dot" style={job.current ? { background: 'var(--gradient-primary)' } : {}}>
                                {job.current && <span className="timeline-dot-pulse" />}
                            </div>
                            <div className="timeline-card glass-card">
                                <div className="timeline-header">
                                    <div>
                                        <h3 className="timeline-role">{job.role}</h3>
                                        <p className="timeline-company">{job.company}</p>
                                    </div>
                                    {job.current && <span className="timeline-badge-current">Current</span>}
                                </div>
                                <div className="timeline-meta">
                                    <span><FiCalendar size={13} /> {job.period}</span>
                                    <span><FiMapPin size={13} /> {job.location}</span>
                                </div>
                                <ul className="timeline-highlights">
                                    {job.highlights.map((h, j) => (
                                        <li key={j}>
                                            <FiChevronRight size={13} className="highlight-arrow" />
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                                <div className="timeline-tags">
                                    {job.tags.map(t => (
                                        <span className="tag" key={t}>{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
