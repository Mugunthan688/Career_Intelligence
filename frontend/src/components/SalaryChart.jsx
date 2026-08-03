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
      background: 'rgba(12,15,26,0.97)',
      border: '1px solid rgba(176,110,255,0.3)',
      borderRadius: 12, padding: '12px 16px',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
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
            {/* Purple gradient — avg */}
            <linearGradient id="grad-avg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#B06EFF" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#B06EFF" stopOpacity={0}    />
            </linearGradient>
            {/* Cyan gradient — max */}
            <linearGradient id="grad-max" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#22D3EE" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#22D3EE" stopOpacity={0}    />
            </linearGradient>
            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(176,110,255,0.07)"
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
            stroke="#22D3EE" strokeWidth={1.5} strokeDasharray="5 3"
            fill="url(#grad-max)"
          />

          {/* Average — hero line */}
          <Area
            type="monotone" dataKey="avg" name="Avg"
            stroke="#B06EFF" strokeWidth={2.5}
            fill="url(#grad-avg)"
            filter="url(#glow)"
          />

          {/* Min range */}
          <Area
            type="monotone" dataKey="min" name="Min"
            stroke="#8B5CF6" strokeWidth={1} strokeDasharray="5 3"
            fill="none" opacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}