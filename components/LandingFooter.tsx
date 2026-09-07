'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MEDIA } from '@/lib/media';

interface CoordinatorContact {
  name: string;
  role: string;
  phone: string;
  displayPhone: string;
  cleanPhone: string;
  initials: string;
}

const FOOTER_COORDINATORS: CoordinatorContact[] = [
  {
    name: 'Harshil Biyani',
    role: 'President',
    phone: '+919422001054',
    displayPhone: '+91 94220 01054',
    cleanPhone: '919422001054',
    initials: 'HB',
  },
  {
    name: 'Anushka Shinde',
    role: 'Vice President',
    phone: '+918767165372',
    displayPhone: '+91 87671 65372',
    cleanPhone: '918767165372',
    initials: 'AS',
  },
];

export default function LandingFooter() {
  const [activeGlow, setActiveGlow] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key and lock body scroll when modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isContactModalOpen) {
        setIsContactModalOpen(false);
      }
    };
    if (isContactModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isContactModalOpen]);

  const handleCopyPhone = (coord: CoordinatorContact) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(coord.displayPhone).then(() => {
        setCopiedPhone(coord.phone);
        setTimeout(() => {
          setCopiedPhone(null);
        }, 2000);
      });
    }
  };

  const triggerGlow = (logoKey: string) => {
    setActiveGlow(logoKey);
    setTimeout(() => {
      setActiveGlow((current) => (current === logoKey ? null : current));
    }, 950);
  };

  return (
    <footer className="landing-footer" aria-label="Footer">
      <div className="footer-container">
        {/* ── Left Section: Association & Department ── */}
        <div className="footer-left">
          <div className="footer-logos-grid">
            {/* Logo 1: AIMSA (Clickable link to https://www.pccoeaimsa.in/) */}
            <a
              href="https://www.pccoeaimsa.in/"
              target="_blank"
              rel="noopener noreferrer"
              className={`footer-logo-aimsa-link ${activeGlow === 'aimsa' ? 'is-glowing-aimsa' : ''}`}
              title="AIMSA - PCCOE"
              aria-label="AIMSA Website"
              onClick={() => triggerGlow('aimsa')}
            >
              <img
                src={MEDIA.images.footerLogos.aimsa}
                alt="AIMSA"
                className="footer-aimsa-img"
              />
            </a>

            {/* Logo 2: GFG (Clickable link to https://gfgpccoe.in/) */}
            <a
              href="https://gfgpccoe.in/"
              target="_blank"
              rel="noopener noreferrer"
              className={`footer-logo-circle footer-logo-white ${activeGlow === 'gfg' ? 'is-glowing-gold' : ''}`}
              title="GeeksforGeeks Campus Body - PCCOE"
              aria-label="GFG PCCOE Website"
              onClick={() => triggerGlow('gfg')}
            >
              <img
                src={MEDIA.images.footerLogos.gfg}
                alt="GFG Campus Body"
                className="footer-circle-img"
              />
            </a>

            {/* Logo 3: INNS */}
            <div
              className={`footer-logo-circle footer-logo-inns ${activeGlow === 'inns' ? 'is-glowing-inns' : ''}`}
              title="INNS Student Network Cell"
              role="button"
              tabIndex={0}
              onClick={() => triggerGlow('inns')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  triggerGlow('inns');
                }
              }}
            >
              <img
                src={MEDIA.images.footerLogos.inns}
                alt="INNS Student Network Cell"
                className="footer-circle-img inns-img"
              />
            </div>

            {/* Logo 4: AAAI Chapter */}
            <div
              className={`footer-logo-circle footer-logo-white ${activeGlow === 'aaai' ? 'is-glowing-gold' : ''}`}
              title="AAAI Student Chapter"
              role="button"
              tabIndex={0}
              onClick={() => triggerGlow('aaai')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  triggerGlow('aaai');
                }
              }}
            >
              <img
                src={MEDIA.images.footerLogos.aaai}
                alt="AAAI Student Chapter"
                className="footer-circle-img"
              />
            </div>

            {/* Logo 5: IEEE CIS */}
            <div
              className={`footer-logo-circle footer-logo-white ieee-cis-circle ${activeGlow === 'ieeeCis' ? 'is-glowing-gold' : ''}`}
              title="IEEE Computational Intelligence Society"
              role="button"
              tabIndex={0}
              onClick={() => triggerGlow('ieeeCis')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  triggerGlow('ieeeCis');
                }
              }}
            >
              <img
                src={MEDIA.images.footerLogos.ieeeCis}
                alt="IEEE Computational Intelligence Society"
                className="footer-circle-img ieee-cis-img"
              />
            </div>

            {/* Logo 6: IEEE CS */}
            <div
              className={`footer-logo-cs-btn ${activeGlow === 'ieeeCs' ? 'is-glowing-gold' : ''}`}
              title="IEEE Computer Society"
              role="button"
              tabIndex={0}
              onClick={() => triggerGlow('ieeeCs')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  triggerGlow('ieeeCs');
                }
              }}
            >
              <img
                src={MEDIA.images.footerLogos.ieeeCs}
                alt="IEEE Computer Society"
                className="footer-cs-img"
              />
            </div>
          </div>

          <div className="footer-dept-info">
            <h4 className="footer-dept-title">DEPARTMENT OF CSE (AI &amp; ML)</h4>
            <p className="footer-college-name">Pimpri Chinchwad College Of Engineering, Pune</p>
          </div>
        </div>

        {/* ── Right Section: Social Connections ── */}
        <div className="footer-right">
          <h3 className="footer-connect-title">Connect With Us</h3>

          <div className="footer-social-links">
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/pccoe-s-aimsa/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-1.6-1.6Z" />
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/PCCOE-AiMSA"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="GitHub"
              title="GitHub"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/pccoe_aimsa"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="Instagram"
              title="Instagram"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </a>

            {/* Phone / Contact Coordinators Trigger */}
            <button
              type="button"
              onClick={() => setIsContactModalOpen(true)}
              className="social-icon-btn"
              aria-label="Contact Coordinators"
              title="Contact Coordinators"
              aria-haspopup="dialog"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </button>

            {/* Email */}
            <a
              href="mailto:artimas@pccoepune.org"
              className="social-icon-btn"
              aria-label="Email"
              title="Email"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ── Footer Bottom Copyright & Credits ── */}
      <div className="footer-bottom-bar">
        <p className="footer-motto">|| एम्सा कुटुम्बकम् ||</p>
        <p className="footer-credits">
          Crafted with <span className="heart-icon">❤️</span> by the <strong className="gold-tech-team">ARTIMAS Tech Team</strong>
        </p>
        <p className="footer-copyright">
          © 2026 ARTIMAS - All Rights Reserved
        </p>
      </div>

      {/* ── Contact Coordinators Modal Portal ── */}
      {mounted && isContactModalOpen && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Festival Coordinators Contact Options"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsContactModalOpen(false);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.78)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              background: 'linear-gradient(178deg, #1c0f06 0%, #120702 55%, #080301 100%)',
              border: '1.5px solid #d4af37',
              borderRadius: '14px',
              boxShadow: '0 25px 65px rgba(0, 0, 0, 0.95), 0 0 35px rgba(212, 175, 55, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'contactModalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative',
            }}
          >
            {/* Top Ancient Gold Trim Bar */}
            <div
              style={{
                height: '3px',
                background: 'linear-gradient(90deg, transparent, #fbbf24, #d4af37, #fbbf24, transparent)',
                width: '100%',
              }}
            />

            {/* Modal Header */}
            <div
              style={{
                padding: '18px 20px 14px',
                borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '12px',
                background: 'rgba(0, 0, 0, 0.25)',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '1.8px',
                    color: '#fbbf24',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  <span>✦</span>
                  <span>ARTIMAS 2026 CONTACTS</span>
                  <span>✦</span>
                </div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#fef3c7',
                    letterSpacing: '0.5px',
                    fontFamily: 'serif',
                  }}
                >
                  Festival Leadership
                </h2>
                <p
                  style={{
                    margin: '3px 0 0',
                    fontSize: '12.5px',
                    color: '#c5b18a',
                  }}
                >
                  Contact our council leadership directly for queries & assistance
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                aria-label="Close contacts modal"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  color: '#fde68a',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15px',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.25)';
                  e.currentTarget.style.borderColor = '#fbbf24';
                  e.currentTarget.style.transform = 'rotate(90deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                  e.currentTarget.style.transform = 'rotate(0deg)';
                }}
              >
                ✕
              </button>
            </div>

            {/* Coordinators List */}
            <div
              style={{
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {FOOTER_COORDINATORS.map((coord) => (
                <div
                  key={coord.phone}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    background: 'rgba(38, 20, 10, 0.55)',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    gap: '12px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(161, 98, 7, 0.4))',
                          border: '1.5px solid #d4af37',
                          color: '#fbbf24',
                          fontWeight: 700,
                          fontSize: '15px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          fontFamily: 'serif',
                          boxShadow: '0 0 10px rgba(212, 175, 55, 0.2)',
                        }}
                      >
                        {coord.initials}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              color: '#fffbeb',
                              fontWeight: 700,
                              fontSize: '15px',
                              letterSpacing: '0.3px',
                            }}
                          >
                            {coord.name}
                          </span>
                          <span
                            style={{
                              fontSize: '9.5px',
                              fontWeight: 600,
                              color: '#fbbf24',
                              border: '1px solid rgba(251, 191, 36, 0.35)',
                              borderRadius: '4px',
                              padding: '1px 5px',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {coord.role.toUpperCase()}
                          </span>
                        </div>
                        <a
                          href={`tel:${coord.phone}`}
                          style={{
                            color: '#fef3c7',
                            fontSize: '13px',
                            fontFamily: 'monospace',
                            letterSpacing: '0.5px',
                            marginTop: '2px',
                            display: 'inline-block',
                            textDecoration: 'none',
                          }}
                        >
                          {coord.displayPhone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Call, WhatsApp, Copy */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Call Button */}
                    <a
                      href={`tel:${coord.phone}`}
                      aria-label={`Call ${coord.name}`}
                      style={{
                        flex: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.22), rgba(161, 98, 7, 0.28))',
                        border: '1px solid #d4af37',
                        color: '#fef3c7',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#d4af37';
                        e.currentTarget.style.color = '#120701';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.22), rgba(161, 98, 7, 0.28))';
                        e.currentTarget.style.color = '#fef3c7';
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <span>Call</span>
                    </a>

                    {/* WhatsApp Button */}
                    <a
                      href={`https://wa.me/${coord.cleanPhone}?text=${encodeURIComponent(
                        `Hi ${coord.name.split(' ')[0]}, I have an inquiry regarding ARTIMAS 2026.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`WhatsApp ${coord.name}`}
                      style={{
                        flex: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        background: 'rgba(37, 211, 102, 0.18)',
                        border: '1px solid #22c55e',
                        color: '#4ade80',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#22c55e';
                        e.currentTarget.style.color = '#042f14';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(37, 211, 102, 0.18)';
                        e.currentTarget.style.color = '#4ade80';
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.27-2.42 5.82a8.196 8.196 0 0 1-5.82 2.41c-1.47 0-2.91-.39-4.17-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.216 8.216 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.5 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.22-.16-.47-.29z" />
                      </svg>
                      <span>WhatsApp</span>
                    </a>

                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={() => handleCopyPhone(coord)}
                      aria-label={`Copy phone number for ${coord.name}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        background: copiedPhone === coord.phone ? 'rgba(212, 175, 55, 0.35)' : 'rgba(255, 255, 255, 0.05)',
                        border: copiedPhone === coord.phone ? '1px solid #fbbf24' : '1px solid rgba(212, 175, 55, 0.25)',
                        color: copiedPhone === coord.phone ? '#fbbf24' : '#c5b18a',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (copiedPhone !== coord.phone) {
                          e.currentTarget.style.borderColor = '#d4af37';
                          e.currentTarget.style.color = '#fef3c7';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (copiedPhone !== coord.phone) {
                          e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)';
                          e.currentTarget.style.color = '#c5b18a';
                        }
                      }}
                    >
                      {copiedPhone === coord.phone ? (
                        <>
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '10px 18px 14px',
                borderTop: '1px solid rgba(212, 175, 55, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.3)',
              }}
            >
              <a
                href="mailto:artimas@pccoepune.org"
                style={{
                  fontSize: '12px',
                  color: '#fbbf24',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>✉</span>
                <span>Prefer email? artimas@pccoepune.org</span>
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </footer>

  );
}
