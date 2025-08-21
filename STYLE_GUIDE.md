# 🎨 StudyHal PM Simulator - Style Guide

*Last updated: December 2024*

## 📋 Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing System](#spacing-system)
5. [Component Library](#component-library)
6. [Layout Patterns](#layout-patterns)
7. [Interactive States](#interactive-states)
8. [Responsive Design](#responsive-design)
9. [Accessibility](#accessibility)
10. [Animation Guidelines](#animation-guidelines)
11. [Code Standards](#code-standards)

---

## 🎯 Design Philosophy

StudyHal PM Simulator embraces a **retro Game Boy aesthetic** that combines nostalgic pixel-art styling with modern usability. The design system prioritizes:

- **Authenticity**: True-to-era Game Boy color palette and typography
- **Readability**: High contrast and clear information hierarchy
- **Usability**: Modern interaction patterns with retro visual styling
- **Consistency**: Unified design language across all components
- **Accessibility**: WCAG 2.1 AA compliance with retro aesthetics

### Design Principles

1. **Pixel-Perfect**: Embrace the pixelated aesthetic while maintaining functionality
2. **High Contrast**: Ensure text and interactive elements are clearly visible
3. **Consistent Spacing**: Use the defined spacing system for all layouts
4. **Clear Hierarchy**: Use typography and color to establish information priority
5. **Responsive First**: Design for all screen sizes while maintaining the retro aesthetic

---

## 🎨 Color System

### Primary Palette (Game Boy Inspired)

```css
/* Beige Tones - Backgrounds and Panels */
--gb-light-beige: #f8f4ec;    /* Light backgrounds, hover states */
--gb-medium-beige: #e6d8c0;   /* Secondary backgrounds, headers */
--gb-dark-beige: #d0c2a0;     /* Panel backgrounds, borders */
--gb-darker-beige: #b8a678;   /* Shadows, disabled states */
--gb-cream: #fdfbf7;          /* Main background color */

/* Accent Colors */
--gb-blue: #3d5a96;           /* Primary actions, links */
--gb-red: #b83c3c;            /* Errors, warnings, status indicators */
--gb-yellow: #f0c537;         /* Secondary actions, highlights */

/* Neutral Colors */
--gb-white: #ffffff;          /* Content backgrounds, text on dark */
--gb-black: #1a1a1a;          /* Borders, primary text */
```

### Text Colors

```css
--gb-dark-text: #2d2d2d;      /* Primary text */
--gb-medium-text: #5a5a5a;    /* Secondary text */
--gb-light-text: #8a8a8a;     /* Muted text, placeholders */
```

### Usage Guidelines

- **Primary Text**: Use `--gb-dark-text` for main content
- **Secondary Text**: Use `--gb-medium-text` for labels and descriptions
- **Muted Text**: Use `--gb-light-text` for timestamps and metadata
- **Backgrounds**: Use beige tones for panels and containers
- **Accents**: Use blue for primary actions, yellow for secondary, red for warnings

---

## 📝 Typography

### Font Families

```css
/* UI Elements - Pixel Font */
--font-pixel: 'Press Start 2P', monospace;

/* Body Text - Readable Monospace */
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

### Font Sizes

#### Pixel Font (UI Elements)
```css
--pixel-xs: 8px;      /* Small labels, metadata */
--pixel-sm: 10px;     /* Button text, navigation */
--pixel-base: 12px;   /* Default UI text */
--pixel-lg: 14px;     /* Headers, important UI text */
```

#### Monospace Font (Content)
```css
--text-xs: 10px;      /* Small content, captions */
--text-sm: 12px;      /* Secondary content */
--text-base: 14px;    /* Default body text */
--text-lg: 16px;      /* Large body text */
--text-xl: 18px;      /* Subheadings */
--text-2xl: 20px;     /* Main headings */
```

### Typography Classes

```css
/* Font Family Utilities */
.font-pixel {
  font-family: var(--font-pixel);
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: unset;
  font-smooth: never;
}

.font-mono {
  font-family: var(--font-mono);
}

/* Text Color Utilities */
.text-primary { color: var(--gb-dark-text); }
.text-secondary { color: var(--gb-medium-text); }
.text-muted { color: var(--gb-light-text); }
```

### Usage Guidelines

- **UI Elements**: Always use pixel font for buttons, headers, navigation
- **Content**: Use monospace font for readable text, messages, documents
- **Font Smoothing**: Disable for pixel font, enable for monospace
- **Line Height**: Use 1.5-1.6 for optimal readability

---

## 📏 Spacing System

### Spacing Scale

```css
--spacing-xs: 4px;    /* Minimal spacing */
--spacing-sm: 8px;    /* Small gaps */
--spacing-md: 12px;   /* Default spacing */
--spacing-lg: 16px;   /* Large spacing */
--spacing-xl: 20px;   /* Extra large spacing */
--spacing-2xl: 24px;  /* Section spacing */
--spacing-3xl: 32px;  /* Major section spacing */
```

### Spacing Utilities

```css
/* Padding Utilities */
.p-xs { padding: var(--spacing-xs); }
.p-sm { padding: var(--spacing-sm); }
.p-md { padding: var(--spacing-md); }
.p-lg { padding: var(--spacing-lg); }
.p-xl { padding: var(--spacing-xl); }

/* Margin Utilities */
.m-xs { margin: var(--spacing-xs); }
.m-sm { margin: var(--spacing-sm); }
.m-md { margin: var(--spacing-md); }
.m-lg { margin: var(--spacing-lg); }
.m-xl { margin: var(--spacing-xl); }
```

### Usage Guidelines

- **Component Padding**: Use `--spacing-md` to `--spacing-lg` for component interiors
- **Section Spacing**: Use `--spacing-2xl` to `--spacing-3xl` between major sections
- **Element Gaps**: Use `--spacing-sm` to `--spacing-md` between related elements
- **Consistency**: Always use the spacing scale, avoid arbitrary values

---

## 🧩 Component Library

### Core Components

#### 1. Pokemon Button

```css
.pokemon-button {
  background-color: var(--gb-light-beige);
  border: 2px solid var(--gb-black);
  border-radius: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  font-family: var(--font-pixel);
  font-size: var(--pixel-sm);
  font-weight: normal;
  cursor: pointer;
  box-shadow: 1px 1px 0px var(--gb-darker-beige);
  transition: all 0.1s ease;
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--gb-dark-text);
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: unset;
  font-smooth: never;
}
```

**Variants:**
- `.pokemon-button--primary`: Blue background, white text
- `.pokemon-button--secondary`: Yellow background, dark text
- `.pokemon-button--danger`: Red background, white text

**States:**
- `:hover`: Lighter background, translate(1px, 1px), no shadow
- `:active`: Same as hover
- `:disabled`: Reduced opacity, darker background, not-allowed cursor

#### 2. Pokemon Panel

```css
.pokemon-panel {
  background-color: var(--gb-light-beige);
  border: 2px solid var(--gb-black);
  border-radius: var(--spacing-xs);
}
```

**Variants:**
- `.pokemon-panel--header`: Bottom border only, no border radius
- `.pokemon-panel--sidebar`: Right border only, no border radius
- `.pokemon-panel--content`: Full border with radius

#### 3. Pokemon Textbox

```css
.pokemon-textbox {
  background-color: var(--gb-white);
  border: 2px solid var(--gb-black);
  border-radius: var(--spacing-xs);
  padding: var(--spacing-md) var(--spacing-lg);
  font-family: var(--font-mono);
  font-size: var(--text-base);
  line-height: 1.6;
  box-shadow: 1px 1px 0px var(--gb-darker-beige);
}
```

### Component Usage Examples

#### Button Implementation
```jsx
<button className="pokemon-button pokemon-button--primary">
  SUBMIT
</button>
```

#### Panel Implementation
```jsx
<div className="pokemon-panel pokemon-panel--header">
  <h2 className="font-pixel">HEADER TITLE</h2>
</div>
```

#### Textbox Implementation
```jsx
<div className="pokemon-textbox">
  <p className="font-mono">Content goes here...</p>
</div>
```

---

## 🏗 Layout Patterns

### Common Layout Structures

#### 1. Header Layout
```jsx
<div className="pokemon-panel--header" style={{
  backgroundColor: 'var(--gb-medium-beige)',
  padding: 'var(--spacing-lg) var(--spacing-xl)'
}}>
  <div className="flex items-center justify-between">
    <h1 className="font-pixel">TITLE</h1>
    <div className="flex items-center gap-4">
      {/* Header content */}
    </div>
  </div>
</div>
```

#### 2. Sidebar Layout
```jsx
<div className="h-full flex">
  <div className="w-80 flex-shrink-0 pokemon-panel--sidebar">
    {/* Sidebar content */}
  </div>
  <div className="flex-1 flex flex-col">
    {/* Main content */}
  </div>
</div>
```

#### 3. Chat Message Layout
```jsx
<div className="flex justify-end"> {/* or justify-start */}
  <div className="pokemon-textbox max-w-[75%]">
    <div className="font-pixel text-xs mb-2">SENDER</div>
    <div className="font-mono">Message content...</div>
    <div className="font-mono text-xs opacity-75 mt-2">🕐 Time</div>
  </div>
</div>
```

### Grid and Flexbox Guidelines

- **Use Flexbox** for most layouts (header, sidebar, content areas)
- **Use Grid** for complex multi-column layouts
- **Responsive Breakpoints**: Use Tailwind's responsive prefixes
- **Consistent Gaps**: Use spacing variables for gaps between elements

---

## 🎮 Interactive States

### Hover States

```css
/* Button hover */
.pokemon-button:hover {
  background-color: var(--gb-medium-beige);
  transform: translate(1px, 1px);
  box-shadow: none;
}

/* Panel hover */
.pokemon-panel:hover {
  box-shadow: 2px 2px 0px var(--gb-darker-beige);
  transform: translate(-1px, -1px);
}
```

### Active States

```css
/* Button active */
.pokemon-button:active {
  transform: translate(1px, 1px);
  box-shadow: none;
}
```

### Focus States

```css
/* Focus outline for accessibility */
.pokemon-button:focus {
  outline: 2px solid var(--gb-blue);
  outline-offset: 2px;
}
```

### Disabled States

```css
.pokemon-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: var(--gb-darker-beige);
  color: var(--gb-light-text);
}
```

---

## 📱 Responsive Design

### Breakpoint Strategy

```css
/* Mobile First Approach */
/* Base styles: 320px+ */

/* Small: 640px+ */
@media (min-width: 640px) { /* sm: */ }

/* Medium: 768px+ */
@media (min-width: 768px) { /* md: */ }

/* Large: 1024px+ */
@media (min-width: 1024px) { /* lg: */ }

/* Extra Large: 1280px+ */
@media (min-width: 1280px) { /* xl: */ }
```

### Responsive Patterns

#### Text Responsiveness
```jsx
<h1 className="font-pixel text-lg md:text-xl lg:text-2xl">
  RESPONSIVE TITLE
</h1>
```

#### Layout Responsiveness
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

#### Navigation Responsiveness
```jsx
<button className="pokemon-button">
  <span className="hidden sm:inline">FULL TEXT</span>
  <span className="sm:hidden">SHORT</span>
</button>
```

### Mobile Considerations

- **Touch Targets**: Minimum 44x44px for interactive elements
- **Text Size**: Ensure readable text sizes on small screens
- **Spacing**: Increase spacing on mobile for better touch interaction
- **Navigation**: Simplify navigation patterns for mobile

---

## ♿ Accessibility

### WCAG 2.1 AA Compliance

#### Color Contrast
- **Normal Text**: Minimum 4.5:1 contrast ratio
- **Large Text**: Minimum 3:1 contrast ratio
- **UI Components**: Minimum 3:1 contrast ratio

#### Keyboard Navigation
```css
/* Focus indicators */
.pokemon-button:focus {
  outline: 2px solid var(--gb-blue);
  outline-offset: 2px;
}

/* Skip links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--gb-blue);
  color: var(--gb-white);
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 6px;
}
```

#### Screen Reader Support
```jsx
// ARIA labels
<button 
  className="pokemon-button"
  aria-label="Submit form"
>
  SUBMIT
</button>

// Semantic HTML
<nav role="navigation" aria-label="Main navigation">
  {/* Navigation content */}
</nav>
```

### Accessibility Guidelines

1. **Use Semantic HTML**: Proper heading hierarchy, landmarks
2. **Provide Alt Text**: For all images and icons
3. **Keyboard Navigation**: All interactive elements must be keyboard accessible
4. **Focus Management**: Clear focus indicators and logical tab order
5. **Color Independence**: Don't rely solely on color to convey information

---

## ✨ Animation Guidelines

### Animation Principles

- **Subtle and Purposeful**: Animations should enhance UX, not distract
- **Performance First**: Use CSS transforms and opacity for smooth animations
- **Consistent Timing**: Use standard durations (0.1s, 0.2s, 0.3s)
- **Easing Functions**: Use `ease-out` for most interactions

### Predefined Animations

```css
/* Fade In */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Bounce */
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}
```

### Transition Guidelines

```css
/* Standard transitions */
.pokemon-button {
  transition: all 0.1s ease;
}

.pokemon-panel {
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}
```

### Animation Usage

- **Micro-interactions**: Use subtle animations for button clicks, hover states
- **Page Transitions**: Use fade-in for new content
- **Loading States**: Use bounce animation for loading indicators
- **Feedback**: Use scale transforms for successful actions

---

## 💻 Code Standards

### CSS Organization

#### File Structure
```
src/
├── index.css              # Global styles and variables
├── components/
│   └── ComponentName.css  # Component-specific styles (if needed)
```

#### CSS Variable Naming
```css
/* Use kebab-case for variable names */
--gb-light-beige: #f8f4ec;
--spacing-lg: 16px;
--font-pixel: 'Press Start 2P', monospace;
```

#### Class Naming Convention
```css
/* Component classes: kebab-case */
.pokemon-button { }
.pokemon-panel { }

/* Modifier classes: BEM-style */
.pokemon-button--primary { }
.pokemon-panel--header { }

/* Utility classes: abbreviated */
.font-pixel { }
.text-primary { }
.p-lg { }
```

### JavaScript/JSX Standards

#### Component Structure
```jsx
import React from 'react';

export const ComponentName = ({ prop1, prop2 }) => {
  return (
    <div className="pokemon-panel">
      {/* Component content */}
    </div>
  );
};
```

#### Inline Styles
```jsx
// Use CSS variables for consistent styling
<div style={{
  backgroundColor: 'var(--gb-light-beige)',
  padding: 'var(--spacing-lg)',
  fontFamily: 'var(--font-pixel)',
  fontSize: 'var(--pixel-sm)'
}}>
  Content
</div>
```

#### Conditional Classes
```jsx
<button 
  className={`pokemon-button ${
    isActive ? 'pokemon-button--primary' : ''
  }`}
>
  Button Text
</button>
```

### Best Practices

1. **Use CSS Variables**: Always use design system variables
2. **Component Composition**: Build complex components from simple ones
3. **Responsive Design**: Mobile-first approach with progressive enhancement
4. **Performance**: Minimize CSS-in-JS, prefer CSS classes
5. **Accessibility**: Include ARIA attributes and semantic HTML
6. **Consistency**: Follow established patterns and conventions

---

## 📚 Resources

### Design System Files
- `src/index.css` - Global styles and design tokens
- `src/components/` - Component implementations
- `README.md` - Project overview and architecture

### External Resources
- [Press Start 2P Font](https://fonts.google.com/specimen/Press+Start+2P)
- [JetBrains Mono Font](https://fonts.google.com/specimen/JetBrains+Mono)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Tools
- Browser DevTools for testing responsive design
- Color contrast checkers for accessibility validation
- CSS Grid and Flexbox debugging tools

---

*This style guide is a living document. Update it as the design system evolves.* 