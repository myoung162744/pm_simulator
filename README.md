# StudyHal - Claude PM Simulator

A retro game-styled product management simulation application where users can interact with AI team members, collaborate on documents, and manage product requirements.

## 🎮 Features

- **AI Team Chat**: Interact with 5 distinct AI team members (PM, Developer, Designer, Analyst, Marketing)
- **Document Collaboration**: Write and get AI feedback on product requirements documents
- **Inbox System**: Receive and view shared documents from team members
- **Strict Data Mode**: Toggle between creative and data-focused AI responses
- **Responsive Design**: Works on desktop and mobile devices
- **Retro Game Boy Aesthetic**: Complete pixel-art themed UI with authentic colors and fonts

## 🏗 Architecture

### Component Structure

```
src/
├── index.js                 # Entry point with routing
├── StudyHal.js             # Main application component
├── index.css               # Global styles with Game Boy theme
├── promptConfig.js         # AI agent configurations
│
├── components/
│   ├── Header.js           # Top navigation bar
│   ├── TabNavigation.js    # Tab switcher (Chat/Docs/Inbox)
│   ├── ChatInterface.js    # Team chat interface
│   ├── ContactsList.js     # Team member sidebar
│   ├── DocumentInterface.js # Document editor with comments
│   ├── InboxInterface.js   # Shared documents viewer
│   ├── ProjectOverview.js  # Landing page
│   └── ProjectDetails.js   # Project info component
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
Agents are configured in `promptConfig.js`:
```javascript
export const agentConfigs = {
  'agent-id': {
    systemPrompt: "Agent personality and expertise",
    knowledgeBase: ["Key facts", "Domain knowledge"],
    traits: ["Personality traits"],
    documentPath: "/documents/agent_document.md"
  }
};
```

## 📝 License

MIT License - feel free to use this project for your own purposes. 
