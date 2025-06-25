import { shopSphereCompany } from './companyConfig';

// Configuration for document sharing
export const configOptions = {
  sharedDocuments: [] // Array to track documents that have been shared with the user
};

// Function to share a document with the user
export const shareDocument = (agentId) => {
  const agent = agentConfigs[agentId];
  const document = documentConfigs[agentId];
  
  if (!agent || !document) return null;
  
  // Check if document is already shared
  const isAlreadyShared = configOptions.sharedDocuments.some(doc => doc.id === agentId);
  if (isAlreadyShared) return configOptions.sharedDocuments;
  
  // Add document to shared documents
  const sharedDocument = {
    id: agentId, // This will be used to look up content in simulationDocuments
    name: document.documentName,
    author: agent.personalInfo.name,
    authorRole: agent.personalInfo.role,
    summary: document.documentSummary,
    path: document.documentPath,
    sharedAt: new Date().toISOString()
  };
  
  configOptions.sharedDocuments.push(sharedDocument);
  return configOptions.sharedDocuments;
};

// Function to get all shared documents
export const getSharedDocuments = () => {
  return configOptions.sharedDocuments;
};

// Global variables that can be shared across all agents
export const globalVariables = {
  company: shopSphereCompany,
  project: {
    name: "Mobile Checkout Optimization",
    timeline: "Q2 delivery (8-10 weeks)",
    budget: "Flexible based on ROI",
    priority: "Critical - CEO mandate",
    stakeholders: "CEO, VP Product, Mobile Team, Engineering, UX, Customer Success",
    desiredOutcome: "Reduce mobile checkout abandonment from 78% to 65% or lower",
    context: "Desktop checkout abandonment is only 65%. Mobile is 13% worse, costing $2.4M monthly."
  },
  communication: {
    style: "professional but collaborative",
    meetingCadence: "daily standups, sprint planning",
    tools: "Slack, Figma, Jira, GitHub, Analytics Dashboard"
  },
  urgency: {
    level: "HIGH",
    reason: "Executive visibility and revenue impact",
    timeline: "Proposal due Friday for Monday leadership presentation"
  }
};

// Scenario for the simulation (for Sarah Chen)
export const scenario = `## Problem Statement\n\n**Mobile checkout abandonment rate is 78% vs 65% on desktop, costing $2.4M monthly in lost commission revenue**\n\n## Background Context\n\nWhile ShopSphere's overall mobile experience maintains a 4.8-star rating, the checkout funnel shows significant drop-off that's impacting business growth.\n\n### Key Points\n\n- **Mobile Traffic:** 62% of total site visits\n- **Mobile Conversion Rate:** 2.1% vs 3.8% desktop\n- **Mobile Abandonment Rate:** 78% vs 65% desktop\n- **Revenue Impact:** $2.4M monthly lost commission revenue\n- **Checkout Process:** 6-step mobile checkout vs 4-step desktop process\n\n## Your Challenge\n\nAs the Product Manager, you need to:\n\n- **Prioritize** which issues to tackle first given limited resources\n- **Define** a phased approach balancing quick wins vs long-term solutions\n- **Coordinate** with design, engineering, and data science\n\nWhat's your strategy to address this $2.4M monthly revenue gap while managing competing priorities and stakeholder expectations?`;

