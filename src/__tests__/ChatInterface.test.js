import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInterface } from '../components/ChatInterface';
import { sendMessageToAPI } from '../services/api';

// Mock the API service
jest.mock('../services/api', () => ({
  sendMessageToAPI: jest.fn()
}));

describe('ChatInterface', () => {
  const mockContacts = [
    {
      id: 'sarah-chen',
      name: 'Sarah Chen',
      role: 'VP of Product',
      status: 'online'
    }
  ];

  const defaultProps = {
    selectedContact: 'sarah-chen',
    isLoadingResponse: false,
    currentMessage: '',
    setCurrentMessage: jest.fn(),
    chatMessages: {
      'sarah-chen': [
        {
          sender: 'Sarah Chen',
          message: 'Hi! How can I help you?',
          time: '10:30 AM',
          isUser: false
        }
      ]
    },
    chatEndRef: { current: null },
    messageInputRef: { current: null },
    sendMessage: jest.fn(),
    contacts: mockContacts,
    isMobile: false,
    isSidebarOpen: false,
    setIsSidebarOpen: jest.fn(),
    onSelectContact: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays initial message from agent', () => {
    render(<ChatInterface {...defaultProps} />);
    expect(screen.getByText('Hi! How can I help you?')).toBeInTheDocument();
  });

  test('sends message and receives response from agent', async () => {
    const mockResponse = "I understand you're working on the mobile checkout project.";
    sendMessageToAPI.mockResolvedValueOnce(mockResponse);

    render(<ChatInterface {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('TYPE MESSAGE...');
    const sendButton = screen.getByText('➤');

    await userEvent.type(input, 'Hello Sarah!');
    fireEvent.click(sendButton);

    expect(defaultProps.sendMessage).toHaveBeenCalled();
  });

  test('shows loading state while waiting for agent response', async () => {
    render(<ChatInterface {...defaultProps} isLoadingResponse={true} />);
    expect(screen.getByText('SARAH CHEN IS TYPING...')).toBeInTheDocument();
  });

  test('disables input while waiting for response', () => {
    render(<ChatInterface {...defaultProps} isLoadingResponse={true} />);
    const input = screen.getByPlaceholderText('WAITING...');
    expect(input).toBeDisabled();
  });
}); 