import { useState, useEffect, useRef, useCallback } from 'react';

const COLORS = {
  powder: '#F1F6F4',
  mint: '#D9E8E2',
  yellow: '#FFC801',
  saffron: '#FF9932',
  teal: '#114C5A',
  noir: '#172B36',
  cyan: '#00D4FF',
};

const pricingMatrix = {
  USD: { symbol: '$', tiers: { Starter: 49, Professional: 149, Enterprise: 499 } },
  EUR: { symbol: '€', tiers: { Starter: 45, Professional: 139, Enterprise: 459 } },
  INR: { symbol: '₹', tiers: { Starter: 3999, Professional: 11999, Enterprise: 39999 } },
};

const features = [
  { title: 'Neural ETL Engine', label: 'LOW LATENCY', desc: 'Automate extraction, enrichment, and routing with transformer-powered workflows.' },
  { title: 'Vector Native', label: 'RAG READY', desc: 'Built specifically for retrieval pipelines and enterprise-scale semantic search.' },
  { title: 'Real-Time Sync', label: '99.99% UPTIME', desc: 'Sub-second synchronization across every mission-critical data source.' },
  { title: 'Governance Layer', label: 'SOC2 COMPLIANT', desc: 'Compliance, observability, and auditing integrated into every workflow.' },
];

const testimonials = [
  { name: 'Alicia Romero', role: 'VP Engineering - Helix', text: 'NeuralFlow reduced our reporting overhead by nearly 80%. The platform feels years ahead of traditional tooling.' },
  { name: 'David Chen', role: 'CTO - Orion Systems', text: 'Our AI stack became dramatically simpler once we migrated to NeuralFlow.' },
  { name: 'Sofia Patel', role: 'Head of Data - Novaworks', text: "The best developer experience we've seen in enterprise automation." },
];

const faqs = [
  { q: 'Can NeuralFlow integrate with existing systems?', a: 'Yes. Connect databases, APIs, CRMs, warehouses, and vector stores without custom infrastructure.' },
  { q: 'Does the platform support enterprise deployments?', a: 'Dedicated clusters, private networking, compliance controls, and SLA-backed support are available.' },
  { q: 'Can teams collaborate on workflows?', a: 'Role-based permissions, versioning, and real-time collaboration are included.' },
];

function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

function ParallaxLayer({ children, speed = 0.5, style }: { children: React.ReactNode; speed?: number; style?: React.CSSProperties }) {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        setOffset(scrollProgress * speed * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={ref} style={{ ...style, transform: `translateY(${offset}px)` }}>
      {children}
    </div>
  );
}

