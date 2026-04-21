import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TriviaQuestion } from '../../types/index';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, XCircle } from 'lucide-react';
import ClanEmblem from '../common/ClanEmblem';
import { soundService } from '../../services/SoundService';

type Props = {
  question: TriviaQuestion;
  familyName: string;
  familyAvatar: string;
  onCorrect: () => void;
  onIncorrect: () => void;
  onClose: () => void;
};

const TIMER_TOTAL = 40;

const CAT_IMAGES: Record<string, string> = {
  'Global Trailblazers':         'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&h=180&fit=crop&auto=format',
  'The Pitch: Soccer & Beyond':  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&h=180&fit=crop&auto=format',
  'Weird But True?':             'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=500&h=180&fit=crop&auto=format',
  'Disney & Animation Magic':    'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=500&h=180&fit=crop&auto=format',
  'World Shapers: Global Icons': 'https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=500&h=180&fit=crop&auto=format',
  'Expedition: Geography':       'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&h=180&fit=crop&auto=format',
  'Time Machine: History':       'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=500&h=180&fit=crop&auto=format',
  'The Lab: Science':            'https://images.unsplash.com/photo-1532094349884-543559ba2f74?w=500&h=180&fit=crop&auto=format',
  'Brain Flex: Math Challenges': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&h=180&fit=crop&auto=format',
  'Animal Kingdom':              'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=500&h=180&fit=crop&auto=format',
  'The Global Kitchen':          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=180&fit=crop&auto=format',
  'Riddle Me This':              'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=500&h=180&fit=crop&auto=format',
  'Screen Time: Modern Tech & Apps': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&h=180&fit=crop&auto=format',
  'Arts & Masterpieces':         'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=180&fit=crop&auto=format',
  'Daily Life & Inventions':     'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=180&fit=crop&auto=format',
};

const DIFF_COLOR: Record<string, string> = { easy:'#4ade80', medium:'#fbbf24', hard:'#f87171' };

