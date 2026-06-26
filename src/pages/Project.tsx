import { useParams, Link } from 'react-router-dom'

export function Project() {
  const { id, projectId } = useParams<{ id: string; projectId: string }>()

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.navRow}>
          <Link to="/" style={styles.backLink}>Home</Link>
          <span style={styles.separator}>/</span>
          <Link to={`/workspaces/${id}`} style={styles.backLink}>Workspace {id}</Link>
          <span style={styles.separator}>/</span>
          <span style={styles.current}>Project {projectId}</span>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.hero}>
          <div style={styles.projectIcon}>📊</div>
          <h1 style={styles.title}>Project Board</h1>
          <p style={styles.subtitle}>
            Workspace ID: <strong>{id}</strong> | Project ID: <strong>{projectId}</strong>
          </p>
        </div>

        <div style={styles.boardGrid}>
          <div style={styles.column}>
            <h3 style={styles.columnHeader}>To Do</h3>
            <div style={styles.card}>💡 Draft architecture plan</div>
            <div style={styles.card}>🎨 Design user interface</div>
          </div>
          <div style={styles.column}>
            <h3 style={styles.columnHeader}>In Progress</h3>
            <div style={styles.card}>⚡ Implement Router configuration</div>
          </div>
          <div style={styles.column}>
            <h3 style={styles.columnHeader}>Done</h3>
            <div style={styles.card}>🚀 Configure React Query provider</div>
          </div>
        </div>
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
    marginBottom: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.5rem',
  },
  projectIcon: {
    fontSize: '2.5rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    margin: 0,
    color: '#1e293b',
  },
  subtitle: {
    color: '#64748b',
    margin: 0,
  },
  boardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem',
  },
  column: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '1.25rem',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    minHeight: '400px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  columnHeader: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#1e293b',
    borderBottom: '2px solid rgba(0, 0, 0, 0.05)',
    paddingBottom: '0.5rem',
  },
  card: {
    background: '#FAFAFB',
    borderRadius: '8px',
    padding: '1rem',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    color: '#1e293b',
    fontSize: '0.95rem',
    cursor: 'grab',
  },
}
