import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    { 
      icon: '📝', 
      step: '01', 
      title: 'Create Your Profile', 
      desc: 'Join the community by signing up in seconds. All you need is an email and a mobile number to get started.' 
    },
    { 
      icon: '📸', 
      step: '02', 
      title: 'List Your Items', 
      desc: 'Got books or games collecting dust? Take a photo, add a title, and list them for the community to see.' 
    },
    { 
      icon: '🔍', 
      step: '03', 
      title: 'Discover & Request', 
      desc: 'Browse through hundreds of items. Found something you like? Request a swap with the owner instantly.' 
    },
    { 
      icon: '🤝', 
      step: '04', 
      title: 'Meet & Swap', 
      desc: 'Coordinate a safe meeting place and exchange your items. Build your collection without spending a penny!' 
    },
  ];

  return (
    <div className="how-it-works-page">
      {/* Hero Section */}
      <section className="how-hero">
        <div className="how-orb how-orb-1" />
        <div className="how-orb how-orb-2" />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <p className="section-subtitle">The Guide</p>
          <h1 className="how-title">
            Master the Art of <br />
            <span className="how-gradient">Swapping & Sharing</span>
          </h1>
          <p className="how-desc">
            Trading items with your community is easier than you think. 
            Follow this simple guide to start your swapping journey today.
          </p>
        </div>
      </section>

      {/* Main Steps Section */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="how-steps-grid">
            {steps.map((s, i) => (
              <div key={i} className="how-step-card glass-card">
                <div className="how-step-number">{s.step}</div>
                <div className="how-step-icon">{s.icon}</div>
                <h3 className="how-step-title">{s.title}</h3>
                <p className="how-step-desc">{s.desc}</p>
                {i < steps.length - 1 && <div className="how-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits / FAQ style section */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="container">
          <div className="section-header">
            <p className="section-subtitle">Why Swap?</p>
            <h2 className="section-title">The <span>Community</span> Advantage</h2>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card glass-card">
              <span className="benefit-emoji">💰</span>
              <h4>Zero Cost</h4>
              <p>Everything on our platform is free. No hidden fees, no subscriptions, just pure sharing.</p>
            </div>
            <div className="benefit-card glass-card">
              <span className="benefit-emoji">🌍</span>
              <h4>Eco-Friendly</h4>
              <p>Reduce waste by giving pre-loved books and games a new home. Help the planet one swap at a time.</p>
            </div>
            <div className="benefit-card glass-card">
              <span className="benefit-emoji">🔒</span>
              <h4>Safe & Secure</h4>
              <p>Verified mobile numbers ensure you're connecting with real members of your community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="section how-cta">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Ready to <span>Join Us</span>?</h2>
          <p className="section-desc">Create your free account today and see what's waiting for you.</p>
          <div className="hero-ctas" style={{ marginTop: '2rem' }}>
            <Link to="/signup" className="btn btn-primary">Create Free Account</Link>
            <Link to="/products" className="btn btn-secondary">Explore Items</Link>
          </div>
        </div>
      </section>

      <style>{`
        .how-it-works-page { background: var(--bg-primary); }
        
        .how-hero {
          padding: 8rem 0 5rem;
          position: relative; overflow: hidden;
          background: linear-gradient(180deg, rgba(124,58,237,0.1) 0%, transparent 100%);
        }
        .how-orb { position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none; }
        .how-orb-1 { width: 500px; height: 500px; background: rgba(124,58,237,0.15); top: -200px; left: -200px; }
        .how-orb-2 { width: 400px; height: 400px; background: rgba(6,182,212,0.1); bottom: -100px; right: -100px; }
        
        .how-title {
          font-size: clamp(2.2rem, 5vw, 4rem); font-weight: 900; margin: 1rem 0; line-height: 1.1;
        }
        .how-gradient {
          background: linear-gradient(135deg, #7c3aed, #06b6d4, #ec4899);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .how-desc {
          max-width: 600px; margin: 0 auto;
          color: var(--text-secondary); font-size: 1.1rem; line-height: 1.8;
        }

        .how-steps-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem;
        }
        .how-step-card {
          padding: 3rem 2rem; position: relative;
        }
        .how-step-number {
          font-size: 4.5rem; font-weight: 900; line-height: 1;
          color: var(--purple-light); opacity: 0.1;
          position: absolute; top: 1.5rem; right: 2rem;
        }
        .how-step-icon { font-size: 3rem; margin-bottom: 1.5rem; display: block; }
        .how-step-title { font-size: 1.4rem; font-weight: 800; margin-bottom: 1rem; }
        .how-step-desc { color: var(--text-secondary); line-height: 1.7; font-size: 1rem; }

        .benefits-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;
        }
        .benefit-card {
          padding: 2.5rem 1.5rem; text-align: center;
        }
        .benefit-emoji { font-size: 2.5rem; margin-bottom: 1.25rem; display: block; }
        .benefit-card h4 { margin-bottom: 0.75rem; font-size: 1.1rem; }
        .benefit-card p { font-size: 0.9rem; color: var(--text-secondary); }

        @media (max-width: 900px) {
          .how-steps-grid { grid-template-columns: 1fr; }
          .benefits-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default HowItWorks;
