import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'

const DEFAULT_DATA = [
  { level: 'Entry',  min: 45000, avg: 58000,  max: 70000  },
  { level: 'Junior', min: 62000, avg: 78000,  max: 92000  },
  { level: 'Mid',    min: 85000, avg: 105000, max: 125000 },
  { level: 'Senior', min: 110000,avg: 135000, max: 160000 },
  { level: 'Lead',   min: 135000,avg: 165000, max: 195000 },
]

/* ── Custom tooltip ───────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(13,15,24,0.97)',
      border: '1px solid rgba(167,139,250,0.18)',
      borderRadius: 12, padding: '12px 16px',
      backdropFilter: 'blur(16px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    }}>
      <p style={{
        fontFamily: '"Space Grotesk",sans-serif',
        fontWeight: 600, color: '#F0F2FF',
        fontSize: 13, marginBottom: 8,
      }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{
          display: 'flex', justifyContent: 'space-between', gap: 16,
          fontFamily: '"JetBrains Mono",monospace',
          fontSize: 11, color: p.color, marginBottom: 3,
        }}>
          <span>{p.name}</span>
          <span>${p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Custom axis tick ─────────────────────────── */
const MonoTick = ({ x, y, payload }) => (
  <text x={x} y={y} dy={12} textAnchor="middle"
    fill="#3D4A6B"
    style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 10 }}>
    {payload.value}
  </text>
)

const YMonoTick = ({ x, y, payload }) => (
  <text x={x} y={y} dy={4} textAnchor="end"
    fill="#3D4A6B"
    style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 9 }}>
    ${(payload.value / 1000).toFixed(0)}k
  </text>
)

export default function SalaryChart({ data = DEFAULT_DATA, currentSalary = null }) {
  return (
    <div style={{ height: 230 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            {/* Violet gradient — avg */}
            <linearGradient id="grad-avg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#A78BFA" stopOpacity={0.30} />
              <stop offset="95%" stopColor="#A78BFA" stopOpacity={0}    />
            </linearGradient>
            {/* Teal gradient — max */}
            <linearGradient id="grad-max" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#2DD4BF" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0}    />
            </linearGradient>
            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(167,139,250,0.06)"
            vertical={false}
          />

          <XAxis
            dataKey="level"
            axisLine={false}
            tickLine={false}
            tick={<MonoTick />}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={<YMonoTick />}
            width={46}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Current salary reference line */}
          {currentSalary && (
            <ReferenceLine
              y={currentSalary}
              stroke="#F59E0B"
              strokeDasharray="4 3"
              strokeWidth={1.5}
              label={{
                value: 'Current',
                fill: '#F59E0B',
                fontFamily: '"JetBrains Mono",monospace',
                fontSize: 9,
              }}
            />
          )}

          {/* Max range */}
          <Area
            type="monotone" dataKey="max" name="Max"
            stroke="#2DD4BF" strokeWidth={1.5} strokeDasharray="5 3"
            fill="url(#grad-max)"
          />

          {/* Average — hero line */}
          <Area
            type="monotone" dataKey="avg" name="Avg"
            stroke="#A78BFA" strokeWidth={2.5}
            fill="url(#grad-avg)"
            filter="url(#glow)"
          />

          {/* Min range */}
          <Area
            type="monotone" dataKey="min" name="Min"
            stroke="#7C3AED" strokeWidth={1} strokeDasharray="5 3"
            fill="none" opacity={0.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}