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
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Skill Gap Matrix
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFF' }} className="font-display">
            Target Skill Heatmap
          </h3>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 6, background: 'rgba(6, 8, 16, 0.6)', padding: 4, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
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
                background: filter === tab.id ? 'var(--violet)' : 'transparent',
                color: filter === tab.id ? '#FFF' : 'var(--txt-secondary)',
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
                  padding: '8px 16px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: isMatched ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                  border: `1px solid ${isMatched ? 'rgba(16, 185, 129, 0.35)' : 'rgba(244, 63, 94, 0.35)'}`,
                  color: isMatched ? 'var(--green)' : 'var(--rose)',
                  boxShadow: isMatched ? '0 0 12px rgba(16, 185, 129, 0.15)' : '0 0 12px rgba(244, 63, 94, 0.15)',
                  cursor: 'default',
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