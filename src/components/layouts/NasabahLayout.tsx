import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate,  } from 'react-router-dom';
import { 
  LogOut, Droplet, LayoutDashboard, History, 
  User, Menu, X, Wallet, MapPin, ScanLine
} from 'lucide-react';

export default function NasabahLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const menuItems = [
    { path: '/nasabah/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/nasabah/riwayat', label: 'Riwayat Setoran', icon: History },
    { path: '/nasabah/profil', label: 'Profil Saya', icon: User },
    { path: '/nasabah/scan', label: 'Setor Minyak (Scan)', icon: ScanLine }, // <--- TAMBAH INI
  ];

  const SidebarContent = () => (
    <>
      <div className="p-8 flex items-center gap-3">
        <div className="bg-orange-500 p-2.5 rounded-xl shadow-lg shadow-orange-500/20">
          <Droplet className="text-white w-6 h-6" />
        </div>
        <span className="text-2xl font-extrabold text-slate-800 tracking-tight">Jelanta<span className="text-orange-500">HUB</span></span>
      </div>
      
      <nav className="flex-1 px-6 space-y-2 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                isActive 
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-orange-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-100 mt-auto">
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center justify-center gap-3 px-4 py-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-2xl font-bold transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Keluar
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 flex-col bg-white border-r border-slate-200 shadow-sm z-20">
        <SidebarContent />
      </aside>

      {/* Menu Mobile (Drawer) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-4/5 max-w-sm bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-6 p-2 text-slate-400 bg-slate-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Area Konten Utama */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header Mobile Only */}
        <header className="lg:hidden bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <Droplet className="text-orange-500 w-6 h-6" />
            <span className="text-xl font-extrabold text-slate-800">JelantaHUB</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className="p-2 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Konten Halaman */}
        <main className="p-6 md:p-10 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}