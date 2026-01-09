'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PlayerAvatar from '@/components/ui/PlayerAvatar';
import { useGameStore } from '@/store/gameStore';

export default function RoundStartScreen() {
    const {
        players,
        currentRound,
        currentMrMeme,
        specialRoleConfig,
        falafelVendorId,
        setPhase,
        selectMrMeme,
        distributeFalafel,
    } = useGameStore();

    const [selectedFalafelTarget, setSelectedFalafelTarget] = useState<string | null>(null);
    const [falafelDistributed, setFalafelDistributed] = useState(false);
    const [mrMemeSelected, setMrMemeSelected] = useState(false);

    // Select Mr. Meme on first render
    if (!mrMemeSelected && specialRoleConfig.meme) {
        selectMrMeme();
        setMrMemeSelected(true);
    }

    const mrMemePlayer = currentMrMeme ? players.find(p => p.id === currentMrMeme) : null;
    const falafelVendor = falafelVendorId ? players.find(p => p.id === falafelVendorId) : null;
    const vendorIsAlive = falafelVendor?.isAlive && !falafelVendor?.isGhost;

    // Eligible targets for falafel (everyone except vendor)
    const falafelTargets = players.filter(p =>
        p.isAlive && !p.isGhost && p.id !== falafelVendorId
    );

    const handleDistributeFalafel = () => {
        if (selectedFalafelTarget) {
            distributeFalafel(selectedFalafelTarget);
            setFalafelDistributed(true);
        }
    };

    const handleSkipFalafel = () => {
        distributeFalafel(); // Clears without giving to anyone
        setFalafelDistributed(true);
    };

    const handleContinue = () => {
        setPhase('discussion');
    };

    // Check if we need to show falafel distribution
    const needsFalafelDistribution = specialRoleConfig.falafelVendor && vendorIsAlive && !falafelDistributed;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-base overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg py-8"
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="text-6xl mb-4">🎬</div>
                    <h1 className="font-display text-4xl font-bold text-ivory mb-2">
                        Round {currentRound}
                    </h1>
                    <p className="text-ivory-dim">Round announcements</p>
                </motion.div>

                <div className="space-y-4">
                    {/* Mr. Meme Announcement */}
                    {specialRoleConfig.meme && mrMemePlayer && (
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl">😂</div>
                                    <div className="flex-1">
                                        <h3 className="font-display text-lg font-semibold text-ivory mb-1">
                                            Mr. Meme This Round
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <PlayerAvatar player={mrMemePlayer} size="sm" />
                                            <span className="text-ivory-soft">{mrMemePlayer.name}</span>
                                        </div>
                                        <p className="text-xs text-ivory-dim mt-2">
                                            Must use gestures only, no speaking!
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Falafel Distribution */}
                    {specialRoleConfig.falafelVendor && falafelVendor && vendorIsAlive && (
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-green-500/30">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="text-4xl">🧆</div>
                                    <div className="flex-1">
                                        <h3 className="font-display text-lg font-semibold text-ivory mb-1">
                                            Falafel Vendor&apos;s Turn
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <PlayerAvatar player={falafelVendor} size="sm" />
                                            <span className="text-ivory-soft">{falafelVendor.name}</span>
                                        </div>
                                    </div>
                                </div>

                                {!falafelDistributed ? (
                                    <>
                                        <p className="text-ivory-soft text-sm mb-4">
                                            Choose who gets the mystery falafel! Effect is random: 🛡️ Protection (saved + redirect) or 💥 Sabotage (poisoned!)
                                        </p>

                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                            {falafelTargets.map((player) => (
                                                <button
                                                    key={player.id}
                                                    onClick={() => setSelectedFalafelTarget(player.id)}
                                                    className={`
                            p-2 rounded-lg text-center transition-all duration-200
                            ${selectedFalafelTarget === player.id
                                                            ? 'bg-green-500/30 border-2 border-green-500 ring-2 ring-green-500/50'
                                                            : 'bg-surface-light/30 border border-ivory/10 hover:bg-surface-light/50'
                                                        }
                          `}
                                                >
                                                    <div className="text-2xl mb-1">{player.avatar}</div>
                                                    <div className="text-xs text-ivory-dim truncate">{player.name}</div>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="primary"
                                                fullWidth
                                                onClick={handleDistributeFalafel}
                                                disabled={!selectedFalafelTarget}
                                            >
                                                🧆 Give Falafel
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={handleSkipFalafel}
                                            >
                                                Skip
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-green-400 font-semibold">✓ Falafel distributed!</p>
                                        <p className="text-xs text-ivory-dim mt-1">
                                            Effect will activate if that player is affected this round
                                        </p>
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    )}

                    {/* Falafel Vendor is dead */}
                    {specialRoleConfig.falafelVendor && falafelVendor && !vendorIsAlive && (
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="bg-gradient-to-r from-gray-500/20 to-gray-600/20 border border-gray-500/30 opacity-60">
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl grayscale">🧆</div>
                                    <div className="flex-1">
                                        <h3 className="font-display text-lg font-semibold text-ivory-dim mb-1">
                                            Falafel Vendor Eliminated
                                        </h3>
                                        <p className="text-xs text-ivory-dim">
                                            No falafel this round
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* No special announcements */}
                    {!specialRoleConfig.meme && !specialRoleConfig.falafelVendor && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card>
                                <div className="text-center">
                                    <p className="text-ivory-soft">
                                        No special announcements this round
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8"
                >
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={handleContinue}
                        disabled={needsFalafelDistribution}
                    >
                        🗣️ Start Discussion
                    </Button>
                    {needsFalafelDistribution && (
                        <p className="text-center text-ivory-dim text-xs mt-2">
                            Complete falafel distribution to continue
                        </p>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}
