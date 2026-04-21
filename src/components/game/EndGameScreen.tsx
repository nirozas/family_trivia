import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useGame } from '../../store/GameContext';
import ClanEmblem from '../common/ClanEmblem';
import { soundService } from '../../services/SoundService';
import confetti from 'canvas-confetti';

type Props = { onFinished: () => void };

export default function EndGameScreen({ onFinished }: Props) {
  const { gameState, resetGame } = useGame();
  const [timeLeft, setTimeLeft] = useState(10);

  const sorted = [...gameState.families].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  useEffect(() => {
    // Play winning sound and confetti
    soundService.play('fanfare');
    confetti({
      particleCount: 400,
      spread: 160,
      origin: { y: 0.4 },
      colors: ['#f59e0b', '#4f8ef7', '#ec4899', '#22c55e']
    });

    const timer = setInterval(() => {
      setTimeLeft((p) => {
        if (p <= 1) {
          clearInterval(timer);
          resetGame();
          onFinished();
          return 0;
        }
        return p - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []); // eslint-disable-line

  if (!winner) return null;

  return (
    <div className="page-wrap" style={{ 
      minHeight: '100vh', display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center', padding: '2rem' 
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="panel-bright"
        style={{ 
          width: '100%', maxWidth: '600px', textAlign: 'center', 
          padding: '3rem', position: 'relative', overflow: 'hidden' 
        }}
      >
        <div style={{ 
          position: 'absolute', top: 0, left: 0, right: 0, height: '6px', 
          background: 'linear-gradient(90deg, #f59e0b, #4f8ef7, #ec4899)' 
        }} />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Trophy size={80} style={{ color: '#f59e0b', marginBottom: '1.5rem' }} />
          <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem', color: '#1e293b' }}>
            VICTORY!
          </h1>
          <p style={{ color: '#64748b', fontWeight: 600, fontSize: '1.1rem', marginBottom: '2.5rem' }}>
            The quest has concluded. Behold the champions!
          </p>
        </motion.div>

        {/* Winner Highlight */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', delay: 0.4 }}
          style={{ 
            background: 'rgba(245, 158, 11, 0.1)', border: '2px solid #f59e0b', 
            borderRadius: '24px', padding: '2rem', marginBottom: '2.5rem' 
          }}
        >
          <ClanEmblem emoji={winner.avatar} size="lg" animate glow />
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f59e0b', marginTop: '1rem' }}>
            {winner.name}
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 800 }}>Score</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e293b' }}>{winner.score}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 800 }}>Accuracy</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#22c55e' }}>
                {Math.round((winner.correctAnswers / (winner.correctAnswers + winner.wrongAnswers || 1)) * 100)}%
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '3rem' }}>
          {sorted.slice(1).map((f, i) => (
            <div key={f.id} style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#94a3b8', fontWeight: 800, fontSize: '0.8rem' }}>#{i + 2}</span>
                <ClanEmblem emoji={f.avatar} size="sm" />
                <span style={{ fontWeight: 700, color: '#334155' }}>{f.name}</span>
              </div>
              <span style={{ fontWeight: 800, color: '#64748b' }}>{f.score} pts</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #e2e8f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#94a3b8'
          }}>
            {timeLeft}
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>
            Returning to setup shortly...
          </p>
        </div>
      </motion.div>
    </div>
  );
}
