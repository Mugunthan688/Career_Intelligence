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
  { name: 'Research',  code: 'R', color: '#8B5CF6' },
  { name: 'Screener',  code: 'S', color: '#06B6D4' },
  { name: 'Coach',     code: 'C', color: '#EC4899' },
  { name: 'Analytics', code: 'A', color: '#10B981' },
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
        background: 'rgba(11, 14, 27, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--border-dim)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        flexShrink: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '4px 0 25px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* ── Header & Logo ── */}
      <div
        style={{
          padding: collapsed ? '20px 12px' : '20px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 20, color: '#FFF' }}>⚡</span>
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }} className="font-display gradient-text">
                Career Intelligence
              </div>
              <div style={{ fontSize: 10, color: 'var(--cyan)', fontWeight: 700, letterSpacing: '0.12em', marginTop: 2 }}>
                MULTI-AGENT OS
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--txt-secondary)',
            width: 28,
            height: 28,
            borderRadius: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            transition: 'all 0.2s ease',
          }}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* ── Navigation Items ── */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto' }}>
        {items.map((item) => (
          <div key={item.to} style={{ position: 'relative' }}>
            <NavLink
              to={item.to}
              onMouseEnter={() => setHoveredItem(item.to)}
              onMouseLeave={() => setHoveredItem(null)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: collapsed ? '12px' : '11px 16px',
                borderRadius: 12,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#FFFFFF' : 'var(--txt-secondary)',
                background: isActive
                  ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.25) 0%, rgba(6, 182, 212, 0.1) 100%)'
                  : 'transparent',
                border: isActive ? '1px solid var(--border-mid)' : '1px solid transparent',
                justifyContent: collapsed ? 'center' : 'flex-start',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 4px 15px -3px rgba(139, 92, 246, 0.2)' : 'none',
              })}
            >
              {({ isActive }) => (
                <>
                  <span style={{ fontSize: 18, color: isActive ? 'var(--cyan)' : 'inherit' }}>{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                  {isActive && !collapsed && (
                    <motion.div
                      layoutId="nav-active"
                      style={{
                        marginLeft: 'auto',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--cyan)',
                        boxShadow: '0 0 8px var(--cyan)',
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>

            {/* Collapsed Mode Hover Tooltip */}
            {collapsed && hoveredItem === item.to && (
              <div
                style={{
                  position: 'absolute',
                  left: '100%',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  marginLeft: 12,
                  padding: '6px 12px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-mid)',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  color: '#FFF',
                  zIndex: 200,
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.6)',
                }}
              >
                {item.label}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* ── 4-Agent Live Status Overview ── */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border-subtle)', background: 'rgba(6, 8, 16, 0.5)' }}>
        {!collapsed ? (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Agent Network</span>
              <span className="status-dot active" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {AGENTS.map((agent) => (
                <div
                  key={agent.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 10px',
                    borderRadius: 8,
                    background: 'rgba(16, 21, 40, 0.7)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: agent.color,
                      boxShadow: `0 0 6px ${agent.color}`,
                    }}
                  />
                  <span style={{ fontSize: 11, color: 'var(--txt-secondary)', fontWeight: 600 }}>{agent.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            {AGENTS.map((agent) => (
              <div
                key={agent.name}
                title={`${agent.name} Agent Online`}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: agent.color,
                  boxShadow: `0 0 8px ${agent.color}`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── User Footer Profile ── */}
      <div
        style={{
          padding: '16px 14px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
        }}
      >
        {!collapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                color: '#FFF',
                fontWeight: 700,
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#FFF', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {name}
              </div>
              <div style={{ fontSize: 10, color: 'var(--txt-muted)', textTransform: 'capitalize' }}>
                {role.replace('_', ' ')}
              </div>
            </div>
          </div>
        ) : null}

        <button
          onClick={handleLogout}
          title="Sign Out"
          style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: 'var(--rose)',
            width: 32,
            height: 32,
            borderRadius: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
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