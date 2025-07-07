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
          message: 'Hi! I wanted to discuss the critical mobile checkout optimization project I assigned you. The CEO is particularly interested in improving our conversion rates. How are you thinking about approaching this?',
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
    expect(screen.getByText(/Hi! I wanted to discuss the critical mobile checkout optimization project/)).toBeInTheDocument();
  });

  test('displays contact name in header', () => {
    render(<ChatInterface {...defaultProps} />);
    // Use getAllByText to get all instances and check that at least one exists
    const nameElements = screen.getAllByText('SARAH CHEN');
    expect(nameElements.length).toBeGreaterThan(0);
  });

  test('displays contact role in header', () => {
    render(<ChatInterface {...defaultProps} />);
    // Use getAllByText to get all instances and check that at least one exists
    const roleElements = screen.getAllByText('VP OF PRODUCT');
    expect(roleElements.length).toBeGreaterThan(0);
  });

  test('shows loading state while waiting for agent response', () => {
    render(<ChatInterface {...defaultProps} isLoadingResponse={true} />);
    expect(screen.getByText('SARAH CHEN IS TYPING...')).toBeInTheDocument();
  });

  test('disables input while waiting for response', () => {
    render(<ChatInterface {...defaultProps} isLoadingResponse={true} />);
    const input = screen.getByPlaceholderText('WAITING...');
    expect(input).toBeDisabled();
  });

  test('enables input when not loading', () => {
    render(<ChatInterface {...defaultProps} isLoadingResponse={false} />);
    const input = screen.getByPlaceholderText('TYPE MESSAGE...');
    expect(input).not.toBeDisabled();
  });

  test('calls setCurrentMessage when input changes', async () => {
    render(<ChatInterface {...defaultProps} />);
    const input = screen.getByPlaceholderText('TYPE MESSAGE...');
    
    await userEvent.type(input, 'Hello');
    
    expect(defaultProps.setCurrentMessage).toHaveBeenCalled();
  });

  test('calls sendMessage when send button is clicked', async () => {
    render(<ChatInterface {...defaultProps} currentMessage="Test message" />);
    const sendButton = screen.getByText('➤');
    
    await userEvent.click(sendButton);
    
    expect(defaultProps.sendMessage).toHaveBeenCalled();
  });

  test('send button is disabled when message is empty', () => {
    render(<ChatInterface {...defaultProps} currentMessage="" />);
    const sendButton = screen.getByText('➤');
    expect(sendButton).toBeDisabled();
  });

  test('send button is enabled when message has content', () => {
    render(<ChatInterface {...defaultProps} currentMessage="Test message" />);
    const sendButton = screen.getByText('➤');
    expect(sendButton).not.toBeDisabled();
  });
}); 