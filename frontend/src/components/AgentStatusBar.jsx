import React from 'react'
import { motion } from 'framer-motion'

const AGENT_NODES = [
  { id: 'research',  name: 'Research Agent',  icon: '🔍', color: '#A78BFA', desc: 'Market & Company Search' },
  { id: 'screener',  name: 'Screener Agent',  icon: '🎯', color: '#2DD4BF', desc: 'Resume Match Scoring'    },
  { id: 'coach',     name: 'Coach Agent',     icon: '💬', color: '#FB7185', desc: 'Interview Q&A Builder'    },
  { id: 'analytics', name: 'Analytics Agent', icon: '📊', color: '#34D399', desc: 'Skill Gap & Benchmarks'   },
]

export default function AgentStatusBar({ activeAgent, doneAgents = [] }) {
  const percent = Math.round((doneAgents.length / AGENT_NODES.length) * 100)

  return (
    <div
      className="glass-panel"
      style={{
        padding: '24px 28px',
        marginBottom: 28,
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(167,139,250,0.18)',
      }}
    >
      {/* Aurora Accent Top Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: 'linear-gradient(90deg, #2DD4BF, #A78BFA, #34D399)',
          backgroundSize: '200% 100%',
          animation: 'shimmer-flow 3s linear infinite',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--aurora-teal)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: '"JetBrains Mono", monospace' }}>
              ▶ LANGGRAPH AGENT ORCHESTRATOR
            </span>
            <span className="cyber-badge" style={{ fontSize: 9 }}>4-NODE PIPELINE</span>
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFF' }} className="font-display">
            Autonomous Collaboration Engine
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--txt-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
              PIPELINE PROGRESS
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: doneAgents.length === 4 ? 'var(--aurora-emerald)' : 'var(--aurora-teal)', fontFamily: '"JetBrains Mono", monospace' }}>
              {percent}% COMPLETE
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'rgba(8, 12, 25, 0.8)', borderRadius: 20, border: '1px solid var(--border-mid)' }}>
            <span className={`status-dot ${doneAgents.length === 4 ? 'active' : activeAgent ? 'busy' : 'idle'}`} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#FFF', fontFamily: 'JetBrains Mono, monospace' }}>
              {doneAgents.length === 4 ? 'ALL AGENTS COMPLETE' : activeAgent ? `RUNNING ${activeAgent.toUpperCase()}...` : 'STANDBY READY'}
            </span>
          </div>
        </div>
      </div>

      {/* Aurora Progress Bar */}
      <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden', marginBottom: 24 }}>
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6 }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #2DD4BF, #A78BFA, #34D399)',
            boxShadow: '0 0 8px rgba(45,212,191,0.4)',
          }}
        />
      </div>

      {/* ── Connected Nodes Graph ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', padding: '10px 0' }}>
        {/* Background Connecting Line */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 50,
            right: 50,
            height: 2,
            background: 'rgba(176, 110, 255, 0.15)',
            transform: 'translateY(-50%)',
            zIndex: 0,
          }}
        />

        {AGENT_NODES.map((agent) => {
          const isDone = doneAgents.includes(agent.id)
          const isActive = activeAgent === agent.id

          return (
            <div
              key={agent.id}
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
              }}
            >
              {/* Node Icon Circle */}
              <motion.div
                animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={isActive ? { repeat: Infinity, duration: 1.6 } : {}}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 15,
                  background: isDone
                    ? 'linear-gradient(135deg, #34D399 0%, #059669 100%)'
                    : isActive
                    ? `${agent.color}22`
                    : 'rgba(13,15,24,0.9)',
                  border: `1px solid ${isDone ? 'rgba(52,211,153,0.5)' : isActive ? `${agent.color}60` : 'rgba(255,255,255,0.08)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  boxShadow: isDone
                    ? '0 0 16px rgba(52,211,153,0.3)'
                    : isActive
                    ? `0 0 18px ${agent.color}55`
                    : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                {isDone ? '✓' : agent.icon}
              </motion.div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: isDone ? 'var(--aurora-emerald)' : isActive ? '#F8FAFC' : 'var(--txt-secondary)' }}>
                  {agent.name}
                </div>
                <div style={{ fontSize: 10, color: 'var(--txt-muted)', marginTop: 2, fontFamily: '"JetBrains Mono", monospace' }}>
                  {agent.desc}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}