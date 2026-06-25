import { useNavigate, Link } from 'react-router-dom'

export function Home() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  // Dummy list of workspaces to test navigation
  const workspaces = [
    { id: '1', name: 'Engineering Workspace' },
    { id: '2', name: 'Marketing Workspace' },
    { id: '3', name: 'Product Workspace' },
  ]

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>TaskY <span style={styles.badge}>Dashboard</span></h1>
        <button onClick={handleLogout} className="btn-base btn-danger" style={{ padding: '0.5rem 1rem', borderRadius: '6px' }}>
          Logout
        </button>
      </header>

      <main style={styles.main}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Your Workspaces</h2>
          <div style={styles.grid}>
            {workspaces.map((ws) => (
              <div key={ws.id} style={styles.card}>
                <h3 style={styles.cardTitle}>{ws.name}</h3>
                <div style={styles.cardActions}>
                  <Link to={`/workspaces/${ws.id}`} className="btn-base btn-indigo" style={{ padding: '0.6rem', display: 'block' }}>
                    Enter Workspace
                  </Link>
                  <Link to={`/workspaces/${ws.id}/members`} className="btn-base btn-secondary-indigo" style={{ padding: '0.6rem', display: 'block' }}>
                    Manage Members
                  </Link>
                </div>
              </div>
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
  logo: {
    fontSize: '1.5rem',
    fontWeight: 800,
    margin: 0,
    color: '#293180',
  },
  badge: {
    fontSize: '0.8rem',
    verticalAlign: 'middle',
    background: 'rgba(41, 49, 128, 0.08)',
    color: '#293180',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    marginLeft: '0.5rem',
  },

  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 2rem',
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  cardTitle: {
    margin: '0 0 1.5rem 0',
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#1e293b',
  },
  cardActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },

}
