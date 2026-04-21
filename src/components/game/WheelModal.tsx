import { useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { RotateCw, X } from 'lucide-react';
import type { CategoryType, DifficultyType, TriviaQuestion } from '../../types/index';
import { QUESTIONS } from '../../data/questions';
import { soundService } from '../../services/SoundService';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (q: TriviaQuestion) => void;
  categories: CategoryType[];
  answeredIds: string[];
  catConfig: Record<string, { emoji: string; color: string; label: string; shadow: string }>;
};

const DIFFS: DifficultyType[] = ['easy', 'medium', 'hard'];
const DIFF_COLORS = { easy: '#4ade80', medium: '#fbbf24', hard: '#f87171' };

export default function WheelModal({ isOpen, onClose, onSelect, categories, answeredIds, catConfig }: Props) {
  const [isSpinning, setIsSpinning] = useState(false);
  const controls = useAnimation();
  const [result, setResult] = useState<{ cat: CategoryType; diff: DifficultyType } | null>(null);

  const totalSegments = categories.length * 3; // 15 * 3 = 45
  const segmentAngle = 360 / totalSegments;

  const spin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);

    const extraSpins = 5 + Math.random() * 5;
    const totalRotation = extraSpins * 360 + Math.random() * 360;

    soundService.play('spin', 0.4, true);
    await controls.start({
      rotate: totalRotation,
      transition: { duration: 5, ease: [0.15, 0, 0.15, 1] }
    });
    soundService.stop('spin');
    soundService.play('fanfare');

    // The wheel rotates clockwise. The pointer is at the top (0 deg).
    // resultAngle = (360 - (totalRotation % 360)) % 360
    const finalAngle = (360 - (totalRotation % 360)) % 360;
    const segmentIndex = Math.floor(finalAngle / segmentAngle);
    
    // segmentIndex 0..44
    // category index = Math.floor(segmentIndex / 3)
    // difficulty index = segmentIndex % 3
    const catIndex = Math.floor(segmentIndex / 3);
    const diffIndex = segmentIndex % 3;
    
    const selectedCat = categories[catIndex];
    const selectedDiff = DIFFS[diffIndex];

    // Reset rotation for next time
    controls.set({ rotate: totalRotation % 360 });

    const pool = QUESTIONS.filter(q => q.category === selectedCat && q.difficulty === selectedDiff);
    const available = pool.filter(q => !answeredIds.includes(q.id));

    setResult({ cat: selectedCat, diff: selectedDiff });

    if (available.length > 0) {
      const randomQ = available[Math.floor(Math.random() * available.length)];
      setTimeout(() => {
        onSelect(randomQ);
        onClose();
        setIsSpinning(false);
      }, 6000);
    } else {
      setIsSpinning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(2, 6, 23, 0.92)',
      backdropFilter: 'blur(12px)',
      padding: '20px'
    }}>
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.9 }}
        className="wheel-modal-content"
        style={{
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '40px',
          padding: '40px',
          width: '100%',
          maxWidth: '780px',
          position: 'relative',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 25px 50px -12px rgba(0,0,0,0.8)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Decorative background glow */}
        <div style={{
          position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
          width: '300px', height: '300px', background: 'rgba(56, 189, 248, 0.15)',
          filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none'
        }} />

        <button onClick={onClose} style={{
          position: 'absolute', top: '25px', right: '25px',
          background: 'rgba(255,255,255,0.05)', border: 'none',
          borderRadius: '50%', width: '44px', height: '44px',
          color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100
        }}>
          <X size={24} />
        </button>

        <h2 style={{ 
          color: '#fff', fontSize: '2.5rem', fontWeight: 900, 
          marginBottom: '5px', textAlign: 'center',
          background: 'linear-gradient(to bottom, #fff, #94a3b8)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em'
        }}>
          THE MYSTIC WHEEL
        </h2>
        <p style={{ color: '#64748b', marginBottom: '40px', textAlign: 'center', fontSize: '1rem', fontWeight: 500 }}>
          Behold the artifact of destiny!
        </p>

        <div style={{ 
          position: 'relative', width: '560px', height: '560px', 
          perspective: '1200px',
          marginBottom: '30px'
        }}>
          {/* Pointer */}
          <div style={{
            position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)',
            zIndex: 50, width: '40px', height: '50px',
            background: '#fff', clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
            filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.5))',
            border: '2px solid #0f172a'
          }} />

          {/* 3D Wheel Container */}
          <motion.div
            style={{ 
              width: '100%', height: '100%',
              transformStyle: 'preserve-3d',
              rotateX: 12 // 3D tilt
            }}
          >
            {/* Wheel Shadow/Depth */}
            <div style={{
              position: 'absolute', inset: '-10px',
              background: '#020617', borderRadius: '50%',
              transform: 'translateZ(-40px)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.8)'
            }} />

            {/* The Main Wheel */}
            <motion.div
              animate={controls}
              style={{ 
                position: 'absolute', inset: 0, 
                borderRadius: '50%', 
                border: '12px solid #334155',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5), 0 0 0 4px #475569',
                overflow: 'hidden',
                background: '#1e293b'
              }}
            >
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                {categories.map((cat, cIdx) => {
                  const cm = catConfig[cat];
                  const catStartAngle = cIdx * (360 / 15);
                  const catMidAngle = catStartAngle + (360 / 30);
                  const catEndAngle = (cIdx + 1) * (360 / 15);
                  
                  // Main category slice path
                  const x1 = 50 + 50 * Math.cos((Math.PI * catStartAngle) / 180);
                  const y1 = 50 + 50 * Math.sin((Math.PI * catStartAngle) / 180);
                  const x2 = 50 + 50 * Math.cos((Math.PI * catEndAngle) / 180);
                  const y2 = 50 + 50 * Math.sin((Math.PI * catEndAngle) / 180);

                  return (
                    <g key={cat}>
                      {/* Main Category Background */}
                      <path
                        d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                        fill={cm.color}
                        stroke="#0f172a"
                        strokeWidth="0.3"
                      />
                      
                      {/* E M H Blocks at the base */}
                      {DIFFS.map((diff, dIdx) => {
                        const subAngle = (360 / 45);
                        const start = catStartAngle + dIdx * subAngle;
                        const end = catStartAngle + (dIdx + 1) * subAngle;
                        
                        // Inner radius for blocks
                        const rInner = 9;
                        const rOuter = 18;
                        
                        const ix1 = 50 + rOuter * Math.cos((Math.PI * start) / 180);
                        const iy1 = 50 + rOuter * Math.sin((Math.PI * start) / 180);
                        const ix2 = 50 + rOuter * Math.cos((Math.PI * end) / 180);
                        const iy2 = 50 + rOuter * Math.sin((Math.PI * end) / 180);
                        
                        const ix3 = 50 + rInner * Math.cos((Math.PI * end) / 180);
                        const iy3 = 50 + rInner * Math.sin((Math.PI * end) / 180);
                        const ix4 = 50 + rInner * Math.cos((Math.PI * start) / 180);
                        const iy4 = 50 + rInner * Math.sin((Math.PI * start) / 180);

                        return (
                          <g key={`${cat}-${diff}`}>
                            <path
                              d={`M ${ix4} ${iy4} L ${ix1} ${iy1} A ${rOuter} ${rOuter} 0 0 1 ${ix2} ${iy2} L ${ix3} ${iy3} A ${rInner} ${rInner} 0 0 0 ${ix4} ${iy4} Z`}
                              fill={DIFF_COLORS[diff]}
                              stroke="#0f172a"
                              strokeWidth="0.2"
                            />
                            <text
                              x={50 + 15 * Math.cos((Math.PI * (start + subAngle/2)) / 180)}
                              y={50 + 15 * Math.sin((Math.PI * (start + subAngle/2)) / 180)}
                              transform={`rotate(${(start + subAngle/2) + 90}, ${50 + 15 * Math.cos((Math.PI * (start + subAngle/2)) / 180)}, ${50 + 15 * Math.sin((Math.PI * (start + subAngle/2)) / 180)})`}
                              fill="#fff"
                              fontSize="1.8"
                              fontWeight="900"
                              textAnchor="middle"
                              alignmentBaseline="middle"
                              style={{ pointerEvents: 'none' }}
                            >
                              {diff[0].toUpperCase()}
                            </text>
                          </g>
                        );
                      })}

                      {/* Category Label and Icon */}
                      <g transform={`rotate(${catMidAngle}, 50, 50)`}>
                        <text
                          x="82" y="50"
                          fill="#fff"
                          fontSize="2.4"
                          fontWeight="900"
                          textAnchor="middle"
                          alignmentBaseline="middle"
                          style={{ pointerEvents: 'none', textTransform: 'uppercase' }}
                        >
                          {cm.emoji} {cm.label.length > 10 ? cm.label.slice(0, 9) + '..' : cm.label}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </motion.div>

            {/* Center Hub */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%) translateZ(20px)',
              width: '100px', height: '100px', borderRadius: '50%',
              background: '#0f172a', border: '6px solid #334155',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
            }}>
               <button
                onClick={spin}
                disabled={isSpinning}
                style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%)',
                  border: 'none',
                  cursor: isSpinning ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3)',
                  color: '#fff', fontWeight: 900, fontSize: '1.2rem',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                {isSpinning ? <RotateCw className="animate-spin" size={32} /> : 'SPIN'}
              </button>
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              style={{ 
                textAlign: 'center', zIndex: 10,
                background: 'rgba(255,255,255,0.05)',
                padding: '20px 40px', borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(4px)'
              }}
            >
              <div style={{ 
                color: catConfig[result.cat].color, 
                fontSize: '1.8rem', fontWeight: 900,
                marginBottom: '5px'
              }}>
                {catConfig[result.cat].emoji} {result.cat}
              </div>
              <div style={{ 
                color: '#fff', fontSize: '1.2rem', fontWeight: 700, 
                textTransform: 'uppercase', letterSpacing: '0.1em' 
              }}>
                DIFFICULTY: <span style={{ color: DIFF_COLORS[result.diff] }}>{result.diff}</span>
              </div>

              {/* Suspense Progress Bar */}
              <div style={{ 
                width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', 
                borderRadius: '2px', marginTop: '15px', overflow: 'hidden'
              }}>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 6, ease: 'linear' }}
                  style={{ height: '100%', background: catConfig[result.cat].color }}
                />
              </div>
              
              {QUESTIONS.filter(q => q.category === result.cat && q.difficulty === result.diff && !answeredIds.includes(q.id)).length === 0 && (
                <p style={{ color: '#f87171', marginTop: '10px', fontSize: '0.9rem', fontWeight: 800 }}>
                  CATEGORY EXHAUSTED! TRY ANOTHER SPIN
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

