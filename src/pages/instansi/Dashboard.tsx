import { useEffect, useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InstansiDashboard() {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    setUserName(localStorage.getItem('name') || 'Instansi User');
    setUserRole(localStorage.getItem('role') || 'Instansi');
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Instansi</h1>
          <p className="text-slate-500 mt-1">Selamat datang kembali, {userName}</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-blue-100 p-3 rounded-xl">
            <LayoutDashboard className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Informasi Pengguna</h2>
            <p className="text-sm text-slate-500">Detail profil Anda saat ini</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm font-medium text-slate-500 mb-1">Nama</p>
            <p className="text-lg font-bold text-slate-800">{userName}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm font-medium text-slate-500 mb-1">Role</p>
            <p className="text-lg font-bold text-slate-800 capitalize">{userRole}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
