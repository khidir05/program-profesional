import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Megaphone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API Response for Local Login
    if (identifier === 'admin' && password === 'admin') {
      localStorage.setItem('token', 'fake-admin-token');
      localStorage.setItem('role', 'Admin Pusat');
      localStorage.setItem('name', 'Budi Santoso');
      localStorage.setItem('instansi', 'Sistem Pengaduan Pusat');
      navigate('/admin/dashboard');
    } else if (identifier === 'instansi' && password === 'instansi') {
      localStorage.setItem('token', 'fake-instansi-token');
      localStorage.setItem('role', 'Petugas Penindak');
      localStorage.setItem('name', 'Siti Aminah');
      localStorage.setItem('instansi', 'Dinas Sosial Kab. Cilacap');
      // For dynamic routing in the future based on API, we just map it to their specific dashboard
      navigate('/instansi/dashboard');
    } else {
      alert('Login Gagal. Gunakan admin/admin atau instansi/instansi');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-600 p-4 rounded-full shadow-lg mb-3">
            <Megaphone className="text-white w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Sistem Pengaduan
          </h2>
          <p className="text-gray-500 text-sm">Masuk ke akun Anda</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-700">Username / Email</label>
            <input
              type="text"
              placeholder="Masukkan email atau username"
              className="w-full mt-2 px-4 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-2 px-4 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" /> Ingat saya
            </label>
            <span className="text-blue-600 hover:underline cursor-pointer">
              Lupa password?
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            Masuk
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Belum punya akun?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Daftar
          </Link>
        </p>

        <div className="text-center mt-4">
          <Link to="/home" className="text-xs text-gray-400 hover:text-gray-600">
            ← Kembali ke Beranda
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
