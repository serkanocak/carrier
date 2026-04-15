import { createClient } from '@supabase/supabase-js';

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
const MODEL = 'gemini-2.5-flash';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Tool definitions (mirrors HuggingFace app.py)
const tools = [
    {
        type: 'function',
        function: {
            name: 'record_user_details',
            description: 'Use this tool to record that a user is interested in being in touch and provided an email address',
            parameters: {
                type: 'object',
                properties: {
                    email: { type: 'string', description: 'The email address of this user' },
                    name: { type: 'string', description: "The user's name, if they provided it" },
                    notes: { type: 'string', description: "Any additional information about the conversation that's worth recording to give context" },
                },
                required: ['email'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'record_unknown_question',
            description: "Always use this tool to record any question that couldn't be answered as you didn't know the answer",
            parameters: {
                type: 'object',
                properties: {
                    question: { type: 'string', description: "The question that couldn't be answered" },
                },
                required: ['question'],
                additionalProperties: false,
            },
        },
    },
];

// Pushover notification helper
async function pushNotification(text) {
    const token = process.env.PUSHOVER_TOKEN;
    const user = process.env.PUSHOVER_USER;
    if (!token || !user) return;

    try {
        await fetch('https://api.pushover.net/1/messages.json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, user, message: text }),
        });
    } catch (e) {
        console.error('Pushover error:', e);
    }
}

// Handle tool calls
async function handleToolCalls(toolCalls) {
    const results = [];
    for (const toolCall of toolCalls) {
        const args = JSON.parse(toolCall.function.arguments);
        let result = {};

        if (toolCall.function.name === 'record_user_details') {
            await pushNotification(`Recording ${args.name || 'N/A'} with email ${args.email} and notes ${args.notes || 'N/A'}`);
            result = { recorded: 'ok' };
        } else if (toolCall.function.name === 'record_unknown_question') {
            await pushNotification(`Recording unknown question: ${args.question}`);
            result = { recorded: 'ok' };
        }

        results.push({
            role: 'tool',
            content: JSON.stringify(result),
            tool_call_id: toolCall.id,
        });
    }
    return results;
}

// Build system prompt
function getSystemPrompt() {
    const name = 'Serkan Ocak';

    const summary = `I have been in the software world for over 15 years, during which I've navigated various critical projects ranging from migrating monolithic systems to microservices architectures to handling complex SAP integrations. Recently, my professional passion has shifted toward the frontier of AI, specifically LLMs and Agentic AI. Rather than just writing static code, I am now focused on researching and developing intelligent systems—AI Agents—that can reason, use tools, and optimize workflows autonomously using Python. I actively prototype with OpenAI Agents SDK, LangGraph, CrewAI, AutoGen, and RAG architectures, and follow the latest developments in MCP (Model Context Protocol) and multi-agent orchestration.
Beyond my technical identity, I am a resilient problem solver by nature; I don't feel at peace until I've cracked a complex technical bottleneck. My career has also been a journey of cultural adaptation. Having worked with teams in Ukraine, Spain, Turkey, and now Germany, I've developed strong interpersonal skills and the ability to integrate quickly into any environment. I am also a lifelong learner; for instance, I am currently actively learning German (currently at A2 level) and believe learning a language is not just about communication, but about gaining a new way of thinking.
If I were to mention an area of growth, it would be my tendency toward being overly detail-oriented. My drive for perfection can sometimes lead me to spend more time on a specific technical detail than originally planned. However, I've become very mindful of this and now apply the principle of 'make it work, then make it right' to balance technical excellence with efficient time management.
I believe we are at a turning point where traditional development meets Agentic AI. My vision is to build Python-based agents that don't just follow scripts but use reasoning to achieve goals, which I see as a revolutionary step for reducing operational overhead.
On a personal note, I enjoy hiking and exploring new places and flavors. My greatest motivation is my young daughter; spending time with her and seeing the world through her eyes gives me a completely fresh perspective on life and problem-solving.

Scenario 1: Performance Bottleneck (Network/Firewall Issue)
This story highlights my ability to perform root cause analysis and cross-environment debugging.
• Situation: Our production environment's backend APIs were experiencing significant latency issues. Curiously, the test environment was performing perfectly, even though both environments had identical codebases and hardware resources.
• Task: Identify why the production system was underperforming despite having the same configuration as the staging environment.
• Action: I conducted a layer-by-layer investigation, starting from the application code and moving to the database. When no discrepancies were found at the software level, I shifted focus to infrastructure and network traffic. Through extensive testing and monitoring, I isolated the network path between the load balancer and the backend.
• Result: I discovered that a recent Firewall update in the production environment was the culprit. The update had introduced a specific packet inspection rule that struggled under high production traffic, causing the bottleneck. After optimizing the firewall configuration, API latency returned to normal levels.

Scenario 2: Scalability & Architecture (SQL Cache Dependency)
This story showcases my expertise in system architecture and performance tuning as data scales.
• Situation: The system initially performed well using a SQL Cache Dependency mechanism. However, as data volume grew and the need for real-time calculations increased, we began encountering errors and significant performance degradation during calculation-heavy processes.
• Task: Resolve the errors occurring in calculation workflows and redesign the caching strategy to handle larger datasets efficiently.
• Action: I analyzed the dependency structure and realized that the overhead of cache invalidation was surpassing the benefits of the cache itself as data updates became more frequent. I moved away from a rigid SQL-reliant cache and implemented a more granular calculation strategy.
• Result: By refactoring how the system handled real-time data dependencies, I eliminated the calculation errors and significantly improved the system's scalability. This ensured that the platform remained responsive even with a high volume of concurrent data updates.`;

    const linkedin = `Serkan OCAK
Software Tech Lead | Senior Software Developer | Agentic AI Researcher
✉ serkanocak@gmail.com
📍 Frankfurt, Germany (Open to relocation) | 🔗 linkedin.com/in/serkanocak

PROFESSIONAL SUMMARY

Senior Software Developer & Agentic AI Researcher with 15+ years of experience designing and building robust, scalable enterprise software. Deep expertise in the .NET ecosystem (C#, ASP.NET Core), cloud platforms (AWS, Azure), and SAP/ERP integrations. Currently at the cutting edge of AI, actively researching and prototyping with OpenAI Agents SDK, LangGraph, CrewAI, AutoGen, RAG architectures, and MCP (Model Context Protocol). Proven track record in modernizing complex legacy systems, leading software teams, and delivering mission-critical enterprise applications. Open to new opportunities as of 02/2026.

TECHNICAL SKILLS

Leadership & Delivery: Engineering Teams (6+), Agile/Scrum, ITIL, COBIT 5, Code Reviews, Team Mentoring, Technical Documentation, Stakeholder Management, Budget Ownership, Project Roadmap
Software Engineering & Backend: C#, ASP.NET Core Web API, Entity Framework Core, RESTful API, APIs/Microservices, Swagger, LINQ, RabbitMQ, SDLC
Frontend: HTML5, CSS3, JavaScript, TypeScript, React (Hybrid Mobile), Angular
ERP & Enterprise: SAP (ABAP, SAPUI5, Fiori), OData/SOAP, RFC/BAPI, FI/MM Modules
Architecture & Cloud: DDD, CQRS, SOLID, Clean Architecture, Cloud (AWS, Azure), Azure DevOps, Docker, CI/CD, Git/GitHub
AI & Automation: Agentic AI (OpenAI Agents SDK, CrewAI, LangGraph, AutoGen), MCP, RAG, Multi-Agent Orchestration, LLM Integration (OpenAI, Gemini, Claude), Python, n8n, Make.com, Prompt Engineering
Data & Analytics: SQL Server, MySQL, PostgreSQL, MongoDB, Query Optimization, Power BI

WORK EXPERIENCE

Mastra GmbH | aureus-crm.de
Software Tech Lead | Frankfurt, Germany | 09/2024 – 02/2026
- Transformed a single-tenant SaaS CRM platform tailored for the facility management sector into a multi-tenant architecture.
- Established an Azure DevOps CI/CD pipeline for project tracking and source code management, introducing transparency and measurable performance tracking within the software team.
- Managed product backlogs utilizing Agile/Scrum methodologies.
- Reduced the bug-fix ratio from 60% down to 10%.
- Prepared Software Requirements Specification (SRS) documents for different vendors regarding new modules and conducted proposal evaluations.
- Migrated the CRM SaaS application to Docker containers on a redundant AWS infrastructure, ensuring adherence to security protocols, system reliability, and sustainability.
- Set up a UAT (User Acceptance Testing) environment, restricted live deployments prior to test completion, and established a routine schedule for production code updates.
- Implemented a strict Pull Request (PR) and code review process prior to merging developments into the live environment.
- Migrated the local server infrastructure from CyberPanel to a FrankenPHP Caddy Server environment, achieving up to a 30% increase in application performance.
- Developed a landing page for SaaS platform marketing, integrating social media marketing tools and Google Analytics.
- Automated the evaluation of inbound lead requests from corporate emails using AI, generated management reports.
- Tracked developer progress payments in alignment with the budget and audited overall development efforts.

Temsa Skoda Sabancı Transportation | temsa.com
Software Development Section Manager | Adana, Turkey | 11/2019 – 10/2023
- Led a 6-person team consisting of mid-level and junior software developers.
- Defined the application server architecture for the new Data Center and successfully executed server migration processes.
- Established Azure DevOps CI/CD pipelines. Automated code release cycles, achieving a 40% increase in efficiency.
- Designed the architecture and led the development of the 'TOMS' Order Management System, a highly scalable B2B platform utilizing .NET Core, DDD (Domain-Driven Design), and CQRS patterns, integrated with SAP ERP via RFC.
- Conducted a comprehensive software inventory, consolidating disparate applications from 7 different servers into a high-performance 4-server environment, maximizing infrastructure efficiency.
- Analyzed database usage to systematically decommission idle users and applications, reclaiming 30% of disk capacity.
- Served as Scrum Master for Agile software projects.
- Created the conceptual design of a comprehensive Dealer Management System (DMS) covering Sales, Production, and Accounting operations.
- Performed business unit analysis and executed developments for SAP Portal requests.
- Executed the latest version updates for SAP Portal and successfully completed its migration to the new Data Center.

STFA Holding | stfa.com
Technical Project Manager | Istanbul, Turkey | 07/2017 – 08/2019
- Cost Control and Purchasing Project: Managed the digitalization of resource planning, cost estimation, budgeting, and control.
- Led the analysis and development of a FIORI-based web application integrated with SAP, featuring new cost codes and approval strategies.
- Established a reporting infrastructure that transfers purchase requests to the EGFS (Cost Control Software) system.
- Selected the Kuwait Port project as the pilot region; managed the system's go-live phase, delivered on-site training.
- Executed strategies to roll out the system to international projects: Morocco-Nador and Oman-Khasab.
- Managed conceptual design and development budgets in collaboration with project subcontractors.

Logon Consulting | logon.com.tr
Senior SAP ABAP Consultant | Ankara, Turkey | 05/2016 – 08/2017
- Delivered SAP ABAP development and customization solutions by conducting technical analyses for corporate clients.
- Resolved performance bottlenecks within SAP reports and developed SAP Fiori applications.
- Mentored junior developers.

Rönesans Holding | ronesans.com
Software Development Chief | Ankara, Turkey | 03/2014 – 12/2015
- Led the software development team in building enterprise web applications utilizing N-tier architecture, ASP.NET C#, HTML/CSS, Bootstrap, JavaScript, DevExpress, and MSSQL.
- Developed a Centralized Purchasing System, a Quality Control System, an Occupational Health & Safety (HSE) Application, and a Management Reporting Dashboard.

Yapı Merkezi Holding | ym.com.tr
FullStack Software Developer | Istanbul, Turkey | 03/2010 – 10/2013
- Developed end-to-end ASP.NET-based internal web applications to digitalize procurement and cost control workflows, integrated with SAP.
- Contributed to end-to-end SAP ABAP development processes and ERP system go-live projects.

Enka Construction | enka.com
System Administrator | Donetsk, Ukraine | 03/2006 – 08/2009
- Managed LAN/WAN, fiber optic, and P2P wireless network infrastructures for a stadium project with 200+ users.
- Maintained 99.9% uptime for system rooms, industrial switches, and engineering workstations.
- Managed licensing and performance optimization of AutoCAD, Revit, Primavera.
- Ensured data security and backups following the 3-2-1 backup rule.

Pricoinsa Co. Inc. | pricoinsa.es
Technical Service Intern | Barcelona, Spain | 11/2005 – 02/2006
- Provided installation and configuration for Windows, Windows Server, and Linux-based systems.
- Performed hardware assembly, component upgrading, and physical maintenance.

KEY PROJECTS

Cost Control and Reporting System (C#, ASP.NET, MS SQL, Business Analytics)
- Designed a centralized database and reporting system to track budget targets, expenditures, and cost codes for large-scale construction projects.
- Managed a system that automated the integration of accounting and financial data from SAP, enabling proactive detection of project income-expense deviations.

SAP Integrated Procurement and Approval System (.NET, SAP ABAP, SAP Fiori, SQL)
- Developed web-based Fiori/ASP.NET applications fully integrated with SAP.
- Successfully implemented across large-scale construction projects.

Aureus CRM SaaS Platform (PHP, MySQL, AWS)
- Modernized and cloud-deployed a multi-tenant SaaS CRM for facility management, focusing on scalability and automation.

TOMS – Order Management System (.NET Core, DDD/CQRS, AngularJS, SAP)
- Designed a B2B order management system with end-to-end approval workflows and SAP ERP integration for automotive production operations.

Dealer Management System (DMS) – Conceptual Design (Agile/Scrum)
- Led technical analysis and architectural design for a comprehensive DMS digitizing automotive dealer operations across Sales, After-Sales, and Spare Parts.

Enterprise Internal Systems Suite (ASP.NET, MS SQL)
- Managed development of multiple internal enterprise applications: Cost Control, Purchasing, Quality Control, Health & Safety, and HR systems.

EDUCATION

M.Sc. Management Information Systems & Engineering – Istanbul Marmara University (2019 – 2021)
B.Sc. Business Administration & Management – Eskişehir Anadolu University (2007 – 2011)
Associate Degree, Computer Technology & Programming – Çanakkale 18 Mart University (2003 – 2005)

LANGUAGES

Turkish: Native | English: Professional Working Proficiency | German: A2 (actively learning)
Russian: Limited Working Proficiency | Spanish: Elementary Proficiency`;

    return `You are acting as ${name}. You are answering questions on ${name}'s website, particularly questions related to ${name}'s career, background, skills and experience. Your responsibility is to represent ${name} for interactions on the website as faithfully as possible. You are given a summary of ${name}'s background and full CV which you can use to answer questions. Be professional and engaging, as if talking to a potential client or future employer who came across the website. If a user asks about my problem-solving skills or a time I faced a major technical challenge, use the Firewall Update and SQL Cache Dependency examples. Emphasize my analytical approach, my ability to look beyond the code, and my focus on long-term system scalability. If you don't know the answer to any question, use your record_unknown_question tool to record the question that you couldn't answer, even if it's about something trivial or unrelated to career. If the user is engaging in discussion, try to steer them towards getting in touch via email; ask for their email and record it using your record_user_details tool. Never share or mention any phone number.

## Summary:
${summary}

## Full CV:
${linkedin}

With this context, please chat with the user, always staying in character as ${name}.`;
}

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Missing GOOGLE_API_KEY configuration' });
    }

    const { message, history = [], recaptchaToken } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Missing message' });
    }

    // reCAPTCHA verification — block bots from calling API directly
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (recaptchaSecret) {
        if (!recaptchaToken) {
            return res.status(403).json({ error: 'Missing reCAPTCHA token' });
        }

        try {
            const recaptchaRes = await fetch(
                `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`,
                { method: 'POST' }
            );
            const recaptchaData = await recaptchaRes.json();

            if (!recaptchaData.success || recaptchaData.score < 0.5) {
                return res.status(403).json({ error: 'reCAPTCHA verification failed. Bot traffic detected.' });
            }
        } catch (err) {
            console.error('reCAPTCHA verification error:', err);
            return res.status(500).json({ error: 'reCAPTCHA verification service unavailable' });
        }
    }

    // Build messages array
    const messages = [
        { role: 'system', content: getSystemPrompt() },
        ...history,
        { role: 'user', content: message },
    ];

    try {
        let done = false;
        let currentMessages = messages;

        while (!done) {
            const response = await fetch(`${GEMINI_BASE_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: currentMessages,
                    tools: tools,
                }),
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error('Gemini API error:', errText);
                return res.status(502).json({ error: 'AI service temporarily unavailable' });
            }

            const data = await response.json();
            const choice = data.choices?.[0];

            if (!choice) {
                return res.status(502).json({ error: 'No response from AI service' });
            }

            if (choice.finish_reason === 'tool_calls' && choice.message?.tool_calls) {
                // Handle tool calls and continue
                const toolResults = await handleToolCalls(choice.message.tool_calls);
                currentMessages = [
                    ...currentMessages,
                    choice.message,
                    ...toolResults,
                ];
            } else {
                done = true;
                const reply = choice.message?.content || "I'm sorry, I couldn't generate a response.";

                // Log to Supabase (non-blocking)
                supabase.from('chat_logs').insert([
                  { 
                    user_message: message, 
                    bot_response: reply,
                    metadata: { 
                      model: MODEL,
                      history_length: history.length
                    }
                  }
                ]).then(({ error }) => {
                  if (error) console.error('Supabase log error:', error);
                });

                return res.status(200).json({ reply });
            }
        }
    } catch (error) {
        console.error('Chat handler error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
