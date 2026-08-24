import BackToTopButton from './components/BackToTopButton';

const skillGroups = [
  { label: 'AI / ML', items: ['Machine Learning', 'Computer Vision', 'NLP', 'Speech Recognition', 'RAG', 'LLMs', 'YOLOv8'] },
  { label: 'Engineering', items: ['Python', 'JavaScript', 'SQL', 'Flask REST API', 'ReactJS', 'TailwindCSS', 'Git'] },
  { label: 'Data / Infra', items: ['NumPy', 'Pandas', 'OpenCV', 'MySQL', 'SQLite', 'MongoDB', 'MQTT'] },
];

const education = [
  { year: '2022—2027', title: 'Hanoi University of Mining and Geology', detail: 'Information Technology · Engineer programme' },
  { year: '2023', title: 'School-level English Prize', detail: 'Recognition for English communication and academic performance' },
];

const experience = [
  { year: '2026', title: 'AI Speech Pipeline', detail: 'Built a video-to-SRT product with Faster-Whisper, Flask and FFmpeg.', href: 'https://github.com/Tunglee278/ai-speech-subtitles' },
  { year: '2026', title: 'Food Data Warehouse', detail: 'Connected MongoDB commerce data to a live analytics API and dashboard.', href: 'https://github.com/Tunglee278/food-ordering-system' },
  { year: '2025', title: 'Music Genre Classifier', detail: 'Engineered MFCC features and deployed a Random Forest audio classifier.', href: 'https://github.com/Tunglee278/music-genre-classification' },
];

export default function Home() {
  return (
    <main>
      <nav className="portfolioHeader" aria-label="Primary navigation">
        <div className="shell portfolioNav">
          <a className="portfolioBrand" href="#top" aria-label="Le Thanh Tung, home"><span aria-hidden="true">✦</span> Le Thanh Tung</a>
          <div className="portfolioLinks"><a href="#top">About</a><a href="#resume">Resume</a></div>
        </div>
      </nav>

      <header className="resumeHero shell" id="top">
        <div className="resumeHeroCopy">
          <p className="resumeKicker">AI production portfolio · 2026</p>
          <h1>Hello,<br />I’m <em>Le Thanh Tung!</em></h1>
          <p>I turn machine-learning ideas into useful products — from speech recognition and audio classification to data APIs and live analytics.</p>
          <div className="resumeHeroActions">
            <a href="#resume">View resume <span aria-hidden="true">↘</span></a>
            <a href="/Le-Thanh-Tung-CV.pdf" download>Download CV</a>
          </div>
          <div className="aboutFacts" aria-label="Basic information">
            <span><small>EDUCATION</small>Information Technology · HUMG</span>
            <span><small>LOCATION</small>Hanoi, Vietnam</span>
            <span><small>FOCUS</small>Applied AI systems</span>
            <span><small>LANGUAGE</small>Vietnamese · Technical English</span>
          </div>
        </div>
        <div className="resumeHeroVisual" aria-label="AI engineering profile">
          <div className="profileCanvas"><span>AI</span><strong>MODEL → API → PRODUCT</strong><i>LT</i></div>
          <span className="profileBadge badgeRole">AI Engineer</span>
          <span className="profileBadge badgeLocation">Hanoi, Vietnam</span>
          <aside className="heroContactCard"><h2>Contact</h2><p>● Hanoi, Vietnam</p><a href="mailto:tunglee278@gmail.com">✉ tunglee278@gmail.com</a><a href="tel:+84862747689">☎ +84 862 747 689</a></aside>
        </div>
      </header>

      <section className="resumeBand" id="resume">
        <div className="shell resumeGrid">
          <div>
            <p className="resumeSectionLabel">Education</p>
            <div className="resumeTimeline">
              {education.map((item) => <article key={item.year}><span>✦</span><strong>{item.year}</strong><div><h3>{item.title}</h3><p>{item.detail}</p></div></article>)}
            </div>
            <section className="experiencePanel" id="work-intro">
              <div className="experiencePanelHeader">
                <h2 className="resumeSectionLabel dark">Selected experience</h2>
              </div>
              {experience.map((item) => <article key={item.title}><span>✦</span><strong>{item.year}</strong><div><h3><a className="experienceTitleLink" href={item.href} target="_blank" rel="noreferrer" aria-label={`Open ${item.title} repository on GitHub`}>{item.title}<span aria-hidden="true">↗</span></a></h3><p>{item.detail}</p></div></article>)}
              <div className="experienceGithubRow">
                <a className="githubProfilePill" href="https://github.com/Tunglee278" target="_blank" rel="noreferrer" aria-label="Open Le Thanh Tung's GitHub profile">
                  <span className="githubSearchIcon" aria-hidden="true" />
                  <span>github.com/Tunglee278</span>
                </a>
              </div>
            </section>
          </div>
          <div className="resumeSkillsPanel" id="technical-skills">
            <div className="resumeOutline" aria-hidden="true">AI<br />ENGINEER</div>
            <p className="resumeSectionLabel">Technical skills</p>
            <div className="technicalSkillMatrix">
              {skillGroups.map((group, index) => <article key={group.label}><span>0{index + 1}</span><h3>{group.label}</h3><div>{group.items.map((item) => <p key={item}>{item}</p>)}</div></article>)}
            </div>
            <div className="servicePills"><span>Model deployment</span><span>Data pipelines</span><span>API integration</span><span>AI prototyping</span></div>
          </div>
        </div>
      </section>

      <section className="marquee" aria-label="Areas of expertise"><div><span>SPEECH AI</span><i>✦</i><span>COMPUTER VISION</span><i>✦</i><span>RAG SYSTEMS</span><i>✦</i><span>MODEL DEPLOYMENT</span><i>✦</i><span>DATA ENGINEERING</span><i>✦</i></div></section>

      <footer className="compactFooter"><div className="shell compactFooterInner"><span>Le Thanh Tung © 2026</span><a href="mailto:tunglee278@gmail.com">tunglee278@gmail.com</a><span>Hanoi, Vietnam</span></div></footer>
      <BackToTopButton />
    </main>
  );
}
