import { useParams, Link } from 'react-router-dom'

export function Workspace() {
  const { id } = useParams<{ id: string }>()

  // Simulated projects under this workspace
  const projects = [
    { id: 'p1', name: 'Sprint Board' },
    { id: 'p2', name: 'Product Roadmap' },
    { id: 'p3', name: 'Bug Tracker' },
  ]

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.navRow}>
          <Link to="/" style={styles.backLink}>← Back to Workspaces</Link>
          <span style={styles.separator}>/</span>
          <span style={styles.current}>Workspace {id}</span>
        </div>
        <Link to={`/workspaces/${id}/members`} className="btn-base btn-secondary-indigo" style={{ padding: '0.5rem 1rem' }}>
          Manage Members
        </Link>
      </header>

      <main style={styles.main}>
        <div style={styles.hero}>
          <h1 style={styles.title}>Workspace Details</h1>
          <p style={styles.subtitle}>Workspace Identifier: <strong>{id}</strong></p>
        </div>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Projects</h2>
          <div style={styles.grid}>
            {projects.map((proj) => (
              <Link
                key={proj.id}
                to={`/workspaces/${id}/projects/${proj.id}`}
                style={styles.card}
              >
                <div style={styles.cardIcon}>📁</div>
                <h3 style={styles.cardTitle}>{proj.name}</h3>
                <span style={styles.cardArrow}>View Project →</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: '#FAFAFB',
    color: '#1e293b',
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    background: '#ffffff',
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  },
  navRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  backLink: {
    color: '#293180',
    textDecoration: 'none',
    fontWeight: 500,
  },
  separator: {
    color: '#cbd5e1',
  },
  current: {
    color: '#64748b',
  },

  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 2rem',
  },
  hero: {
    marginBottom: '3rem',
    background: 'linear-gradient(135deg, rgba(164, 166, 220, 0.08) 0%, rgba(41, 49, 128, 0.05) 100%)',
    padding: '2rem',
    borderRadius: '16px',
    border: '1px solid rgba(0, 0, 0, 0.06)',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    margin: '0 0 0.5rem 0',
    color: '#1e293b',
  },
  subtitle: {
    color: '#64748b',
    margin: 0,
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '1.5rem',
    color: '#1e293b',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    textDecoration: 'none',
    color: '#1e293b',
    display: 'block',
    transition: 'transform 0.2s, background-color 0.2s',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  cardIcon: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  cardTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#1e293b',
  },
  cardArrow: {
    fontSize: '0.85rem',
    color: '#293180',
    fontWeight: 500,
  },
}
