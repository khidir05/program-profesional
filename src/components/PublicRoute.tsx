import { Navigate, Outlet } from 'react-router-dom';

export const PublicRoute = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Jika user SUDAH login, lempar mereka kembali ke dashboard masing-masing
  if (token && role) {
    switch (role) {
      case 'admin': return <Navigate to="/admin/dashboard" replace />;
      case 'petugas': return <Navigate to="/petugas/dashboard" replace />;
      default: return <Navigate to="/" replace />;
    }
  }

  // Jika BELUM login, izinkan mereka melihat halaman Login / Register (<Outlet />)
  return <Outlet />;
};