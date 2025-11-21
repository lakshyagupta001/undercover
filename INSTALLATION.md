# 📦 Installation Guide

Complete installation instructions for **The Infiltrators & The Ghost** game.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0 or higher
  - Check version: `node --version`
  - Download: [nodejs.org](https://nodejs.org/)

- **npm** or **yarn**: Package manager (comes with Node.js)
  - Check npm version: `npm --version`
  - Check yarn version: `yarn --version`

## Installation Steps

### 1. Clone or Download the Repository

**Option A: Using Git**
```bash
git clone <repository-url>
cd undercover
```

**Option B: Download ZIP**
- Download the ZIP file
- Extract to your desired location
- Open terminal in the extracted folder

### 2. Install Dependencies

Choose your preferred package manager:

**Using npm:**
```bash
npm install
```

**Using yarn:**
```bash
yarn install
```

**Using pnpm:**
```bash
pnpm install
```

This will install all required packages:
- Next.js 14
- React 18
- Framer Motion (animations)
- Zustand (state management)
- Tailwind CSS (styling)
- Google Generative AI (Gemini)
- React Confetti (victory effects)
- TypeScript

### 3. Configure Environment Variables (Optional)

**For AI-Generated Words:**

Create a `.env.local` file in the root directory:

```bash
# On Windows:
copy .env.example .env.local

# On Mac/Linux:
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

**Getting a Gemini API Key:**

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in `.env.local`

**Note**: If you don't add an API key, the game will work perfectly offline using 30+ pre-configured word pairs!

### 4. Run the Development Server

```bash
npm run dev
```

Or with yarn:
```bash
yarn dev
```

The game will be available at:
- **Local**: [http://localhost:3000](http://localhost:3000)
- **Network**: Check terminal for network URL (for mobile testing)

### 5. Open in Browser

1. Open your browser
2. Navigate to `http://localhost:3000`
3. You should see the game home screen!

## Building for Production

### Create Production Build

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

### Run Production Build Locally

```bash
npm start
```

The production server will run on `http://localhost:3000`

### Deploy to Hosting

**Vercel (Recommended):**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

**Other Platforms:**
- Upload the `.next`, `public`, and `node_modules` folders
- Set build command: `npm run build`
- Set start command: `npm start`

## Mobile Setup

### Testing on Mobile Device (Same Network)

1. Start the dev server: `npm run dev`
2. Find your network URL in the terminal (e.g., `http://192.168.1.100:3000`)
3. Open that URL on your mobile device
4. Play the game!

### Install as PWA (Progressive Web App)

**On iOS:**
1. Open the game in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Tap "Add"

**On Android:**
1. Open the game in Chrome
2. Tap the menu (⋮)
3. Select "Add to Home screen"
4. Tap "Add"

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Use a different port
npm run dev -- -p 3001
```

### Installation Errors

**"npm ERR! code ERESOLVE"**
```bash
npm install --legacy-peer-deps
```

**"command not found: npm"**
- Node.js is not installed or not in PATH
- Reinstall Node.js from [nodejs.org](https://nodejs.org/)

### Build Errors

**"Out of memory"**
```bash
# Increase Node memory limit
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

**TypeScript errors**
```bash
# Check for syntax errors
npm run lint
```

### Runtime Errors

**"Failed to generate words"**
- Check your internet connection
- Verify Gemini API key is correct
- Game will automatically fall back to offline words

**Animations not working**
- Clear browser cache
- Try a different browser
- Check console for JavaScript errors (F12)

**Styles not loading**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Restart dev server

## File Structure After Installation

```
undercover/
├── .next/                  # Build output (after build)
├── node_modules/           # Dependencies
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── screens/          # Game screens
│   └── ui/               # UI components
├── data/                  # Static data
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── public/               # Static assets
├── store/                # State management
├── types/                # TypeScript types
├── .env.local            # Environment variables (you create this)
├── .gitignore            # Git ignore rules
├── next.config.mjs       # Next.js configuration
├── package.json          # Dependencies
├── README.md             # Documentation
├── QUICKSTART.md         # Quick start guide
├── GAME_RULES.md         # Complete game rules
├── tailwind.config.ts    # Tailwind CSS config
└── tsconfig.json         # TypeScript config
```

## System Requirements

### Minimum
- **OS**: Windows 10, macOS 10.15, or Linux
- **RAM**: 4 GB
- **Storage**: 500 MB free space
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Recommended
- **OS**: Latest version
- **RAM**: 8 GB or more
- **Storage**: 1 GB free space
- **Browser**: Latest version of any modern browser
- **Internet**: For AI word generation (optional)

## Updating the Game

### Pull Latest Changes

```bash
git pull origin main
npm install  # Install any new dependencies
npm run dev  # Start the updated version
```

### Manual Update

1. Download the latest version
2. Extract to a new folder
3. Copy your `.env.local` file to the new folder
4. Run `npm install`
5. Run `npm run dev`

## Uninstalling

To remove the game:

1. Delete the project folder
2. (Optional) Clear npm cache:
   ```bash
   npm cache clean --force
   ```

## Need Help?

- 📖 Check [QUICKSTART.md](./QUICKSTART.md) for quick setup
- 🎮 Read [GAME_RULES.md](./GAME_RULES.md) for gameplay
- 🐛 Open an issue on GitHub
- 💬 Contact the development team

---

**Enjoy the game!** 🎭🎉

