import { Outlet, useNavigate } from 'react-router-dom';
import { Bell, UserCircle, LogOut, Droplet } from 'lucide-react';

export default function TopNavLayout() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('name') || 'Pengguna';
  const userRole = localStorage.getItem('role') || 'Role';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
             <Droplet className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">SISTEM PENGADUAN SOSIAL</h1>
            <p className="text-xs text-gray-500">Pengaduan ODGJ & Orang Terlantar . Kabupaten/Kota</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="text-gray-500 hover:text-blue-600 relative transition">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
            <UserCircle className="w-9 h-9 text-blue-600" />
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 ml-2 bg-red-50 p-2 rounded-xl transition" title="Keluar">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-6 md:p-8 max-w-7xl mx-auto w-full">
        <Outlet /> 
      </main>
    </div>
  );
}