export default function QuestionModal({ question, familyName, familyAvatar, onCorrect, onIncorrect }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_TOTAL);
  const [imgErr,   setImgErr]   = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setTimeLeft(p => {
        if (p === 7) soundService.play('tick', 0.6, true);
        if (p <= 1) {
          clearInterval(timer.current!);
          soundService.stop('tick');
          if (!answered) {
            setAnswered(true);
            setSelected('__timeout__');
            soundService.play('wrong');
          }
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(timer.current!);
  }, []); // eslint-disable-line

  const handlePick = (opt: string) => {
    if (answered) return;
    clearInterval(timer.current!);
    soundService.stop('tick');
    setSelected(opt);
    setAnswered(true);
    if (opt === question.correctAnswer) {
      soundService.play('correct');
      confetti({ particleCount:200, spread:80, origin:{ y:0.5 },
        colors:['#4f8ef7','#9b5de5','#f59e0b','#00b94a'] });
    } else {
      soundService.play('wrong');
    }
  };

  const timedOut  = selected === '__timeout__';
  const isCorrect = !timedOut && selected === question.correctAnswer;

  /* SVG timer ring */
  const R      = 22;
  const circ   = 2 * Math.PI * R;
  const offset = circ - (timeLeft / TIMER_TOTAL) * circ;
  const urgent = timeLeft <= 10;
  const ringColor = urgent ? '#ff3b3b' : '#4f8ef7';
  const imgSrc = question.image || CAT_IMAGES[question.category] || '';

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center',
        justifyContent:'center', padding:'1rem',
        background:'rgba(4,8,24,0.88)', backdropFilter:'blur(10px)' }}
    >
      <motion.div
        initial={{ scale:0.82, y:36 }} animate={{ scale:1, y:0 }}
        exit={{ scale:0.88, opacity:0 }}
        transition={{ type:'spring', stiffness:310, damping:26 }}
        style={{ width:'100%', maxWidth:'440px', borderRadius:'24px', overflow:'hidden',
          background:'#0d1530', border:'1px solid rgba(255,255,255,0.12)',
          boxShadow:'0 24px 80px rgba(0,0,0,0.6)' }}
      >
        {/* ── Top accent strip ── */}
        <div style={{ height:'3px', background:'linear-gradient(90deg,#4f8ef7,#9b5de5,#f59e0b)' }} />

        {/* ── Header bar ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'10px 14px', background:'rgba(255,255,255,0.04)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          {/* Family */}
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <ClanEmblem emoji={familyAvatar} size="sm" animate={false} />
            <div>
              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.1em' }}>Answering</p>
              <p style={{ color:'#4f8ef7', fontWeight:800, fontSize:'0.82rem' }}>{familyName}</p>
            </div>
          </div>

          {/* Timer ring */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
              <circle cx="28" cy="28" r={R} fill="none"
                stroke={ringColor} strokeWidth="4"
                strokeDasharray={circ} strokeDashoffset={offset}
                strokeLinecap="round" transform="rotate(-90 28 28)"
                style={{ transition:'stroke-dashoffset 1s linear, stroke 0.4s' }}
              />
              <text x="28" y="33" textAnchor="middle" fontSize="14" fontWeight="800"
                fill={urgent ? '#ff3b3b' : '#fff'}>
                {timeLeft}
              </text>
            </svg>
          </div>

          {/* Difficulty pill */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'4px' }}>
            <span style={{
              background: `${DIFF_COLOR[question.difficulty]}22`,
              color: DIFF_COLOR[question.difficulty],
              border: `1px solid ${DIFF_COLOR[question.difficulty]}55`,
              borderRadius:'20px', padding:'2px 10px',
              fontSize:'0.65rem', fontWeight:800, textTransform:'uppercase',
            }}>{question.difficulty}</span>
            <span style={{ color:'#f59e0b', fontWeight:900, fontSize:'0.8rem' }}>+{question.points} pts</span>
          </div>
        </div>

        {/* ── Image ── */}
        {!imgErr && imgSrc && (
          <div style={{ width:'100%', height:'160px', overflow:'hidden', background:'#0a0e20' }}>
            <img src={imgSrc} alt={question.category} onError={() => setImgErr(true)}
              style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.85 }} />
          </div>
        )}

        {/* ── Question ── */}
        <div style={{ padding:'16px 18px 10px', textAlign:'center' }}>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.65rem', textTransform:'uppercase',
            letterSpacing:'0.12em', marginBottom:'8px' }}>{question.category}</p>
          <h2 style={{ color:'#fff', fontWeight:800, fontSize:'1.05rem', lineHeight:'1.4' }}>
            {question.question}
          </h2>
        </div>

        {/* ── Options ── */}
        <div style={{ padding:'6px 14px 14px', display:'flex', flexDirection:'column', gap:'8px' }}>
          {question.options.map((opt, i) => {
            const isSelected = opt === selected;
            const isRight    = opt === question.correctAnswer;
            const BASE_CLASSES = ['opt-a','opt-b','opt-c','opt-d'];
            let extraClass = BASE_CLASSES[i] ?? 'opt-a';
            let extraStyle: React.CSSProperties = {};
            if (answered) {
              if (isRight)                     { extraClass += ' correct'; }
              else if (isSelected && !isRight) { extraClass += ' wrong';  }
              else                             { extraClass = 'answer-btn dim'; extraStyle = {}; }
            }
            return (
              <motion.button key={opt}
                className={`answer-btn ${extraClass}`}
                style={extraStyle}
                initial={{ opacity:0, x:-10 }}
                animate={{ opacity:1, x:0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => handlePick(opt)}
                disabled={answered}
              >
                <span style={{
                  width:'24px', height:'24px', borderRadius:'50%', flexShrink:0,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  background:'rgba(255,255,255,0.1)',
                  fontSize:'0.7rem', fontWeight:900, color:'rgba(255,255,255,0.6)',
                }}>
                  {String.fromCharCode(65+i)}
                </span>
                <span style={{ flex:1, fontSize:'0.88rem' }}>{opt}</span>
                {answered && isRight    && <CheckCircle2 size={17} style={{ color:'#4ade80', flexShrink:0 }} />}
                {answered && isSelected && !isRight && <XCircle size={17} style={{ color:'#f87171', flexShrink:0 }} />}
              </motion.button>
            );
          })}
        </div>

        {/* ── Result / Explanation ── */}
        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
              style={{ margin:'0 14px', borderRadius:'12px', padding:'10px 14px',
                background: isCorrect ? 'rgba(0,185,74,0.12)' : 'rgba(255,59,59,0.1)',
                border: `1px solid ${isCorrect ? 'rgba(0,185,74,0.3)' : 'rgba(255,59,59,0.25)'}` }}
            >
              <p style={{ color: isCorrect ? '#4ade80' : '#f87171', fontWeight:800, fontSize:'0.85rem' }}>
                {timedOut ? "⏰ Time's up!" : isCorrect ? `🎉 +${question.points} pts for ${familyName}!` : '😬 Wrong answer — next family!'}
              </p>
              {question.explanation && (
                <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.75rem', marginTop:'4px' }}>
                  💡 {question.explanation}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Close button (only after answer) ── */}
        <AnimatePresence>
          {answered && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ padding:'12px 14px 16px', display:'flex', justifyContent:'center' }}
            >
              <button
                onClick={isCorrect ? onCorrect : onIncorrect}
                style={{
                  display:'flex', alignItems:'center', gap:'8px',
                  background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)',
                  borderRadius:'12px', padding:'10px 24px',
                  color:'#fff', fontWeight:700, fontSize:'0.88rem', cursor:'pointer',
                  transition:'all 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.background='rgba(255,255,255,0.14)')}
                onMouseOut={e  => (e.currentTarget.style.background='rgba(255,255,255,0.08)')}
              >
                <X size={15} /> Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
