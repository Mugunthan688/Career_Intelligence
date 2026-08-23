import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { clearToken, getName, getRole } from '../utils/auth'

const NAV_ITEMS = [
  { to: '/dashboard', icon: '⊞', label: 'Dashboard'         },
  { to: '/upload',    icon: '⬆', label: 'Analyze Resume'    },
  { to: '/builder',   icon: '✍', label: 'Resume AI Editor'  },
  { to: '/ats',       icon: '🎯', label: 'ATS Checker'       },
  { to: '/results',   icon: '◈', label: 'Agent Results'     },
  { to: '/coach',     icon: '◎', label: 'Interview Coach'   },
  { to: '/history',   icon: '📜', label: 'Interview History' },
  { to: '/analytics', icon: '▦', label: 'Analytics'         },
]

const AGENTS = [
  { name: 'Research',  color: '#A78BFA' },
  { name: 'Screener',  color: '#2DD4BF' },
  { name: 'Coach',     color: '#FB7185' },
  { name: 'Analytics', color: '#34D399' },
]

export default function Navbar() {
  const [collapsed, setCollapsed] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  const name = getName() || 'User'
  const role = getRole() || 'job_seeker'
  const navigate = useNavigate()

  const handleLogout = () => {
    clearToken()
    navigate('/login')
  }

  const items = role === 'admin'
    ? [...NAV_ITEMS, { to: '/admin', icon: '⚙', label: 'Admin Panel' }]
    : NAV_ITEMS

  return (
    <aside
      style={{
        width: collapsed ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w)',
        background: 'rgba(8, 9, 14, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        flexShrink: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* ── Logo / Header ── */}
      <div style={{
        padding: collapsed ? '18px 12px' : '18px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        gap: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          {/* Aurora logo mark */}
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #7C3AED 0%, #2DD4BF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            flexShrink: 0,
            boxShadow: '0 0 16px rgba(124,58,237,0.35)',
          }}>
            ⚡
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, color: '#F8FAFC' }} className="font-display">
                Career Intelligence
              </div>
              <div style={{ fontSize: 9, color: 'var(--aurora-teal)', fontWeight: 700, letterSpacing: '0.12em', marginTop: 2, opacity: 0.8 }}>
                MULTI-AGENT OS
              </div>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.06)',
              color: 'var(--txt-muted)',
              width: 26,
              height: 26,
              borderRadius: 7,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
          >
            ◀
          </button>
        )}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.06)',
              color: 'var(--txt-muted)',
              width: 26,
              height: 26,
              borderRadius: 7,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              transition: 'all 0.2s ease',
            }}
          >
            ▶
          </button>
        )}
      </div>

      {/* ── Nav Items ── */}
      <nav style={{
        flex: 1,
        padding: '12px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        overflowY: 'auto',
      }}>
        {items.map((item) => (
          <div key={item.to} style={{ position: 'relative' }}>
            <NavLink
              to={item.to}
              onMouseEnter={() => setHoveredItem(item.to)}
              onMouseLeave={() => setHoveredItem(null)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: collapsed ? '10px' : '10px 14px',
                borderRadius: 11,
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: isActive ? 600 : 450,
                color: isActive ? '#F8FAFC' : 'var(--txt-secondary)',
                background: isActive
                  ? 'rgba(167, 139, 250, 0.10)'
                  : 'transparent',
                borderLeft: isActive
                  ? '2px solid var(--aurora-violet)'
                  : '2px solid transparent',
                justifyContent: collapsed ? 'center' : 'flex-start',
                transition: 'all 0.18s ease',
              })}
            >
              {({ isActive }) => (
                <>
                  <span style={{ fontSize: 16, opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                  {!collapsed && (
                    <span style={{ flex: 1 }}>{item.label}</span>
                  )}
                  {isActive && !collapsed && (
                    <div style={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: 'var(--aurora-teal)',
                      boxShadow: '0 0 6px var(--aurora-teal)',
                      flexShrink: 0,
                    }} />
                  )}
                </>
              )}
            </NavLink>

            {/* Collapsed tooltip */}
            {collapsed && hoveredItem === item.to && (
              <div style={{
                position: 'absolute',
                left: '100%',
                top: '50%',
                transform: 'translateY(-50%)',
                marginLeft: 10,
                padding: '5px 10px',
                background: 'var(--bg-elevated)',
                border: '1px solid rgba(167,139,250,0.2)',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                color: '#F8FAFC',
                zIndex: 200,
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              }}>
                {item.label}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* ── Agent Network Status ── */}
      <div style={{
        padding: '12px 12px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        {!collapsed ? (
          <div>
            <div style={{
              fontSize: 9,
              fontWeight: 700,
              color: 'var(--txt-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: '"JetBrains Mono", monospace',
            }}>
              <span>Agent Network</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span className="status-dot active" />
                <span style={{ fontSize: 8, color: 'var(--aurora-emerald)', fontWeight: 700 }}>LIVE</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
              {AGENTS.map((agent) => (
                <div
                  key={agent.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '6px 8px',
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: agent.color,
                    boxShadow: `0 0 5px ${agent.color}80`,
                    animation: 'soft-pulse 2.5s ease-in-out infinite',
                  }} />
                  <span style={{ fontSize: 10, color: 'var(--txt-secondary)', fontWeight: 500 }}>{agent.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            {AGENTS.map((agent) => (
              <div
                key={agent.name}
                title={`${agent.name} Agent`}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: agent.color,
                  boxShadow: `0 0 6px ${agent.color}80`,
                  animation: 'soft-pulse 2.5s ease-in-out infinite',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── User Profile Footer ── */}
      <div style={{
        padding: '12px 12px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        gap: 8,
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
            <div style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7C3AED 0%, #FB7185 100%)',
              color: '#FFF',
              fontWeight: 700,
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 10px rgba(124,58,237,0.3)',
            }}>
              {name.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#F8FAFC', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {name}
              </div>
              <div style={{ fontSize: 10, color: 'var(--txt-muted)', textTransform: 'capitalize' }}>
                {role.replace('_', ' ')}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          title="Sign Out"
          style={{
            background: 'rgba(251,113,133,0.08)',
            border: '1px solid rgba(251,113,133,0.20)',
            color: 'var(--aurora-rose)',
            width: 28,
            height: 28,
            borderRadius: 7,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }}
        >
          ⎋
        </button>
      </div>
    </aside>
  )
}