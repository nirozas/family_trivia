import { motion } from 'framer-motion';
import { Crown, Trophy } from 'lucide-react';
import { useGame } from '../../store/GameContext';
import ClanEmblem from '../common/ClanEmblem';

export default function Leaderboard() {
  const { gameState } = useGame();
  const sorted  = [...gameState.families].sort((a, b) => b.score - a.score);
  const current = gameState.families[gameState.currentFamilyIndex];

  const PODIUM = [
    { idx: 0, height: 80, color: '#f59e0b', glow: 'rgba(245,158,11,0.4)', label: '🥇' },
    { idx: 1, height: 56, color: '#94a3b8', glow: 'rgba(148,163,184,0.3)', label: '🥈' },
    { idx: 2, height: 38, color: '#b45309', glow: 'rgba(180,83,9,0.3)',    label: '🥉' },
  ];

  return (
    <div className="panel flex flex-col gap-4" style={{ height: '100%' }}>
      {/* Title */}
      <div className="flex items-center gap-2 mb-2">
        <Trophy size={17} style={{ color: '#f59e0b' }} />
        <span style={{ color:'#fff', fontWeight:800, fontSize:'0.95rem', letterSpacing:'0.02em' }}>
          Leaderboard
        </span>
      </div>

      {/* Podium (top 3) */}
      {sorted.length >= 2 && (
        <div className="lb-podium" style={{ display:'flex', alignItems:'flex-end', justifyContent:'center', gap:'8px', 
          paddingTop:'40px', paddingBottom:'12px', height:'190px', marginTop:'20px' }}>
          {/* Arrange: 2nd | 1st | 3rd */}
          {[1, 0, 2].map(rank => {
            const fam = sorted[rank];
            if (!fam) return null;
            const p = PODIUM[rank];
            
            // Equal scores = equal heights. Top score is 85px, 0 score is 35px.
            const maxScore = sorted[0]?.score || 1;
            const dynamicHeight = 35 + ((fam.score / maxScore) * 50);

            return (
              <motion.div key={fam.id} layout
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', flex:1 }}
              >
                <ClanEmblem emoji={fam.avatar} size="md" glow={rank === 0} />
                <span style={{ color:'#fff', fontSize:'0.6rem', fontWeight:700, textAlign:'center',
                  maxWidth:'60px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {fam.name}
                </span>
                <span style={{ color: p.color, fontSize:'0.7rem', fontWeight:900 }}>{fam.score}</span>
                <div style={{
                  width:'100%', height: dynamicHeight,
                  background: `linear-gradient(180deg, ${p.color}99, ${p.color}44)`,
                  borderRadius:'8px 8px 0 0',
                  boxShadow: `0 -4px 16px ${p.glow}`,
                  display:'flex', alignItems:'flex-start', justifyContent:'center',
                  paddingTop:'6px', fontSize:'1rem',
                }}>
                  {p.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full rank list */}
      <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
        {sorted.map((fam, idx) => {
          const isActive = current?.id === fam.id;
          return (
            <motion.div key={fam.id} layout
              className="lb-row"
              transition={{ type:'spring', stiffness:400, damping:30 }}
              style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'12px 14px', borderRadius:'16px',
                background: isActive ? 'rgba(79,142,247,0.18)' : 'rgba(255,255,255,0.05)',
                border: isActive ? '1.5px solid rgba(79,142,247,0.5)' : '1px solid rgba(255,255,255,0.07)',
                boxShadow: isActive ? '0 0 16px rgba(79,142,247,0.2)' : 'none',
                transition: 'all 0.3s',
              }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.7rem', fontWeight:800, width:'14px' }}>
                  {idx + 1}
                </span>
                <ClanEmblem emoji={fam.avatar} size="sm" animate={isActive} glow={isActive} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="lb-name" style={{
                    color: isActive ? '#4f8ef7' : '#fff',
                    fontSize: '0.8rem', fontWeight: 700,
                    maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {fam.name}
                  </span>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem', fontWeight: 900 }}>
                    <span style={{ color: '#4ade80' }}>✓ {fam.correctAnswers}</span>
                    <span style={{ color: '#f87171' }}>✗ {fam.wrongAnswers}</span>
                  </div>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                {isActive && <Crown size={11} style={{ color:'#f59e0b' }} />}
                <span style={{
                  color: idx === 0 ? '#f59e0b' : 'rgba(255,255,255,0.7)',
                  fontSize:'0.85rem', fontWeight:900,
                }}>
                  {fam.score}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Current turn */}
      {current && (
        <div style={{
          borderTop:'1px solid rgba(255,255,255,0.1)',
          paddingTop:'12px', textAlign:'center',
        }}>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.6rem', textTransform:'uppercase',
            letterSpacing:'0.15em', marginBottom:'6px' }}>Now Playing</p>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
            <ClanEmblem emoji={current.avatar} size="md" />
            <span style={{ color:'#4f8ef7', fontWeight:800, fontSize:'0.9rem' }}>{current.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}
