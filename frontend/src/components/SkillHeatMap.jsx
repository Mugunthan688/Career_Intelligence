import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function SkillHeatMap({ matched = [], missing = [] }) {
  const [filter, setFilter] = useState('all') // 'all' | 'matched' | 'missing'

  const allMatched = matched.map((s) => ({ name: s, type: 'matched' }))
  const allMissing = missing.map((s) => ({ name: s, type: 'missing' }))
  const skills = [...allMatched, ...allMissing]

  const filteredSkills = skills.filter((s) => {
    if (filter === 'matched') return s.type === 'matched'
    if (filter === 'missing') return s.type === 'missing'
    return true
  })

  return (
    <div className="glass-panel" style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: '"JetBrains Mono", monospace' }}>
            Skill Gap Matrix
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#F8FAFC' }} className="font-display">
            Target Skill Heatmap
          </h3>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 6, background: 'rgba(8,9,14,0.6)', padding: 4, borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
          {[
            { id: 'all', label: `All (${skills.length})` },
            { id: 'matched', label: `Matched (${matched.length})` },
            { id: 'missing', label: `Missing (${missing.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: filter === tab.id ? 'var(--aurora-violet)' : 'transparent',
                color: filter === tab.id ? '#FFF' : 'var(--txt-muted)',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Skill Chips */}
      {filteredSkills.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--txt-muted)', fontSize: 14 }}>
          No skills match the selected filter.
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {filteredSkills.map((skill, index) => {
            const isMatched = skill.type === 'matched'
            return (
              <motion.div
                key={`${skill.name}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                style={{
                  padding: '7px 14px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: isMatched ? 'rgba(52,211,153,0.10)' : 'rgba(251,113,133,0.10)',
                  border: `1px solid ${isMatched ? 'rgba(52,211,153,0.22)' : 'rgba(251,113,133,0.22)'}`,
                  color: isMatched ? 'var(--aurora-emerald)' : 'var(--aurora-rose)',
                  cursor: 'default',
                  transition: 'transform 0.15s ease',
                }}
              >
                <span>{isMatched ? '✓' : '⚠'}</span>
                <span>{skill.name}</span>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}