import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PublicRoute } from './components/PublicRoute'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Home } from './pages/Home'
import { Workspace } from './pages/Workspace'
import { WorkspaceMembers } from './pages/WorkspaceMembers'
import { Project } from './pages/Project'
import { NotFound } from './pages/NotFound'
import { AuthProvider } from './features/auth'
import { AppShell } from './components/layout/AppShell'
import { WorkspaceSettingsPage } from './features/workspaces'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes - Accessible only when NOT authenticated */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Routes - Accessible only when authenticated */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<Home />} />
              <Route path="/workspaces/:id" element={<Workspace />} />
              <Route path="/workspaces/:id/members" element={<WorkspaceMembers />} />
              <Route path="/workspaces/:id/settings" element={<WorkspaceSettingsPage />} />
              <Route path="/workspaces/:id/projects/:projectId" element={<Project />} />
            </Route>
          </Route>

          {/* Catch-all Route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

