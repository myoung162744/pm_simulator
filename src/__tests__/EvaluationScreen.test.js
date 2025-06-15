import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EvaluationScreen } from '../components/EvaluationScreen';
import { sendMessageToAPI } from '../services/api';

// Mock the API service
jest.mock('../services/api', () => ({
  sendMessageToAPI: jest.fn()
}));

describe('EvaluationScreen', () => {
  const mockDocumentContent = `
    # Mobile Checkout Optimization Proposal
    
    ## Problem Statement
    Our mobile checkout abandonment rate is 78%, compared to 65% on desktop.
    
    ## Proposed Solution
    1. Implement one-click checkout
    2. Add guest checkout option
    3. Optimize form fields
  `;

  const mockEvaluation = {
    overallEvaluation: {
      overall_score: 85,
      strengths: "Clear problem statement and actionable solutions",
      areas_for_improvement: "Could use more technical details"
    },
    categoriesEvaluation: {
      problem_understanding: 90,
      solution_quality: 85,
      technical_feasibility: 80,
      business_impact: 85
    },
    leadershipFeedback: {
      what_went_well: "Strong focus on user experience and business impact",
      growth_opportunities: "Could provide more technical implementation details",
      next_steps: "Schedule technical review with engineering team"
    },
    readinessForPresentation: {
      ready: true,
      confidence_level: "High",
      key_talking_points: ["Clear problem statement", "Actionable solutions"],
      potential_questions: ["Technical implementation timeline?", "Resource requirements?"]
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    sendMessageToAPI
      .mockResolvedValueOnce(JSON.stringify(mockEvaluation.overallEvaluation))
      .mockResolvedValueOnce(JSON.stringify(mockEvaluation.categoriesEvaluation))
      .mockResolvedValueOnce(JSON.stringify(mockEvaluation.leadershipFeedback))
      .mockResolvedValueOnce(JSON.stringify(mockEvaluation.readinessForPresentation));
  });

  test('generates evaluation when submitted', async () => {
    render(<EvaluationScreen documentContent={mockDocumentContent} />);
    
    const submitButton = screen.getByText('Submit for Evaluation');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Overall Score: 85')).toBeInTheDocument();
      expect(screen.getByText('Clear problem statement and actionable solutions')).toBeInTheDocument();
    });
  });

  test('displays all evaluation sections', async () => {
    render(<EvaluationScreen documentContent={mockDocumentContent} />);
    
    const submitButton = screen.getByText('Submit for Evaluation');
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Check overall evaluation
      expect(screen.getByText('Overall Score: 85')).toBeInTheDocument();
      
      // Check categories
      expect(screen.getByText('Problem Understanding: 90')).toBeInTheDocument();
      expect(screen.getByText('Solution Quality: 85')).toBeInTheDocument();
      
      // Check leadership feedback
      expect(screen.getByText('What Went Well')).toBeInTheDocument();
      expect(screen.getByText('Strong focus on user experience and business impact')).toBeInTheDocument();
      
      // Check readiness
      expect(screen.getByText('Ready for Presentation: Yes')).toBeInTheDocument();
      expect(screen.getByText('Confidence Level: High')).toBeInTheDocument();
    });
  });

  test('handles evaluation generation error', async () => {
    sendMessageToAPI.mockRejectedValueOnce(new Error('Failed to generate evaluation'));

    render(<EvaluationScreen documentContent={mockDocumentContent} />);
    
    const submitButton = screen.getByText('Submit for Evaluation');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error generating evaluation. Please try again.')).toBeInTheDocument();
    });
  });

  test('shows loading state during evaluation', async () => {
    render(<EvaluationScreen documentContent={mockDocumentContent} />);
    
    const submitButton = screen.getByText('Submit for Evaluation');
    fireEvent.click(submitButton);

    expect(screen.getByText('Generating Evaluation...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
}); 