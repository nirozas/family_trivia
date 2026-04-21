import { motion } from 'framer-motion';

type Props = {
  emoji: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  glow?: boolean;
};

const SIZES = {
  sm: { box: 36, font: '1.2rem', border: 2 },
  md: { box: 50, font: '1.8rem', border: 2.5 },
  lg: { box: 80, font: '3rem', border: 3 },
  xl: { box: 110, font: '4.5rem', border: 4 },
};

export default function ClanEmblem({ emoji, size = 'md', animate = true, glow = true }: Props) {
  const s = SIZES[size];

  return (
    <motion.div
      animate={animate ? {
        y: [0, -4, 0],
        rotate: [0, 2, -2, 0],
      } : {}}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        position: 'relative',
        width: s.box,
        height: s.box,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {/* Background Glow */}
      {glow && (
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            position: 'absolute',
            inset: -4,
            background: 'radial-gradient(circle, rgba(79, 142, 247, 0.4) 0%, transparent 70%)',
            borderRadius: '50%',
            zIndex: 0,
          }}
        />
      )}

      {/* The Shield/Frame */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        border: `${s.border}px solid rgba(255, 255, 255, 0.2)`,
        borderRadius: '24%', // Slightly squared circle (superellipse)
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 0 10px rgba(255,255,255,0.1)',
        zIndex: 1,
        overflow: 'hidden',
      }}>
        {/* Subtle Shine Effect */}
        <motion.div
          animate={{ left: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            width: '50%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
            transform: 'skewX(-20deg)',
            zIndex: 2,
          }}
        />
        
        <span style={{ 
          fontSize: s.font, 
          lineHeight: 1, 
          zIndex: 3,
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
        }}>
          {emoji}
        </span>
      </div>
    </motion.div>
  );
}
