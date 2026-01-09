'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PlayerAvatar from '@/components/ui/PlayerAvatar';
import { useGameStore } from '@/store/gameStore';

export default function RevengerScreen() {
    const { players, revengerPending, executeRevenge, setPhase } = useGameStore();
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

    if (!revengerPending) {
        return null;
    }

    const revenger = players.find(p => p.id === revengerPending);
    const eligiblePlayers = players.filter(p => p.isAlive && !p.isGhost && p.id !== revengerPending);

    const handleConfirm = () => {
        if (selectedPlayerId) {
            executeRevenge(selectedPlayerId);
            setPhase('role-reveal');
        }
    };

    const handleSkip = () => {
        useGameStore.setState({ revengerPending: null });
        setPhase('role-reveal');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-base">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg"
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="text-6xl mb-4">🔥</div>
                    <h1 className="font-display text-3xl font-bold text-ivory mb-2">
                        Revenge!
                    </h1>
                    <p className="text-ivory-dim">
                        The Revenger was eliminated and seeks vengeance
                    </p>
                </motion.div>

                {revenger && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6"
                    >
                        <Card className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30">
                            <div className="flex items-center gap-4">
                                <PlayerAvatar player={{ ...revenger, isAlive: false }} size="md" />
                                <div>
                                    <p className="text-ivory-dim text-sm">The Revenger</p>
                                    <p className="text-ivory font-semibold text-lg">{revenger.name}</p>
                                    <p className="text-xs text-accent">Choose one player to take with you!</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-6"
                >
                    <h3 className="text-ivory font-semibold mb-4 text-center">
                        Choose your target:
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {eligiblePlayers.map((player, index) => {
                            const isSelected = selectedPlayerId === player.id;

                            return (
                                <motion.div
                                    key={player.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + index * 0.05 }}
                                >
                                    <Card
                                        onClick={() => setSelectedPlayerId(player.id)}
                                        className={`
                      cursor-pointer transition-all duration-300
                      ${isSelected ? 'ring-4 ring-accent bg-accent/20 border-accent/40' : 'hover:bg-surface-light/50'}
                    `}
                                    >
                                        <div className="text-center">
                                            <PlayerAvatar player={player} size="md" />
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                <div className="space-y-4">
                    <Button
                        variant="danger"
                        size="lg"
                        fullWidth
                        onClick={handleConfirm}
                        disabled={!selectedPlayerId}
                    >
                        🔥 Take Revenge on {selectedPlayerId ? players.find(p => p.id === selectedPlayerId)?.name : '...'}
                    </Button>

                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={handleSkip}
                    >
                        Skip Revenge
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
