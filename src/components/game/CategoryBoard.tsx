import React from 'react';
import { motion } from 'framer-motion';
import type { CategoryType, DifficultyType, TriviaQuestion } from '../../types/index';
import { QUESTIONS } from '../../data/questions';
import { useGame } from '../../store/GameContext';
import { RotateCw } from 'lucide-react';
import WheelModal from './WheelModal';

type Props = { onSelectQuestion: (q: TriviaQuestion) => void };

const CATEGORIES: CategoryType[] = [
  'Global Trailblazers',
  'The Pitch: Soccer & Beyond',
  'Weird But True?',
  'Disney & Animation Magic',
  'World Shapers: Global Icons',
  'Expedition: Geography',
  'Time Machine: History',
  'The Lab: Science',
  'Brain Flex: Math Challenges',
  'Animal Kingdom',
  'The Global Kitchen',
  'Riddle Me This',
  'Screen Time: Modern Tech & Apps',
  'Arts & Masterpieces',
  'Daily Life & Inventions'
];
const DIFFS: DifficultyType[] = ['easy','medium','hard'];

/* Trivia Crack-inspired bold category colors */
const CAT: Record<CategoryType, { emoji:string; color:string; shadow:string; label:string }> = {
  'Global Trailblazers':         { emoji:'🚀', color:'#1d4ed8', shadow:'rgba(29,78,216,0.5)',  label:'Trailblazers' },
  'The Pitch: Soccer & Beyond':  { emoji:'⚽', color:'#16a34a', shadow:'rgba(22,163,74,0.5)',  label:'The Pitch'    },
  'Weird But True?':             { emoji:'🤯', color:'#7c3aed', shadow:'rgba(124,58,237,0.5)', label:'Weird!'       },
  'Disney & Animation Magic':    { emoji:'🎬', color:'#db2777', shadow:'rgba(219,39,119,0.5)', label:'Disney'      },
  'World Shapers: Global Icons': { emoji:'🌟', color:'#b45309', shadow:'rgba(180,83,9,0.5)',   label:'Icons'       },
  'Expedition: Geography':       { emoji:'🗺️', color:'#0891b2', shadow:'rgba(8,145,178,0.5)',  label:'Expedition'  },
  'Time Machine: History':       { emoji:'⏳', color:'#ea580c', shadow:'rgba(234,88,12,0.5)',  label:'Time Machine' },
  'The Lab: Science':            { emoji:'🔬', color:'#2563eb', shadow:'rgba(37,99,235,0.5)',  label:'The Lab'      },
  'Brain Flex: Math Challenges': { emoji:'🧩', color:'#4f46e5', shadow:'rgba(79,70,229,0.5)',  label:'Brain Flex'   },
  'Animal Kingdom':              { emoji:'🦁', color:'#65a30d', shadow:'rgba(101,163,13,0.5)', label:'Animals'      },
  'The Global Kitchen':          { emoji:'🍕', color:'#f59e0b', shadow:'rgba(245,158,11,0.5)', label:'Kitchen'      },
  'Riddle Me This':              { emoji:'🤔', color:'#ec4899', shadow:'rgba(236,72,153,0.5)', label:'Riddles'      },
  'Screen Time: Modern Tech & Apps': { emoji:'📱', color:'#0ea5e9', shadow:'rgba(14,165,233,0.5)', label:'Tech' },
  'Arts & Masterpieces':         { emoji:'🎨', color:'#f43f5e', shadow:'rgba(244,63,94,0.5)', label:'Arts'         },
  'Daily Life & Inventions':     { emoji:'💡', color:'#8b5cf6', shadow:'rgba(139,92,246,0.5)', label:'Inventions'   },
};

const DIFF_LABEL: Record<DifficultyType, { pts:string; ring:string }> = {
  easy:   { pts:'100', ring:'#4ade80' },
  medium: { pts:'200', ring:'#fbbf24' },
  hard:   { pts:'300', ring:'#f87171' },
};

function pickRandom(cat: CategoryType, diff: DifficultyType, answeredIds: string[]): TriviaQuestion | null {
  const pool = QUESTIONS.filter(q => q.category === cat && q.difficulty === diff);
  const available = pool.filter(q => !answeredIds.includes(q.id));
  const finalPool = available.length > 0 ? available : pool;
  return finalPool.length ? finalPool[Math.floor(Math.random() * finalPool.length)] : null;
}

