# 📁 Project Structure

Complete guide to the codebase architecture and file organization.

## Directory Overview

```
undercover/
├── app/                    # Next.js 14 App Router
├── components/             # React Components
├── data/                   # Static Data & Content
├── hooks/                  # Custom React Hooks
├── lib/                    # Utility Functions & Libraries
├── public/                 # Static Assets
├── store/                  # State Management (Zustand)
├── types/                  # TypeScript Type Definitions
├── *.config.*             # Configuration Files
└── *.md                   # Documentation
```

## Detailed Structure

### 📱 `/app` - Next.js Application

```
app/
├── api/
│   └── generate-words/
│       └── route.ts        # Gemini AI API endpoint
├── favicon.ico            # App icon
├── globals.css            # Global styles & animations
├── layout.tsx             # Root layout with metadata
└── page.tsx               # Main game router
```

**Purpose**: Next.js 14 App Router structure
- **`api/`**: Server-side API routes
- **`layout.tsx`**: Defines the HTML structure, metadata, and global layout
- **`page.tsx`**: Main entry point that routes to different game screens
- **`globals.css`**: Tailwind imports, animations, and global styles

### 🎨 `/components` - React Components

```
components/
├── screens/               # Full-page game screens
│   ├── HomeScreen.tsx     # Landing page with game start
│   ├── SetupScreen.tsx    # Player count & difficulty selection
│   ├── RoleAssignmentScreen.tsx  # Pass-the-phone role reveal
│   ├── GameScreen.tsx     # Main gameplay (description & discussion)
│   ├── VotingScreen.tsx   # Player elimination voting
│   ├── RoleRevealScreen.tsx  # Show eliminated player's role
│   ├── VictoryScreen.tsx  # End game with winners
│   └── RulesScreen.tsx    # How to play instructions
└── ui/                    # Reusable UI components
    ├── Button.tsx         # Styled button with variants
    ├── Card.tsx           # Glassmorphic card container
    ├── Loading.tsx        # Loading spinner animation
    ├── Modal.tsx          # Modal dialog with overlay
    └── PlayerAvatar.tsx   # Player avatar display
```

**Design Pattern**: Component separation by responsibility
- **Screens**: Full-page components managing game state
- **UI**: Reusable, presentational components

### 💾 `/store` - State Management

```
store/
└── gameStore.ts           # Zustand global state store
```

**State Structure**:
```typescript
{
  phase: GamePhase          // Current game phase
  players: Player[]         // All players with roles
  currentPlayerIndex: number
  currentRound: number
  wordPair: WordPair | null
  settings: GameSettings
  eliminatedPlayer: Player | null
  winner: 'civilians' | 'infiltrators' | null
}
```

**Key Actions**:
- `initializePlayers()` - Create player list
- `assignRoles()` - Distribute roles and words
- `eliminatePlayer()` - Remove player from game
- `checkVictoryCondition()` - Evaluate win conditions
- `resetGame()` - Start new game

### 📊 `/types` - TypeScript Types

```
types/
└── game.ts                # All game-related types
```

**Key Types**:
- `Role`: 'civilian' | 'undercover' | 'mrwhite'
- `GamePhase`: Current stage of the game
- `Player`: Player data with role and word
- `WordPair`: Civilian and Undercover words
- `GameSettings`: Difficulty, sound, theme

### 📚 `/data` - Static Content

```
data/
└── fallbackWords.ts       # 30+ pre-configured word pairs
```

**Content**:
- Easy level: 10 word pairs
- Medium level: 10 word pairs
- Hard level: 10 word pairs
- `getRandomWordPair()` function for offline mode

### 🪝 `/hooks` - Custom React Hooks

```
hooks/
├── useVibrate.ts          # Device vibration wrapper
└── useSound.ts            # Sound effects (Web Audio API)
```

**Usage**:
```typescript
const { vibratePattern } = useVibrate();
vibratePattern('success');

const { playSound } = useSound();
playSound('click');
```

### 🛠️ `/lib` - Utilities & Libraries

```
lib/
├── wordGenerator.ts       # Word generation logic
└── utils.ts               # Helper functions
```

**wordGenerator.ts**:
- `generateWordPair()` - Fetches from API or fallback

**utils.ts**:
- `shuffleArray()` - Fisher-Yates shuffle
- `isMobile()` - Device detection
- `formatPlayerName()` - Text formatting
- Other utility functions

### 🌐 `/public` - Static Assets

```
public/
└── manifest.json          # PWA manifest
```

**manifest.json**: Enables Progressive Web App features
- Add to home screen
- Standalone display mode
- App icons and theme colors

### ⚙️ Configuration Files

```
├── next.config.mjs        # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── postcss.config.mjs     # PostCSS configuration
├── package.json           # Dependencies & scripts
├── .gitignore             # Git ignore rules
└── .env.example           # Environment variables template
```

## Data Flow

### Game Initialization Flow

```
HomeScreen
    ↓
SetupScreen
    ↓ (generateWordPair)
API → Gemini AI (or fallback)
    ↓
gameStore.assignRoles()
    ↓
RoleAssignmentScreen
    ↓
GameScreen
```

### Game Loop Flow