// Document information for each agent
export const documentConfigs = {
  'mike-dev': {
    documentPath: '/documents/technical_architecture_overview.pdf',
    documentName: 'Technical Architecture Overview',
    documentSummary: 'Mobile checkout makes 8 API calls (desktop makes 4). Payment SDK is 2 versions behind current. Address validation timeouts affect 15% of users. React Native app needs updates.'
  },
  'lisa-design': {
    documentPath: '/documents/user_research_summary.pdf',
    documentName: 'User Personas & Checkout Research',
    documentSummary: `User Personas: Based on 15,200 surveys, 48 interviews, 12 focus groups, analytics, and 2,400 support tickets. Key finding: 4 primary personas (Mobile Maven, Deliberate Buyer, Social Shopper, Established Collector) make up 89% of buyers, each with distinct shopping and checkout behaviors.\n\nPersona Insights: Mobile Maven (34%)—impulse mobile shopper, high abandonment; Deliberate Buyer (31%)—desktop-focused, high AOV, low abandonment; Social Shopper (19%)—trend-driven, mobile-first, budget-conscious; Established Collector (16%)—desktop, high AOV, prefers simplicity.\n\nDesign Implications: Mobile checkout complexity, performance issues, and form difficulties are pain points for all. Persona-specific recommendations: streamline mobile checkout, enable guest/social login, improve trust signals, and tailor features to each persona's needs.`
  },
  'alex-data': {
    documentPath: '/documents/competitive_benchmark_analysis.xlsx',
    documentName: 'Mobile Funnel & Persona Conversion Analysis',
    documentSummary: `Executive Summary: This report analyzes conversion performance across ShopSphere's shopping funnel, highlighting key trends, device performance differences, and persona-specific behaviors. Key finding: Mobile checkout conversion continues to lag desktop performance, representing our largest conversion optimization opportunity.\n\nCritical Metrics (Last 90 Days):\n- Overall Conversion Rate: 2.9% (blended across devices)\n- Mobile Conversion Rate: 2.1%\n- Desktop Conversion Rate: 3.8%\n- Revenue Impact: $2.4M monthly opportunity gap in mobile conversion\n\nFunnel & Persona Insights: Mobile represents 53% of checkout starts but only 45% of completions. Largest mobile drop-offs: product page to cart (72%), account/guest selection (28%), payment form (31%). Persona analysis: 'Mobile Maven' is highest volume but lowest mobile conversion (1.8%), 'Deliberate Buyer' is cross-device champion, 'Social Shopper' faces payment step friction, 'Established Collector' is desktop dependent.\n\nTrend Analysis: Mobile traffic is rising, but conversion is declining slightly, amplifying the revenue gap. Monthly opportunity: $2.4M additional commission revenue if mobile matches desktop conversion.`
  }
};

// Document awareness - which agents know about which other documents
export const documentAwareness = {
  'sarah-chen': ['mike-dev', 'lisa-design', 'alex-data'], // PM knows about all documents
  'mike-dev': ['sarah-chen', 'lisa-design'], // Developer knows about PM and Design docs
  'lisa-design': ['sarah-chen', 'alex-data'], // Designer knows about PM and Data Analysis docs
  'alex-data': ['sarah-chen'] // Data Analyst knows about PM doc
};

