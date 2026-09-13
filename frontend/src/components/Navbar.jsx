import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Home, ShieldAlert } from 'lucide-react';

export default function Navbar({ activeSim }) {
  return (
    <nav style={{
      height: '70px',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--border-light)',
      padding: '0 2.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1100,
      boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <NavLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src="/logo.webp"
              alt="BreachSense Logo"
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--accent-primary)',
                boxShadow: '0 2px 8px rgba(29, 111, 217, 0.2)',
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.50rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
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
