import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter States
  const [filterKategori, setFilterKategori] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchNama, setSearchNama] = useState('');

  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userInstansi, setUserInstansi] = useState('');

  const isInstansiRoute = window.location.pathname.startsWith('/instansi');

  const fetchReports = async () => {
    setLoading(true);
    try {
      let url = '/api/laporan/';
      const params = new URLSearchParams();
      if (filterKategori) {
        params.append('kategori', filterKategori);
      }
      if (filterStatus) {
        params.append('status', filterStatus);
      }
      if (searchNama) {
        params.append('nama_pelapor', searchNama);
      }
      params.append('ordering', '-tgl_laporan');

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await api.get(url);
      if (response.data && response.data.status === 'success' && Array.isArray(response.data.data)) {
        setReports(response.data.data);
      } else if (Array.isArray(response.data)) {
        setReports(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setReports(response.data.data);
      } else {
        const arr = Object.values(response.data).find(val => Array.isArray(val));
        if (arr) {
          setReports(arr as any[]);
        }
      }
      setError('');
    } catch (err: any) {
      console.error('Gagal mengambil laporan dari backend, menggunakan data fallback:', err);
      setError('Menampilkan data lokal/fallback.');
      
      // Fallback premium mock data
      setReports([
        {
          id_laporan: "123e4567-e89b-12d3-a456-426614174000",
          instansi_id: "550e8400-e29b-41d4-a716-446655440000",
          instansi_nama: "Dinas Kesehatan",
          nama_pelapor: "Ahmad",
          email_pelapor: "ahmad@email.com",
          no_hp_pelapor: "081234567890",
          hubungan_pelapor: "Keluarga",
          foto: "foto_aduan.jpg",
          tgl_laporan: "2026-05-25T10:30:00Z",
          deskripsi: "Ada penderita ODGJ di lingkungan kami yang memerlukan bantuan",
          kategori: "ODGJ",
          latitude: -6.2088,
          longitude: 106.8456,
          status: "menunggu"
        },
        {
          id_laporan: "987f6543-e89b-12d3-a456-426614174999",
          instansi_id: "550e8400-e29b-41d4-a716-446655440001",
          instansi_nama: "Dinas Sosial Kab. Cilacap",
          nama_pelapor: "Budi",
          email_pelapor: "budi@email.com",
          no_hp_pelapor: "082234567890",
          hubungan_pelapor: "Tetangga",
          foto: "foto_aduan_2.jpg",
          tgl_laporan: "2026-05-26T08:15:00Z",
          deskripsi: "Seseorang telantar tidur di pos ronda dekat balai desa",
          kategori: "PGOT",
          latitude: -7.7131,
          longitude: 109.0232,
          status: "proses"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUserName(localStorage.getItem('name') || 'Pengguna');
    setUserRole(localStorage.getItem('role') || 'Role');
    setUserInstansi(localStorage.getItem('instansi') || 'Instansi Terkait');
  }, []);

  useEffect(() => {
    fetchReports();
  }, [filterKategori, filterStatus, searchNama]);

  // Statistics calculation
  const totalReports = reports.length;
  const pendingCount = reports.filter((r: any) => r.status === 'menunggu').length;
  const processCount = reports.filter((r: any) => r.status === 'proses').length;
  const completedCount = reports.filter((r: any) => r.status === 'selesai').length;

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
        {error && <span className="inline-block mt-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-xs font-semibold">{error}</span>}
      </motion.div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-lg border-t-8 border-t-orange-500 h-32 flex flex-col items-center justify-center transition hover:shadow-xl"
        >
          <h3 className="font-bold text-gray-800 text-xs md:text-sm text-center uppercase tracking-wider">TOTAL LAPORAN</h3>
          <span className="text-3xl font-extrabold text-orange-500 mt-2">{totalReports}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-lg border-t-8 border-t-blue-500 h-32 flex flex-col items-center justify-center transition hover:shadow-xl"
        >
          <h3 className="font-bold text-gray-800 text-xs md:text-sm text-center uppercase tracking-wider">LAPORAN MENUNGGU</h3>
          <span className="text-3xl font-extrabold text-blue-500 mt-2">{pendingCount}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-lg border-t-8 border-t-red-500 h-32 flex flex-col items-center justify-center transition hover:shadow-xl"
        >
          <h3 className="font-bold text-gray-800 text-xs md:text-sm text-center uppercase tracking-wider">SEDANG PROSES</h3>
          <span className="text-3xl font-extrabold text-red-500 mt-2">{processCount}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl shadow-lg border-t-8 border-t-green-500 h-32 flex flex-col items-center justify-center transition hover:shadow-xl"
        >
          <h3 className="font-bold text-gray-800 text-xs md:text-sm text-center uppercase tracking-wider">SELESAI</h3>
          <span className="text-3xl font-extrabold text-green-500 mt-2">{completedCount}</span>
        </motion.div>
      </div>

      {/* Filter and Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between border border-gray-100"
      >
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cari Pelapor / Deskripsi</label>
          <input
            type="text"
            placeholder="Cari berdasarkan nama pelapor atau kata kunci..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50"
            value={searchNama}
            onChange={(e) => setSearchNama(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kategori</label>
          <select
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            <option value="ODGJ">ODGJ</option>
            <option value="PGOT">PGOT</option>
          </select>
        </div>
        <div className="w-full md:w-48">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
          <select
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="menunggu">Menunggu</option>
            <option value="proses">Proses</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>
      </motion.div>

      {/* Tren & Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tren Laporan Masuk */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white p-6 rounded-2xl shadow-lg min-h-[250px] border border-gray-100"
        >
          <h3 className="font-bold text-gray-800 mb-6 text-sm uppercase tracking-wider">TREN LAPORAN MASUK</h3>
          {reports.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400 italic text-sm">
              Data belum ada
            </div>
          ) : (
            <div className="flex items-end justify-center gap-6 h-36 pt-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 bg-orange-400 rounded-t-xl transition-all duration-500 hover:bg-orange-500 shadow-md" style={{ height: `${Math.min(pendingCount * 30 + 15, 120)}px` }}></div>
                <span className="text-[10px] font-bold text-gray-500">Menunggu</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 bg-blue-500 rounded-t-xl transition-all duration-500 hover:bg-blue-600 shadow-md" style={{ height: `${Math.min(processCount * 30 + 15, 120)}px` }}></div>
                <span className="text-[10px] font-bold text-gray-500">Proses</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 bg-green-500 rounded-t-xl transition-all duration-500 hover:bg-green-600 shadow-md" style={{ height: `${Math.min(completedCount * 30 + 15, 120)}px` }}></div>
                <span className="text-[10px] font-bold text-gray-500">Selesai</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Status Laporan Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-2xl shadow-lg min-h-[250px] border border-gray-100"
        >
          <h3 className="font-bold text-gray-800 mb-6 text-sm uppercase tracking-wider">DISTRIBUSI STATUS</h3>
          {reports.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400 italic text-sm">
              Data belum ada
            </div>
          ) : (
            <div className="flex justify-around items-center h-36">
              <div className="w-24 h-24 rounded-full relative shadow-lg flex items-center justify-center" 
                   style={{ 
                     background: `conic-gradient(
                       #f97316 0% ${totalReports > 0 ? (pendingCount / totalReports) * 100 : 0}%, 
                       #3b82f6 ${totalReports > 0 ? (pendingCount / totalReports) * 100 : 0}% ${totalReports > 0 ? ((pendingCount + processCount) / totalReports) * 100 : 0}%, 
                       #22c55e ${totalReports > 0 ? ((pendingCount + processCount) / totalReports) * 100 : 0}% 100%
                     )` 
                   }}>
                <div className="w-16 h-16 bg-white rounded-full absolute flex items-center justify-center shadow-inner font-extrabold text-gray-700 text-sm">
                  {totalReports}
                </div>
              </div>
              <div className="text-xs space-y-2 font-semibold text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span>Menunggu ({pendingCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Proses ({processCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Selesai ({completedCount})</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Laporan Terbaru */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">DAFTAR LAPORAN MASUK</h3>
        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-500 font-medium">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Memuat Laporan...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100 bg-gray-50/50">
                  <th className="pb-3 pt-2 pl-3 font-bold text-xs uppercase text-gray-500 tracking-wider">ID Laporan</th>
                  <th className="pb-3 pt-2 font-bold text-xs uppercase text-gray-500 tracking-wider">Kategori</th>
                  <th className="pb-3 pt-2 font-bold text-xs uppercase text-gray-500 tracking-wider">Instansi Tujuan</th>
                  <th className="pb-3 pt-2 font-bold text-xs uppercase text-gray-500 tracking-wider">Koordinat</th>
                  <th className="pb-3 pt-2 font-bold text-xs uppercase text-gray-500 tracking-wider">Waktu Laporan</th>
                  <th className="pb-3 pt-2 font-bold text-xs uppercase text-gray-500 tracking-wider">Status</th>
                  <th className="pb-3 pt-2"></th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400 italic text-sm">
                      Laporan tidak ditemukan
                    </td>
                  </tr>
                ) : (
                  reports.map((report: any, index) => {
                    const idShort = report.id_laporan ? report.id_laporan.substring(0, 8).toUpperCase() : `LAP-${index}`;
                    const formattedTime = report.tgl_laporan ? new Date(report.tgl_laporan).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : '-';
                    
                    let badgeClass = 'bg-orange-50 text-orange-600 border border-orange-200';
                    let statusLabel = 'Menunggu';
                    if (report.status === 'proses') {
                      badgeClass = 'bg-blue-50 text-blue-600 border border-blue-200';
                      statusLabel = 'Proses';
                    } else if (report.status === 'selesai') {
                      badgeClass = 'bg-green-50 text-green-600 border border-green-200';
                      statusLabel = 'Selesai';
                    }

                    return (
                      <tr key={report.id_laporan || index} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                        <td className="py-4 pl-3 font-mono font-bold text-xs text-blue-600">{idShort}...</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg ${report.kategori === 'ODGJ' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                            {report.kategori}
                          </span>
                        </td>
                        <td className="py-4 font-semibold text-gray-700">{report.instansi_nama || 'Umum'}</td>
                        <td className="py-4 font-mono text-[11px] text-gray-500">
                          {report.latitude ? `${parseFloat(report.latitude).toFixed(4)}, ${parseFloat(report.longitude).toFixed(4)}` : '-'}
                        </td>
                        <td className="py-4 text-xs font-medium text-gray-500">{formattedTime}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block capitalize ${badgeClass}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="py-4 text-right pr-3">
                          <button 
                            onClick={() => navigate(`${isInstansiRoute ? '/instansi/detail' : '/admin/detail'}?id=${report.id_laporan}`)}
                            className="px-4 py-1.5 text-xs font-bold bg-blue-50 hover:bg-blue-600 hover:text-white rounded-full text-blue-600 border border-blue-200 shadow-sm transition-all duration-300">
                            Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
