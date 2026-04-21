import { useState } from 'react';
import { useGame } from '../../store/GameContext';
import Leaderboard from './Leaderboard';
import CategoryBoard from './CategoryBoard';
import QuestionModal from './QuestionModal';
import type { TriviaQuestion } from '../../types/index';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Zap, Trophy, Settings } from 'lucide-react';
import ClanEmblem from '../common/ClanEmblem';

type Props = { 
  onBackToSetup: () => void;
  onEndGame: () => void;
};

export default function GameBoard({ onBackToSetup, onEndGame }: Props) {
  const { gameState, updateScore, nextTurn, markQuestionAsAnswered, resetGame } = useGame();
  const [activeQ, setActiveQ]     = useState<TriviaQuestion | null>(null);
  const [roundCount, setRoundCount] = useState(0);

  const current       = gameState.families[gameState.currentFamilyIndex];

  // Manual game end only now
  const isGameOver = false;

  const leader = [...gameState.families].sort((a,b) => b.score-a.score)[0] || null;

  const advance = (correct: boolean, pts: number) => {
    if (!activeQ || !current) return;
    updateScore(current.id, pts, correct);
    markQuestionAsAnswered(activeQ.id);
    setActiveQ(null);
    nextTurn();
    setRoundCount(r => r + 1);
  };

  /* ── Game Over Screen ── */
  if (isGameOver && leader) {
    return (
      <div className="page-wrap" style={{ minHeight:'100vh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', gap:'28px', textAlign:'center', padding:'2rem 1rem' }}>

        <motion.div animate={{ rotate:[-8,8,-8,8,0], scale:[1,1.2,1] }}
          transition={{ delay:0.3, duration:0.9 }} style={{ fontSize:'5rem' }}>
          🏆
        </motion.div>

        <div>
          <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.8rem', textTransform:'uppercase',
            letterSpacing:'0.2em', marginBottom:'8px' }}>Heritage Quest Champion</p>
          <h2 style={{ color:'#fff', fontWeight:900, fontSize:'2.8rem', lineHeight:1 }}>
            Quest Complete!
          </h2>
        </div>

        <div className="panel" style={{ padding:'24px 40px', textAlign:'center' }}>
          <span style={{ fontSize:'4rem' }}>{leader.avatar}</span>
          <h3 style={{ color:'#fff', fontWeight:900, fontSize:'1.6rem', marginTop:'8px' }}>{leader.name}</h3>
          <p style={{ color:'#f59e0b', fontWeight:900, fontSize:'1.4rem' }}>{leader.score} pts</p>
        </div>

        {/* All scores */}
        <div style={{ display:'flex', flexDirection:'column', gap:'8px', width:'100%', maxWidth:'320px' }}>
          {[...gameState.families].sort((a,b) => b.score-a.score).slice(1).map((f,i) => (
            <div key={f.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'10px 14px', borderRadius:'12px', background:'rgba(255,255,255,0.07)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.75rem', fontWeight:800 }}>#{i+2}</span>
                <span style={{ fontSize:'1.4rem' }}>{f.avatar}</span>
                <span style={{ color:'#fff', fontWeight:700 }}>{f.name}</span>
              </div>
              <span style={{ color:'rgba(255,255,255,0.6)', fontWeight:800 }}>{f.score}</span>
            </div>
          ))}
        </div>

        <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
          onClick={() => { resetGame(); onBackToSetup(); }}
          className="btn" style={{ fontSize:'1.05rem', padding:'14px 36px' }}
        >
          <RotateCcw size={18} /> Play Again
        </motion.button>
      </div>
    );
  }

  /* ── Main Game ── */
  return (
    <div className="page-wrap" style={{ paddingTop:'1.25rem', paddingBottom:'2rem' }}>

      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'20px' }}>
        <button onClick={onBackToSetup}
          style={{ display:'flex', alignItems:'center', gap:'6px', color:'rgba(255,255,255,0.5)',
            fontSize:'0.82rem', fontWeight:700, background:'none', border:'none', cursor:'pointer' }}>
          <Settings size={14} /> Setup
        </button>

        <button onClick={() => { if(confirm('Reset all scores and board?')) { resetGame(); onBackToSetup(); } }}
          style={{ display:'flex', alignItems:'center', gap:'6px', color:'#f87171',
            fontSize:'0.82rem', fontWeight:700, background:'rgba(248,113,113,0.1)', border:'none',
            padding:'4px 10px', borderRadius:'8px', cursor:'pointer' }}>
          <RotateCcw size={14} /> Reset Game
        </button>

        <button onClick={onEndGame}
          style={{ display:'flex', alignItems:'center', gap:'6px', color:'#f59e0b',
            fontSize:'0.82rem', fontWeight:700, background:'rgba(245,158,11,0.1)', border:'none',
            padding:'4px 10px', borderRadius:'8px', cursor:'pointer' }}>
          <Trophy size={14} /> End Game
        </button>

        <div style={{ textAlign:'center', flexGrow: 1 }}>
          <h1 style={{ color:'#fff', fontWeight:900, fontSize:'1.1rem', letterSpacing:'0.04em' }}>
            ⚔️ HERITAGE QUEST
          </h1>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'6px',
          background:'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.3)',
          borderRadius:'20px', padding:'4px 12px' }}>
          <Zap size={13} style={{ color:'#f59e0b' }} />
          <span style={{ color:'#f59e0b', fontWeight:800, fontSize:'0.75rem' }}>
            Round {Math.floor(roundCount / Math.max(gameState.families.length, 1)) + 1}
          </span>
        </div>
      </div>

      {/* Layout grid */}
      <div className="game-grid" style={{ display:'grid', gridTemplateColumns:'1.1fr 2.9fr', gap:'20px', alignItems:'stretch' }}>

        {/* Sidebar: leaderboard */}
        <div className="sidebar" style={{ position:'sticky', top:'16px', height:'100%' }}>
          <Leaderboard />
        </div>

        {/* Main: turn banner + board */}
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>

          {/* Whose turn */}
          <AnimatePresence mode="wait">
            <motion.div key={current?.id}
              initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              className="panel"
              style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'12px', padding:'12px 20px' }}
            >
              <ClanEmblem emoji={current?.avatar || ''} size="lg" />
              <div>
                <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.62rem', textTransform:'uppercase',
                  letterSpacing:'0.12em' }}>Pick a category</p>
                <p style={{ color:'#fff', fontWeight:900, fontSize:'1.05rem' }}>{current?.name}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <CategoryBoard onSelectQuestion={setActiveQ} />
        </div>
      </div>

      {/* Question modal */}
      <AnimatePresence>
        {activeQ && current && (
          <QuestionModal
            key={activeQ.id + String(Date.now())}
            question={activeQ}
            familyName={current.name}
            familyAvatar={current.avatar}
            onCorrect={()  => advance(true,  activeQ.points)}
            onIncorrect={() => advance(false, 0)}
            onClose={()    => advance(false, 0)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
