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

export default function Home() {
  return (
    <main>
      <nav className="navWrap" aria-label="Primary navigation">
        <div className="nav shell">
          <a className="brand" href="#top" aria-label="Le Thanh Tung, home">LT<span>²</span></a>
          <div className="navLinks"><a href="#work">Work</a><a href="#subtitle-demo">Speech demo</a><a href="#live-demos">More demos</a><a href="#skills">Skills</a><a href="#about">About</a></div>
        </div>
      </nav>

      <header className="hero shell" id="top">
        <div className="heroSignal" aria-hidden="true"><span className="signalDot" /> Available for AI opportunities</div>
        <p className="eyebrow">AI ENGINEER · HANOI, VIETNAM</p>
        <h1>I build AI that<br /><span>moves into production.</span></h1>
        <div className="heroBottom">
          <p className="intro">I’m <strong>Le Thanh Tung</strong> — an AI engineer turning machine learning ideas into practical, end-to-end products across speech, vision, data and language.</p>
          <div className="heroActions">
            <a className="button buttonPrimary" href="#work">Explore my work <span aria-hidden="true">↓</span></a>
            <a className="button buttonGhost" href="/Le-Thanh-Tung-CV.pdf" download>Download CV</a>
          </div>
        </div>
        <div className="heroOrb" aria-hidden="true"><div className="orbCore" /><div className="orbit orbitOne" /><div className="orbit orbitTwo" /><span className="node nodeOne" /><span className="node nodeTwo" /><span className="node nodeThree" /></div>
      </header>

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

      <section className="section skillSection" id="skills"><div className="shell">
        <div className="sectionHeading compact"><div><p className="eyebrow">TECHNICAL TOOLKIT</p><h2>Ideas are only useful<br />when they ship.</h2></div><p>From experimentation and data pipelines to APIs and user-facing experiences.</p></div>
        <div className="skillGrid">{skillGroups.map((group, index) => <article className="skillGroup" key={group.label}><span className="skillIndex">0{index + 1}</span><h3>{group.label}</h3><div className="skillList">{group.items.map((item) => <span key={item}>{item}</span>)}</div></article>)}</div>
      </div></section>

      <section className="section shell about" id="about">
        <div className="aboutLead"><p className="eyebrow">ABOUT / EDUCATION</p><h2>Curious by nature.<br /><span>Practical by design.</span></h2></div>
        <div className="aboutCopy"><p>I enjoy the full journey of an AI product: understanding the problem, preparing data, evaluating a model, designing an API and making the result useful to real people.</p><p>Currently studying <strong>Information Technology</strong> at Hanoi University of Mining and Geology (2022—2027), while continuously building personal AI projects.</p><div className="factRow"><span><small>FOCUS</small>Applied AI systems</span><span><small>LANGUAGE</small>Vietnamese · Technical English</span><span><small>AWARD</small>School-level English prize, 2023</span></div></div>
      </section>

      <footer><div className="shell footerInner"><div><p className="eyebrow">START A CONVERSATION</p><h2>Have an AI problem<br />worth solving?</h2></div><a className="email" href="mailto:tunglee278@gmail.com">tunglee278@gmail.com <span aria-hidden="true">↗</span></a><div className="footerMeta"><span>Le Thanh Tung © 2026</span><a href="tel:+84862747689">+84 862 747 689</a><span>Hanoi, Vietnam</span></div></div></footer>
      <BackToTopButton />
    </main>
  );
}
