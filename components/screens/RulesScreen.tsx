'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface RulesScreenProps {
  onClose: () => void;
}

export default function RulesScreen({ onClose }: RulesScreenProps) {
  const rules = [
    {
      icon: '👥',
      title: 'Roles & Teams',
      items: [
        'Civilians: Get a Hindi word. Find the infiltrators!',
        'Undercover: Get an English word (related to Hindi word). Blend in!',
        'Mr. White: No word at all. Listen and survive!',
      ],
    },
    {
      icon: '🎯',
      title: 'Victory Conditions',
      items: [
        'Civilians Win: Eliminate both Undercover AND Mr. White',
        'Infiltrators Win: Survive until only 2 players remain (both infiltrators)',
      ],
    },
    {
      icon: '🎮',
      title: 'How to Play',
      items: [
        '1. Pass the device to see your role and word secretly',
        '2. Each player gives ONE clue about their word',
        '3. Discuss who seems suspicious',
        '4. Vote to eliminate someone',
        '5. Repeat until a team wins!',
      ],
    },
    {
      icon: '💡',
      title: 'Strategy Tips',
      items: [
        'Civilians: Be specific but not too obvious',
        'Undercover: Your word is related but different',
        'Mr. White: Listen carefully and blend in!',
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col p-6 overflow-y-auto bg-base">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Button variant="secondary" onClick={onClose}>
          ← Back
        </Button>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="font-display text-4xl font-bold text-center mb-8 text-ivory"
      >
        📖 How to Play
      </motion.h1>

      <div className="max-w-2xl mx-auto w-full space-y-6 pb-8">
        {rules.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="flex items-start gap-4">
                <div className="text-4xl">{section.icon}</div>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-semibold mb-3 text-ivory">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="text-ivory-soft leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-accent/20 to-gold/20 border border-gold/20">
            <div className="text-center">
              <p className="text-2xl mb-2">🎭</p>
              <p className="text-ivory font-semibold mb-2">Important!</p>
              <p className="text-ivory-soft text-sm">
                Undercover and Mr. White share the same victory condition but don&apos;t know each other&apos;s identity. They must work together through clever gameplay!
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

