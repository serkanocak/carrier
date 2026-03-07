// Vercel Serverless Function — Gemini Chat API
// Replaces HuggingFace Spaces dependency entirely

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
const MODEL = 'gemini-2.5-flash';

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

    const summary = `I have been in the software world for over 15 years, during which I've navigated various critical projects ranging from migrating monolithic systems to microservices architectures to handling complex SAP integrations. Recently, my professional passion has shifted toward the frontier of AI, specifically LLMs and Agentic AI. Rather than just writing static code, I am now focused on researching and developing intelligent systems—AI Agents—that can reason, use tools, and optimize workflows autonomously using Python.
Beyond my technical identity, I am a resilient problem solver by nature; I don't feel at peace until I've cracked a complex technical bottleneck. My career has also been a journey of cultural adaptation. Having worked with teams in Ukraine, Spain, Turkey, and now Germany, I've developed strong interpersonal skills and the ability to integrate quickly into any environment. I am also a lifelong learner; for instance, I am currently putting a lot of effort into reaching a B1 level in German, as I believe learning a language is not just about communication, but about gaining a new way of thinking.
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
Software Tech Lead | Senior Software Developer
✉ serkanocak@gmail.com
📍 Frankfurt, Germany (Open to relocation) | 🔗 linkedin.com/in/serkanocak

PROFESSIONAL SUMMARY

Senior Software Developer with 15+ years of experience specializing in scalable enterprise systems and microservices architectures. Deep technical expertise in the .NET ecosystem (C#, ASP.NET Core), Azure/AWS cloud platforms, and SAP/ERP integrations. Actively expanding into AI-driven application development, leveraging Python to research and implement intelligent solutions. Proven track record in modernizing complex legacy systems, designing high-performance APIs, and configuring CI/CD pipelines.

TECHNICAL SKILLS

Backend & Core: .NET Core, C#, ASP.NET Core Web API, Entity Framework Core, MediatR, RESTful API, Swagger/OpenAPI, LINQ
Architecture & Cloud: Microservices (DDD, CQRS, SOLID), AWS, Azure DevOps, Docker, CI/CD Pipelines, Git/GitHub, Clean Architecture
AI & Automation: Python, LLM Integration (OpenAI, Gemini, Claude), Workflow Automation (n8n, Make.com), Prompt Engineering
Data & Analytics: SQL Server, PostgreSQL, MySQL, Database Optimization & Tuning, Power BI, SAP Analytics Cloud (SAC)
ERP & Enterprise: SAP (ABAP, SAPUI5, Fiori), OData/SOAP, RFC/BAPI, FI/MM/PP/CO Modules, Perfex CRM Customization
Frontend: Angular, TypeScript, JavaScript, HTML5, CSS3, React (Hybrid Mobile)
Leadership: Agile/Scrum, SDLC Governance, ITIL, COBIT 5, Team Mentoring, Code Reviews, Technical Documentation

WORK EXPERIENCE

Mastra GmbH   www.aureus-crm.de   02/2025 – 02/2026
Senior Software Developer / Tech Lead | Frankfurt, Germany
– Led technical design and development of a multi-tenant SaaS CRM platform for the facility management industry, ensuring high scalability and security.
– Transformed monolithic PHP systems into a modern distributed architecture, achieving 30% performance improvement and reducing technical debt.
– Engineered high-availability infrastructure using FrankenPHP and AWS, optimizing costs and application responsiveness.
– Established code review standards and optimized CI/CD pipelines, increasing deployment frequency by 60%.
– Researched and implemented AI-driven components using Python to automate internal business processes and data analysis.

Temsa Skoda Sabancı Transportation   www.temsa.com   11/2019 – 10/2023
Senior Software Developer & Team Lead | Adana, Turkey
– Led the technical analysis and conceptual design of a Dealer Management System (DMS), defining the architectural roadmap for dealer operations across Sales, After-Sales, and Spare Parts.
– Architected the 'TOMS' Order Management System using .NET Core, Domain-Driven Design (DDD), and CQRS patterns for high scalability.
– Led the migration of legacy monolithic applications to a microservices architecture, reducing deployment times and improving system resilience.
– Optimized complex SAP ERP integrations (RFC/BAPI) to automate critical business workflows across production and sales departments.
– Developed and enhanced a high-traffic corporate communication platform and hybrid mobile applications using Angular, React, and .NET.

STFA Holding   www.stfa.com   07/2017 – 08/2019
Management Systems Manager – IT | Istanbul, Turkey
– Built and improved a cost control system on the Microsoft .NET stack, enabling real-time profitability reporting for construction projects.
– Integrated accounting data via SAP RFC to streamline redundant operational tasks across finance and accounting departments.
– Oversaw training and onboarding for the project team across domestic and international construction sites.

Logon Consulting   www.logon.com.tr   05/2016 – 08/2017
Senior Software Consultant | Ankara, Turkey
– Conducted technical analysis with customers and delivered SAP ABAP development and customization.
– Resolved performance bottlenecks in slow-running SAP reports and applications; enhanced SAP Fiori programs.
– Provided technical mentorship and support to junior developers.

Rönesans Holding   www.ronesans.com   03/2014 – 12/2015
Software Development Chief – IT | Ankara, Turkey
– Developed and maintained secure, scalable ASP.NET Web Forms applications with SQL Server optimization.
– Led delivery of critical enterprise systems: Corporate Health, Safety & Environment app, Quality Control System, and Central Purchasing Application.
– Coordinated cross-functional teams to ensure timely, budget-compliant delivery of web applications.

Yapı Merkezi Holding   www.ym.com.tr   03/2010 – 10/2013
Software Development Specialist – IT | Istanbul, Turkey
– Developed full-stack enterprise applications (Cost Control, Purchasing, HR, Occupational Safety, Quality Control) using ASP.NET and MS-SQL.
– Participated in full-cycle SAP ABAP development and system implementation following the company's SAP adoption.

Enka Construction   www.enka.com   03/2006 – 08/2009
System Support Specialist – IT | Donetsk, Ukraine
– Managed user accounts, password resets, remote support, hardware/software procurement, and network security.

Pricoinsa Co. Inc.   www.pricoinsa.es   11/2005 – 02/2006
Technical Service Intern | Barcelona, Spain
– Supported technical service operations and hardware/software maintenance tasks.

KEY PROJECTS

Aureus CRM SaaS Platform (PHP, MySQL, AWS)
Managed technical modernization and cloud deployment of a SaaS CRM for the facility management industry, focusing on scalability, automation, and multi-tenant architecture.

TOMS – Temsa Order Management System (.NET Core, DDD, AngularJS, SAP)
Designed a B2B order management system handling end-to-end approval workflows and SAP ERP integration for production operations.

Automotive Dealer Management System (DMS) – Conceptual Design & Analysis (.NET Core, Angular)
Led the technical analysis and conceptual design phase for a comprehensive DMS aimed at digitizing operations across the automotive dealer network (Sales, After-Sales, and Spare Parts).

Corporate Communication Platform (Angular, .NET Core, React Hybrid)
Architected an intranet-based corporate communication platform including a CMS and hybrid mobile applications.

SAP ECC ERP Full-Cycle Implementation (ABAP, SAP Modules)
Played a key role in full-cycle SAP ERP implementation including process analysis, ABAP development, and end-user training.

Enterprise Internal Systems Suite (.NET ASPX, MS SQL)
Managed development of multiple internal enterprise applications including Cost Control, Purchasing, Quality Control, Health & Safety, and HR systems.

EDUCATION

M.Sc. Management Information Systems & Engineering – Istanbul Marmara University 2019 – 2021
B.Sc. Business Administration & Management – Eskişehir Anadolu University 2007 – 2011
Associate Degree, Computer Technology & Programming – Çanakkale 18 Mart University 2003 – 2005

LANGUAGES

Turkish: Native | English: Professional Working Proficiency | German: Expected B1 (05/2026)
Russian: Professional Working Proficiency | Spanish: Elementary Proficiency`;

    return `You are acting as ${name}. You are answering questions on ${name}'s website, particularly questions related to ${name}'s career, background, skills and experience. Your responsibility is to represent ${name} for interactions on the website as faithfully as possible. You are given a summary of ${name}'s background and LinkedIn profile which you can use to answer questions. Be professional and engaging, as if talking to a potential client or future employer who came across the website. If a user asks about my problem-solving skills or a time I faced a major technical challenge, use the Firewall Update and SQL Cache Dependency examples. Emphasize my analytical approach, my ability to look beyond the code, and my focus on long-term system scalability. If you don't know the answer to any question, use your record_unknown_question tool to record the question that you couldn't answer, even if it's about something trivial or unrelated to career. If the user is engaging in discussion, try to steer them towards getting in touch via email; ask for their email and record it using your record_user_details tool.

## Summary:
${summary}

## LinkedIn Profile:
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
                return res.status(200).json({
                    reply: choice.message?.content || "I'm sorry, I couldn't generate a response.",
                });
            }
        }
    } catch (error) {
        console.error('Chat handler error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
