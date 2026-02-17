export const servicePages = {
  'ai-lead-pipeline-qualification-engine': {
    slug: 'ai-lead-pipeline-qualification-engine',
    serviceNumber: 'Service 01',
    title: 'AI Lead Pipeline & Qualification Engine',
    metaDescription:
      'Client-owned lead pipeline automation with secure intake, qualification scoring, and routing to hot, warm, and cold response paths.',
    subtitle:
      'Turn raw inquiries into prioritized sales action with a client-owned intake system that captures, protects, scores, and routes leads in seconds.',
    pricing: {
      starter: 'EUR 1,500-2,500',
      growth: 'EUR 3,500-6,500',
      scale: 'EUR 7,500+'
    },
    proof: [
      { value: '93%', label: 'Faster lead response compared to manual assignment' },
      { value: '<10s', label: 'Typical scoring and routing latency' },
      { value: '24/7', label: 'Always-on intake without manual triage bottlenecks' }
    ],
    problemTitle: 'Good leads arrive, then go cold',
    problems: [
      {
        title: 'Slow first response',
        text: 'Qualified prospects wait too long, then book with whoever replies first.'
      },
      {
        title: 'Noisy inbox',
        text: 'Bots, spam, and low-fit inquiries consume the same effort as high-intent leads.'
      },
      {
        title: 'No priority model',
        text: 'Teams treat every inquiry equally instead of routing by intent and value.'
      }
    ],
    blueprint: {
      title: 'Capture -> Guardrails -> Score -> Route',
      description:
        'A modular intake architecture that blocks junk, classifies intent, and pushes each lead to the right action path.',
      image: '../../assets/images/services/lead-blueprint-2026.png',
      alt: 'Lead automation blueprint with intake, security guardrails, scoring tiers, and routing.'
    },
    processTitle: 'Production rollout in 4 phases',
    process: [
      {
        title: 'Foundation',
        text: 'Secure webhook intake, normalized payloads, and baseline notification flow.'
      },
      {
        title: 'Logging',
        text: 'Persistent lead journal for auditability, attribution, and downstream analytics.'
      },
      {
        title: 'Qualification',
        text: 'AI + fallback rules to classify hot, warm, cold, and spam with fail-safe logic.'
      },
      {
        title: 'Conversion',
        text: 'Tier-based responses, escalation paths, and CRM-ready handoff.'
      }
    ],
    fit: {
      title: 'Who this is for',
      for: [
        'Teams with meaningful inbound volume and inconsistent response speed',
        'Sales pipelines where lead quality varies sharply across channels',
        'Founders who want client-owned automation, not a black-box vendor flow'
      ],
      notFor: [
        'Businesses with near-zero inbound and no outreach strategy',
        'Teams unwilling to define qualification criteria',
        'Setups that require unreviewed full-autonomous outbound messaging'
      ]
    },
    outcomes: [
      'Faster speed-to-lead and higher appointment conversion',
      'Reduced sales time spent on low-intent inquiries',
      'Clear priority routing across channels and owners'
    ],
    deliverables: [
      'Secure intake pipeline (form -> webhook -> normalized payload)',
      'Qualification logic with fallback rule set',
      'Response/routing flows by lead tier',
      'Lead log integration to Sheets/CRM',
      'Escalation alerts for high-intent leads',
      'Runbook, verification checklist, and handover'
    ],
    integrations: ['Typebot', 'n8n', 'OpenAI / Claude', 'HubSpot', 'Google Sheets', 'Slack / Telegram'],
    ownershipNote:
      'Client-owned setup: your workspace, your keys, your billing, your data. No lock-in handover risk.',
    packages: [
      {
        name: 'Starter',
        price: 'EUR 1,500-2,500',
        timeline: '5-7 days',
        bestFor: 'Reliable lead capture and basic triage',
        includes: ['Secure intake', 'Lead logging', 'Basic lead scoring', 'Email notification handoff']
      },
      {
        name: 'Growth',
        price: 'EUR 3,500-6,500',
        timeline: '2-3 weeks',
        bestFor: 'Qualification + conversion automation',
        includes: ['AI + fallback scoring', 'Hot/warm/cold routing', 'CRM sync', 'Alerting and QA hardening']
      },
      {
        name: 'Scale',
        price: 'EUR 7,500+',
        timeline: '4+ weeks',
        bestFor: 'Multi-channel + advanced monitoring',
        includes: ['Multi-channel ingest', 'Deeper enrichment', 'Performance monitoring', 'Ops enablement and governance']
      }
    ],
    faqTitle: 'Common buyer questions',
    faqs: [
      {
        q: 'Can this run with our existing form?',
        a: 'Yes. Existing form endpoints can be preserved while adding scoring and routing layers.'
      },
      {
        q: 'What happens if AI fails?',
        a: 'Fallback deterministic rules keep routing stable, so lead flow does not break.'
      },
      {
        q: 'Can we add calendar booking?',
        a: 'Yes. Booking can be added by tier after qualification and anti-spam checks.'
      },
      {
        q: 'Who owns the infrastructure?',
        a: 'You do. Accounts, credentials, billing, and data stay in client-controlled systems.'
      }
    ],
    nextStepTitle:
      'If lead follow-up is still manual, this is usually the highest-leverage automation to implement first.',
    contact: {
      heading: 'Share your intake flow and qualification criteria',
      description: 'I will reply with a scoped architecture, timeline, and package recommendation.',
      note: 'Default flow is async intake first. If you want a call, use the booking option.',
      messageLabel: 'Current lead flow + blockers',
      messagePlaceholder: 'Where are leads currently lost or delayed?'
    },
    theme: {
      accent: '#2563eb',
      accentLight: '#60a5fa',
      accentDim: 'rgba(37, 99, 235, 0.32)',
      accentGlow: 'rgba(37, 99, 235, 0.08)',
      heroGlow: 'rgba(37, 99, 235, 0.11)'
    }
  },

  'document-intelligence-pdf-to-data': {
    slug: 'document-intelligence-pdf-to-data',
    serviceNumber: 'Service 02',
    title: 'Document Intelligence (PDF-to-Data)',
    metaDescription:
      'Automate PDF extraction into structured records with validation, exception handling, and client-owned infrastructure.',
    subtitle:
      'Convert unstructured PDFs into clean, validated data flows so operations stop retyping and start scaling.',
    pricing: {
      starter: 'EUR 2,000-3,500',
      growth: 'EUR 4,500-7,500',
      scale: 'EUR 9,000+'
    },
    proof: [
      { value: '90%', label: 'Reduction in manual data entry effort' },
      { value: 'Faster', label: 'Turnaround from document arrival to usable records' },
      { value: 'Safer', label: 'Validation and exception gates before write operations' }
    ],
    problemTitle: 'Manual extraction becomes the growth bottleneck',
    problems: [
      {
        title: 'Repetitive keying',
        text: 'Teams re-enter the same fields by hand across multiple systems.'
      },
      {
        title: 'Format variance',
        text: 'Document layouts differ by vendor and break brittle workflows.'
      },
      {
        title: 'Silent errors',
        text: 'Bad records slip into downstream systems and create hidden operational risk.'
      }
    ],
    processTitle: 'Ingest -> Extract -> Validate -> Sync',
    process: [
      {
        title: 'Document mapping',
        text: 'Define schemas, required fields, and quality thresholds by document type.'
      },
      {
        title: 'Extraction workflow',
        text: 'Apply AI and deterministic parsers to convert PDFs into structured payloads.'
      },
      {
        title: 'Validation layer',
        text: 'Run business rules and confidence checks before writing to destination systems.'
      },
      {
        title: 'Exception handling',
        text: 'Route uncertain outputs to human review with clear retry paths.'
      }
    ],
    fit: {
      title: 'Who this is for',
      for: [
        'Operations teams processing recurring invoices, contracts, or intake PDFs',
        'Back-office processes where accuracy and auditability matter',
        'Businesses moving from manual handling to structured automation'
      ],
      notFor: [
        'Teams with one-off document flows and no recurring volume',
        'Cases with no clear destination schema',
        'Workflows that skip human review entirely for low-confidence records'
      ]
    },
    outcomes: [
      'Faster document processing with predictable latency',
      'Lower human error rates before database/CRM write',
      'Operational visibility on failure and exception cases'
    ],
    deliverables: [
      'Source ingestion workflow',
      'Extraction prompts/templates by document family',
      'Validation and confidence scoring gates',
      'Exception queue and reviewer flow',
      'Destination sync to target systems',
      'Runbook and handover materials'
    ],
    integrations: ['Google Drive', 'n8n', 'Claude/OpenAI vision', 'Airtable/CRM', 'Sheets', 'Databases'],
    ownershipNote: 'Client-owned credentials and storage from day one. No shared-secret dependency risk.',
    packages: [
      {
        name: 'Starter',
        price: 'EUR 2,000-3,500',
        timeline: '1-2 weeks',
        bestFor: 'One document family with controlled output schema',
        includes: ['Single-source ingest', 'Core extraction', 'Basic validation', 'Destination write']
      },
      {
        name: 'Growth',
        price: 'EUR 4,500-7,500',
        timeline: '2-4 weeks',
        bestFor: 'Multiple document families and exception handling',
        includes: ['Multi-schema extraction', 'Confidence routing', 'Reviewer queue', 'Operational dashboard']
      },
      {
        name: 'Scale',
        price: 'EUR 9,000+',
        timeline: '4+ weeks',
        bestFor: 'High-volume document operations with governance needs',
        includes: ['Advanced validation', 'Monitoring + alerts', 'Versioned extraction rules', 'Team enablement']
      }
    ],
    faqTitle: 'Before implementation',
    faqs: [
      {
        q: 'Can this handle variable PDF formats?',
        a: 'Yes. Flows are designed per document family with fallback handling for unknown layouts.'
      },
      {
        q: 'What happens on low confidence extraction?',
        a: 'Records are routed to exception review and blocked from auto-write until approved.'
      },
      {
        q: 'Can we start small?',
        a: 'Yes. Starter scope is intentionally narrow for faster ROI and safer rollout.'
      },
      {
        q: 'Can this feed our existing system?',
        a: 'Yes. Destination adapters are configured around your existing stack.'
      }
    ],
    nextStepTitle:
      'If your team still retypes PDFs, this is usually the fastest operational win available.',
    contact: {
      heading: 'Tell me your document flow and output requirements',
      description: 'I will reply with architecture options, timeline, and package range.',
      note: 'If you prefer live scoping, use the booking path after submitting requirements.',
      messageLabel: 'Document types + destination system',
      messagePlaceholder: 'What document types and fields do you need to extract?'
    },
    theme: {
      accent: '#0ea5e9',
      accentLight: '#38bdf8',
      accentDim: 'rgba(14, 165, 233, 0.34)',
      accentGlow: 'rgba(14, 165, 233, 0.09)',
      heroGlow: 'rgba(14, 165, 233, 0.11)'
    }
  },

  'client-onboarding-automation': {
    slug: 'client-onboarding-automation',
    serviceNumber: 'Service 03',
    title: 'Client Onboarding Automation',
    metaDescription:
      'Trigger-based onboarding automation from close-won to delivery kickoff with standardized provisioning and communication.',
    subtitle:
      'Trigger every onboarding step automatically from contract or payment events, so your team delivers a consistent first impression.',
    pricing: {
      starter: 'EUR 1,500-3,000',
      growth: 'EUR 3,500-6,500',
      scale: 'EUR 7,500+'
    },
    proof: [
      { value: '<24h', label: 'Typical onboarding cycle after automation' },
      { value: 'Fewer', label: 'Missed setup steps and handoff errors' },
      { value: 'Higher', label: 'Client onboarding consistency and clarity' }
    ],
    problemTitle: 'Onboarding still depends on manual reminders',
    problems: [
      {
        title: 'Handoff delays',
        text: 'No deterministic trigger between close-won and delivery kickoff.'
      },
      {
        title: 'Skipped setup tasks',
        text: 'Folders, docs, and assignments are inconsistent across clients.'
      },
      {
        title: 'Weak first-week experience',
        text: 'New clients lack timely, clear next-step communication.'
      }
    ],
    processTitle: 'Trigger -> Provision -> Assign -> Communicate',
    process: [
      {
        title: 'Blueprint mapping',
        text: 'Define variants, required assets, owners, and milestones by service type.'
      },
      {
        title: 'Trigger events',
        text: 'Start workflows from signed contract, payment received, or CRM status change.'
      },
      {
        title: 'Provisioning automation',
        text: 'Create workspaces, folders, tasks, and templates automatically.'
      },
      {
        title: 'Client communication',
        text: 'Deliver structured next steps and collect required documents.'
      }
    ],
    fit: {
      title: 'Who this is for',
      for: [
        'Agencies and service businesses onboarding clients weekly',
        'Teams with frequent handoff errors between sales and delivery',
        'Operators who need consistency across varied project types'
      ],
      notFor: [
        'Teams without a defined onboarding checklist',
        'Businesses with one-off, non-repeatable kickoff processes',
        'Setups unwilling to assign ownership for onboarding stages'
      ]
    },
    outcomes: [
      'Reduced time from close to kickoff',
      'Improved first-week client experience',
      'Fewer internal handoff misses and rework cycles'
    ],
    deliverables: [
      'Trigger-based onboarding orchestration',
      'Automated workspace and folder setup',
      'Task templates by role and service type',
      'Client document collection sequence',
      'Status visibility + exception handling',
      'Runbook + team handover'
    ],
    integrations: [
      'PandaDoc / DocuSign',
      'Stripe',
      'Google Workspace',
      'Microsoft 365',
      'Asana/ClickUp/Notion/Jira',
      'n8n'
    ],
    ownershipNote: 'Client-owned implementation model with long-term continuity and no platform lock-in.',
    packages: [
      {
        name: 'Starter',
        price: 'EUR 1,500-3,000',
        timeline: '1 week',
        bestFor: 'Single onboarding track with basic automation',
        includes: ['One trigger path', 'Core provisioning', 'Task assignment', 'Client confirmation message']
      },
      {
        name: 'Growth',
        price: 'EUR 3,500-6,500',
        timeline: '2-3 weeks',
        bestFor: 'Multiple onboarding variants and document collection',
        includes: ['Variant logic', 'Docs intake flow', 'Cross-tool sync', 'Exception routes']
      },
      {
        name: 'Scale',
        price: 'EUR 7,500+',
        timeline: '4+ weeks',
        bestFor: 'Mature operation requiring visibility + governance',
        includes: ['Advanced handoff automation', 'SLA monitoring', 'Ops reporting', 'Enablement sessions']
      }
    ],
    faqTitle: 'Scope and rollout questions',
    faqs: [
      {
        q: 'Can onboarding start from payment instead of contract?',
        a: 'Yes. Trigger sources are configured to match your actual sales workflow.'
      },
      {
        q: 'Can we support multiple service lines?',
        a: 'Yes. Growth and Scale scopes include variant routing by deal type.'
      },
      {
        q: 'Will this work with our PM tool?',
        a: 'Usually yes. Connectors are selected around your current stack.'
      },
      {
        q: 'Who maintains it after launch?',
        a: 'Your team receives runbooks and handover sessions for independent operations.'
      }
    ],
    nextStepTitle: 'If onboarding is still checklist-driven and fragile, automate this before scaling sales.',
    contact: {
      heading: 'Share your onboarding flow and where handoffs fail',
      description: 'I will return a rollout plan, timeline, and package recommendation.',
      note: 'Async scope intake is the default. Booking is optional for live scoping.',
      messageLabel: 'Current onboarding flow + blockers',
      messagePlaceholder: 'Which steps are currently delayed, skipped, or inconsistent?'
    },
    theme: {
      accent: '#16a34a',
      accentLight: '#4ade80',
      accentDim: 'rgba(22, 163, 74, 0.33)',
      accentGlow: 'rgba(22, 163, 74, 0.08)',
      heroGlow: 'rgba(22, 163, 74, 0.11)'
    }
  },

  'internal-company-brain-rag': {
    slug: 'internal-company-brain-rag',
    serviceNumber: 'Service 04',
    title: 'Internal Company Brain (RAG)',
    metaDescription:
      'Build a source-cited internal knowledge system so teams get reliable answers faster with client-owned infrastructure.',
    subtitle:
      'Transform scattered docs into a source-cited answer layer that reduces internal bottlenecks and speeds team execution.',
    pricing: {
      starter: 'EUR 2,000-4,000',
      growth: 'EUR 4,500-8,500',
      scale: 'EUR 10,000+'
    },
    proof: [
      { value: 'Faster', label: 'Internal answer retrieval and onboarding speed' },
      { value: 'Cited', label: 'Responses grounded in approved internal sources' },
      { value: 'Controlled', label: 'Role-aware access and client-owned data stack' }
    ],
    problemTitle: 'Critical knowledge is fragmented and hard to trust',
    problems: [
      {
        title: 'Source sprawl',
        text: 'Answers are split across docs, chat threads, and disconnected systems.'
      },
      {
        title: 'Inconsistent guidance',
        text: 'Teams receive different answers to the same policy or process question.'
      },
      {
        title: 'Slow ramp-up',
        text: 'New team members depend on specific people instead of reliable systems.'
      }
    ],
    processTitle: 'Ingest -> Retrieve -> Respond -> Cite',
    process: [
      {
        title: 'Knowledge mapping',
        text: 'Identify trusted sources, ownership, and freshness rules.'
      },
      {
        title: 'Indexing pipeline',
        text: 'Chunk and embed content for accurate retrieval and maintainability.'
      },
      {
        title: 'Answer experience',
        text: 'Deploy a question interface with source-backed responses.'
      },
      {
        title: 'Governance + tuning',
        text: 'Apply access boundaries and tune relevance with real prompts.'
      }
    ],
    fit: {
      title: 'Who this is for',
      for: [
        'Teams repeatedly answering the same internal questions',
        'Organizations with critical SOPs across multiple content systems',
        'Operators who need citation-backed internal AI outputs'
      ],
      notFor: [
        'Teams without any stable source documentation',
        'Use cases requiring unrestricted external content generation',
        'Setups without data governance ownership'
      ]
    },
    outcomes: [
      'Faster internal decision-making and issue resolution',
      'Lower dependency on tribal knowledge holders',
      'Higher trust through source-cited responses'
    ],
    deliverables: [
      'Knowledge source audit + ingestion plan',
      'RAG indexing and retrieval workflow',
      'Citation-enabled response layer',
      'Access/governance recommendations',
      'Quality test prompt set + tuning',
      'Runbook + team handover'
    ],
    integrations: ['Google Drive', 'Notion', 'Confluence', 'Slack', 'Supabase pgvector', 'n8n'],
    ownershipNote: 'Client-owned knowledge stack with explicit operational ownership and extension path.',
    packages: [
      {
        name: 'Starter',
        price: 'EUR 2,000-4,000',
        timeline: '1-2 weeks',
        bestFor: 'One team knowledge base with citation-ready answers',
        includes: ['Source audit', 'Core indexing', 'Q&A interface', 'Citation baseline']
      },
      {
        name: 'Growth',
        price: 'EUR 4,500-8,500',
        timeline: '3-4 weeks',
        bestFor: 'Cross-team retrieval and governance',
        includes: ['Multi-source ingest', 'Access controls', 'Prompt tuning', 'Usage instrumentation']
      },
      {
        name: 'Scale',
        price: 'EUR 10,000+',
        timeline: '5+ weeks',
        bestFor: 'Enterprise-grade internal answer infrastructure',
        includes: ['Advanced governance', 'Monitoring', 'Feedback loops', 'Team enablement program']
      }
    ],
    faqTitle: 'Deployment questions',
    faqs: [
      {
        q: 'How is this different from public chat tools?',
        a: 'It is constrained to your private sources with role-aware governance and citations.'
      },
      {
        q: 'Will answers include references?',
        a: 'Yes. Citation-first responses are core to trust and adoption.'
      },
      {
        q: 'Can we segment access by department?',
        a: 'Yes. Access boundaries can align with teams and content sensitivity.'
      },
      {
        q: 'Can we start with a small source set?',
        a: 'Yes. Starter scope begins with high-impact documents and expands in phases.'
      }
    ],
    nextStepTitle:
      'If your team keeps asking the same operational questions, this system compounds quickly.',
    contact: {
      heading: 'Share your knowledge stack and where answers break down',
      description: 'I will return a scoped implementation plan with timeline and package range.',
      note: 'Mention if you need live scoping and we can move to a discovery call.',
      messageLabel: 'Sources + team use case',
      messagePlaceholder: 'Which sources should be trusted and who needs access?'
    },
    theme: {
      accent: '#f59e0b',
      accentLight: '#fbbf24',
      accentDim: 'rgba(245, 158, 11, 0.33)',
      accentGlow: 'rgba(245, 158, 11, 0.08)',
      heroGlow: 'rgba(245, 158, 11, 0.11)'
    }
  },

  'automated-performance-reporting': {
    slug: 'automated-performance-reporting',
    serviceNumber: 'Service 05',
    title: 'Automated Performance Reporting',
    metaDescription:
      'Unify marketing, sales, and operations data into always-current dashboards with consistent KPI definitions and alerting.',
    subtitle:
      'Replace stale exports and ad-hoc reports with a client-owned reporting stack that drives faster decisions.',
    pricing: {
      starter: 'EUR 2,000-4,500',
      growth: 'EUR 5,000-9,000',
      scale: 'EUR 10,000+'
    },
    proof: [
      { value: 'Live', label: 'Dashboards instead of stale weekly exports' },
      { value: 'Unified', label: 'KPI definitions aligned across stakeholders' },
      { value: 'Alerted', label: 'Threshold and anomaly signals routed automatically' }
    ],
    problemTitle: 'Most teams still decide from old exports',
    problems: [
      {
        title: 'Source fragmentation',
        text: 'Data lives across ad platforms, CRM, finance tools, and ops systems.'
      },
      {
        title: 'Metric conflicts',
        text: 'Each team calculates core KPIs differently and trusts different numbers.'
      },
      {
        title: 'Manual reporting tax',
        text: 'Analyst time is consumed by updates instead of optimization.'
      }
    ],
    processTitle: 'Connect -> Model -> Visualize -> Alert',
    process: [
      {
        title: 'Source audit',
        text: 'Map systems, owners, refresh cadence, and reliability constraints.'
      },
      {
        title: 'KPI model',
        text: 'Define canonical metric formulas and stakeholder views.'
      },
      {
        title: 'Pipeline build',
        text: 'Automate extraction, transformation, and loading workflows.'
      },
      {
        title: 'Dashboard + alerts',
        text: 'Publish role-specific views with threshold/anomaly notifications.'
      }
    ],
    fit: {
      title: 'Who this is for',
      for: [
        'Teams managing paid channels with revenue accountability',
        'Organizations where KPI disputes slow decisions',
        'Operators needing reporting without manual export cycles'
      ],
      notFor: [
        'Teams without defined business goals or KPI ownership',
        'Organizations unwilling to standardize metric definitions',
        'Setups with no reliable source data access'
      ]
    },
    outcomes: [
      'Faster decision cycles with trusted live KPIs',
      'Reduced analyst overhead for recurring reports',
      'Clear ownership for metrics, refresh, and alerting'
    ],
    deliverables: [
      'Source-to-dashboard architecture map',
      'Unified KPI dictionary',
      'Automated ETL workflows',
      'Role-specific dashboard implementation',
      'Threshold/anomaly alerting',
      'Refresh policy + runbook'
    ],
    integrations: ['Ad platforms', 'CRM', 'Finance systems', 'n8n', 'Warehouse', 'Looker Studio / BI'],
    ownershipNote: 'Client-owned reporting stack with transparent ownership and extension path.',
    packages: [
      {
        name: 'Starter',
        price: 'EUR 2,000-4,500',
        timeline: '1-2 weeks',
        bestFor: 'Core KPI dashboard from a few critical sources',
        includes: ['Source connectors', 'Baseline KPI model', 'Primary dashboard', 'Refresh schedule']
      },
      {
        name: 'Growth',
        price: 'EUR 5,000-9,000',
        timeline: '3-4 weeks',
        bestFor: 'Multi-team reporting with alerts and ownership model',
        includes: ['Expanded source model', 'Alerting', 'Role-based views', 'Governance handover']
      },
      {
        name: 'Scale',
        price: 'EUR 10,000+',
        timeline: '5+ weeks',
        bestFor: 'Performance intelligence across business units',
        includes: ['Advanced modeling', 'Anomaly workflows', 'Operational playbooks', 'Enablement sessions']
      }
    ],
    faqTitle: 'Implementation details',
    faqs: [
      {
        q: 'Can we keep our current BI tool?',
        a: 'Yes. Pipelines can feed your existing visualization layer.'
      },
      {
        q: 'How are KPI conflicts resolved?',
        a: 'During modeling, formulas are explicitly defined and approved by stakeholders.'
      },
      {
        q: 'How often can data refresh?',
        a: 'Cadence is set per source and business need, with guardrails for rate limits.'
      },
      {
        q: 'Can alerts route to Slack or email?',
        a: 'Yes. Alerts route to channels tied to ownership and escalation paths.'
      }
    ],
    nextStepTitle:
      'If reporting still depends on manual merges, this is one of the highest-leverage systems upgrades.',
    contact: {
      heading: 'Share your KPI stack and where decisions get blocked',
      description: 'I will return a proposed architecture, timeline, and package recommendation.',
      note: 'Use intake first. If needed, we can move to a live discovery call.',
      messageLabel: 'Current KPI stack + reporting pain',
      messagePlaceholder: 'Which KPI decisions are currently delayed or disputed?'
    },
    theme: {
      accent: '#0891b2',
      accentLight: '#22d3ee',
      accentDim: 'rgba(8, 145, 178, 0.33)',
      accentGlow: 'rgba(8, 145, 178, 0.08)',
      heroGlow: 'rgba(8, 145, 178, 0.11)'
    }
  },

  'openclaw-setup-security-hardening': {
    slug: 'openclaw-setup-security-hardening',
    serviceNumber: 'Service 06',
    title: 'OpenClaw Setup & Security Hardening',
    metaDescription:
      'Deploy OpenClaw with policy-first hardening, sandbox controls, channel/provider strategy, and client-owned handover.',
    subtitle:
      'Deploy OpenClaw as production infrastructure, not a side experiment: hardened permissions, sandbox policy, channel governance, testing, and handover.',
    pricing: {
      starter: 'EUR 1,500-2,500',
      growth: 'EUR 3,500-6,500',
      scale: 'EUR 7,500-15,000+'
    },
    proof: [
      { value: 'Policy-first', label: 'Permissions and sandbox rules before traffic' },
      { value: 'Multi-channel', label: 'Controlled integration across approved channels' },
      { value: 'Handover-ready', label: 'Runbook, QA, and ownership transfer included' }
    ],
    problemTitle: 'OpenClaw is easy to start and easy to misconfigure',
    problems: [
      {
        title: 'Risky defaults',
        text: 'Permissive policies can expose production actions and sensitive data.'
      },
      {
        title: 'Provider/channel drift',
        text: 'Inconsistent configuration causes unstable behavior and outages.'
      },
      {
        title: 'No operations model',
        text: 'Without runbooks and ownership, teams depend on the implementer.'
      }
    ],
    processTitle: 'Discover -> Harden -> Test -> Operate',
    process: [
      {
        title: 'Risk profiling',
        text: 'Define data classes, allowed actions, and governance requirements.'
      },
      {
        title: 'Architecture choices',
        text: 'Select deployment topology, provider strategy, and control baseline.'
      },
      {
        title: 'Bootstrap + hardening',
        text: 'Install OpenClaw and configure permission/sandbox/allowlist policy.'
      },
      {
        title: 'Integration + QA',
        text: 'Pair channels/providers and run adversarial plus failure-path testing.'
      }
    ],
    fit: {
      title: 'Who this is for',
      for: [
        'Teams adopting OpenClaw for real operations, not experiments',
        'Organizations with compliance/security requirements',
        'Leaders who need ownership-ready documentation and governance'
      ],
      notFor: [
        'Teams wanting unrestricted autonomous tool execution',
        'Setups with no designated operator/owner',
        'Projects that skip staging/QA before production'
      ]
    },
    outcomes: [
      'Safer OpenClaw operation under explicit policy controls',
      'Reduced deployment risk from misconfiguration and drift',
      'Clear handover path with runbooks and owner training'
    ],
    deliverables: [
      'OpenClaw bootstrap + health validation',
      'Permission/sandbox/command policy setup',
      'Channel and provider integration matrix',
      'QA and red-team summary',
      'Operations runbook + rollback guide',
      'Admin/operator handover sessions'
    ],
    integrations: ['OpenAI', 'Anthropic', 'OpenRouter', 'Ollama', 'Telegram/Slack/Discord', 'Docker sandbox'],
    ownershipNote: 'Client-owned infrastructure and credentials from day one. No shadow ownership risk.',
    packages: [
      {
        name: 'Starter',
        price: 'EUR 1,500-2,500',
        timeline: '3-7 days',
        bestFor: 'Secure single-environment deployment baseline',
        includes: ['Bootstrap', 'Core hardening', 'One channel/provider setup', 'Ops runbook']
      },
      {
        name: 'Growth',
        price: 'EUR 3,500-6,500',
        timeline: '2-3 weeks',
        bestFor: 'Policy-driven rollout with testing and multi-channel setup',
        includes: ['Expanded hardening', 'Multi-channel config', 'QA scenarios', 'Operator enablement']
      },
      {
        name: 'Scale',
        price: 'EUR 7,500-15,000+',
        timeline: '4+ weeks',
        bestFor: 'Advanced governance and high-assurance production setup',
        includes: ['Advanced policy matrix', 'Provider fallback strategy', 'Monitoring design', 'Governance playbook']
      }
    ],
    faqTitle: 'Pre-go-live questions',
    faqs: [
      {
        q: 'Can this run inside our own cloud/VPC?',
        a: 'Yes, and that is often preferred for governance and data control.'
      },
      {
        q: 'How strict should permission mode be?',
        a: 'Default recommendation is strict-by-default with explicit escalation paths.'
      },
      {
        q: 'Can we configure multiple providers?',
        a: 'Yes. Provider routing and failover are included in Growth and Scale scope.'
      },
      {
        q: 'How is misuse tested?',
        a: 'Abuse and failure-path testing are part of pre-production validation.'
      }
    ],
    nextStepTitle: 'If OpenClaw is strategic, deploy it with governance from day one.',
    contact: {
      heading: 'Share OpenClaw goals and required risk posture',
      description: 'I will return recommended architecture, hardening scope, timeline, and package range.',
      note: 'Include preferred deployment mode and channel/provider requirements.',
      messageLabel: 'Deployment mode + channel/provider needs',
      messagePlaceholder: 'Local, VM/VPS, or managed? Which channels and providers are required?'
    },
    theme: {
      accent: '#ef4444',
      accentLight: '#f87171',
      accentDim: 'rgba(239, 68, 68, 0.34)',
      accentGlow: 'rgba(239, 68, 68, 0.08)',
      heroGlow: 'rgba(239, 68, 68, 0.11)'
    }
  }
};

export function getServicePage(slug) {
  return servicePages[slug] || null;
}
