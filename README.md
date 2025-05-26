# StudyHal - PM Simulator

A Product Manager simulation app with Claude AI integration that lets you practice PM skills by chatting with AI-powered team members and collaborating on documents with interactive feedback.

## 🚀 Features

### 💬 **AI-Powered Team Chat**
- **5 Unique Team Members**: Chat with AI personalities powered by Claude, each with distinct expertise and communication styles
- **Real-time Conversations**: Natural chat interface with typing indicators and message history
- **Role-Based Responses**: Each team member responds from their professional perspective
- **Responsive Design**: Seamless experience on desktop and mobile devices

### 📋 **Interactive Document Collaboration**
- **PRD Editor**: Write and edit Product Requirements Documents
- **AI-Generated Comments**: Get feedback from multiple team members on specific text sections
- **Interactive Highlighting**: Click on highlighted text to see corresponding comments, and vice versa
- **Visual Connections**: Clear visual feedback showing which comments relate to which document sections
- **Multi-Round Reviews**: Generate additional feedback rounds to refine your documents

### 🏗️ **Modern Architecture**
- **Modular Component Structure**: Clean separation of concerns with custom hooks and services
- **Responsive UI**: Mobile-first design with collapsible sidebar and touch-friendly controls
- **Real-time State Management**: Efficient handling of chat history, comments, and document state

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- An Anthropic API key for Claude

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/myoung162744/pm_simulator.git
   cd pm_simulator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

### Running the Application

Start both servers (backend and frontend):

1. **Start the backend server** (in one terminal):
   ```bash
   npm run server
   ```
   This starts the Express server on http://localhost:4000

2. **Start the frontend** (in another terminal):
   ```bash
   npm start
   ```
   This starts the React app on http://localhost:3000

3. **Open your browser** and go to http://localhost:3000

## 🎭 Meet Your Team

The simulator includes 5 AI-powered team members from **InnovateTech Solutions**:

- **👩‍💼 Sarah Chen** - Product Manager
  - *Collaborative, user-focused, data-driven strategic thinker*
  
- **👨‍💻 Mike Rodriguez** - Senior Developer  
  - *Technical expert, practical problem-solver, architecture-focused*
  
- **👩‍🎨 Lisa Kim** - UX Designer
  - *Creative, user-experience advocate, design-thinking specialist*
  
- **📊 Alex Thompson** - Data Analyst
  - *Analytical, metrics-driven, evidence-based decision maker*
  
- **📈 Jen Wilson** - Marketing Lead
  - *Strategic, growth-focused, market-oriented communicator*

## 💬 Chat Interface

### How to Chat
1. **Select a team member** from the sidebar (shows online status)
2. **Type your message** in the input field
3. **Send** by pressing Enter or clicking the send button
4. **Watch for typing indicators** as the AI responds
5. **Continue naturally** - the AI maintains conversation context

### Example Conversations
- "What do you think about this new feature idea?"
- "How should we prioritize our roadmap for Q2?"
- "What metrics should we track for user engagement?"
- "Can you help me think through this technical approach?"
- "What are the market implications of this strategy?"

## 📋 Document Collaboration

### Writing & Editing
1. **Switch to Documents tab** to access the PRD editor
2. **Write your document** using the full-screen editor
3. **Use the draft interface** for iterative writing

### Getting AI Feedback
1. **Click "Get Feedback"** to generate AI-powered comments
2. **Review highlighted sections** - each highlight corresponds to a specific comment
3. **Click on highlights** to see the related comment in the sidebar
4. **Click on comments** to jump to the related text in the document
5. **Use visual connections** to understand feedback relationships

### Interactive Features
- **Smart Highlighting**: Text sections are automatically highlighted based on AI analysis
- **Click Navigation**: Seamless movement between document sections and comments
- **Visual Selection**: Selected comment-highlight pairs are visually emphasized
- **Multi-Perspective Reviews**: Each team member provides feedback from their expertise area
- **Comment Management**: Clear comments to return to edit mode or generate additional rounds

