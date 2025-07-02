import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PortfolioPage } from '../components/PortfolioPage';

// Mock the clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe('PortfolioPage', () => {
  const mockDocumentContent = `# My Test Proposal

## Problem Statement
Test problem statement

## Solution
Test solution content`;

  const mockOnContinue = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders portfolio page with correct title', () => {
    render(<PortfolioPage documentContent={mockDocumentContent} onContinue={mockOnContinue} />);
    
    expect(screen.getByText('📁 ADD TO PORTFOLIO')).toBeInTheDocument();
    expect(screen.getByText('Great work! Your proposal is ready to add to your portfolio.')).toBeInTheDocument();
  });

  test('displays copy button and finish button', () => {
    render(<PortfolioPage documentContent={mockDocumentContent} onContinue={mockOnContinue} />);
    
    expect(screen.getByText('📋 COPY TO CLIPBOARD')).toBeInTheDocument();
    expect(screen.getByText('🎉 FINISH')).toBeInTheDocument();
  });

  test('shows portfolio content preview', () => {
    render(<PortfolioPage documentContent={mockDocumentContent} onContinue={mockOnContinue} />);
    
    expect(screen.getByText('📄 PORTFOLIO CONTENT PREVIEW')).toBeInTheDocument();
    expect(screen.getByText(/Product Management Case Study: Mobile Checkout Optimization/)).toBeInTheDocument();
  });

  test('calls onContinue when finish button is clicked', () => {
    render(<PortfolioPage documentContent={mockDocumentContent} onContinue={mockOnContinue} />);
    
    const finishButton = screen.getByText('🎉 FINISH');
    fireEvent.click(finishButton);
    
    expect(mockOnContinue).toHaveBeenCalledTimes(1);
  });

  test('copies content to clipboard when copy button is clicked', async () => {
    navigator.clipboard.writeText.mockResolvedValueOnce();
    
    render(<PortfolioPage documentContent={mockDocumentContent} onContinue={mockOnContinue} />);
    
    const copyButton = screen.getByText('📋 COPY TO CLIPBOARD');
    fireEvent.click(copyButton);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    
    await waitFor(() => {
      expect(screen.getByText('✓ COPIED!')).toBeInTheDocument();
    });
  });

  test('shows portfolio tips section', () => {
    render(<PortfolioPage documentContent={mockDocumentContent} onContinue={mockOnContinue} />);
    
    expect(screen.getByText('💡 PORTFOLIO TIPS')).toBeInTheDocument();
    expect(screen.getByText(/Add this to your LinkedIn or personal website/)).toBeInTheDocument();
    expect(screen.getByText(/Include it in your PM portfolio or case study collection/)).toBeInTheDocument();
  });

  test('handles empty document content gracefully', () => {
    render(<PortfolioPage documentContent="" onContinue={mockOnContinue} />);
    
    expect(screen.getByText(/No proposal content available/)).toBeInTheDocument();
  });
}); 