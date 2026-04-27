import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Building, LayoutDashboard, Menu, X } from 'lucide-react';

export default function InstansiLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    navigate('/login');
  };

  const menuItems = [
    { path: '/instansi/dashboard', label: 'Ikhtisar', icon: LayoutDashboard },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-8 flex items-center gap-3">
        <div className="bg-blue-600 p-2.5 rounded-xl"><Building className="text-white w-6 h-6" /></div>
        <span className="text-2xl font-extrabold text-slate-800 tracking-tight">Instansi</span>
      </div>
      <nav className="flex-1 px-6 space-y-2 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold transition-all ${
                isActive ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-slate-500 hover:bg-slate-50'
              }`}>
              <Icon className="w-5 h-5" />{item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-6 border-t border-slate-100 mt-auto">
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl font-bold">
          <LogOut className="w-5 h-5" /> Keluar
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <aside className="hidden md:flex w-72 flex-col bg-white border-r border-slate-200"><SidebarContent /></aside>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-4/5 max-w-sm bg-white h-full flex flex-col"><SidebarContent /></div>
        </div>
      )}

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="md:hidden bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Building className="text-blue-600 w-6 h-6" /><span className="text-xl font-extrabold text-slate-800">Instansi</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 bg-slate-100 rounded-xl">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        <main className="p-6 md:p-10 max-w-6xl mx-auto w-full">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}
