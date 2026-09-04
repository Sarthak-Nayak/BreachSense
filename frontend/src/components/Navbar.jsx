import React from 'react';
import { NavLink } from 'react-router-dom';
import { Waves, LayoutDashboard, BookOpen, Home, ShieldAlert } from 'lucide-react';

export default function Navbar({ activeSim }) {
  return (
    <nav style={{
      height: '60px',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--border-light)',
      padding: '0 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 1100,
      boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
    }}>
      {/* Brand Logo & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <NavLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '9px',
            background: 'linear-gradient(135deg, #1D6FD9 0%, #0F4C9C 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 2px 5px rgba(29, 111, 217, 0.25)'
          }}>
            <Waves size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                BreachSense
              </span>

            </div>
          </div>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Home size={16} /> Home
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={16} /> Dashboard
        </NavLink>

        <NavLink
          to="/docs"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <BookOpen size={16} /> Documentation
        </NavLink>

        {activeSim && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: '#FEF2F2',
            color: '#DC2626',
            padding: '0.3rem 0.65rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            border: '1px solid #FCA5A5',
            marginLeft: '0.75rem'
          }}>
            <ShieldAlert size={14} />
            <span>SIMULATION ACTIVE</span>
          </div>
        )}
      </div>

      <style>{`
        .nav-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.85rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.15s ease;
        }
        .nav-link:hover {
          color: var(--text-primary);
          background-color: var(--bg-subtle);
        }
        .nav-link.active {
          color: var(--accent-primary);
          background-color: var(--accent-light);
        }
      `}</style>
    </nav>
  );
}
