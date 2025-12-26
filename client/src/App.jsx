import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OutletProvider } from './context/OutletContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/admin/Login';
import Home from './pages/Home/Home';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import ManagerLayout from './layouts/ManagerLayout';

// Admin Pages
import OutletManagement from './pages/admin/OutletManagement';
import Dashboard from './pages/admin/Dashboard';
import GlobalMenu from './pages/admin/GlobalMenu';

// Manager Pages
import MenuControl from './pages/manager/MenuControl';
import StaffManagement from './pages/manager/StaffManagement';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <OutletProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/home" element={<Home />} />
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<div className="p-10 text-center text-2xl text-red-600">Unauthorized Access</div>} />

              {/* Super Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route path="overview" element={<Dashboard />} />
                <Route path="outlets" element={<OutletManagement />} />
                <Route path="menu" element={<GlobalMenu />} />
                <Route path="users" element={<div className="p-4">User Management (Coming Soon)</div>} />
                <Route path="analytics" element={<div className="p-4">Analytics (Coming Soon)</div>} />
                <Route index element={<Navigate to="/admin/overview" replace />} />
              </Route>

              {/* Manager Routes */}
              <Route path="/manager" element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OUTLET_MANAGER']}>
                  <ManagerLayout />
                </ProtectedRoute>
              }>
                <Route path="live-orders" element={<div className="p-4">Live Orders (Coming Soon)</div>} />
                <Route path="menu" element={<MenuControl />} />
                <Route path="staff" element={<StaffManagement />} />
                <Route path="tables" element={<div className="p-4">Table Management (Coming Soon)</div>} />
                <Route index element={<Navigate to="/manager/live-orders" replace />} />
              </Route>

              {/* Kitchen Routes */}
              <Route path="/kitchen" element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OUTLET_MANAGER', 'KITCHEN']}>
                  <div className="p-4">Kitchen Interface (Coming Soon)</div>
                </ProtectedRoute>
              } />

              {/* Waiter Routes */}
              <Route path="/waiter" element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OUTLET_MANAGER', 'WAITER']}>
                  <div className="p-4">Waiter Interface (Coming Soon)</div>
                </ProtectedRoute>
              } />

              {/* Dispatcher Routes */}
              <Route path="/dispatcher" element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OUTLET_MANAGER', 'DISPATCHER']}>
                  <div className="p-4">Dispatcher Interface (Coming Soon)</div>
                </ProtectedRoute>
              } />

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </Router>
        </OutletProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
