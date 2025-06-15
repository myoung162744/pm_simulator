import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useComments } from '../hooks/useComments';
import { generateCommentsFromAPI } from '../services/commentsService';

// Mock the comments service
jest.mock('../services/commentsService', () => ({
  generateCommentsFromAPI: jest.fn()
}));

// Test component to use the hook
const TestComponent = ({ documentContent, contacts, getAgentPrompt }) => {
  const { comments, generateComments, isGeneratingComments } = useComments(
    documentContent,
    contacts,
    getAgentPrompt
  );

  return (
    <div>
      <button onClick={generateComments} disabled={isGeneratingComments}>
        Get Feedback
      </button>
      {isGeneratingComments && <div>Generating comments...</div>}
      <div data-testid="comments">
        {comments.map((comment, index) => (
          <div key={index}>
            <p>{comment.text}</p>
            <p>By: {comment.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

describe('Comments Functionality', () => {
  const mockDocumentContent = 'This is a test document content for the mobile checkout project.';
  const mockContacts = [
    {
      id: 'sarah-chen',
      name: 'Sarah Chen',
      role: 'VP of Product',
      status: 'online'
    }
  ];
  const mockGetAgentPrompt = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('generates comments when Get Feedback button is clicked', async () => {
    const mockComments = [
      {
        text: 'Consider adding more details about the mobile payment flow.',
        author: 'Sarah Chen',
        textExcerpt: 'mobile checkout project',
        textPosition: 0,
        textLength: 0,
        perspective: 'Product',
        resolved: false
      }
    ];

    generateCommentsFromAPI.mockResolvedValueOnce(mockComments);

    render(
      <TestComponent
        documentContent={mockDocumentContent}
        contacts={mockContacts}
        getAgentPrompt={mockGetAgentPrompt}
      />
    );

    const button = screen.getByText('Get Feedback');
    fireEvent.click(button);

    expect(screen.getByText('Generating comments...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Consider adding more details about the mobile payment flow.')).toBeInTheDocument();
      expect(screen.getByText('By: Sarah Chen')).toBeInTheDocument();
    });
  });

  test('handles error when generating comments fails', async () => {
    generateCommentsFromAPI.mockRejectedValueOnce(new Error('Failed to generate comments'));

    render(
      <TestComponent
        documentContent={mockDocumentContent}
        contacts={mockContacts}
        getAgentPrompt={mockGetAgentPrompt}
      />
    );

    const button = screen.getByText('Get Feedback');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Sorry, there was an error generating comments. Please try again.')).toBeInTheDocument();
    });
  });

  test('disables button while generating comments', async () => {
    render(
      <TestComponent
        documentContent={mockDocumentContent}
        contacts={mockContacts}
        getAgentPrompt={mockGetAgentPrompt}
      />
    );

    const button = screen.getByText('Get Feedback');
    fireEvent.click(button);

    expect(button).toBeDisabled();
  });
}); 