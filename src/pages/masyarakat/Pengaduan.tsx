import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// FIX: Menangani Ikon Marker yang hilang menggunakan CDN resmi Leaflet
const markerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// --- KOMPONEN PETA INTERAKTIF ---
function LocationPicker({ position, setPosition }: { position: L.LatLng | null, setPosition: any }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
    locationfound(e) {
      // Jika lokasi ditemukan, arahkan peta ke Cilacap (atau lokasi asli Anda)
      setPosition(e.latlng);
      map.flyTo(e.latlng, 16);
    },
    locationerror() {
      alert("GPS Gagal mengunci lokasi. Pastikan izin lokasi di browser sudah diizinkan (Allow).");
    }
  });

  useEffect(() => {
    // Mencoba mendeteksi lokasi dengan akurasi tinggi saat modal dibuka
    map.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true });
  }, [map]);

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

export default function Pengaduan() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aduan, setAduan] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number | string; lng: number | string }>({ lat: '', lng: '' });
  const [showMap, setShowMap] = useState(false);
  const [tempCoords, setTempCoords] = useState<L.LatLng | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
          setTempCoords(new L.LatLng(position.coords.latitude, position.coords.longitude));
          setLoading(false);
        },
        () => {
          setLoading(false);
          alert("Gagal mengambil GPS.");
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const confirmLocation = () => {
    if (tempCoords) {
      setCoords({ lat: tempCoords.lat, lng: tempCoords.lng });
      setShowMap(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800 font-sans">
      <nav className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
          <h1 className="text-lg font-bold text-blue-600">Sistem Pengaduan</h1>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-12 px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-blue-50">
          <div className="flex flex-col md:flex-row">
            <div className="bg-blue-600 p-10 text-white md:w-1/3">
              <h2 className="text-2xl font-bold mb-4">Buat Laporan</h2>
              <p className="text-blue-100 text-sm">Pastikan GPS aktif agar kami bisa menuju lokasi dengan cepat.</p>
            </div>

            <div className="p-8 md:w-2/3 space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Detail Aduan</label>
                <textarea rows={4} className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" value={aduan} onChange={(e) => setAduan(e.target.value)} placeholder="Tulis laporan di sini..." />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Foto Kejadian</label>
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer hover:bg-blue-50 transition">
                  {imagePreview ? <img src={imagePreview} className="h-32 mx-auto rounded-lg object-cover" /> : <div className="py-2"><span className="text-2xl block">📸</span><span className="text-xs text-gray-400">Klik untuk lampirkan foto</span></div>}
                </div>
                <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setImage(e.target.files[0]);
                    setImagePreview(URL.createObjectURL(e.target.files[0]));
                  }
                }} />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Titik Lokasi</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={handleGetCurrentLocation} className="p-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold border border-blue-100">🛰️ GPS Cepat</button>
                  <button type="button" onClick={() => setShowMap(true)} className="p-3 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold border border-gray-200">🗺️ Pilih Manual</button>
                </div>
                {coords.lat && <div className="mt-3 p-3 bg-green-50 text-green-700 rounded-xl text-[11px] font-mono">Lokasi Terkunci: {coords.lat}, {coords.lng}</div>}
              </div>

              <button onClick={() => alert("Mengirim...")} disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition">Kirim Pengaduan</button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* MODAL PETA */}
      <AnimatePresence>
        {showMap && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl h-[80vh] flex flex-col">
              <div className="p-5 border-b flex justify-between items-center">
                <h3 className="font-bold">Geser Pin ke Lokasi Kejadian</h3>
                <button onClick={() => setShowMap(false)} className="text-2xl">&times;</button>
              </div>
              <div className="flex-grow z-0">
                <MapContainer center={[-7.7131, 109.0232]} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker position={tempCoords} setPosition={setTempCoords} />
                </MapContainer>
              </div>
              <div className="p-4 bg-gray-50 border-t flex justify-end gap-2">
                <button onClick={() => setShowMap(false)} className="px-5 py-2 text-sm font-semibold text-gray-500">Batal</button>
                <button onClick={confirmLocation} className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold">Gunakan Lokasi Ini</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}