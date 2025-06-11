// Phase Configuration for Narrative-Driven Simulation
export const simulationConfig = {
  title: "Product Management Simulation: Mobile Checkout Optimization",
  company: {
    name: "ShopSphere",
    valuation: "$2B",
    type: "Mid-sized e-commerce marketplace"
  },
  userRole: {
    title: "Senior Product Manager",
    team: "Mobile Experience Team",
    manager: "Sarah Chen (VP of Product)"
  }
};

export const phases = {
  ASSIGNMENT: {
    id: 'ASSIGNMENT',
    title: 'Task Assignment',
    subtitle: 'Receiving Your Mission',
    description: 'Your manager has assigned you a critical project. Review the initial task and understand the scope.',
    objectives: [
      'Read the initial task assignment from your manager',
      'Understand the problem scope and urgency',
      'Acknowledge the assignment and ask clarifying questions'
    ],
    estimatedTime: '5-10 minutes',
    icon: '📧'
  },
  RESEARCH: {
    id: 'RESEARCH',
    title: 'Information Gathering',
    subtitle: 'Understanding the Problem',
    description: 'Review available documents and gather insights from your team members to understand the full scope of the mobile checkout problem.',
    objectives: [
      'Review documents from your inbox (suggestions)',
      'Chat with team members to gather their perspectives',
      'Identify key metrics and pain points',
      'Understand technical constraints and user needs'
    ],
    estimatedTime: '15-20 minutes',
    icon: '🔍'
  },
  PLANNING: {
    id: 'PLANNING',
    title: 'Solution Planning',
    subtitle: 'Crafting Your Strategy',
    description: 'Based on your research, start drafting your solution proposal. Collaborate with team members to refine your approach.',
    objectives: [
      'Create initial solution outline in the document editor',
      'Get feedback from team members on your approach',
      'Prioritize features and define success metrics',
      'Address feasibility concerns and constraints'
    ],
    estimatedTime: '20-25 minutes',
    icon: '📝'
  },
  COLLABORATION: {
    id: 'COLLABORATION',
    title: 'Team Collaboration',
    subtitle: 'Refining Through Feedback',
    description: 'Work with your team to refine your proposal. Address concerns, incorporate suggestions, and build consensus.',
    objectives: [
      'Respond to document comments from team members',
      'Revise proposal based on feedback',
      'Ensure technical feasibility with engineering',
      'Validate design approach with UX team',
      'Confirm metrics and success criteria'
    ],
    estimatedTime: '15-20 minutes',
    icon: '🤝'
  },
  FINALIZATION: {
    id: 'FINALIZATION',
    title: 'Final Submission',
    subtitle: 'Delivering Your Solution',
    description: 'Complete your final proposal and submit it for leadership review. Ensure all requirements are met.',
    objectives: [
      'Finalize all sections of your proposal',
      'Ensure all feedback has been addressed',
      'Submit final proposal to your manager',
      'Confirm readiness for leadership presentation'
    ],
    estimatedTime: '10-15 minutes',
    icon: '🎯'
  },
  EVALUATION: {
    id: 'EVALUATION',
    title: 'Performance Review',
    subtitle: 'Your Results',
    description: 'Review your comprehensive performance evaluation with detailed feedback from leadership.',
    objectives: [
      'Review your overall score and grade',
      'Understand strengths and improvement areas',
      'Read leadership feedback and next steps',
      'Assess presentation readiness'
    ],
    estimatedTime: '5-10 minutes',
    icon: '📊'
  }
};

// Phase progression logic
export class PhaseManager {
  constructor() {
    this.currentPhase = 'ASSIGNMENT';
    this.phaseStartTimes = {};
    this.phaseStartTimes[this.currentPhase] = Date.now();
  }

  getCurrentPhase() {
    return phases[this.currentPhase];
  }

  advanceToNextPhase() {
    const phaseOrder = ['ASSIGNMENT', 'RESEARCH', 'PLANNING', 'COLLABORATION', 'FINALIZATION', 'EVALUATION'];
    const currentIndex = phaseOrder.indexOf(this.currentPhase);
    
    if (currentIndex < phaseOrder.length - 1) {
      this.currentPhase = phaseOrder[currentIndex + 1];
      this.phaseStartTimes[this.currentPhase] = Date.now();
      return true;
    }
    
    return false; // Simulation complete
  }

