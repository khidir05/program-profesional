import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import api from '../../lib/axios';

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
  const [nama, setNama] = useState('');
  const [nomorHP, setNomorHP] = useState('');
  const [aduan, setAduan] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number | string; lng: number | string }>({ lat: '', lng: '' });
  const [showMap, setShowMap] = useState(false);
  const [tempCoords, setTempCoords] = useState<L.LatLng | null>(null);

  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Tidak dapat mengakses kamera. Pastikan Anda telah memberikan izin.");
      setIsCameraOpen(false);
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            closeCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async () => {
    if (!nama || !nomorHP || !aduan || !coords.lat) {
      alert("Mohon lengkapi nama, nomor HP, detail aduan, dan lokasi.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('nama', nama);
      formData.append('nomorHP', nomorHP);
      formData.append('aduan', aduan);
      formData.append('lat', coords.lat.toString());
      formData.append('lng', coords.lng.toString());
      if (image) {
        formData.append('image', image);
      }

      await api.post('/laporan', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Pengaduan berhasil dikirim!');
      // Reset form if needed
      setNama('');
      setNomorHP('');
      setAduan('');
      setImage(null);
      setImagePreview(null);
      setCoords({ lat: '', lng: '' });
    } catch (err) {
      alert('Gagal mengirim pengaduan. Pastikan server berjalan.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Nama Pelapor</label>
                  <input type="text" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Masukkan nama Anda" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Nomor HP</label>
                  <input type="tel" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" value={nomorHP} onChange={(e) => setNomorHP(e.target.value)} placeholder="08xxxxxxxx" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Detail Aduan</label>
                <textarea rows={4} className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" value={aduan} onChange={(e) => setAduan(e.target.value)} placeholder="Tulis laporan di sini..." required />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Foto Kejadian</label>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <button type="button" onClick={openCamera} className="p-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold border border-blue-100 flex items-center justify-center gap-2">
                    📷 Kamera
                  </button>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold border border-gray-200 flex items-center justify-center gap-2">
                    🖼️ Galeri
                  </button>
                </div>
                {imagePreview && (
                  <div className="mt-4">
                    <img src={imagePreview} className="h-40 mx-auto rounded-xl object-cover shadow-sm border border-gray-200" alt="Preview" />
                  </div>
                )}
                
                {/* Hidden Inputs */}
                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageChange} />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Titik Lokasi</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={handleGetCurrentLocation} className="p-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold border border-blue-100 flex items-center justify-center gap-2">
                    🛰️ GPS Cepat
                  </button>
                  <button type="button" onClick={() => setShowMap(true)} className="p-3 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold border border-gray-200 flex items-center justify-center gap-2">
                    🗺️ Pilih Manual
                  </button>
                </div>
                {coords.lat && <div className="mt-3 p-3 bg-green-50 text-green-700 rounded-xl text-[11px] font-mono border border-green-100">Lokasi Terkunci: {coords.lat}, {coords.lng}</div>}
              </div>

              <button onClick={handleSubmit} disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Mengirim...' : 'Kirim Pengaduan'}
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* MODAL KAMERA */}
      <AnimatePresence>
        {isCameraOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover max-h-[80vh]"></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
            
            <div className="absolute bottom-10 flex gap-6">
              <button onClick={closeCamera} className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm border-2 border-white/50">
                Batal
              </button>
              <button onClick={takePhoto} className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-gray-300 shadow-xl">
                <div className="w-16 h-16 bg-white rounded-full border-2 border-black"></div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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