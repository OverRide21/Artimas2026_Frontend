'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import NavIslands from './NavIslands';
import LandingFooter from './LandingFooter';
import IntroVideoOverlay from './IntroVideoOverlay';
import LinearYugaSlider from './LinearYugaSlider';
import MythicCrestIcon from './MythicCrestIcon';
import { MEDIA } from '@/lib/media';
import { EVENTS } from '@/lib/events';
import { getHasSeenIntro, setHasSeenIntro } from '@/lib/introState';

// model-viewer is a browser-only web component — dynamically imported without SSR
const ChakraMedallion = dynamic(() => import('./ChakraMedallion'), { ssr: false });

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/+$/, '');

// ─── Types ──────────────────────────────────────────────────────────────────

type YugaAngle = 0 | 90 | 180 | 270;

// ─── Static data ─────────────────────────────────────────────────────────────

const YUGA_NAME_MAP: Record<YugaAngle, string> = {
  0: 'Satya Yuga',
  90: 'Treta Yuga',
  180: 'Dwapara Yuga',
  270: 'Kali Yuga',
};

const VIDEO_KEY: Record<YugaAngle, string> = {
  0: 'satyug',
  90: 'treta',
  180: 'dwapar',
  270: 'kalyug',
};

const SCROLL_COOLDOWN_MS = 1200;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getRotationAngle(el: HTMLElement): number {
  const matrix = window.getComputedStyle(el).transform;
  if (matrix === 'none') return 0;
  const vals = matrix.split('(')[1].split(')')[0].split(',');
  const angle = Math.round(Math.atan2(parseFloat(vals[1]), parseFloat(vals[0])) * (180 / Math.PI));
  return angle < 0 ? angle + 360 : angle;
}

function normalizeToYuga(angle: number): YugaAngle {
  const n = (((angle - 315) % 360) + 360) % 360;
  const snapped = (Math.round(n / 90) * 90) % 360;
  return (snapped as YugaAngle);
}

const YUGA_ANGLE_MAP: Record<string, YugaAngle> = {
  'Satya Yuga': 0,
  'Treta Yuga': 90,
  'Dwapara Yuga': 180,
  'Kali Yuga': 270,
};

const YUGA_START_EVENT_INDEX: Record<YugaAngle, number> = {
  0: 0,
  90: 2,
  180: 4,
  270: 6,
};

interface DecreeCardContentProps {
  evt: (typeof EVENTS)[0];
  openMap: Record<string, boolean>;
  isSideCard?: boolean;
}

