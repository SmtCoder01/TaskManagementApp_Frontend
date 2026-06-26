import { useParams, Link } from 'react-router-dom'

export function WorkspaceMembers() {
  const { id } = useParams<{ id: string }>()

  // Simulated members list
  const members = [
    { name: 'Alice Smith', email: 'alice@example.com', role: 'Owner' },
    { name: 'Bob Johnson', email: 'bob@example.com', role: 'Member' },
    { name: 'Charlie Brown', email: 'charlie@example.com', role: 'Member' },
  ]

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.navRow}>
          <Link to={`/workspaces/${id}`} style={styles.backLink}>← Back to Workspace {id}</Link>
          <span style={styles.separator}>/</span>
          <span style={styles.current}>Members</span>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.hero}>
          <h1 style={styles.title}>Workspace Members</h1>
          <p style={styles.subtitle}>Manage team access for workspace <strong>{id}</strong></p>
        </div>

        <section style={styles.section}>
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => (
                  <tr key={index} style={styles.tableRow}>
                    <td style={styles.td}>{member.name}</td>
                    <td style={styles.td}>{member.email}</td>
                    <td style={styles.td}>
                      <span style={member.role === 'Owner' ? styles.roleBadgeOwner : styles.roleBadgeMember}>
                        {member.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '3rem 2rem',
  },
  hero: {
    marginBottom: '2.5rem',
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
    width: '100%',
  },
  tableCard: {
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  tableHeaderRow: {
    background: 'rgba(41, 49, 128, 0.04)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  },
  th: {
    padding: '1rem 1.5rem',
    color: '#475569',
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  tableRow: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
  },
  td: {
    padding: '1rem 1.5rem',
    color: '#1e293b',
    fontSize: '0.95rem',
  },
  roleBadgeOwner: {
    background: 'rgba(41, 49, 128, 0.1)',
    color: '#293180',
    padding: '0.25rem 0.6rem',
    borderRadius: '9999px',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  roleBadgeMember: {
    background: 'rgba(164, 166, 220, 0.15)',
    color: '#293180',
    padding: '0.25rem 0.6rem',
    borderRadius: '9999px',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
}