function ScrollRevealSection({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      className={`${className} scroll-reveal ${isVisible ? 'scroll-reveal-visible' : ''}`}
      style={{ '--delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

function DepthCard({ children, depth = 1, className = '' }: { children: React.ReactNode; depth?: number; className?: string }) {
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5 * depth;
    const rotateY = ((x - centerX) / centerX) * 5 * depth;

    setTransform({ rotateX, rotateY });
  }, [depth]);

  const handleMouseLeave = useCallback(() => {
    setTransform({ rotateX: 0, rotateY: 0 });
  }, []);

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) translateZ(${depth * 10}px)`,
        transition: 'transform 0.3s ease-out',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [currency, setCurrency] = useState('USD');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('active-feature');
    if (stored !== null) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) setActiveFeature(parsed);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFeatureClick = (index: number) => {
    setActiveFeature(index);
    localStorage.setItem('active-feature', String(index));
  };

  const calculatePrice = (value: number) => (billingCycle === 'annual' ? Math.floor(value * 0.8) : value);
  const currentPrices = pricingMatrix[currency as keyof typeof pricingMatrix];

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }

    body {
      background: ${COLORS.noir};
      color: ${COLORS.powder};
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    h1, h2, h3, h4, .mono { font-family: 'JetBrains Mono', monospace; }

    /* Parallax & Reveal Animations */
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(2deg); }
    }

    @keyframes pulse-glow {
      0%, 100% { opacity: 0.25; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.05); }
    }

    @keyframes text-gradient {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    @keyframes border-glow {
      0%, 100% { box-shadow: 0 0 20px rgba(255, 200, 1, 0.3); }
      50% { box-shadow: 0 0 40px rgba(255, 200, 1, 0.6); }
    }

    @keyframes progress-fill {
      from { width: 0%; }
    }

    @keyframes scale-bounce {
      0% { transform: scale(0.8); opacity: 0; }
      60% { transform: scale(1.02); }
      100% { transform: scale(1); opacity: 1; }
    }

    @keyframes slide-in-left {
      from { transform: translateX(-60px) rotateY(10deg); opacity: 0; }
      to { transform: translateX(0) rotateY(0deg); opacity: 1; }
    }

    @keyframes slide-in-right {
      from { transform: translateX(60px) rotateY(-10deg); opacity: 0; }
      to { transform: translateX(0) rotateY(0deg); opacity: 1; }
    }

    @keyframes fade-up {
      from { transform: translateY(50px) scale(0.95); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }

    @keyframes parallax-zoom {
      from { transform: scale(1.2); opacity: 0.3; }
      to { transform: scale(1); opacity: 1; }
    }

    .scroll-reveal {
      opacity: 0;
      transform: translateY(40px) scale(0.98);
      transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      transition-delay: var(--delay, 0ms);
    }

    .scroll-reveal.scroll-reveal-visible {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    .scroll-reveal-left {
      opacity: 0;
      transform: translateX(-80px) rotateY(15deg);
      transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1);
      transition-delay: var(--delay, 0ms);
    }

    .scroll-reveal-left.scroll-reveal-visible {
      opacity: 1;
      transform: translateX(0) rotateY(0deg);
    }

    .scroll-reveal-right {
      opacity: 0;
      transform: translateX(80px) rotateY(-15deg);
      transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1);
      transition-delay: var(--delay, 0ms);
    }

    .scroll-reveal-right.scroll-reveal-visible {
      opacity: 1;
      transform: translateX(0) rotateY(0deg);
    }

    .scroll-reveal-scale {
      opacity: 0;
      transform: scale(0.85) translateY(30px);
      transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
      transition-delay: var(--delay, 0ms);
    }

    .scroll-reveal-scale.scroll-reveal-visible {
      opacity: 1;
      transform: scale(1) translateY(0);
    }

    .glow {
      position: absolute;
      border-radius: 999px;
      filter: blur(120px);
      pointer-events: none;
      animation: pulse-glow 6s ease-in-out infinite;
      will-change: transform, opacity;
    }

    .glow-1 { animation-delay: 0s; }
    .glow-2 { animation-delay: 2s; }
    .glow-3 { animation-delay: 4s; }

    .parallax-deep { will-change: transform; }
    .parallax-mid { will-change: transform; }
    .parallax-shallow { will-change: transform; }

    .depth-layer {
      transform-style: preserve-3d;
      perspective: 1000px;
    }

    .primary-btn {
      background: linear-gradient(135deg, ${COLORS.yellow}, ${COLORS.saffron});
      color: ${COLORS.noir};
      border: none;
      padding: 18px 32px;
      border-radius: 14px;
      font-weight: 700;
      font-size: 15px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(255, 200, 1, 0.25);
    }

    .primary-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      transition: left 0.5s ease;
    }

    .primary-btn:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 8px 30px rgba(255, 200, 1, 0.4);
    }

    .primary-btn:hover::before { left: 100%; }

    .secondary-btn {
      background: transparent;
      color: ${COLORS.powder};
      border: 1.5px solid rgba(255, 255, 255, 0.2);
      padding: 18px 32px;
      border-radius: 14px;
      font-weight: 600;
      font-size: 15px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .secondary-btn:hover {
      border-color: ${COLORS.yellow};
      color: ${COLORS.yellow};
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(255, 200, 1, 0.15);
    }

    .feature-card {
      background: rgba(17, 76, 90, 0.35);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      padding: 32px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .feature-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, ${COLORS.yellow}, transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-8px) scale(1.02);
      border-color: rgba(255, 200, 1, 0.3);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 200, 1, 0.1);
    }

    .feature-card:hover::before { opacity: 1; }
    .feature-card.active {
      border-color: ${COLORS.yellow};
      box-shadow: 0 0 0 1px ${COLORS.yellow}, 0 20px 50px rgba(255, 200, 1, 0.2);
    }

    .pricing-card {
      background: linear-gradient(180deg, rgba(17, 76, 90, 0.8), rgba(23, 43, 54, 0.95));
      border-radius: 28px;
      padding: 48px 40px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .pricing-card::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255, 200, 1, 0.05) 0%, transparent 50%);
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    .pricing-card:hover {
      transform: translateY(-8px) scale(1.02);
      border-color: rgba(255, 200, 1, 0.2);
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
    }

    .pricing-card:hover::before { opacity: 1; }
    .pricing-card.featured {
      border: 2px solid ${COLORS.yellow};
      animation: border-glow 3s ease-in-out infinite;
    }

    .testimonial-card {
      background: rgba(255, 255, 255, 0.03);
      border-radius: 24px;
      padding: 36px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .testimonial-card:hover {
      transform: translateY(-5px) scale(1.02);
      border-color: rgba(255, 200, 1, 0.2);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.03);
      padding: 36px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .stat-card::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, ${COLORS.yellow}, ${COLORS.saffron});
      transform: scaleX(0);
      transition: transform 0.4s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px) scale(1.02);
      border-color: rgba(255, 200, 1, 0.15);
    }

    .stat-card:hover::after { transform: scaleX(1); }

    .faq-card {
      background: rgba(255, 255, 255, 0.03);
      padding: 32px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      transition: all 0.3s ease;
    }

    .faq-card:hover {
      border-color: rgba(255, 200, 1, 0.2);
      background: rgba(255, 255, 255, 0.05);
      transform: translateX(8px);
    }

    .gradient-text {
      background: linear-gradient(135deg, ${COLORS.yellow}, ${COLORS.saffron}, ${COLORS.cyan});
      background-size: 200% 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: text-gradient 4s ease infinite;
    }

    .nav-link {
      color: ${COLORS.mint};
      transition: all 0.2s ease;
      cursor: pointer;
      position: relative;
    }

    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: ${COLORS.yellow};
      transition: width 0.3s ease;
    }

    .nav-link:hover { color: ${COLORS.powder}; }
    .nav-link:hover::after { width: 100%; }

    .toggle-btn {
      background: transparent;
      color: ${COLORS.powder};
      border: none;
      padding: 12px 24px;
      border-radius: 999px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .toggle-btn.active {
      background: ${COLORS.yellow};
      color: ${COLORS.noir};
    }

    .progress-bar {
      height: 8px;
      border-radius: 999px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.08);
    }

    .progress-fill {
      height: 100%;
      border-radius: 999px;
      animation: progress-fill 1.5s ease-out forwards;
    }

    .trusted-logo {
      font-weight: 700;
      letter-spacing: 2px;
      opacity: 0.7;
      transition: all 0.3s ease;
    }

    .trusted-logo:hover {
      opacity: 1;
      color: ${COLORS.powder};
      transform: scale(1.05);
    }

    .dashboard-card {
      background: rgba(255, 255, 255, 0.04);
      padding: 20px;
      border-radius: 16px;
      transition: all 0.3s ease;
    }

    .dashboard-card:hover { background: rgba(255, 255, 255, 0.08); }

    .footer-link {
      color: ${COLORS.mint};
      transition: color 0.2s ease;
      cursor: pointer;
    }

    .footer-link:hover { color: ${COLORS.yellow}; }

    .hero-text { animation: slide-in-left 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .hero-dashboard { animation: slide-in-right 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }

    @media (max-width: 900px) {
      .hero-grid { grid-template-columns: 1fr !important; }
      .stats-grid { grid-template-columns: 1fr !important; }
      .pricing-grid { grid-template-columns: 1fr !important; }
      .testimonial-grid { grid-template-columns: 1fr !important; }
    }
  `;

  return (
    <div style={{ background: COLORS.noir, minHeight: '100vh', color: COLORS.powder, position: 'relative', overflow: 'hidden' }}>
      <style>{globalStyles}</style>

      {/* Parallax Background Layers */}
      <div className="depth-layer">
        <ParallaxLayer speed={-30}>
          <div className="glow glow-1 parallax-deep" style={{ width: 700, height: 700, background: COLORS.yellow, top: -200, left: -250, position: 'fixed' }} />
        </ParallaxLayer>

        <ParallaxLayer speed={-15}>
          <div className="glow glow-2 parallax-mid" style={{ width: 500, height: 500, background: COLORS.teal, right: -100, top: 300, position: 'fixed' }} />
        </ParallaxLayer>

        <ParallaxLayer speed={-8}>
          <div className="glow glow-3 parallax-shallow" style={{ width: 450, height: 450, background: COLORS.saffron, left: '25%', bottom: -50, position: 'fixed' }} />
        </ParallaxLayer>
      </div>

      {/* Floating particles with parallax */}
      <div style={{ position: 'fixed', width: 8, height: 8, background: COLORS.yellow, borderRadius: '50%', top: '20%', left: '10%', animation: 'float 6s ease-in-out infinite', opacity: 0.6, transform: `translateY(${scrollY * 0.1}px)` }} />
      <div style={{ position: 'fixed', width: 6, height: 6, background: COLORS.cyan, borderRadius: '50%', top: '40%', right: '15%', animation: 'float 8s ease-in-out infinite 1s', opacity: 0.5, transform: `translateY(${scrollY * 0.15}px)` }} />
      <div style={{ position: 'fixed', width: 10, height: 10, background: COLORS.saffron, borderRadius: '50%', top: '70%', left: '20%', animation: 'float 7s ease-in-out infinite 2s', opacity: 0.4, transform: `translateY(${scrollY * 0.08}px)` }} />
      <div style={{ position: 'fixed', width: 5, height: 5, background: COLORS.yellow, borderRadius: '50%', top: '50%', left: '70%', animation: 'float 5s ease-in-out infinite 0.5s', opacity: 0.3, transform: `translateY(${scrollY * 0.12}px)` }} />
      <div style={{ position: 'fixed', width: 7, height: 7, background: COLORS.cyan, borderRadius: '50%', top: '30%', right: '30%', animation: 'float 9s ease-in-out infinite 1.5s', opacity: 0.35, transform: `translateY(${scrollY * 0.18}px)` }} />

      {/* Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 7%',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: `rgba(23, 43, 54, ${Math.min(0.95, 0.65 + scrollY * 0.001)})`,
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'background 0.3s ease',
      }}>
        <div className="mono" style={{ fontSize: 26, fontWeight: 800, color: COLORS.yellow, letterSpacing: 1 }}>
          NEURALFLOW
        </div>
        <div style={{ display: 'flex', gap: 36 }}>
          {['Features', 'Pricing', 'Security', 'Developers'].map((item) => (
            <span key={item} className="nav-link">{item}</span>
          ))}
        </div>
        <button className="primary-btn">Start Free Trial</button>
      </nav>

      {/* Hero Section */}
      <header style={{ padding: '100px 7% 80px', position: 'relative', zIndex: 10 }}>
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 80, alignItems: 'center' }}>
          <div className="hero-text">
            <div className="mono" style={{ color: COLORS.saffron, marginBottom: 24, letterSpacing: 3, fontSize: 13, fontWeight: 600 }}>
              AI-POWERED DATA AUTOMATION
            </div>
            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', lineHeight: 1.08, marginBottom: 32, fontWeight: 800 }}>
              Build<span className="gradient-text"> self-healing </span>data systems at enterprise scale.
            </h1>
            <p style={{ fontSize: 18, maxWidth: 600, color: COLORS.mint, lineHeight: 1.85, marginBottom: 48, fontWeight: 400 }}>
              NeuralFlow orchestrates pipelines, vector databases, AI agents, and real-time analytics into a single, intelligent automation layer.
            </p>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <button className="primary-btn">Deploy in Minutes</button>
              <button className="secondary-btn">Read Documentation</button>
            </div>
          </div>

          <DepthCard depth={2}>
            <div className="hero-dashboard" style={{
              background: 'linear-gradient(180deg, rgba(17, 76, 90, 0.7), rgba(23, 43, 54, 0.9))',
              borderRadius: 32,
              padding: 40,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 40px 80px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(20px)',
            }}>
              <div className="mono" style={{ color: COLORS.yellow, marginBottom: 28, fontSize: 13, fontWeight: 600, letterSpacing: 2 }}>
                SYSTEM HEALTH
              </div>
              <div style={{ display: 'grid', gap: 16 }}>
                {['Pipeline Throughput', 'AI Agent Activity', 'Vector Sync', 'Latency Monitor'].map((item, index) => (
                  <div key={item} className="dashboard-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontSize: 14 }}>{item}</span>
                      <span style={{ color: COLORS.yellow, fontWeight: 600 }}>99.{index + 1}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${90 + index * 2}%`,
                          background: index % 2 ? `linear-gradient(90deg, ${COLORS.saffron}, ${COLORS.yellow})` : `linear-gradient(90deg, ${COLORS.yellow}, ${COLORS.cyan})`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DepthCard>
        </div>
      </header>

      {/* Stats Section */}
      <section style={{ padding: '20px 7% 80px', position: 'relative', zIndex: 10 }}>
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          <ScrollRevealSection delay={0}>
            <DepthCard depth={1.5}>
              <div className="stat-card">
                <div className="mono gradient-text" style={{ fontSize: 48, marginBottom: 8, fontWeight: 800 }}>1.2B+</div>
                <div style={{ color: COLORS.mint, fontSize: 15 }}>Events Processed</div>
              </div>
            </DepthCard>
          </ScrollRevealSection>
          <ScrollRevealSection delay={100}>
            <DepthCard depth={1.5}>
              <div className="stat-card">
                <div className="mono gradient-text" style={{ fontSize: 48, marginBottom: 8, fontWeight: 800 }}>320+</div>
                <div style={{ color: COLORS.mint, fontSize: 15 }}>Enterprise Clients</div>
              </div>
            </DepthCard>
          </ScrollRevealSection>
          <ScrollRevealSection delay={200}>
            <DepthCard depth={1.5}>
              <div className="stat-card">
                <div className="mono gradient-text" style={{ fontSize: 48, marginBottom: 8, fontWeight: 800 }}>99.99%</div>
                <div style={{ color: COLORS.mint, fontSize: 15 }}>Global Uptime</div>
              </div>
            </DepthCard>
          </ScrollRevealSection>
        </div>
      </section>

      {/* Trusted By */}
      <section style={{ padding: '40px 7% 100px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <ScrollRevealSection>
          <div className="mono" style={{ marginBottom: 40, color: COLORS.saffron, letterSpacing: 2, fontSize: 12, fontWeight: 600 }}>
            TRUSTED BY MODERN TEAMS
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 60, flexWrap: 'wrap' }}>
            {['OPENAI', 'VERCEL', 'STRIPE', 'SHOPIFY', 'NOTION'].map((name, i) => (
              <ScrollRevealSection key={name} delay={i * 50}>
                <span className="trusted-logo">{name}</span>
              </ScrollRevealSection>
            ))}
          </div>
        </ScrollRevealSection>
      </section>

      {/* Features Section */}
      <section style={{ padding: '100px 7%', position: 'relative', zIndex: 10 }}>
        <ScrollRevealSection>
          <h2 className="mono" style={{ textAlign: 'center', fontSize: 48, marginBottom: 80, fontWeight: 800 }}>
            Platform Capabilities
          </h2>
        </ScrollRevealSection>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {features.map((feature, index) => (
            <ScrollRevealSection key={feature.title} delay={index * 100}>
              <DepthCard depth={1.2}>
                <div
                  className={`feature-card ${activeFeature === index ? 'active' : ''}`}
                  onClick={() => handleFeatureClick(index)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFeatureClick(index)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="mono" style={{ color: COLORS.saffron, fontSize: 11, marginBottom: 16, letterSpacing: 2, fontWeight: 600 }}>
                    {feature.label}
                  </div>
                  <h3 style={{ marginBottom: 16, fontSize: 26, fontWeight: 700 }}>{feature.title}</h3>
                  <p style={{ color: COLORS.mint, lineHeight: 1.8, fontSize: 15 }}>{feature.desc}</p>
                </div>
              </DepthCard>
            </ScrollRevealSection>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ padding: '120px 7%', background: 'linear-gradient(180deg, rgba(17, 76, 90, 0.3), rgba(23, 43, 54, 0.5))', position: 'relative', zIndex: 10 }}>
        <ScrollRevealSection>
          <h2 className="mono" style={{ textAlign: 'center', fontSize: 48, marginBottom: 20, fontWeight: 800 }}>
            Transparent Pricing
          </h2>
          <p style={{ textAlign: 'center', color: COLORS.mint, maxWidth: 600, margin: '0 auto 60px', lineHeight: 1.85 }}>
            Flexible pricing engineered for startups, scaling businesses, and enterprise teams.
          </p>
        </ScrollRevealSection>

        <ScrollRevealSection delay={100}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 60 }}>
            <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 999, padding: 6, gap: 4 }}>
              {['USD', 'EUR', 'INR'].map((item) => (
                <button key={item} onClick={() => setCurrency(item)} className={`toggle-btn ${currency === item ? 'active' : ''}`}>
                  {item}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 999, padding: 6, gap: 4 }}>
              <button onClick={() => setBillingCycle('monthly')} className={`toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}>Monthly</button>
              <button onClick={() => setBillingCycle('annual')} className={`toggle-btn ${billingCycle === 'annual' ? 'active' : ''}`}>Annual (20% Off)</button>
            </div>
          </div>
        </ScrollRevealSection>

        <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
          {Object.entries(currentPrices.tiers).map(([tier, value], index) => {
            const priceValue = value as number;
            return (
              <ScrollRevealSection key={tier} delay={index * 150}>
                <DepthCard depth={tier === 'Professional' ? 2 : 1.2}>
                  <div className={`pricing-card ${tier === 'Professional' ? 'featured' : ''}`}>
                    {tier === 'Professional' && (
                      <div className="mono" style={{ color: COLORS.yellow, marginBottom: 20, fontSize: 11, letterSpacing: 2, fontWeight: 600 }}>
                        MOST POPULAR
                      </div>
                    )}
                    <h3 style={{ fontSize: 28, marginBottom: 24, fontWeight: 700 }}>{tier}</h3>
                    <div className="mono" style={{ fontSize: 56, marginBottom: 24, fontWeight: 800 }}>
                      <span className="gradient-text">{currentPrices.symbol}{calculatePrice(priceValue)}</span>
                      <span style={{ fontSize: 18, color: COLORS.mint, marginLeft: 4 }}> /mo</span>
                    </div>
                    <ul style={{ listStyle: 'none', lineHeight: 2.5, color: COLORS.mint, marginBottom: 40 }}>
                      <li>Unlimited Pipelines</li>
                      <li>AI Workflow Builder</li>
                      <li>Vector DB Integrations</li>
                      <li>{tier === 'Enterprise' ? 'Dedicated Infrastructure' : 'Community Support'}</li>
                    </ul>
                    <button className="primary-btn" style={{ width: '100%' }}>Select Plan</button>
                  </div>
                </DepthCard>
              </ScrollRevealSection>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '120px 7%', position: 'relative', zIndex: 10 }}>
        <ScrollRevealSection>
          <h2 className="mono" style={{ textAlign: 'center', fontSize: 48, marginBottom: 80, fontWeight: 800 }}>
            Loved By Engineering Teams
          </h2>
        </ScrollRevealSection>

        <div className="testimonial-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {testimonials.map((item, index) => (
            <ScrollRevealSection key={item.name} delay={index * 100}>
              <DepthCard depth={1.3}>
                <div className="testimonial-card">
                  <p style={{ lineHeight: 1.9, color: COLORS.mint, marginBottom: 28, fontSize: 15 }}>"{item.text}"</p>
                  <div className="mono" style={{ color: COLORS.yellow, fontWeight: 600 }}>{item.name}</div>
                  <div style={{ color: COLORS.saffron, marginTop: 6, fontSize: 14 }}>{item.role}</div>
                </div>
              </DepthCard>
            </ScrollRevealSection>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '120px 7%', background: 'rgba(17, 76, 90, 0.2)', position: 'relative', zIndex: 10 }}>
        <ScrollRevealSection>
          <h2 className="mono" style={{ textAlign: 'center', fontSize: 48, marginBottom: 60, fontWeight: 800 }}>
            Frequently Asked Questions
          </h2>
        </ScrollRevealSection>

        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gap: 20 }}>
          {faqs.map((item, index) => (
            <ScrollRevealSection key={item.q} delay={index * 80}>
              <div className="faq-card">
                <h3 className="mono" style={{ marginBottom: 16, color: COLORS.yellow, fontWeight: 600 }}>{item.q}</h3>
                <p style={{ color: COLORS.mint, lineHeight: 1.85 }}>{item.a}</p>
              </div>
            </ScrollRevealSection>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '140px 7%', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <ScrollRevealSection>
          <h2 className="mono" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', marginBottom: 32, lineHeight: 1.2, fontWeight: 800 }}>
            Ready to build the future
            <br />
            <span className="gradient-text">of intelligent data systems?</span>
          </h2>
          <p style={{ maxWidth: 650, margin: '0 auto 50px', color: COLORS.mint, lineHeight: 1.9, fontSize: 18 }}>
            Join thousands of developers, analysts, and enterprise teams orchestrating AI-native workflows with NeuralFlow.
          </p>
          <button className="primary-btn" style={{ fontSize: 16, padding: '22px 44px' }}>
            Start Building For Free
          </button>
        </ScrollRevealSection>
      </section>

      {/* Footer */}
      <footer style={{ padding: '70px 7%', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40, position: 'relative', zIndex: 10 }}>
        <ScrollRevealSection>
          <div>
            <div className="mono" style={{ fontSize: 26, color: COLORS.yellow, marginBottom: 16, fontWeight: 800 }}>NEURALFLOW</div>
            <p style={{ color: COLORS.mint, maxWidth: 350, lineHeight: 1.85, fontSize: 14 }}>
              AI-driven enterprise data automation built for modern infrastructure teams.
            </p>
          </div>
        </ScrollRevealSection>

        <ScrollRevealSection delay={100}>
          <div style={{ display: 'flex', gap: 60, flexWrap: 'wrap' }}>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Security'] },
              { title: 'Developers', links: ['API Docs', 'SDKs', 'Status'] },
              { title: 'Company', links: ['About', 'Careers', 'Contact'] },
            ].map((group) => (
              <div key={group.title}>
                <h4 className="mono" style={{ marginBottom: 20, color: COLORS.yellow, fontWeight: 600 }}>{group.title}</h4>
                {group.links.map((link) => (
                  <div key={link} className="footer-link" style={{ marginBottom: 12 }}>{link}</div>
                ))}
              </div>
            ))}
          </div>
        </ScrollRevealSection>
      </footer>
    </div>
  );
}
