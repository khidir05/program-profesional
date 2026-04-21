import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-blue-600">Pengaduan Masyarakat</h1>
        <button
          onClick={() => navigate('/masyarakat/pengaduan')}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Buat Pengaduan
        </button>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-16 gap-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
            Sampaikan Pengaduan Anda Dengan Mudah
          </h2>
          <p className="text-gray-600 mb-6">
            Platform ini membantu masyarakat untuk menyampaikan laporan atau pengaduan secara cepat, transparan, dan terorganisir.
          </p>
          <button
            onClick={() => navigate('/masyarakat/pengaduan')}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:bg-blue-700 transition"
          >
            Laporkan Sekarang
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2"
        >
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <img
              src="https://illustrations.popsy.co/blue/customer-support.svg"
              alt="Ilustrasi"
              className="w-full h-auto"
            />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-16 py-16 bg-white">
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Kenapa Menggunakan Sistem Ini?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Mudah Digunakan',
              desc: 'Antarmuka sederhana dan mudah dipahami oleh semua kalangan.',
            },
            {
              title: 'Cepat & Responsif',
              desc: 'Pengaduan diproses dengan cepat oleh pihak terkait.',
            },
            {
              title: 'Transparan',
              desc: 'Status pengaduan dapat dipantau secara real-time.',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="p-6 bg-blue-50 rounded-2xl shadow-sm"
            >
              <h4 className="text-xl font-semibold mb-2 text-blue-600">
                {item.title}
              </h4>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-16 py-16 text-center bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          Punya Keluhan atau Laporan?
        </h3>
        <p className="mb-6">
          Jangan ragu untuk menyampaikan pengaduan Anda sekarang juga.
        </p>
        <button
          onClick={() => navigate('/masyarakat/pengaduan')}
          className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition"
        >
          Buat Pengaduan
        </button>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} Sistem Pengaduan Masyarakat
      </footer>
    </div>
  );
}
