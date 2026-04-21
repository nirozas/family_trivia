import React, { useState } from 'react';
import { useGame } from '../../store/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Play, Trash2, Shield, Users } from 'lucide-react';
import ClanEmblem from '../common/ClanEmblem';

const AVATARS = ['🤡', '👽', '🤖', '🦖', '🦙', '👻', '🤪', '👾', '🐷'];

type Props = { onStart: () => void };

export default function FamilySetup({ onStart }: Props) {
  const { gameState, addFamily, removeFamily } = useGame();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addFamily(name.trim(), avatar);
    setName('');
  };

  const isReady = gameState.families.length >= 2;

  return (
    <div className="page-wrap" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4rem', paddingBottom: '4rem' }}>
      
      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '12px', 
          background: 'rgba(79, 142, 247, 0.1)', border: '1px solid rgba(79, 142, 247, 0.3)',
          padding: '8px 16px', borderRadius: '100px', marginBottom: '16px'
        }}>
          <Shield size={18} style={{ color: '#4f8ef7' }} />
          <span style={{ color: '#4f8ef7', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Clan Recruitment
          </span>
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#fff', lineHeight: 0.9, letterSpacing: '-0.03em', marginBottom: '12px' }}>
          REGISTER YOUR <span style={{ color: '#4f8ef7' }}>CLAN</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
          Gather your kin and prepare for the ultimate test of knowledge. Only the strongest minds shall prevail.
        </p>
      </motion.div>

      <div className="setup-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '32px', width: '100%', alignItems: 'start' }}>
        
        {/* Left: Add Clan Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="panel-bright"
          style={{ padding: '2.5rem' }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserPlus size={24} style={{ color: '#4f8ef7' }} /> New Recruit
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label className="label">Clan Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter clan name..."
                className="field"
                maxLength={20}
              />
            </div>

            <div>
              <label className="label">Choose Emblem</label>
              <div style={{ 
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', 
                background: '#f8fafc', padding: '12px', borderRadius: '16px', border: '2px solid #e2e8f0'
              }}>
                {AVATARS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAvatar(a)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '8px', borderRadius: '12px', border: 'none',
                      background: avatar === a ? 'rgba(79, 142, 247, 0.1)' : 'transparent',
                      transform: avatar === a ? 'scale(1.05)' : 'scale(1)',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    <ClanEmblem emoji={a} size="md" animate={avatar === a} glow={avatar === a} />
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn" style={{ width: '100%', height: '54px', fontSize: '1.1rem' }}>
              Add to Alliance
            </button>
          </form>
        </motion.div>

        {/* Right: Clan List & Start */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="panel" 
            style={{ flexGrow: 1 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} style={{ color: 'rgba(255,255,255,0.4)' }} /> Current Alliance
              </h2>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px' }}>
                {gameState.families.length} Clans
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
              <AnimatePresence mode="popLayout">
                {gameState.families.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.3)' }}
                  >
                    No clans registered yet...
                  </motion.div>
                ) : (
                  gameState.families.map((f) => (
                    <motion.div
                      key={f.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      style={{ 
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '16px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <ClanEmblem emoji={f.avatar} size="md" />
                        <span style={{ color: '#fff', fontWeight: 900, fontSize: '1.2rem' }}>{f.name}</span>
                      </div>
                      <button
                        onClick={() => removeFamily(f.id)}
                        style={{ 
                          background: 'rgba(248, 113, 113, 0.1)', color: '#f87171',
                          border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.button
            whileHover={isReady ? { scale: 1.02, translateY: -2 } : {}}
            whileTap={isReady ? { scale: 0.98 } : {}}
            disabled={!isReady}
            onClick={onStart}
            style={{
              width: '100%', height: '70px', borderRadius: '20px', border: 'none',
              background: isReady ? 'linear-gradient(135deg, #4f8ef7 0%, #7c3aed 100%)' : 'rgba(255,255,255,0.05)',
              color: isReady ? '#fff' : 'rgba(255,255,255,0.2)',
              fontSize: '1.4rem', fontWeight: 900, cursor: isReady ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              boxShadow: isReady ? '0 10px 30px rgba(79, 142, 247, 0.4)' : 'none',
              transition: 'all 0.3s'
            }}
          >
            {isReady ? (
              <>Start the Quest <Play fill="currentColor" size={20} /></>
            ) : (
              `Add ${2 - gameState.families.length} more clans...`
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
