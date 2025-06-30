# StudyHal - Claude PM Simulator

A retro game-styled product management simulation application where users can interact with AI team members, collaborate on documents, and manage product requirements.

## 🎮 Features

- **AI Team Chat**: Interact with 5 distinct AI team members (PM, Developer, Designer, Analyst, Marketing)
- **Document Collaboration**: Write and get AI feedback on product requirements documents
- **Inbox System**: Receive and view shared documents from team members
- **Strict Data Mode**: Toggle between creative and data-focused AI responses
- **Responsive Design**: Works on desktop and mobile devices
- **Retro Game Boy Aesthetic**: Complete pixel-art themed UI with authentic colors and fonts
- **Company Context Integration**: All agents have comprehensive knowledge of ShopSphere company details

## 🏗 Architecture

### Component Structure

```
src/
├── index.js                 # Entry point with routing
├── StudyHal.js             # Main application component
├── index.css               # Global styles with Game Boy theme
├── companyConfig.js        # Centralized company context configuration
├── promptConfig.js         # AI agent configurations
├── phaseConfig.js          # Simulation phase management
│
├── components/
│   ├── Header.js           # Top navigation bar
│   ├── TabNavigation.js    # Tab switcher (Chat/Docs/Inbox)
│   ├── ChatInterface.js    # Team chat interface
│   ├── ContactsList.js     # Team member sidebar
│   ├── DocumentInterface.js # Document editor with comments
│   ├── InboxInterface.js   # Shared documents viewer
│   ├── ProjectOverview.js  # Landing page
│   ├── ProjectDetails.js   # Project info component
│   └── EvaluationScreen.js # Performance evaluation component
│
├── hooks/
│   ├── useChat.js          # Chat state management
│   ├── useComments.js      # Document comments logic
│   └── useResponsive.js    # Responsive design utilities
│
└── services/
    ├── api.js              # API integration layer
    └── commentsService.js  # AI comment generation

```

### Company Context Integration

The application includes comprehensive ShopSphere company context that is shared across all AI agents and document review processes:

- **Centralized Configuration**: Company details stored in `src/companyConfig.js`
- **Agent Knowledge**: All team members have access to company metrics, technology stack, and operational context
- **Document Review**: Company context included in all document feedback and evaluation processes
- **Consistent Context**: Ensures all AI interactions maintain company-specific knowledge and terminology

**ShopSphere Company Details**:
- E-commerce marketplace valued at $2B with 350 employees
- $3.2B GMV, $445M revenue, 15.2M active buyers
- SphereMatch AI recommendation engine (94% accuracy)
- Bi-weekly sprints, quarterly OKRs, A/B testing required
- North America and 12 European countries

### Key Technologies

- **React 18**: Component-based UI framework
- **React Router**: Client-side routing
- **Custom CSS**: Game Boy-inspired design system
- **AI Integration**: Claude API for intelligent responses

## 🎨 Design System

### Color Palette
- **Beige tones**: `#f8f4ec`, `#e6d8c0`, `#d0c2a0`, `#b8a678`
- **Accent colors**: Blue `#3d5a96`, Red `#b83c3c`, Yellow `#f0c537`
- **Text**: Dark `#2d2d2d`, Medium `#5a5a5a`, Light `#8a8a8a`

### Typography
- **UI Elements**: Press Start 2P (pixel font)
- **Body Text**: JetBrains Mono (readable monospace)

### Components
- **pokemon-button**: Retro-styled buttons with hover states
- **pokemon-textbox**: Input fields and content boxes
- **pokemon-panel**: Container panels with borders

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm start
   ```

3. **Navigate to**:
   - `/` - Project overview page
   - `/study` - Main application

## 🛠 Development

### Adding New Components
Components follow a consistent pattern:
```jsx
export const ComponentName = ({ props }) => {
  return (
    <div className="pokemon-panel">
      {/* Component content */}
    </div>
  );
};
```

### Styling Guidelines
- Use CSS variables for consistent spacing and colors
- Apply `pokemon-*` classes for Game Boy aesthetic
- Use `var(--font-pixel)` for UI text, `var(--font-mono)` for content

### AI Agent Configuration
Agents are configured in `promptConfig.js` and automatically receive company context:
```javascript
import { shopSphereCompany } from './companyConfig';

export const agentConfigs = {
  'agent-id': {
    systemPrompt: "Agent personality and expertise",
    knowledgeBase: ["Key facts", "Domain knowledge"],
    traits: ["Personality traits"],
    documentPath: "/documents/agent_document.md"
  }
};
```

### Company Context Usage
To use company context in new components or services:
```javascript
import { getCompanyContext, getCompanyContextForReviews } from './companyConfig';

// For agent prompts
const companyContext = getCompanyContext();

// For document reviews
const reviewContext = getCompanyContextForReviews();
```

## 📝 License

MIT License - feel free to use this project for your own purposes. 
