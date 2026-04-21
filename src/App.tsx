import { useState } from 'react';
import { GameProvider } from './store/GameContext';
import FamilySetup from './components/setup/FamilySetup';
import GameBoard from './components/game/GameBoard';
import EndGameScreen from './components/game/EndGameScreen';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [scene, setScene] = useState<'setup' | 'game' | 'end'>('setup');

  return (
    <GameProvider>
      <div style={{ width:'100%', minHeight:'100vh' }}>
        <AnimatePresence mode="wait">
          {scene === 'setup' ? (
            <motion.div key="setup" style={{ width:'100%' }}
              initial={{ opacity:0, scale:0.97 }}
              animate={{ opacity:1, scale:1 }}
              exit={{ opacity:0, scale:0.97 }}
              transition={{ duration:0.28 }}
            >
              <FamilySetup onStart={() => setScene('game')} />
            </motion.div>
          ) : scene === 'game' ? (
            <motion.div key="game" style={{ width:'100%' }}
              initial={{ opacity:0, scale:0.97 }}
              animate={{ opacity:1, scale:1 }}
              exit={{ opacity:0, scale:0.97 }}
              transition={{ duration:0.28 }}
            >
              <GameBoard 
                onBackToSetup={() => setScene('setup')} 
                onEndGame={() => setScene('end')}
              />
            </motion.div>
          ) : (
            <motion.div key="end" style={{ width:'100%' }}
              initial={{ opacity:0, scale:1.05 }}
              animate={{ opacity:1, scale:1 }}
              exit={{ opacity:0, scale:0.95 }}
              transition={{ duration:0.5 }}
            >
              <EndGameScreen onFinished={() => setScene('setup')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameProvider>
  );
}
