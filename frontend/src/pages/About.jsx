const About = () => {
  const team = [
    { name: 'Yash Dodiya', role: 'Full Stack Developer', emoji: '👨‍💻', color: '#7c3aed' },
    { name: 'Team Member', role: 'UI/UX Designer', emoji: '🎨', color: '#06b6d4' },
    { name: 'Team Member', role: 'Backend Developer', emoji: '⚙️', color: '#ec4899' },
  ];

  const values = [
    { icon: '♻️', title: 'Sustainability', desc: 'Giving books and games a second life reduces waste and promotes a circular economy.' },
    { icon: '🤝', title: 'Community', desc: 'Connecting people locally to foster friendships and shared interests.' },
    { icon: '💡', title: 'Education', desc: 'Making knowledge accessible to everyone — because books should be shared.' },
    { icon: '🆓', title: 'Free Forever', desc: 'No hidden charges. Our platform is completely free to use for everyone.' },
  ];

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-orb" />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <p className="section-subtitle">About Us</p>
          <h1 className="about-title">
            We Believe in <br />
            <span className="about-gradient">Sharing &amp; Swapping</span>
          </h1>
          <p className="about-desc">
            Swap &amp; Share is a final year MERN stack project built to solve a real problem —
            books and games sitting on shelves collecting dust when someone nearby needs them.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-text">
              <p className="section-subtitle">Our Mission</p>
              <h2>What is <span style={{ color: 'var(--purple-light)' }}>Swap &amp; Share?</span></h2>
              <p style={{ marginTop: '1rem', lineHeight: 1.8 }}>
                Swap &amp; Share is a community-driven platform that lets you list your Books and
                Games, browse what others have listed, and arrange a local swap — completely free.
              </p>
              <p style={{ marginTop: '1rem', lineHeight: 1.8 }}>
                Built with the MERN stack (MongoDB, Express, React, Node.js), this platform
                demonstrates a full-featured web application with user authentication, image
                uploads, and complete CRUD operations.
              </p>
              <div className="mission-chips">
                <span className="chip">MongoDB</span>
                <span className="chip">Express.js</span>
                <span className="chip">React</span>
                <span className="chip">Node.js</span>
                <span className="chip">JWT Auth</span>
                <span className="chip">Multer Uploads</span>
              </div>
            </div>
            <div className="mission-visual glass-card">
              <div className="visual-grid">
                <div className="visual-item" style={{ background: 'rgba(124,58,237,0.15)' }}>
                  <span>📚</span><strong>Books</strong>
                </div>
                <div className="visual-item" style={{ background: 'rgba(6,182,212,0.15)' }}>
                  <span>🎮</span><strong>Games</strong>
                </div>
                <div className="visual-item" style={{ background: 'rgba(236,72,153,0.15)' }}>
                  <span>🔄</span><strong>Swap</strong>
                </div>
                <div className="visual-item" style={{ background: 'rgba(34,197,94,0.15)' }}>
                  <span>🤝</span><strong>Share</strong>
                </div>
              </div>
              <div className="visual-tagline">
                "One person's shelf is another's treasure"
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <p className="section-subtitle">Simple Process</p>
            <h2 className="section-title">How <span>Swap &amp; Share</span> Works</h2>
            <p className="section-desc">Get started in 4 easy steps and join our growing community of swappers.</p>
          </div>
          <div className="steps-grid">
            {[
              { icon: '📝', step: '01', title: 'Sign Up', desc: 'Create your free account in seconds. No hidden fees.' },
              { icon: '📸', step: '02', title: 'List Your Item', desc: 'Upload a photo, add title and description.' },
              { icon: '🔍', step: '03', title: 'Discover', desc: 'Browse hundreds of unique books and games nearby.' },
              { icon: '🤝', step: '04', title: 'Connect & Swap', desc: 'Meet other swappers safely and exchange your items in person.' },
            ].map((s, i) => (
              <div key={i} className="step-card glass-card">
                <div className="step-number">{s.step}</div>
                <div className="step-icon">{s.icon}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <p className="section-subtitle">Our Values</p>
            <h2 className="section-title">Why We Built <span>This</span></h2>
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="value-card glass-card">
                <div className="value-icon">{v.icon}</div>
                <h3 className="value-title">{v.title}</h3>
                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <p className="section-subtitle">The Developers</p>
            <h2 className="section-title">Meet the <span>Team</span></h2>
          </div>
          <div className="team-grid">
            {team.map((member, i) => (
              <div key={i} className="team-card glass-card">
                <div className="team-avatar" style={{ background: `${member.color}22`, border: `2px solid ${member.color}44` }}>
                  <span>{member.emoji}</span>
                </div>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .about-page { background: var(--bg-primary); }
        .about-hero {
          padding: 8rem 0 5rem;
          position: relative; overflow: hidden;
          background: linear-gradient(180deg, rgba(124,58,237,0.08) 0%, transparent 100%);
        }
        .about-orb {
          position: absolute; top: -100px; right: -100px;
          width: 500px; height: 500px; border-radius: 50%;
          background: rgba(124,58,237,0.15); filter: blur(100px);
          pointer-events: none;
        }
        .about-title {
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 900; margin: 1rem 0;
        }
        .about-gradient {
          background: linear-gradient(135deg, #7c3aed, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .about-desc {
          max-width: 600px; margin: 0 auto;
          color: var(--text-secondary); font-size: 1.05rem; line-height: 1.8;
        }

        .mission-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;
        }
        .mission-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.5rem; }
        .chip {
          padding: 0.3rem 0.85rem;
          background: var(--purple-dim);
          border: 1px solid rgba(124,58,237,0.3);
          border-radius: 999px;
          font-size: 0.82rem; color: var(--purple-light); font-weight: 600;
        }
        .mission-visual {
          padding: 2rem;
        }
        .visual-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;
        }
        .visual-item {
          padding: 1.5rem; border-radius: var(--radius-md);
          display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          font-size: 2rem; text-align: center;
        }
        .visual-item strong { font-size: 0.95rem; color: var(--text-secondary); }
        .visual-tagline {
          text-align: center; font-style: italic;
          color: var(--text-muted); font-size: 0.9rem;
          border-top: 1px solid var(--border-glass); padding-top: 1rem;
        }

        .values-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem;
        }
        .value-card { padding: 2rem 1.5rem; text-align: center; }
        .value-icon { font-size: 2.5rem; margin-bottom: 1rem; display: block; }
        .value-title { font-size: 1rem; margin-bottom: 0.5rem; }
        .value-desc { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; }

        .team-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;
        }
        .team-card { padding: 2.5rem 1.5rem; text-align: center; }
        .team-avatar {
          width: 80px; height: 80px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 2.5rem; margin: 0 auto 1.25rem;
        }
        .team-name { font-size: 1.05rem; margin-bottom: 0.25rem; }
        .team-role { font-size: 0.85rem; color: var(--text-muted); }

        @media (max-width: 900px) {
          .mission-grid { grid-template-columns: 1fr; }
          .values-grid { grid-template-columns: repeat(2, 1fr); }
          .team-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .values-grid { grid-template-columns: 1fr; }
          .team-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default About;