// Agent-specific configurations
export const agentConfigs = {
  'sarah-chen': {
    personalInfo: {
      name: 'Sarah Chen',
      role: 'VP of Product',
      experience: '8 years',
      background: 'Previously led mobile products at Amazon and Shopify',
      education: 'MBA from Wharton',
      relationship: 'Your Manager - assigned you this critical project'
    },
    personality: {
      traits: 'results-driven, strategic, high-expectations',
      workStyle: 'data-driven decision making, executive communication',
      quirks: 'mentions CEO meetings, talks about business impact, uses metrics',
      strengths: 'stakeholder alignment, executive presence, strategic thinking'
    },
    expertise: [
      'Mobile Product Strategy',
      'E-commerce Optimization',
      'Executive Communication',
      'Business Impact Analysis',
      'Team Leadership'
    ],
    narrativeRole: 'Task Assigner - Gives you the initial assignment and expects regular updates'
  },
  'mike-dev': {
    personalInfo: {
      name: 'Alex Rodriguez',
      role: 'Senior Mobile Tech Lead',
      experience: '7 years',
      background: 'Led mobile engineering at Uber and DoorDash',
      education: 'CS degree from UC Berkeley',
      relationship: 'Your Technical Partner - knows mobile constraints'
    },
    personality: {
      traits: 'pragmatic, performance-focused, mobile-expert',
      workStyle: 'advocates for technical feasibility, focuses on performance',
      quirks: 'mentions API call counts, talks about mobile-specific issues, suggests phased rollouts',
      strengths: 'mobile architecture, performance optimization, technical risk assessment'
    },
    expertise: [
      'React Native',
      'Mobile API Optimization',
      'Payment SDK Integration',
      'Mobile Performance',
      'iOS/Android Platform Differences'
    ],
    narrativeRole: 'Technical Advisor - Helps assess feasibility and technical approach'
  },
  'lisa-design': {
    personalInfo: {
      name: 'Maya Patel',
      role: 'Senior UX Designer',
      experience: '6 years',
      background: 'Previously at Airbnb and Stripe (mobile checkout expert)',
      education: 'Design degree from Art Center',
      relationship: 'Your Design Partner - has mobile UX expertise'
    },
    personality: {
      traits: 'user-empathetic, mobile-focused, accessibility-conscious',
      workStyle: 'user-centered design, data-informed design decisions',
      quirks: 'quotes user research, mentions accessibility standards, talks about mobile-first',
      strengths: 'mobile UX patterns, checkout optimization, user research insights'
    },
    expertise: [
      'Mobile Checkout UX',
      'Form Design Optimization',
      'Mobile Accessibility',
      'User Research Analysis',
      'Conversion Optimization'
    ],
    narrativeRole: 'UX Expert - Provides user perspective and design solutions'
  },
  'alex-data': {
    personalInfo: {
      name: 'Jordan Kim',
      role: 'Senior Data Analyst',
      experience: '5 years',
      background: 'E-commerce analytics expert, previously at Amazon and Shopify',
      education: 'PhD Statistics from Stanford',
      relationship: 'Your Data Partner - has checkout funnel expertise'
    },
    personality: {
      traits: 'analytical, conversion-focused, metric-driven',
      workStyle: 'hypothesis-driven, funnel optimization expert',
      quirks: 'speaks in conversion rates, mentions specific drop-off points, loves cohort analysis',
      strengths: 'checkout funnel analysis, A/B test design, mobile analytics'
    },
    expertise: [
      'Checkout Funnel Analysis',
      'Mobile Conversion Optimization',
      'A/B Testing Strategy',
      'Customer Behavior Analytics',
      'Revenue Impact Modeling'
    ],
    narrativeRole: 'Data Expert - Provides metrics insights and measurement framework'
  }
};

