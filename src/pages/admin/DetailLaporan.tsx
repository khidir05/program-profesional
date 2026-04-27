import { motion } from 'framer-motion';

export default function DetailLaporan() {
  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl shadow-lg min-h-[600px] border border-gray-100"
      >
        <h3 className="font-bold text-gray-800 mb-6 text-xl">DETAIL LAPORAN</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-gray-800 mb-3 text-sm">Ringkasan Laporan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 p-3 flex flex-col justify-center items-center h-20 bg-gray-50 shadow-sm rounded-xl">
                <span className="text-xs text-gray-500 absolute self-start -mt-6 ml-2">Kategori</span>
                <span className="font-bold text-gray-800">ODGJ</span>
              </div>
              <div className="border border-gray-200 p-3 flex flex-col justify-center items-center h-20 bg-gray-50 shadow-sm rounded-xl relative">
                <span className="text-xs text-gray-500 absolute top-2 left-3">Urgensi</span>
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mb-1"></div>
                  <span className="font-bold text-gray-800 text-sm">Darurat</span>
                </div>
              </div>
              <div className="border border-gray-200 p-3 flex flex-col justify-center items-center h-20 bg-gray-50 shadow-sm rounded-xl relative">
                <span className="text-xs text-gray-500 absolute top-2 left-3">Lokasi</span>
                <span className="font-bold text-gray-800 mt-2">Kab.Cilacap</span>
              </div>
              <div className="border border-gray-200 p-3 flex flex-col justify-center items-center h-20 bg-gray-50 shadow-sm rounded-xl relative">
                <span className="text-xs text-gray-500 absolute top-2 left-3">Waktu Laporan</span>
                <span className="font-bold text-gray-800 mt-2 text-sm">22 Maret 2026 . 10.08</span>
              </div>
            </div>
          </div>

          <div className="relative pt-4">
            <span className="text-xs text-gray-500 absolute top-5 left-3 z-10">Deskripsi Situasi</span>
            <div className="border border-gray-200 h-24 bg-gray-50 shadow-sm w-full relative rounded-xl p-3 pt-8 text-gray-700 text-sm">
              Melihat seseorang terlantar di depan minimarket, kondisinya memprihatinkan dan butuh bantuan segera.
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-3 text-sm">Riwayat Penanganan</h4>
            <div className="flex flex-col gap-3 ml-2 relative before:absolute before:inset-0 before:ml-1.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              <div className="w-4 h-4 bg-green-500 rounded-full relative z-10 shadow-sm"></div>
              <div className="w-4 h-4 bg-blue-500 rounded-full relative z-10 shadow-sm"></div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-4 text-sm mt-8">Tugaskan Petugas</h4>
            <div className="flex flex-wrap gap-4 justify-start md:justify-center mt-6">
              <button className="px-8 py-2.5 bg-blue-600 rounded-xl font-bold text-white shadow-md hover:bg-blue-700 transition">
                Terima
              </button>
              <button className="px-8 py-2.5 bg-green-500 rounded-xl font-bold text-white shadow-md hover:bg-green-600 transition">
                Kirim Petugas
              </button>
              <button className="px-8 py-2.5 bg-red-500 rounded-xl font-bold text-white shadow-md hover:bg-red-600 transition">
                Tolak
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
