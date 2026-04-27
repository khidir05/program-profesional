import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  // Simulate empty data state
  const [reports, setReports] = useState([]);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userInstansi, setUserInstansi] = useState('');

  useEffect(() => {
    setUserName(localStorage.getItem('name') || 'Pengguna');
    setUserRole(localStorage.getItem('role') || 'Role');
    setUserInstansi(localStorage.getItem('instansi') || 'Instansi Terkait');
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Greeting Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Selamat datang, {userName}
        </h2>
        <p className="text-gray-500 mt-1">
          Anda login sebagai <span className="font-semibold text-blue-600">{userRole}</span> dari <span className="font-semibold text-gray-700">{userInstansi}</span>
        </p>
      </motion.div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-lg border-t-8 border-t-orange-500 h-32 flex flex-col items-center justify-center"
        >
          <h3 className="font-bold text-gray-800 text-lg md:text-xl text-center">TOTAL LAPORAN</h3>
          <span className="text-3xl font-extrabold text-orange-500 mt-2">0</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-lg border-t-8 border-t-blue-500 h-32 flex flex-col items-center justify-center"
        >
          <h3 className="font-bold text-gray-800 text-lg md:text-xl text-center">LAPORAN DARURAT</h3>
          <span className="text-3xl font-extrabold text-blue-500 mt-2">0</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-lg border-t-8 border-t-red-500 h-32 flex flex-col items-center justify-center"
        >
          <h3 className="font-bold text-gray-800 text-lg md:text-xl text-center">SEDANG PROSES</h3>
          <span className="text-3xl font-extrabold text-red-500 mt-2">0</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl shadow-lg border-t-8 border-t-green-500 h-32 flex flex-col items-center justify-center"
        >
          <h3 className="font-bold text-gray-800 text-lg md:text-xl text-center">SELESAI BULAN INI</h3>
          <span className="text-3xl font-extrabold text-green-500 mt-2">0</span>
        </motion.div>
      </div>

      {/* Tren Laporan Masuk */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-2xl shadow-lg min-h-[250px]"
      >
        <h3 className="font-bold text-gray-800 mb-6 text-lg">TREN LAPORAN MASUK</h3>
        {reports.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400 italic">
            Data belum ada
          </div>
        ) : (
          <div className="flex items-end justify-center gap-4 h-32">
            {/* Simple Bar Chart Placeholder */}
            <div className="w-8 md:w-12 bg-green-400 rounded-t-md h-16 relative"></div>
            <div className="w-8 md:w-12 bg-green-500 rounded-t-md h-24 relative"></div>
            <div className="w-8 md:w-12 bg-green-600 rounded-t-md h-32 relative"></div>
            <div className="w-8 md:w-12 bg-green-400 rounded-t-md h-12 relative"></div>
            <div className="w-full absolute bottom-0 h-2 bg-green-300 rounded-full mt-2"></div>
          </div>
        )}
      </motion.div>

      {/* Status Laporan */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white p-6 rounded-2xl shadow-lg min-h-[250px]"
      >
        <h3 className="font-bold text-gray-800 mb-6 text-lg">STATUS LAPORAN</h3>
        {reports.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-gray-400 italic">
            Data belum ada
          </div>
        ) : (
          <div className="flex justify-center items-center h-40">
            {/* Donut Chart Placeholder */}
            <div className="w-32 h-32 rounded-full relative shadow-inner" 
                 style={{ background: 'conic-gradient(#3b82f6 0% 40%, #22c55e 40% 75%, #facc15 75% 100%)' }}>
              <div className="w-16 h-16 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-inner"></div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Laporan Terbaru */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto"
      >
        <h3 className="font-bold text-gray-800 mb-4 text-lg">LAPORAN TERBARU</h3>
        <div className="min-w-[600px]">
          <table className="w-full text-left text-sm text-gray-600 border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="pb-3 font-semibold text-gray-700">ID laporan</th>
                <th className="pb-3 font-semibold text-gray-700">Kategori</th>
                <th className="pb-3 font-semibold text-gray-700">Lokasi</th>
                <th className="pb-3 font-semibold text-gray-700">Urgensi</th>
                <th className="pb-3 font-semibold text-gray-700">Status</th>
                <th className="pb-3 font-semibold text-gray-700">Waktu</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 italic">
                    Data belum ada
                  </td>
                </tr>
              ) : (
                reports.map((report: any, index) => (
                  <tr key={index} className="border-b border-gray-50">
                    <td className="py-3">{report.id}</td>
                    <td className="py-3">{report.kategori}</td>
                    <td className="py-3">{report.lokasi}</td>
                    <td className="py-3">{report.urgensi}</td>
                    <td className="py-3">{report.status}</td>
                    <td className="py-3">{report.waktu}</td>
                    <td className="py-3 text-right">
                      <button 
                        onClick={() => navigate('/admin/detail')}
                        className="px-4 py-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 rounded-full text-blue-600 shadow-sm border border-blue-200 transition">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
