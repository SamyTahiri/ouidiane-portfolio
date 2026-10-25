import { profile, skills, projects } from './data'

export default function App() {
  return (
    <>
      <header className="nav">
        <a className="logo" href="#top">{profile.name}</a>
        <nav>
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <p className="eyebrow">{profile.role}</p>
          <h1>{profile.name}</h1>
          <p className="lead">{profile.tagline}</p>
          <a className="btn" href="#work">View my work</a>
        </section>

        <section id="about" className="section">
          <h2>About</h2>
          <p>{profile.about}</p>
          <ul className="chips">
            {skills.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </section>

        <section id="work" className="section">
          <h2>Selected work</h2>
          <div className="grid">
            {projects.map((p) => (
              <a className="card" href={p.href} key={p.title}>
                <span className="year">{p.year}</span>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="tags">{p.tags.map((t, i) => <span key={i}>{t}</span>)}</div>
              </a>
            ))}
          </div>
        </section>

        <section id="contact" className="section contact">
          <h2>Let’s talk</h2>
          <a className="mail" href={`mailto:${profile.email}`}>{profile.email}</a>
          <div className="links">
            {profile.links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
            ))}
          </div>
        </section>
      </main>

      <footer>© {profile.name}</footer>
    </>
  )
}
