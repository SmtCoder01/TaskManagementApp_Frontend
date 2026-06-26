import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate login by setting a token
    localStorage.setItem('token', 'simulated-jwt-token')
    navigate('/')
  }

  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        <h2 style={styles.title}>Welcome back to <span style={styles.brand}>TaskY</span></h2>
        <p style={styles.subtitle}>Enter your details to access your workspace</p>
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
              required
            />
          </div>
          <button type="submit" className="btn-base btn-lavender" style={{ width: '100%', marginTop: '0.5rem' }}>
            Sign In
          </button>
        </form>
        <p style={styles.footerText}>
          Don't have an account? <Link to="/register" style={styles.link}>Sign up</Link>
        </p>
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
    fontFamily: "'Inter', sans-serif",
    padding: '1rem',
  },
  glassCard: {
    background: '#ffffff',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
    textAlign: 'center',
  },
  title: {
    color: '#1e293b',
    fontSize: '1.8rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
  },
  brand: {
    color: '#293180',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '0.9rem',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    textAlign: 'left',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    color: '#475569',
    fontSize: '0.85rem',
    fontWeight: 500,
  },
  input: {
    background: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#1e293b',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },

  footerText: {
    color: '#64748b',
    fontSize: '0.85rem',
    marginTop: '1.5rem',
  },
  link: {
    color: '#293180',
    textDecoration: 'none',
    fontWeight: 600,
  },
}