function DiffRow({ cat, onPick }: { cat: CategoryType; onPick:(q:TriviaQuestion)=>void }) {
  const { gameState } = useGame();
  return (
    <div style={{ display:'flex', gap:'4px', justifyContent:'center', marginTop:'6px' }}>
      {DIFFS.map(diff => {
        const dl = DIFF_LABEL[diff];
        const pool = QUESTIONS.filter(q => q.category === cat && q.difficulty === diff);
        const available = pool.filter(q => !gameState.answeredQuestionIds.includes(q.id));
        const isExhausted = pool.length > 0 && available.length === 0;

        return (
          <motion.button key={diff}
            whileHover={!isExhausted ? { scale:1.15 } : {}} 
            whileTap={!isExhausted ? { scale:0.9 } : {}}
            disabled={isExhausted}
            onClick={() => { 
              if (isExhausted) return;
              const q = pickRandom(cat, diff, gameState.answeredQuestionIds); 
              if(q) onPick(q); 
            }}
            style={{
              background: isExhausted ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.15)',
              border:`2px solid ${isExhausted ? '#475569' : dl.ring}`,
              borderRadius:'8px', padding:'3px 6px',
              color: isExhausted ? '#475569' : dl.ring, fontWeight:800, fontSize:'0.6rem',
              cursor: isExhausted ? 'not-allowed' : 'pointer', 
              transition:'all 0.15s',
              opacity: isExhausted ? 0.5 : 1,
            }}
          >
            {dl.pts}
          </motion.button>
        );
      })}
    </div>
  );
}

export default function CategoryBoard({ onSelectQuestion }: Props) {
  const [active, setActive] = React.useState<CategoryType | null>(null);
  const { gameState } = useGame();
  const [isWheelOpen, setIsWheelOpen] = React.useState(false);

  return (
    <div>
      <div className="category-grid" style={{
        display:'grid',
        gridTemplateColumns:'repeat(5, 1fr)',
        gap:'12px',
      }}>
        {CATEGORIES.map((cat, ci) => {
          const cm = CAT[cat];
          const isActive = active === cat;
          
          // Check if ALL questions in this category are exhausted
          const catQuestions = QUESTIONS.filter(q => q.category === cat);
          const answeredInCat = catQuestions.filter(q => gameState.answeredQuestionIds.includes(q.id));
          const isExhausted = catQuestions.length > 0 && answeredInCat.length === catQuestions.length;

          return (
            <motion.div key={cat}
              initial={{ opacity:0, scale:0.7 }}
              animate={{ opacity:1, scale:1 }}
              transition={{ delay: ci * 0.05, type:'spring', stiffness:280, damping:22 }}
              style={{ display:'flex', flexDirection:'column', alignItems:'center', position: 'relative' }}
            >
              <motion.button
                whileHover={{ scale:1.08, boxShadow:`0 8px 32px ${cm.shadow}` }}
                whileTap={{ scale:0.93 }}
                onClick={() => setActive(prev => prev === cat ? null : cat)}
                style={{
                  width:'100%',
                  aspectRatio:'1',
                  borderRadius:'50%',
                  background: isExhausted 
                    ? `linear-gradient(135deg, #334155, #1e293b)`
                    : `radial-gradient(circle at 35% 35%, ${cm.color}ee, ${cm.color}99)`,
                  boxShadow: isActive
                    ? `0 0 0 4px #fff, 0 8px 32px ${cm.shadow}`
                    : `0 6px 20px ${cm.shadow}`,
                  border: isActive ? `3px solid #fff` : `3px solid ${isExhausted ? '#475569' : cm.color+'88'}`,
                  display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center',
                  cursor:'pointer',
                  transition:'all 0.2s',
                  gap:'2px',
                  opacity: isExhausted ? 0.7 : 1,
                }}
              >
                <span style={{ fontSize:'1.8rem', lineHeight:1, filter: isExhausted ? 'grayscale(1)' : 'none' }}>{cm.emoji}</span>
                <span style={{
                  color:'#fff', fontWeight:900, fontSize:'0.65rem',
                  textTransform:'uppercase', letterSpacing:'0.04em',
                  textAlign:'center', lineHeight:'1.1',
                  maxWidth:'95%',
                }}>
                  {cm.label}
                </span>
                {isExhausted && (
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-15deg)', 
                    background: 'rgba(255,255,255,0.9)', color: '#1e293b', fontSize: '0.5rem', fontWeight: 900, 
                    padding: '2px 4px', borderRadius: '4px', border: '1px solid #1e293b' }}>
                    DONE
                  </div>
                )}
              </motion.button>

              <motion.div
                initial={false}
                animate={{ opacity: isActive ? 1 : 0, height: isActive ? 'auto' : 0 }}
                transition={{ duration:0.2 }}
                style={{ overflow:'hidden', width:'100%' }}
              >
                {isActive && (
                  <DiffRow cat={cat} onPick={(q) => { setActive(null); onSelectQuestion(q); }} />
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {active && (
        <p style={{ textAlign:'center', color:'rgba(255,255,255,0.5)', fontSize:'0.7rem',
          marginTop:'16px', fontWeight:600 }}>
          Select a difficulty above ↑
        </p>
      )}

      <div style={{ display:'flex', justifyContent:'center', marginTop:'30px' }}>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsWheelOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            border: '2px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            padding: '16px 32px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
            fontSize: '1rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          <RotateCw size={20} />
          Spin the Mystic Wheel
        </motion.button>
      </div>

      <WheelModal 
        isOpen={isWheelOpen}
        onClose={() => setIsWheelOpen(false)}
        onSelect={onSelectQuestion}
        categories={CATEGORIES}
        answeredIds={gameState.answeredQuestionIds}
        catConfig={CAT}
      />
    </div>
  );
}
