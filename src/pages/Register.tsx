import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate successful registration and auto-login
    localStorage.setItem('token', 'simulated-jwt-token')
    navigate('/')
  }

  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        <h2 style={styles.title}>Create your Account</h2>
        <p style={styles.subtitle}>Get started with <span style={styles.brand}>TaskY</span> today</p>
        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              style={styles.input}
              required
            />
          </div>
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
            Create Account
          </button>
        </form>
        <p style={styles.footerText}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
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
