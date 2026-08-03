import React from 'react'
import { motion } from 'framer-motion'

const AGENT_NODES = [
  { id: 'research',  name: 'Research Agent',  icon: '🔍', color: '#8B5CF6', desc: 'Market & Company Search' },
  { id: 'screener',  name: 'Screener Agent',  icon: '🎯', color: '#22D3EE', desc: 'Resume Match Scoring'    },
  { id: 'coach',     name: 'Coach Agent',     icon: '💬', color: '#EC4899', desc: 'Interview Q&A Builder'    },
  { id: 'analytics', name: 'Analytics Agent', icon: '📊', color: '#10B981', desc: 'Skill Gap & Benchmarks'   },
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
        border: '1px solid rgba(176, 110, 255, 0.25)',
      }}
    >
      {/* HUD Accent Top Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: 'linear-gradient(90deg, #22D3EE, #B06EFF, #10B981)',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--cyan)', letterSpacing: '0.12em', textTransform: 'uppercase' }} className="font-mono">
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
            <div style={{ fontSize: 16, fontWeight: 800, color: doneAgents.length === 4 ? 'var(--green)' : 'var(--cyan)' }} className="font-mono">
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

      {/* Live Pipeline Progress Meter */}
      <div style={{ height: 4, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 2, overflow: 'hidden', marginBottom: 24 }}>
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6 }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #22D3EE, #B06EFF, #10B981)',
            boxShadow: '0 0 10px #22D3EE',
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
                animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={isActive ? { repeat: Infinity, duration: 1.4 } : {}}
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 16,
                  background: isDone
                    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                    : isActive
                    ? `linear-gradient(135deg, ${agent.color} 0%, #3B82F6 100%)`
                    : 'rgba(14, 20, 40, 0.95)',
                  border: `2px solid ${isDone ? '#10B981' : isActive ? agent.color : 'rgba(176, 110, 255, 0.2)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  boxShadow: isDone
                    ? '0 0 20px rgba(16, 185, 129, 0.5)'
                    : isActive
                    ? `0 0 25px ${agent.color}88`
                    : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                {isDone ? '✓' : agent.icon}
              </motion.div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: isDone ? '#10B981' : isActive ? '#FFF' : 'var(--txt-secondary)' }}>
                  {agent.name}
                </div>
                <div style={{ fontSize: 10, color: 'var(--txt-muted)', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>
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