function DecreeCardContent({ evt, openMap, isSideCard = false }: DecreeCardContentProps) {
  const isRegistrationOpen = openMap[evt.slug] !== false && openMap[evt.id] !== false;

  return (
    <>
      {/* Ornamental Decree Corner Brackets */}
      <div className="decree-corner top-left" aria-hidden="true" />
      <div className="decree-corner top-right" aria-hidden="true" />
      <div className="decree-corner bottom-left" aria-hidden="true" />
      <div className="decree-corner bottom-right" aria-hidden="true" />

      <div className="yuga-decree-inner">
        {/* Top Header Group (Crest + Title + Epoch badge) */}
        <div className="yuga-card-header-group">
          <div className="yuga-mythic-crest-box" aria-hidden="true">
            <MythicCrestIcon type={evt.mythicCrest || 'lotus'} />
          </div>
          {evt.overheadTitle && (
            <span className="yuga-decree-overhead-title">{evt.overheadTitle}</span>
          )}
          <h3 className="yuga-decree-title">{evt.name}</h3>
          <span className="yuga-card-epoch-pill">{evt.yuga}</span>
        </div>

        {/* Middle Body Group: Center Art + Short Description */}
        <div className="yuga-card-body">
          {evt.slug === 'datathon' ? (
            <div className="yuga-card-center-art datathon-art" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MEDIA.images.datathonFish}
                alt="Datathon Matsya Golden Fish"
                className="yuga-art-img yuga-datathon-fish"
                draggable={false}
                loading="lazy"
              />
            </div>
          ) : evt.slug === 'prompt-relay' ? (
            <div className="yuga-card-center-art prompt-relay-art" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MEDIA.images.promptRelayLotus}
                alt="Prompt Relay Golden Lotus"
                className="yuga-art-img yuga-prompt-relay-lotus"
                draggable={false}
                loading="lazy"
              />
            </div>
          ) : evt.slug === 'brandathon' ? (
            <div className="yuga-card-center-art brandathon-art" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MEDIA.images.brandathonRath}
                alt="Brandathon Golden Rath"
                className="yuga-art-img yuga-brandathon-rath"
                draggable={false}
                loading="lazy"
              />
            </div>
          ) : evt.slug === 'hackmatrix' ? (
            <div className="yuga-card-center-art hackmatrix-art" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MEDIA.images.hackmatrixArt}
                alt="HackMatrix Golden Emblem"
                className="yuga-art-img yuga-hackmatrix-art"
                draggable={false}
                loading="lazy"
              />
            </div>
          ) : evt.slug === 'capture-the-flag' ? (
            <div className="yuga-card-center-art ctf-art" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MEDIA.images.ctfFeather}
                alt="CTF Golden Peacock Feather"
                className="yuga-art-img yuga-ctf-feather"
                draggable={false}
                loading="lazy"
              />
            </div>
          ) : evt.slug === 'among-us' ? (
            <div className="yuga-card-center-art among-us-art" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MEDIA.images.amongUsArt}
                alt="Among Us Golden Bow & Arrow"
                className="yuga-art-img yuga-among-us-art"
                draggable={false}
                loading="lazy"
              />
            </div>
          ) : evt.slug === 'pixel-perfect' || evt.slug === 'surprise-event' ? (
            <div className="yuga-card-center-art surprise-art pixel-perfect-art" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MEDIA.images.pixelPerfectTurtle}
                alt="Surprise Event Kurma Golden Turtle"
                className="yuga-art-img yuga-surprise-turtle"
                draggable={false}
                loading="lazy"
              />
            </div>
          ) : evt.slug === 'houdini-heist' ? (
            <div className="yuga-card-center-art houdini-art" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MEDIA.images.houdiniHeistArt}
                alt="Houdini Heist Golden Mace"
                className="yuga-art-img yuga-houdini-gada"
                draggable={false}
                loading="lazy"
              />
            </div>
          ) : (
            /* Ornamental Divider with Epoch Star */
            <div className="decree-ornament-divider" aria-hidden="true">
              <span className="decree-divider-line" />
              <span className="decree-divider-gem">✦</span>
              <span className="decree-divider-line" />
            </div>
          )}

          {/* Short Description */}
          <p className="yuga-decree-desc">{evt.shortDescription}</p>
        </div>

        {/* Footer Group: Prize Pool + Actions */}
        <div className="yuga-card-footer">
          {evt.prizePool && (
            <div className="yuga-card-meta-row">
              <span className="yuga-decree-prize-badge">{evt.prizePool}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className={`yuga-decree-actions ${!isRegistrationOpen ? 'single-btn is-closed' : ''}`}>
            {isRegistrationOpen ? (
              <>
                <Link
                  href={evt.rulebookUrl}
                  className="yuga-decree-btn secondary"
                  onClick={(e) => {
                    if (isSideCard) e.preventDefault();
                    e.stopPropagation();
                  }}
                  tabIndex={isSideCard ? -1 : 0}
                  target={evt.rulebookUrl?.startsWith('http') ? '_blank' : undefined}
                  rel={evt.rulebookUrl?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  VIEW RULEBOOK
                </Link>
                <Link
                  href={evt.registerUrl}
                  className="yuga-decree-btn primary"
                  onClick={(e) => {
                    if (isSideCard) e.preventDefault();
                    e.stopPropagation();
                  }}
                  tabIndex={isSideCard ? -1 : 0}
                  target={evt.registerUrl?.startsWith('http') ? '_blank' : undefined}
                  rel={evt.registerUrl?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  ENTER TRIAL
                </Link>
              </>
            ) : (
              <div
                className="yuga-decree-btn closed"
                onClick={(e) => e.stopPropagation()}
              >
                REGISTRATION CLOSED
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ArtimasScene() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [showIntro, setShowIntro] = useState(() => !getHasSeenIntro());
  const [wheelEmerging, setWheelEmerging] = useState(false);
  const [isYugasMode, setIsYugasMode] = useState(false);
  const [activeYuga, setActiveYuga] = useState<YugaAngle | null>(null);
  const [cardsReady, setCardsReady] = useState(false);
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  // Fetch live registration open/closed status from API
  useEffect(() => {
    fetch(`${API_BASE}/events`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data && Array.isArray(json.data)) {
          const map: Record<string, boolean> = {};
          json.data.forEach((e: any) => {
            const isOpen = e.registrationOpen !== false && e.active !== false;
            map[e.slug] = isOpen;
            map[e.id] = isOpen;
          });
          setOpenMap(map);
        }
      })
      .catch(() => { });
  }, []);

  // Clear legacy sessionStorage
  useEffect(() => {
    try {
      sessionStorage.removeItem('artimas_has_seen_intro');
    } catch { }
  }, []);

  const handleIntroComplete = useCallback(() => {
    setHasSeenIntro(true);
    setShowIntro(false);
    setTimeout(() => {
      setWheelEmerging(true);
    }, 50);
  }, []);

  useEffect(() => {
    if (!showIntro) {
      setWheelEmerging(true);
    }
  }, [showIntro]);

  // ── Mobile Arc Carousel State & Touch Swipe Handlers (< 768px) ─────────────
  const [mobileEventIndex, setMobileEventIndex] = useState(0);
  const mobileEventIndexRef = useRef(mobileEventIndex);
  useEffect(() => {
    mobileEventIndexRef.current = mobileEventIndex;
  }, [mobileEventIndex]);

  const arcTouchStartX = useRef(0);
  const arcTouchStartY = useRef(0);
  const arcTouchDeltaX = useRef(0);
  const arcTouchDeltaY = useRef(0);
  const isArcSwiping = useRef(false);

  // ── Refs ───────────────────────────────────────────────────────────────────
  const chakraRef = useRef<HTMLDivElement>(null);
  const chakraAngle = useRef(0);
  const isScrolling = useRef(false);
  const isYugasModeRef = useRef(false);

  // Video element refs
  const satyugRef = useRef<HTMLVideoElement>(null);
  const tretaRef = useRef<HTMLVideoElement>(null);
  const dwaparRef = useRef<HTMLVideoElement>(null);
  const kalyugRef = useRef<HTMLVideoElement>(null);

  const vidRefs = useRef({
    satyug: satyugRef,
    treta: tretaRef,
    dwapar: dwaparRef,
    kalyug: kalyugRef,
  });

  // ── Sync body class & chakra rotation ──────────────────────────────────────
  useEffect(() => {
    document.body.classList.toggle('mode-yugas', isYugasMode);
    isYugasModeRef.current = isYugasMode;

    if (isYugasMode && chakraRef.current && !chakraRef.current.classList.contains('chakra-descending')) {
      const el = chakraRef.current;
      void el.offsetWidth; // force reflow
      el.style.transform = `translate(-50%, -50%) rotate(${chakraAngle.current}deg)`;
    }
  }, [isYugasMode]);

  // ── Video play/pause when activeYuga changes ──────────────────────────────
  useEffect(() => {
    const activeKey = activeYuga !== null ? VIDEO_KEY[activeYuga] : null;

    Object.entries(vidRefs.current).forEach(([key, ref]) => {
      const el = ref.current;
      if (!el) return;
      if (key === activeKey) {
        el.muted = true;
        el.play().catch(() => { });
      } else {
        const target = el;
        setTimeout(() => {
          if (activeKey !== key) target.pause();
        }, 1400);
      }
    });
  }, [activeYuga]);

  // ── Core actions ──────────────────────────────────────────────────────────

  const enterYugasMode = useCallback(() => {
    if (isYugasModeRef.current || isScrolling.current) return;
    isScrolling.current = true;
    const el = chakraRef.current;
    if (!el) {
      isScrolling.current = false;
      return;
    }

    // 1. Freeze CSS rotation at current angle and disable spinning keyframe
    const currentAngle = getRotationAngle(el);
    el.style.animation = 'none';
    el.style.transition = 'none';
    el.style.transform = `translate(-50%, -50%) rotate(${currentAngle}deg)`;
    void el.offsetWidth; // Force browser to register frozen state

    // 2. Compute stately forward rotation to Satya Yuga (aligned at 315°):
    // Completes 1 full graceful turn (360°) plus alignment delta
    const norm = ((currentAngle % 360) + 360) % 360;
    const forwardDiff = (315 - norm + 360) % 360;
    const target = currentAngle + forwardDiff + 360;
    chakraAngle.current = target;

    // 3. Trigger the slow, synchronized 2.4s descent transition in next animation frame
    requestAnimationFrame(() => {
      el.classList.add('chakra-descending');
      el.style.transition = 'transform 2.4s cubic-bezier(0.16, 1, 0.3, 1), top 2.4s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transform = `translate(-50%, -50%) rotate(${target}deg)`;

      setIsYugasMode(true);
      setActiveYuga(0);

      // Stagger decree cards emergence so they appear gracefully as the chakra settles into place
      setTimeout(() => {
        setCardsReady(true);
      }, 1400);

      // Once chakra settles into place at the bottom, restore normal transition for subsequent turns
      setTimeout(() => {
        if (chakraRef.current) {
          chakraRef.current.classList.remove('chakra-descending');
          chakraRef.current.style.transition = '';
        }
        isScrolling.current = false;
      }, 2500);
    });
  }, []);

  const rotateChakra = useCallback((delta: number) => {
    if (isScrolling.current) return;
    isScrolling.current = true;

    chakraAngle.current += delta;
    const el = chakraRef.current;
    if (el) {
      el.style.transform = `translate(-50%, -50%) rotate(${chakraAngle.current}deg)`;
    }
    setActiveYuga(normalizeToYuga(chakraAngle.current));

    setTimeout(() => { isScrolling.current = false; }, SCROLL_COOLDOWN_MS);
  }, []);

  const goToYuga = useCallback((targetYuga: YugaAngle) => {
    if (isScrolling.current) return;
    isScrolling.current = true;

    const curNorm = (((chakraAngle.current - 315) % 360) + 360) % 360;
    let diff = targetYuga - curNorm;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    chakraAngle.current += diff;
    const el = chakraRef.current;
    if (el) {
      el.style.transform = `translate(-50%, -50%) rotate(${chakraAngle.current}deg)`;
    }
    setActiveYuga(targetYuga);

    setTimeout(() => { isScrolling.current = false; }, SCROLL_COOLDOWN_MS);
  }, []);

  const exitYugasMode = useCallback(() => {
    Object.values(vidRefs.current).forEach(ref => { ref.current?.pause(); });
    if (chakraRef.current) {
      chakraRef.current.classList.remove('chakra-descending');
      chakraRef.current.classList.add('chakra-ascending');
      chakraRef.current.style.transform = '';
      chakraRef.current.style.top = '';
      chakraRef.current.style.animation = '';
    }
    setIsYugasMode(false);
    setActiveYuga(null);
    setCardsReady(false);
    setTimeout(() => {
      if (chakraRef.current) {
        chakraRef.current.classList.remove('chakra-ascending');
        chakraRef.current.style.transition = '';
      }
    }, 1900);
  }, []);

  // ── Mobile Arc Carousel Navigation & Touch Gestures (< 768px) ──────────────
  // Sync mobileEventIndex when activeYuga changes externally (e.g. wheel rotation or slider)
  useEffect(() => {
    if (activeYuga !== null) {
      const currentEvent = EVENTS[mobileEventIndexRef.current];
      if (!currentEvent || currentEvent.yuga !== YUGA_NAME_MAP[activeYuga]) {
        const firstIdx = YUGA_START_EVENT_INDEX[activeYuga];
        if (firstIdx !== undefined && firstIdx !== mobileEventIndexRef.current) {
          setMobileEventIndex(firstIdx);
        }
      }
    }
  }, [activeYuga]);

  const selectMobileEvent = useCallback(
    (targetIndex: number) => {
      const normalized = ((targetIndex % EVENTS.length) + EVENTS.length) % EVENTS.length;
      setMobileEventIndex(normalized);

      const targetEvent = EVENTS[normalized];
      if (targetEvent) {
        const targetYuga = YUGA_ANGLE_MAP[targetEvent.yuga];
        if (targetYuga !== undefined && targetYuga !== activeYuga) {
          goToYuga(targetYuga);
        }
      }
    },
    [activeYuga, goToYuga]
  );

  const handleArcTouchStart = (e: React.TouchEvent) => {
    arcTouchStartX.current = e.touches[0].clientX;
    arcTouchStartY.current = e.touches[0].clientY;
    arcTouchDeltaX.current = 0;
    arcTouchDeltaY.current = 0;
    isArcSwiping.current = false;
  };

  const handleArcTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - arcTouchStartX.current;
    const dy = e.touches[0].clientY - arcTouchStartY.current;
    arcTouchDeltaX.current = dx;
    arcTouchDeltaY.current = dy;

    if (!isArcSwiping.current && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
      isArcSwiping.current = true;
    }
  };

  const handleArcTouchEnd = () => {
    const threshold = 35;
    if (
      Math.abs(arcTouchDeltaX.current) > threshold &&
      Math.abs(arcTouchDeltaX.current) > Math.abs(arcTouchDeltaY.current)
    ) {
      if (arcTouchDeltaX.current < 0) {
        selectMobileEvent(mobileEventIndexRef.current + 1);
      } else {
        selectMobileEvent(mobileEventIndexRef.current - 1);
      }
    }
    arcTouchDeltaX.current = 0;
    arcTouchDeltaY.current = 0;
    isArcSwiping.current = false;
  };

  // ── Event listeners (active only inside Yugas mode) ─────────────────────────

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!isYugasModeRef.current) return;
      rotateChakra(e.deltaY > 0 ? 90 : -90);
    };

    let touchStartY = 0;
    let touchStartX = 0;
    let isCardZoneTouch = false;

    const onTouchStart = (e: TouchEvent) => {
      if (!e.touches.length) return;
      const touch = e.touches[0];
      touchStartY = touch.clientY;
      touchStartX = touch.clientX;

      const target = e.target as HTMLElement | null;
      const isCardTarget = Boolean(
        target && (
          target.closest('.yuga-events-showcase') ||
          target.closest('.yuga-mobile-arc-showcase') ||
          target.closest('.yuga-decree-card') ||
          target.closest('.mobile-deck-indicator') ||
          target.closest('.deck-dot') ||
          target.closest('.yuga-arc-dot')
        )
      );

      // Check if touch starts anywhere within the vertical band of the showcase cards
      // (this catches edge swipes in the gutters next to the cards)
      let isInShowcaseBand = false;
      const showcaseEl = document.querySelector('.yuga-events-showcase') || document.querySelector('.yuga-mobile-arc-showcase');
      if (showcaseEl) {
        const rect = showcaseEl.getBoundingClientRect();
        if (touch.clientY >= rect.top - 24 && touch.clientY <= rect.bottom + 24) {
          isInShowcaseBand = true;
        }
      }

      if (isCardTarget || isInShowcaseBand) {
        isCardZoneTouch = true;
        return;
      }

      isCardZoneTouch = false;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!e.changedTouches.length || !isYugasModeRef.current) return;

      const touch = e.changedTouches[0];
      const diffX = touchStartX - touch.clientX;
      const diffY = touchStartY - touch.clientY;

      if (isCardZoneTouch) {
        isCardZoneTouch = false;
        // If swiped horizontally on or near the card edges, trigger card switch along the arc!
        if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX > 0) {
            selectMobileEvent(mobileEventIndexRef.current + 1);
          } else {
            selectMobileEvent(mobileEventIndexRef.current - 1);
          }
        }
        return; // NEVER rotate chakra from card zone!
      }

      // Outside card zone: only deliberate vertical swipes rotate the Chakra/Yuga
      if (Math.abs(diffY) > 50 && Math.abs(diffY) > Math.abs(diffX) * 1.5) {
        rotateChakra(diffY > 0 ? 90 : -90);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!isYugasModeRef.current) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') rotateChakra(90);
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') rotateChakra(-90);
      else if (['1', '2', '3', '4'].includes(e.key)) {
        const targetNorm = (parseInt(e.key, 10) - 1) * 90;
        goToYuga(targetNorm as YugaAngle);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [goToYuga, rotateChakra, selectMobileEvent]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Cinematic Full-Screen Intro Video ─────────────────────────── */}
      {showIntro && (
        <IntroVideoOverlay onComplete={handleIntroComplete} />
      )}

      <div className={`landing-wrapper${isYugasMode ? ' in-yugas-mode' : ''}`}>
        {/* ── Main Landing Hero Viewport (100vh) ─────────────────────────── */}
        <div className="landing-hero-section">
          {/* ── Brand Logo ────────────────────────────────────────────────── */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={MEDIA.images.logo}
            className={`brand-logo${wheelEmerging && !isYugasMode ? ' logo-emerged' : ''}${!wheelEmerging && !isYugasMode ? ' logo-starting-top' : ''}`}
            alt="Artimas Logo"
            onClick={isYugasMode ? exitYugasMode : undefined}
            draggable={false}
          />

          {/* ── Top-Right Navigation Islands ──────────────────────────────── */}
          <NavIslands
            showMobile={isYugasMode}
            onLogoClick={isYugasMode ? exitYugasMode : undefined}
          />

          {/* ── Enter Button ──────────────────────────────────────────────── */}
          <button className="enter-btn" type="button" onClick={enterYugasMode}>
            ENTER THE YUGAS
          </button>

          {/* ── Yuga Title Emblems ────────────────────────────────────────── */}
          <div className="yuga-titles-wrapper">
            {([
              [0, MEDIA.images.yugaTitles[0], 'Satya Yuga'],
              [90, MEDIA.images.yugaTitles[90], 'Treta Yuga'],
              [180, MEDIA.images.yugaTitles[180], 'Dwapara Yuga'],
              [270, MEDIA.images.yugaTitles[270], 'Kali Yuga'],
            ] as [YugaAngle, string, string][]).map(([angle, src, alt]) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={angle}
                src={src}
                alt={alt}
                className={`yuga-title-img${activeYuga === angle ? ' active' : ''}`}
                draggable={false}
              />
            ))}
          </div>

          {/* ── Parallax Scene ────────────────────────────────────────────── */}
          <div className="parallax-scene">
            {/* Layer 0: Cosmic Background & Videos */}
            <div className="parallax-layer layer-bg">
              {/* Default landing background */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MEDIA.images.bgImage}
                alt=""
                draggable={false}
                className={`yuga-bg default-bg${!isYugasMode ? ' active' : ''}`}
              />

              {/* Yuga cinematic videos (Cloudinary CDN) */}
              <video
                ref={satyugRef}
                className={`yuga-bg yuga-video${activeYuga === 0 ? ' active' : ''}`}
                style={{ zIndex: activeYuga === 0 ? 2 : 1 }}
                loop muted playsInline preload="auto"
              >
                <source src={MEDIA.videos.satyug} type="video/mp4" />
              </video>
              <video
                ref={tretaRef}
                className={`yuga-bg yuga-video${activeYuga === 90 ? ' active' : ''}`}
                style={{ zIndex: activeYuga === 90 ? 2 : 1 }}
                loop muted playsInline preload="auto"
              >
                <source src={MEDIA.videos.treta} type="video/mp4" />
              </video>
              <video
                ref={dwaparRef}
                className={`yuga-bg yuga-video${activeYuga === 180 ? ' active' : ''}`}
                style={{ zIndex: activeYuga === 180 ? 2 : 1 }}
                loop muted playsInline preload="auto"
              >
                <source src={MEDIA.videos.dwapar} type="video/mp4" />
              </video>
              <video
                ref={kalyugRef}
                className={`yuga-bg yuga-video${activeYuga === 270 ? ' active' : ''}`}
                style={{ zIndex: activeYuga === 270 ? 2 : 1 }}
                loop muted playsInline preload="auto"
              >
                <source src={MEDIA.videos.kalyug} type="video/mp4" />
              </video>
            </div>

            {/* 3D Chakra Medallion (The Wheel) */}
            <div
              ref={chakraRef}
              className={`chakra-container${wheelEmerging && !isYugasMode ? ' wheel-emerged' : ''}${!wheelEmerging && !isYugasMode ? ' wheel-starting-bottom' : ''}`}
              onClick={() => (isYugasMode ? rotateChakra(90) : enterYugasMode())}
              role="button"
              tabIndex={0}
              aria-label={isYugasMode ? 'Rotate Chakra to next Yuga' : 'Enter the Yugas'}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  if (isYugasMode) rotateChakra(90);
                  else enterYugasMode();
                }
              }}
            >
              <ChakraMedallion />
            </div>

            {/* Temple Pillars Foreground */}
            <div className="parallax-layer layer-pillars">
              <picture className="pillar-picture">
                <source media="(max-width: 960px)" srcSet={MEDIA.images.pillarMobile} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={MEDIA.images.pillar} alt="" draggable={false} />
              </picture>
            </div>
          </div>

          {/* ── Yuga Event Showcase Cards ──── */}
          {/* Desktop 3D Dual-Card Showcase (>= 768px) */}
          {isYugasMode && activeYuga !== null && cardsReady && (
            <div
              className={`yuga-events-showcase yuga-showcase-${activeYuga}`}
              key={`desktop-${activeYuga}`}
            >
              {EVENTS.filter((e) => e.yuga === YUGA_NAME_MAP[activeYuga]).map((evt, idx) => (
                <div
                  key={evt.id}
                  className={`yuga-decree-card yuga-card-${activeYuga}`}
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  <DecreeCardContent evt={evt} openMap={openMap} isSideCard={false} />
                </div>
              ))}
            </div>
          )}

          {/* Mobile Arc Carousel Showcase (< 768px) */}
          {isYugasMode && activeYuga !== null && cardsReady && (
            <div
              className="yuga-mobile-arc-showcase"
              onTouchStart={handleArcTouchStart}
              onTouchMove={handleArcTouchMove}
              onTouchEnd={handleArcTouchEnd}
              role="region"
              aria-label="Artimas Events Curved Carousel"
            >
              <div className="yuga-mobile-arc-stage">
                {EVENTS.map((evt, idx) => {
                  let offset = ((idx - mobileEventIndex) % 8 + 8) % 8;
                  if (offset > 4) offset -= 8;

                  // Render only center and surrounding 2 cards on either side
                  if (Math.abs(offset) > 2) return null;

                  let posClass = 'arc-pos-center';
                  if (offset === -1) posClass = 'arc-pos-left-1';
                  else if (offset === 1) posClass = 'arc-pos-right-1';
                  else if (offset === -2) posClass = 'arc-pos-left-2';
                  else if (offset === 2) posClass = 'arc-pos-right-2';

                  const isCenter = offset === 0;
                  const cardYugaAngle = YUGA_ANGLE_MAP[evt.yuga];
                  const isCurrentEpoch = cardYugaAngle === activeYuga;

                  return (
                    <div
                      key={evt.id}
                      className={`yuga-decree-card yuga-arc-card yuga-card-${cardYugaAngle} ${posClass} ${
                        isCurrentEpoch ? 'yuga-card-active-epoch' : 'yuga-card-inactive-epoch'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isCenter) {
                          selectMobileEvent(idx);
                        }
                      }}
                      role={isCenter ? 'group' : 'button'}
                      aria-label={`${evt.name} (${evt.yuga})`}
                      tabIndex={isCenter ? 0 : -1}
                    >
                      <DecreeCardContent
                        evt={evt}
                        openMap={openMap}
                        isSideCard={!isCenter}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Mobile Arc Dot & Epoch Indicators */}
              <div className="yuga-arc-dots-bar" aria-hidden="true">
                {EVENTS.map((evt, idx) => {
                  const isActive = idx === mobileEventIndex;
                  const dotEpoch = YUGA_ANGLE_MAP[evt.yuga];
                  return (
                    <button
                      key={evt.id}
                      type="button"
                      className={`yuga-arc-dot dot-epoch-${dotEpoch}${isActive ? ' active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectMobileEvent(idx);
                      }}
                      aria-label={`Go to ${evt.name}`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Right-Side Linear Yuga Slider Navigation ──── */}
          {isYugasMode && activeYuga !== null && (
            <LinearYugaSlider
              activeYuga={activeYuga}
              onSelectYuga={goToYuga}
            />
          )}

          {/* ── Yuga Chakra Navigation Controls (Beside Wheel) ──── */}
          {isYugasMode && (
            <>
              <button
                type="button"
                className="chakra-nav-btn prev"
                onClick={(e) => {
                  e.stopPropagation();
                  rotateChakra(-90);
                }}
                title="Previous Yuga"
                aria-label="Previous Yuga"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={MEDIA.images.chakraRotateBtn}
                  alt="Previous Yuga"
                  className="chakra-nav-btn-img prev"
                  draggable={false}
                />
              </button>
              <button
                type="button"
                className="chakra-nav-btn next"
                onClick={(e) => {
                  e.stopPropagation();
                  rotateChakra(90);
                }}
                title="Next Yuga"
                aria-label="Next Yuga"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={MEDIA.images.chakraRotateBtn}
                  alt="Next Yuga"
                  className="chakra-nav-btn-img next"
                  draggable={false}
                />
              </button>
            </>
          )}
        </div>

        {/* ── Natural Flow Footer (Scroll down to reveal) ────────────────── */}
        {!isYugasMode && <LandingFooter />}
      </div>
    </>
  );
}
