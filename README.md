# 🎭 The Infiltrators & The Ghost

A modern, AI-powered social deduction party game built with Next.js. Pass a single device around as players take on secret roles and use wordplay, deduction, and tactical voting to achieve victory.

![Game Banner](https://img.shields.io/badge/Players-3--10-blue) ![AI Powered](https://img.shields.io/badge/AI-Gemini%20Powered-purple)

## 🎮 Game Overview

### Roles & Teams

- **Civilians (Majority)**: Receive a secret word. Work together to identify and eliminate the infiltrators.
- **Undercover (1 player)**: Receives a related but different word. Must blend in and survive.
- **Mr. White (1 player)**: Receives no word at all! Must listen carefully and adapt to survive.

### Victory Conditions

- **Civilians Win**: Eliminate both the Undercover and Mr. White (+1 point each)
- **Infiltrators Win**: Survive until only 1 civilian remains
  - Undercover: +2 points if survives
  - Mr. White: +3 points if survives OR guesses the civilian word correctly

## ✨ Features

- 🎨 **Modern UI**: Glassmorphic design with smooth animations
- 📱 **Mobile-First**: Optimized for single-device pass-and-play
- 🤖 **AI-Powered**: Gemini AI generates unique word pairs each game
- 🔒 **Privacy-Focused**: Secure role assignment with "pass-the-phone" mechanic
- 🎭 **Rich Animations**: Framer Motion animations for cinematic experience
- 🎯 **Smart Game Logic**: Automatic victory detection and round management
- ⭐ **Points System**: Track scores across multiple games

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm package manager
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd undercover_game
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Gemini AI**

Create a `.env.local` file:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_GEMINI_MODEL_NAME=gemini-2.5-flash
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open the game**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 How to Play

1. **Setup**: Choose number of players (3-10) and difficulty
2. **Name Players**: Enter names for all players
3. **Role Assignment**: Pass the phone - each player taps to see their secret role/word
4. **Discussion Round**: Each player says ONE word related to their secret word, then discuss who seems suspicious
5. **Voting**: Vote to eliminate a player
6. **Continue**: Repeat discussion/voting until a team wins
7. **Victory**: See results and points earned
8. **Points**: View the leaderboard and start the next game

## 📁 Project Structure

```
undercover_game/
├── app/
│   ├── api/
│   │   └── generate-words/    # Gemini AI integration
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main game router
├── components/
│   ├── screens/               # Game screens
│   │   ├── HomeScreen.tsx
│   │   ├── SetupScreen.tsx
│   │   ├── PlayerNamesScreen.tsx
│   │   ├── RoleAssignmentScreen.tsx
│   │   ├── GameScreen.tsx
│   │   ├── VotingScreen.tsx
│   │   ├── MrWhiteGuessScreen.tsx
│   │   ├── RoleRevealScreen.tsx
│   │   ├── VictoryScreen.tsx
│   │   ├── PointsScreen.tsx
│   │   └── RulesScreen.tsx
│   └── ui/                    # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── PlayerAvatar.tsx
│       └── PointsDisplay.tsx
├── store/
│   └── gameStore.ts           # Zustand state management
├── types/
│   └── game.ts                # TypeScript types
├── lib/
│   ├── utils.ts               # Utility functions
│   └── wordGenerator.ts       # Word generation logic
└── public/                    # Static assets (icons, manifest)
```

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **AI Integration**: Google Gemini AI
- **Confetti**: react-confetti

## 🌟 Key Features

### Pass-the-Phone Mechanic
Each player taps to reveal their role privately. Screen can be hidden before passing.

### AI Word Generation
Gemini AI generates contextually related word pairs with varying difficulty levels.

### Points System
- Civilians: +1 point each if they win
- Undercover: +2 points if survives to the end
- Mr. White: +3 points if survives OR guesses correctly

### Mr. White's Last Chance
When eliminated, Mr. White gets one chance to guess the civilian word and steal victory.

## 📄 License

MIT License - feel free to use and modify!
