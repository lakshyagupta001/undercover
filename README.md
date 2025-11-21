# 🎭 The Infiltrators & The Ghost

A modern, offline-first social deduction party game built with Next.js. Pass a single device around as players take on secret roles and use wordplay, deduction, and tactical voting to achieve victory.

![Game Banner](https://img.shields.io/badge/Players-3--10-blue) ![Offline](https://img.shields.io/badge/Mode-Offline%20First-green) ![AI Powered](https://img.shields.io/badge/AI-Gemini%20Powered-purple)

## 🎮 Game Overview

### Roles & Teams

- **Civilians (Majority)**: Receive a Hindi word. Work together to identify and eliminate the infiltrators.
- **Undercover (1 player)**: Receives an English word related to the Civilians' word. Must blend in and survive.
- **Mr. White (1 player)**: Receives no word at all! Must listen carefully and adapt to survive.

### Victory Conditions

- **Civilians Win**: Eliminate both the Undercover and Mr. White
- **Infiltrators Win**: Survive until only 2 players remain (both infiltrators) OR all infiltrators remain

## ✨ Features

- 🎨 **Modern UI**: Glassmorphic design with smooth animations
- 📱 **Mobile-First**: Optimized for single-device pass-and-play
- 🤖 **AI-Powered**: Optional Gemini AI integration for generating unique word pairs
- 🔒 **Privacy-Focused**: Secure role assignment with "pass-the-phone" mechanic
- 🌐 **Offline First**: Works perfectly without internet using fallback words
- 🎭 **Rich Animations**: Framer Motion animations for cinematic experience
- 🎯 **Smart Game Logic**: Automatic victory detection and round management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd undercover
```

2. **Install dependencies**
```bash
npm install
```

3. **(Optional) Configure Gemini AI**

Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. **Run the development server**
```bash
npm run dev
```

5. **Open the game**

Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Play

### 1. Setup Phase
- Select number of players (3-10)
- Choose difficulty level (Easy/Medium/Hard)
- Optionally configure AI word generation

### 2. Role Assignment
- Pass the device around
- Each player privately views their role and word
- Privacy is ensured with "pass-the-phone" mechanic

### 3. Description Round
- Each player gives ONE verbal clue about their word
- Civilians: Be specific but not too obvious
- Undercover: Your word is related but different
- Mr. White: Listen and blend in!

### 4. Discussion Phase
- Debate who seems suspicious
- Look for inconsistencies in clues
- Build consensus on who to eliminate

### 5. Voting
- Vote to eliminate a player
- Eliminated player's role is revealed
- Check for victory conditions

### 6. Repeat
- Continue rounds until a team wins

## 🏗️ Project Structure

```
undercover/
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
│   │   ├── RoleAssignmentScreen.tsx
│   │   ├── GameScreen.tsx
│   │   ├── VotingScreen.tsx
│   │   ├── RoleRevealScreen.tsx
│   │   ├── VictoryScreen.tsx
│   │   └── RulesScreen.tsx
│   └── ui/                    # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Modal.tsx
│       └── PlayerAvatar.tsx
├── store/
│   └── gameStore.ts           # Zustand state management
├── types/
│   └── game.ts                # TypeScript types
├── data/
│   └── fallbackWords.ts       # Offline word list
├── lib/
│   └── wordGenerator.ts       # Word generation logic
└── public/                    # Static assets
```

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **AI Integration**: Google Gemini AI
- **Confetti**: react-confetti

## 🌟 Key Features Explained

### Pass-the-Phone Mechanic
The game implements a secure role assignment system where:
- Each player taps to reveal their role privately
- Screen automatically hides after viewing
- Device vibration (if supported) indicates player changes
- No back buttons to prevent peeking

### AI Word Generation
- Uses Google's Gemini AI to generate contextually related word pairs
- Hindi-English word combinations
- Difficulty-aware generation
- Automatic fallback to offline words if API fails

### Offline Support
- 30+ pre-configured word pairs across difficulty levels
- Works completely offline
- No internet required for gameplay

### Smart Victory Detection
- Automatic detection of win conditions after each elimination
- Immediate victory screen when conditions are met
- Comprehensive role reveals at game end

## 🎭 Word Pair Examples

| Difficulty | Civilian (Hindi) | Undercover (English) | Relationship |
|-----------|------------------|---------------------|--------------|
| Easy      | किताब            | Novel               | Reading materials |
| Medium    | डॉक्टर            | Nurse               | Medical professionals |
| Hard      | न्याय             | Justice             | Same concept |

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-optimized interactions
- Safe area insets for notched devices
- Prevent text selection during pass-the-phone
- Optimized animations for 60fps

## 🔧 Configuration

### Difficulty Levels
- **Easy**: Common everyday objects and concepts
- **Medium**: Moderately familiar concepts requiring thought
- **Hard**: Abstract concepts with subtle differences

### Game Settings
Configurable through the setup screen:
- Number of players (3-10)
- Difficulty level
- AI word generation toggle

## 🚀 Build for Production

```bash
npm run build
npm start
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 🎉 Credits

Inspired by the classic party game "Undercover" with unique twists:
- Hindi/English word pairs for cultural fusion
- Mr. White role for extra complexity
- AI-powered word generation
- Modern, mobile-first design

---

**Enjoy the game! May the best team win! 🎭🏆**