  canManuallyAdvancePhase() {
    const phaseOrder = ['ASSIGNMENT', 'RESEARCH', 'PLANNING', 'COLLABORATION', 'FINALIZATION', 'EVALUATION'];
    const currentIndex = phaseOrder.indexOf(this.currentPhase);
    
    // Only allow manual advancement for ASSIGNMENT, RESEARCH, and COLLABORATION phases
    // PLANNING and FINALIZATION require document submission via "Get Feedback" button
    // EVALUATION cannot be advanced (it's the final phase)
    const phasesWithManualAdvancement = ['ASSIGNMENT', 'RESEARCH', 'COLLABORATION'];
    
    return currentIndex < phaseOrder.length - 1 && phasesWithManualAdvancement.includes(this.currentPhase);
  }

  getAdvancementRequirements() {
    const phaseOrder = ['ASSIGNMENT', 'RESEARCH', 'PLANNING', 'COLLABORATION', 'FINALIZATION', 'EVALUATION'];
    const currentIndex = phaseOrder.indexOf(this.currentPhase);
    
    if (currentIndex >= phaseOrder.length - 1) {
      return { canAdvance: false, reason: 'Simulation complete' };
    }
    
    if (this.currentPhase === 'PLANNING' || this.currentPhase === 'FINALIZATION') {
      return { canAdvance: false, reason: 'Submit document for review to advance' };
    }
    
    return { canAdvance: true, reason: 'Ready to advance when you are' };
  }

  forceAdvancePhase() {
    return this.advanceToNextPhase();
  }

  getOverallProgress() {
    const totalPhases = Object.keys(phases).length;
    const phaseOrder = ['ASSIGNMENT', 'RESEARCH', 'PLANNING', 'COLLABORATION', 'FINALIZATION', 'EVALUATION'];
    const currentIndex = phaseOrder.indexOf(this.currentPhase);
    
    return {
      currentPhase: currentIndex + 1,
      totalPhases: totalPhases,
      percentage: Math.round(((currentIndex + 1) / totalPhases) * 100)
    };
  }

  getTimeSpentInPhase(phaseId = null) {
    const targetPhase = phaseId || this.currentPhase;
    const startTime = this.phaseStartTimes[targetPhase];
    
    if (!startTime) return 0;
    
    return Math.round((Date.now() - startTime) / 1000); // Return seconds
  }

  isSimulationComplete() {
    return this.currentPhase === 'EVALUATION';
  }

  isEvaluationPhase() {
    return this.currentPhase === 'EVALUATION';
  }

  moveToEvaluation() {
    if (this.currentPhase === 'FINALIZATION') {
      this.currentPhase = 'EVALUATION';
      this.phaseStartTimes[this.currentPhase] = Date.now();
      return true;
    }
    return false;
  }
}

// Initial context for the simulation
export const initialContext = {
  problem: {
    title: "Mobile Checkout Abandonment Crisis",
    urgency: "HIGH",
    metrics: {
      current: "78% mobile abandonment rate",
      target: "65% or lower (matching desktop)",
      impact: "$2.4M monthly revenue at risk"
    },
    timeline: "Solution needed by Q2",
    stakeholders: ["CEO", "VP Product", "Mobile Team", "Engineering", "UX"]
  },
  documents: [
    {
      id: 'mobile-analytics',
      title: 'Mobile Analytics Report Q4',
      type: 'report',
      priority: 'high',
      description: 'Checkout funnel analysis showing 45% drop at shipping address, 30% at payment'
    },
    {
      id: 'user-research',
      title: 'User Research Summary',
      type: 'research',
      priority: 'high',
      description: '20 user interviews revealing top pain points and user quotes'
    },
    {
      id: 'technical-architecture',
      title: 'Technical Architecture Overview',
      type: 'technical',
      priority: 'medium',
      description: 'Current system making 8 API calls vs 4 on desktop, SDK issues'
    },
    {
      id: 'competitive-analysis',
      title: 'Competitive Benchmark Analysis',
      type: 'market',
      priority: 'medium',
      description: 'Amazon 55%, Target 48% completion rates vs our performance'
    },
    {
      id: 'support-tickets',
      title: 'Customer Support Tickets Export',
      type: 'data',
      priority: 'low',
      description: 'Top issues: address editing, payment freezes, Apple Pay requests'
    }
  ]
};

export default { phases, PhaseManager, simulationConfig, initialContext }; 