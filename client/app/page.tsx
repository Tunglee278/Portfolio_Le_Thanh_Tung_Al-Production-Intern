import Image from 'next/image';
import SubtitleDemo from './components/SubtitleDemo';
import FoodAnalyticsDemo from './components/FoodAnalyticsDemo';
import MusicDemo from './components/MusicDemo';
import BackToTopButton from './components/BackToTopButton';

const projects = [
  { number: '01', period: 'Mar — May 2026', title: 'AI Speech Recognition & Automatic Subtitles', summary: 'An end-to-end video-to-SRT pipeline built for accurate, synchronized transcription with efficient media preprocessing.', stack: ['Faster-Whisper', 'Flask', 'FFmpeg', 'MongoDB'], impact: 'GPU-accelerated inference · Vietnamese LLM post-processing', tone: 'lime', image: '/projects/speech-subtitles.png', imageAlt: 'Speech waveform being transformed into subtitle text files' },
  { number: '02', period: 'Jan — Feb 2026', title: 'Food Ordering Data Warehouse', summary: 'A unified analytics system that turns transactional order data into structured datasets for sales and customer analysis.', stack: ['Python', 'Flask', 'MongoDB', 'Pandas', 'ETL'], impact: 'Backend, database & analytics integration', tone: 'blue', image: '/projects/food-ordering.jpg', imageAlt: 'Customers ordering food using mobile applications at a restaurant table' },
  { number: '03', period: 'Jul — Sep 2025', title: 'Music Genre Classification', summary: 'An end-to-end supervised learning workflow using MFCC and acoustic features to classify tracks by genre.', stack: ['Python', 'Librosa', 'Scikit-learn'], impact: 'Feature engineering · Model evaluation', tone: 'purple', image: '/projects/music-genres.jpg', imageAlt: 'Digital music genre classification interface showing pop, rock, jazz and EDM' },
];

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
  { year: '2026', title: 'AI Speech Pipeline', detail: 'Built a video-to-SRT product with Faster-Whisper, Flask and FFmpeg.' },
  { year: '2026', title: 'Food Data Warehouse', detail: 'Connected MongoDB commerce data to a live analytics API and dashboard.' },
  { year: '2025', title: 'Music Genre Classifier', detail: 'Engineered MFCC features and deployed a Random Forest audio classifier.' },
];

export default function Home() {
  return (
    <main>
      <nav className="portfolioHeader" aria-label="Primary navigation">
        <div className="shell portfolioNav">
          <a className="portfolioBrand" href="#top" aria-label="Le Thanh Tung, home"><span aria-hidden="true">✦</span> Le Thanh Tung</a>
          <div className="portfolioLinks"><a href="#top">About</a><a href="#resume">Resume</a><a href="#work">Work</a><a href="#live-demos">Live demos</a></div>
        </div>
      </nav>

      <header className="resumeHero shell" id="top">
        <div className="resumeHeroCopy">
          <p className="resumeKicker">AI production portfolio · 2026</p>
          <h1>Hello,<br />I’m <em>Le Thanh Tung!</em></h1>
          <p>I turn machine-learning ideas into useful products — from speech recognition and audio classification to data APIs and live analytics.</p>
          <div className="resumeHeroActions">
            <a href="#work">Explore selected work <span aria-hidden="true">↘</span></a>
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
              <p className="resumeSectionLabel dark">Selected experience</p>
              {experience.map((item) => <article key={item.title}><span>✦</span><strong>{item.year}</strong><div><h3>{item.title}</h3><p>{item.detail}</p></div></article>)}
              <div className="strengthTags"><span>#Curious</span><span>#Practical</span><span>#Detail-oriented</span><span>#Adaptable</span></div>
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

      <section className="section shell" id="work">
        <div className="sectionHeading"><div><p className="eyebrow">SELECTED WORK / 2025—2026</p><h2>Built from model<br />to meaningful outcome.</h2></div><p>Three projects spanning speech AI, analytics and audio classification.</p></div>
        <div className="projectGrid">
          {projects.map((project) => (
            <article className={`projectCard ${project.tone}`} key={project.number}>
              <div className="cardTop"><span className="projectNumber">/{project.number}</span><span className="period">{project.period}</span></div>
              <div className="projectVisual"><Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
              <h3>{project.title}</h3><p>{project.summary}</p>
              <div className="tags" aria-label="Technologies used">{project.stack.map((tech) => <span key={tech}>{tech}</span>)}</div>
              <div className="impact"><span aria-hidden="true">↳</span> {project.impact}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="section demoSection" id="subtitle-demo">
        <div className="shell">
          <div className="sectionHeading demoHeading">
            <div><p className="eyebrow">LIVE PROJECT / SPEECH AI</p><h2>Turn video into<br />timed subtitles.</h2></div>
            <p>Upload a Vietnamese video, run it through Faster-Whisper and download an editable SRT file or a subtitled MP4.</p>
          </div>
          <SubtitleDemo />
          <div className="pipelineSteps" aria-label="Processing pipeline">
            <span><i>01</i>Upload</span><b aria-hidden="true">→</b><span><i>02</i>Extract audio</span><b aria-hidden="true">→</b><span><i>03</i>Transcribe</span><b aria-hidden="true">→</b><span><i>04</i>Download</span>
          </div>
        </div>
      </section>

      <section className="section projectLabSection" id="live-demos">
        <div className="shell">
          <div className="sectionHeading demoHeading">
            <div><p className="eyebrow">LIVE PROJECTS / DATA + AUDIO</p><h2>Explore two more<br />working systems.</h2></div>
            <p>Classify an audio track with the trained model or inspect live commerce metrics from the Food Ordering backend.</p>
          </div>
          <div className="projectLabGrid">
            <MusicDemo />
            <FoodAnalyticsDemo />
          </div>
        </div>
      </section>

      <footer className="compactFooter"><div className="shell compactFooterInner"><span>Le Thanh Tung © 2026</span><a href="mailto:tunglee278@gmail.com">tunglee278@gmail.com</a><span>Hanoi, Vietnam</span></div></footer>
      <BackToTopButton />
    </main>
  );
}
