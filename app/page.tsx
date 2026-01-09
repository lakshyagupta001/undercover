'use client';

import { useGameStore } from '@/store/gameStore';
import HomeScreen from '@/components/screens/HomeScreen';
import SetupScreen from '@/components/screens/SetupScreen';
import PlayerNamesScreen from '@/components/screens/PlayerNamesScreen';
import RoleAssignmentScreen from '@/components/screens/RoleAssignmentScreen';
import RoundStartScreen from '@/components/screens/RoundStartScreen';
import GameScreen from '@/components/screens/GameScreen';
import VotingScreen from '@/components/screens/VotingScreen';
import RevengerScreen from '@/components/screens/RevengerScreen';
import MrWhiteGuessScreen from '@/components/screens/MrWhiteGuessScreen';
import RoleRevealScreen from '@/components/screens/RoleRevealScreen';
import VictoryScreen from '@/components/screens/VictoryScreen';
import PointsScreen from '@/components/screens/PointsScreen';
import RulesScreen from '@/components/screens/RulesScreen';
import { useState } from 'react';

export default function Home() {
  const phase = useGameStore((state) => state.phase);
  const [showRules, setShowRules] = useState(false);

  if (showRules) {
    return <RulesScreen onClose={() => setShowRules(false)} />;
  }

  switch (phase) {
    case 'home':
      return <HomeScreen onShowRules={() => setShowRules(true)} />;
    case 'setup':
      return <SetupScreen />;
    case 'player-names':
      return <PlayerNamesScreen />;
    case 'role-assignment':
      return <RoleAssignmentScreen />;
    case 'round-start':
      return <RoundStartScreen />;
    case 'discussion':
      return <GameScreen />;
    case 'voting':
      return <VotingScreen />;
    case 'revenger':
      return <RevengerScreen />;
    case 'mrwhite-guess':
      return <MrWhiteGuessScreen />;
    case 'role-reveal':
      return <RoleRevealScreen />;
    case 'victory':
      return <VictoryScreen />;
    case 'points':
      return <PointsScreen />;
    default:
      return <HomeScreen onShowRules={() => setShowRules(true)} />;
  }
}

