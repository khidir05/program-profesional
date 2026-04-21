import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  
  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded: any = jwtDecode(token);
    
    // Jika role user tidak ada dalam daftar yang diizinkan
    if (!allowedRoles.includes(decoded.role)) {
      return <Navigate to="/login" replace />;
    }
    
    return <Outlet />;
  } catch (error) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};