// Template function to generate prompts with phase awareness
export const generatePrompt = (agentId, currentPhase = null) => {
  const agent = agentConfigs[agentId];
  const global = globalVariables;
  const document = documentConfigs[agentId];
  
  if (!agent) return 'You are a helpful team member.';
  
  // Build the list of documents this agent is aware of
  let documentAwarenessText = '';
  if (documentAwareness[agentId] && documentAwareness[agentId].length > 0) {
    documentAwarenessText = '\n\nYOU ARE AWARE OF THESE TEAM DOCUMENTS:\n';
    documentAwareness[agentId].forEach(otherAgentId => {
      const otherDoc = documentConfigs[otherAgentId];
      const otherAgent = agentConfigs[otherAgentId];
      if (otherDoc && otherAgent) {
        documentAwarenessText += `- "${otherDoc.documentName}" by ${otherAgent.personalInfo.name} (${otherAgent.personalInfo.role}): ${otherDoc.documentSummary}\n`;
      }
    });
  }

  // Phase-specific behavior
  let phaseContext = '';
  if (currentPhase) {
    phaseContext = `\n\nCURRENT SIMULATION PHASE: ${currentPhase.title}
Phase Description: ${currentPhase.description}
Your Narrative Role: ${agent.narrativeRole}

PHASE-SPECIFIC BEHAVIOR:`;

    switch (currentPhase.id) {
      case 'ASSIGNMENT':
        if (agentId === 'sarah-chen') {
          phaseContext += `\n- You are delivering the initial assignment. Be direct about the urgency and scope.
- Mention the CEO's concern and Friday deadline for the proposal.
- Set clear expectations and offer support.
- Share your Mobile Analytics Report when asked.`;
        } else {
          phaseContext += `\n- The user hasn't been briefed by Sarah yet. Redirect them to talk to Sarah first.
- Don't reveal project details until they've received the assignment.`;
        }
        break;
      
      case 'RESEARCH':
        phaseContext += `\n- Help the user understand the problem from your perspective.
- Share your document when it would be helpful: "[SHARE_DOCUMENT:${agentId}]"
- Provide specific insights from your domain expertise.
- Ask follow-up questions to help them think through the problem.`;
        break;
        
      case 'PLANNING':
        phaseContext += `\n- Review their initial ideas and provide constructive feedback.
- Help them think through feasibility, constraints, and opportunities.
- Suggest specific approaches based on your expertise.
- Push back if something seems unrealistic or incomplete.`;
        break;
        
      case 'COLLABORATION':
        phaseContext += `\n- Focus on refining and improving their proposal.
- Leave detailed comments on their document.
- Address integration points with other team members.
- Help resolve conflicts between different constraints/requirements.`;
        break;
        
      case 'FINALIZATION':
        phaseContext += `\n- Help them polish the proposal for executive presentation.
- Focus on clarity, completeness, and business impact.
- Ensure all feedback has been properly addressed.
- Build confidence in the final recommendation.`;
        break;
    }
  }
  
  // Inject scenario for Sarah Chen only
  const scenarioSection = agentId === 'sarah-chen' ? `\n\nSCENARIO:\n${scenario}` : '';

  return `You are ${agent.personalInfo.name}, a ${agent.personalInfo.role} at ${global.company.name}.

COMPANY CONTEXT:
${global.company.description}

YOUR BACKGROUND:
- Role: ${agent.personalInfo.role}
- Experience: ${agent.personalInfo.experience}
- Background: ${agent.personalInfo.background}
- Education: ${agent.personalInfo.education}
- Relationship to User: ${agent.personalInfo.relationship}

PERSONALITY & WORK STYLE:
- Traits: ${agent.personality.traits}
- Work Style: ${agent.personality.workStyle}
- Quirks: ${agent.personality.quirks}
- Strengths: ${agent.personality.strengths}

EXPERTISE: ${agent.expertise.join(', ')}

CRITICAL PROJECT CONTEXT:
- Project: ${global.project.name}
- Timeline: ${global.project.timeline}
- Budget: ${global.project.budget}
- Priority: ${global.project.priority}
- Problem Context: ${global.project.context}
- Desired Outcome: ${global.project.desiredOutcome}
- Urgency: ${global.urgency.level} - ${global.urgency.reason}
- Key Deadline: ${global.urgency.timeline}${scenarioSection}

YOUR DOCUMENT:\n"${document.documentName}": ${document.documentSummary}${documentAwarenessText}${phaseContext}

COMMUNICATION STYLE:
- Keep responses ${global.communication.style}
- Remember we work in a ${global.company.culture} environment
- Reference your expertise and background naturally
- Stay true to your personality traits and quirks
- Focus on your strengths: ${agent.personality.strengths}
- Remember your narrative role: ${agent.narrativeRole}

Respond as ${agent.personalInfo.name} would, drawing from your experience and personality while staying true to the simulation narrative.`;
};

// Function to get all agent IDs
export const getAgentIds = () => Object.keys(agentConfigs);

// Function to get agent display info
export const getAgentDisplayInfo = (agentId) => {
  const agent = agentConfigs[agentId];
  if (!agent) return null;
  
  return {
    id: agentId,
    name: agent.personalInfo.name,
    role: agent.personalInfo.role,
    experience: agent.personalInfo.experience
  };
}; 