### Advanced Collaboration
- **Role-Based Feedback**: Comments reflect each team member's professional perspective
- **Contextual Analysis**: AI understands document structure and content relationships
- **Iterative Reviews**: Generate multiple rounds of feedback as you refine your PRD
- **Professional Standards**: Comments follow PM best practices and industry standards

## 🏗️ Architecture

### Project Structure
```
src/
├── components/           # React components
│   ├── Header.js        # App header with branding
│   ├── TabNavigation.js # Chat/Documents switcher
│   ├── ContactsList.js  # Team members sidebar
│   ├── ChatInterface.js # Complete chat functionality
│   └── DocumentInterface.js # Document editor & comments
├── hooks/               # Custom React hooks
│   ├── useResponsive.js # Mobile/desktop detection
│   ├── useChat.js       # Chat state management
│   └── useComments.js   # Comments functionality
├── services/            # API and business logic
│   ├── api.js          # Claude API interactions
│   └── commentsService.js # Comment generation
├── config/              # Configuration
│   └── promptConfig.js  # AI prompts and personas
└── StudyHal.js         # Main app component
```

### Backend
- **Express.js server** handling Claude API integration
- **Environment-based configuration** for API keys
- **CORS enabled** for local development
- **Error handling** and response formatting

### Frontend
- **React 18** with functional components and hooks
- **Tailwind CSS** for responsive styling
- **Modular architecture** with custom hooks and services
- **State management** using React hooks and context

## 🛠️ Technical Details

### API Endpoints
- **POST /api/claude** - Send messages to Claude AI
  ```json
  {
    "message": "Your message",
    "history": [...],
    "systemPrompt": "Agent personality",
    "characterName": "Team member name", 
    "characterRole": "Their role"
  }
  ```

### Configuration
- **Dynamic prompts** generated from `promptConfig.js`
- **Global variables** for company/project context
- **Personality-driven responses** for each team member
- **Contextual system prompts** for role-appropriate behavior

## 🔧 Scripts

- `npm start` - Start React development server (port 3000)
- `npm run server` - Start Express backend server (port 4000)
- `npm run dev` - Start backend with nodemon (auto-restart)
- `npm run build` - Build React app for production

## 🐛 Troubleshooting

### Common Issues
- **Port conflicts**: Kill existing processes with `lsof -ti:3000,4000 | xargs kill`
- **API errors**: Verify your `.env` file contains the correct Anthropic API key
- **Chat not working**: Ensure both servers are running
- **Comments not generating**: Check backend server logs for API errors

### Development Tips
- **Hot reload**: Frontend auto-refreshes on changes
- **Backend restart**: Use `npm run dev` for auto-restart on server changes
- **Browser console**: Check for JavaScript errors if UI isn't responding
- **Network tab**: Monitor API requests if chat seems slow

## 🎯 Learning Objectives

This simulator helps you practice:

### Product Management Skills
- **Cross-functional collaboration** with engineering, design, marketing, and data teams
- **Requirements gathering** and PRD writing
- **Stakeholder communication** across different functions
- **Data-driven decision making** with metrics and analytics input

### Professional Communication
- **Role-based discussions** with different team members
- **Technical feasibility** conversations with developers
- **User experience** considerations with designers
- **Market strategy** alignment with marketing

### Document Collaboration
- **Professional writing** for technical and business audiences
- **Iterative feedback incorporation** from multiple perspectives
- **Structured thinking** about product requirements
- **Industry best practices** for PM documentation

## 🌟 Recent Updates

### v2.0 - Interactive Collaboration
- ✨ **Interactive comment highlighting** with click navigation
- 🏗️ **Modular architecture** with custom hooks and services
- 📱 **Enhanced responsive design** for mobile users
- 🎨 **Visual feedback systems** for better user experience
- 🔄 **Improved state management** across components

### v1.0 - Core Features
- 💬 Multi-agent chat simulation
- 📋 Document collaboration system
- 🤖 Claude AI integration
- 🎭 Personality-driven responses

## 📝 License

MIT License - Feel free to modify and use for learning purposes!

---

**StudyHal** - Empowering the next generation of Product Managers through AI-powered simulation and practice. 