```
GameScreen (Description Round)
    ↓
GameScreen (Discussion Phase)
    ↓
VotingScreen
    ↓
eliminatePlayer()
    ↓
RoleRevealScreen
    ↓
checkVictoryCondition()
    ↓ (if no winner)
Back to GameScreen (next round)
    ↓ (if winner)
VictoryScreen
```

### State Management Flow

```
User Action
    ↓
Component Handler
    ↓
gameStore Action
    ↓
State Update
    ↓
Component Re-render
    ↓
UI Update
```

## Key Technologies

### Frontend
- **React 18**: Component library
- **Next.js 14**: Full-stack framework (App Router)
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animation library
- **React Confetti**: Victory effects

### State Management
- **Zustand**: Lightweight state management
- Simple, hook-based API
- No boilerplate required

### Backend/API
- **Next.js API Routes**: Server-side endpoints
- **Google Generative AI**: Gemini API for word generation
- Built-in API routes in `/app/api`

### Build Tools
- **Turbopack**: Fast bundler (Next.js dev)
- **SWC**: Fast TypeScript/JavaScript compiler
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixes

## Styling System

### Tailwind Configuration
```typescript
// tailwind.config.ts
{
  colors: {
    civilian: { /* Blue shades */ },
    undercover: { /* Red shades */ },
    mrwhite: { /* Gray shades */ }
  },
  animations: {
    'fade-in', 'slide-up', 'pulse-glow', etc.
  }
}
```

### Custom CSS Classes
```css
/* globals.css */
.glass              /* Glassmorphic effect */
.glass-dark         /* Dark glass variant */
.bg-gradient-*      /* Role-specific gradients */
.shimmer            /* Loading effect */
.btn-hover          /* Button ripple effect */
```

## Adding New Features

### Add a New Screen

1. Create file in `/components/screens/NewScreen.tsx`
2. Add phase to `GamePhase` type in `/types/game.ts`
3. Add route in `/app/page.tsx`
4. Update gameStore if needed

### Add a New Game Mode

1. Add mode type to `GameSettings` in `/types/game.ts`
2. Update `gameStore.ts` logic
3. Add UI controls in `SetupScreen.tsx`
4. Adjust victory conditions in `checkVictoryCondition()`

### Add More Word Pairs

1. Edit `/data/fallbackWords.ts`
2. Add to appropriate difficulty array
3. Follow the `WordPair` type structure

### Customize Styling

1. Edit `/tailwind.config.ts` for theme colors
2. Edit `/app/globals.css` for animations
3. Component-specific styles in component files

## Testing Locally

### Development
```bash
npm run dev              # Start dev server
npm run lint             # Check for errors
npm run build            # Test production build
```

### Mobile Testing
1. Start dev server
2. Find network URL in terminal
3. Open on mobile device (same WiFi)
4. Test pass-the-phone mechanics

## Performance Considerations

### Optimizations Applied
- ✅ Code splitting (automatic with Next.js)
- ✅ Image optimization (Next.js Image component ready)
- ✅ CSS minification (Tailwind)
- ✅ Component lazy loading
- ✅ Efficient re-renders (Zustand)
- ✅ Framer Motion GPU acceleration

### Best Practices
- Components use `memo` where appropriate
- State updates are batched
- Animations use `transform` and `opacity` (GPU)
- No inline functions in render loops
- Proper key props for lists

## Security Notes

### API Key Security
- ✅ API key in environment variables
- ✅ Not committed to git (.gitignore)
- ✅ Client-side API calls (acceptable for Gemini)
- ⚠️ For production: Consider server-side proxy

### User Data
- ✅ No user data collected
- ✅ No cookies or tracking
- ✅ Fully offline capable
- ✅ No external dependencies (except API)

## Deployment Checklist

- [ ] Build successfully: `npm run build`
- [ ] Test production build: `npm start`
- [ ] Add Gemini API key to hosting environment
- [ ] Configure environment variables
- [ ] Test on mobile devices
- [ ] Verify PWA functionality
- [ ] Check all game phases work
- [ ] Verify victory conditions
- [ ] Test offline mode

## Common Issues & Solutions

**Issue**: "Module not found"
- **Solution**: Run `npm install`

**Issue**: Styles not applying
- **Solution**: Restart dev server

**Issue**: State not updating
- **Solution**: Check Zustand store actions

**Issue**: API not working
- **Solution**: Verify `.env.local` and API key

**Issue**: Build errors
- **Solution**: Run `npm run lint` and fix errors

## Contributing Guidelines

### Code Style
- Use TypeScript for all files
- Follow existing naming conventions
- Use functional components with hooks
- Keep components small and focused
- Add comments for complex logic

### Git Workflow
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Run linting
5. Create pull request

### Testing
- Test all game phases
- Verify victory conditions
- Test on mobile
- Check offline mode
- Verify role assignment privacy

---

**Need help?** Check the other documentation files:
- [README.md](./README.md) - Overview
- [QUICKSTART.md](./QUICKSTART.md) - Quick setup
- [INSTALLATION.md](./INSTALLATION.md) - Detailed install
- [GAME_RULES.md](./GAME_RULES.md) - Complete rules

