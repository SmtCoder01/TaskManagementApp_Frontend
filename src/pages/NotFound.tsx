import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.errorCode}>404</h1>
        <h2 style={styles.title}>Page Not Found</h2>
        <p style={styles.description}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-base btn-lavender" style={{ padding: '0.75rem 1.5rem', display: 'inline-block' }}>
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#FAFAFB',
    color: '#1e293b',
    fontFamily: "'Inter', sans-serif",
    padding: '1rem',
  },
  content: {
    textAlign: 'center',
    maxWidth: '400px',
  },
  errorCode: {
    fontSize: '6rem',
    fontWeight: 900,
    margin: 0,
    color: '#293180',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 700,
    margin: '0.5rem 0 1rem 0',
    color: '#1e293b',
  },
  description: {
    color: '#64748b',
    lineHeight: '1.5',
    marginBottom: '2rem',
  },

}
