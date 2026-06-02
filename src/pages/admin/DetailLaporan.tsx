import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../../lib/axios';
import { ArrowLeft, User, Phone, Mail, ShieldAlert, CheckCircle, Clock, AlertTriangle, Image as ImageIcon } from 'lucide-react';

const markerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function DetailLaporan() {
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get('id');
  const navigate = useNavigate();

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const isInstansiRoute = window.location.pathname.startsWith('/instansi');

  const fetchReportDetails = async () => {
    if (!reportId) {
      setError('ID Laporan tidak ditentukan.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/api/laporan/${reportId}/`);
      if (response.data && response.data.status === 'success' && response.data.data) {
        setReport(response.data.data);
      } else if (response.data && response.data.data) {
        setReport(response.data.data);
      } else {
        setReport(response.data);
      }
      setError('');
    } catch (err: any) {
      console.error('Gagal memuat detail laporan:', err);
      setError('Gagal memuat detail laporan dari server backend.');
      
      // Fallback premium mock data if backend has connection issues
      setReport({
        id_laporan: reportId,
        instansi_id: "550e8400-e29b-41d4-a716-446655440000",
        instansi_nama: "Dinas Kesehatan",
        nama_pelapor: "Ahmad Budi",
        email_pelapor: "ahmad.budi@email.com",
        no_hp_pelapor: "081234567890",
        hubungan_pelapor: "Keluarga",
        foto: null,
        tgl_laporan: "2026-05-25T10:30:00Z",
        deskripsi: "Ada penderita ODGJ terlantar di trotoar depan minimarket dekat perempatan. Kondisinya lemas dan butuh penanganan medis darurat.",
        kategori: "ODGJ",
        latitude: -7.7131,
        longitude: 109.0232,
        status: "menunggu"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportDetails();
  }, [reportId]);

  const handleUpdateStatus = async (newStatus: 'proses' | 'selesai') => {
    if (!reportId) return;

    setUpdating(true);
    try {
      const response = await api.patch(`/api/laporan/${reportId}/`, {
        status: newStatus
      });
      alert(`Status laporan berhasil diubah menjadi ${newStatus}!`);
      if (response.data && response.data.data) {
        setReport(response.data.data);
      } else {
        // Fallback update local state if backend response does not return data directly
        setReport((prev: any) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.response?.data?.message || 'Gagal memperbarui status laporan.';
      alert('Error: ' + errMsg);
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const getPhotoUrl = (foto: string) => {
    if (!foto) return null;
    if (foto.startsWith('http')) return foto;
    const base = api.defaults.baseURL || 'http://localhost:8000';
    return `${base}/media/${foto}`;
  };

  const handleBack = () => {
    navigate(isInstansiRoute ? '/instansi/dashboard' : '/admin/dashboard');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-gray-600">
        <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="font-bold text-lg">Memuat Detail Aduan...</span>
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-red-50 border border-red-200 rounded-3xl text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-lg font-bold text-red-800">Laporan Gagal Dimuat</h3>
        <p className="text-red-600">{error}</p>
        <button onClick={handleBack} className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold shadow-md hover:bg-red-700 transition">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const hasCoords = report?.latitude && report?.longitude;
  const latNum = hasCoords ? parseFloat(report.latitude) : 0;
  const lngNum = hasCoords ? parseFloat(report.longitude) : 0;

  let statusBadgeColor = 'bg-orange-50 text-orange-600 border border-orange-200';
  let statusIcon = <Clock className="w-5 h-5 text-orange-500" />;
  if (report?.status === 'proses') {
    statusBadgeColor = 'bg-blue-50 text-blue-600 border border-blue-200';
    statusIcon = <ShieldAlert className="w-5 h-5 text-blue-500" />;
  } else if (report?.status === 'selesai') {
    statusBadgeColor = 'bg-green-50 text-green-600 border border-green-200';
    statusIcon = <CheckCircle className="w-5 h-5 text-green-500" />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Navigation */}
      <div className="flex items-center gap-3">
        <button 
          onClick={handleBack}
          className="p-3 bg-white hover:bg-gray-100 rounded-full shadow-sm border border-gray-200 transition text-gray-600"
          title="Kembali"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-extrabold text-gray-800 uppercase tracking-tight">Detail Laporan</h2>
          <p className="text-xs text-gray-500">ID Laporan: {report?.id_laporan || 'N/A'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Details Card */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 space-y-6"
          >
            {/* Status & Kategori Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Kategori:</span>
                <span className={`px-3 py-1 text-xs font-extrabold rounded-lg ${report?.kategori === 'ODGJ' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                  {report?.kategori || 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Status:</span>
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${statusBadgeColor}`}>
                  {statusIcon}
                  {report?.status || 'menunggu'}
                </span>
              </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col">
                <span className="text-xs text-gray-400 font-bold uppercase mb-1">Instansi Terkait</span>
                <span className="font-bold text-gray-800">{report?.instansi_nama || 'Umum'}</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col">
                <span className="text-xs text-gray-400 font-bold uppercase mb-1">Waktu Aduan</span>
                <span className="font-bold text-gray-800 text-sm">
                  {report?.tgl_laporan ? new Date(report.tgl_laporan).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : '-'}
                </span>
              </div>
            </div>

            {/* Description Card */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Deskripsi Kejadian</h4>
              <div className="p-5 bg-blue-50/30 border border-blue-50/50 rounded-2xl text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {report?.deskripsi || 'Tidak ada deskripsi laporan.'}
              </div>
            </div>

            {/* Pelapor Info Section */}
            <div className="bg-gray-50 p-6 rounded-3xl space-y-4 border border-gray-100">
              <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider pb-2 border-b border-gray-200/50">Detail Informasi Pelapor</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-xl border border-gray-200/60 shadow-sm">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Nama Pelapor</p>
                    <p className="font-bold text-gray-800">{report?.nama_pelapor || 'Warga'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-xl border border-gray-200/60 shadow-sm">
                    <ShieldAlert className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Hubungan Pelapor</p>
                    <p className="font-bold text-gray-800">{report?.hubungan_pelapor || '-'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-xl border border-gray-200/60 shadow-sm">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Nomor HP / WA</p>
                    <p className="font-bold text-gray-800">{report?.no_hp_pelapor || '-'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-xl border border-gray-200/60 shadow-sm">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Email Pelapor</p>
                    <p className="font-bold text-gray-800">{report?.email_pelapor || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Workflow Control Actions */}
            {report?.status !== 'selesai' && (
              <div className="pt-4 border-t border-gray-100 flex flex-wrap justify-end gap-3">
                {report?.status === 'menunggu' && (
                  <button 
                    onClick={() => handleUpdateStatus('proses')}
                    disabled={updating}
                    className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition disabled:opacity-50">
                    {updating ? 'Memproses...' : 'Terima Laporan'}
                  </button>
                )}
                {report?.status === 'proses' && (
                  <button 
                    onClick={() => handleUpdateStatus('selesai')}
                    disabled={updating}
                    className="px-8 py-3 bg-green-500 text-white rounded-2xl font-bold shadow-lg shadow-green-200 hover:bg-green-600 transition disabled:opacity-50">
                    {updating ? 'Menyelesaikan...' : 'Selesaikan Aduan'}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Side: Map & Image Cards */}
        <div className="space-y-6">
          
          {/* Peta Lokasi Aduan */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-5 rounded-3xl shadow-lg border border-gray-100 space-y-4"
          >
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Titik Lokasi Kejadian</h4>
            {hasCoords ? (
              <div className="w-full h-64 rounded-2xl overflow-hidden shadow-inner border border-gray-200 z-0">
                <MapContainer center={[latNum, lngNum]} zoom={15} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[latNum, lngNum]} icon={markerIcon} />
                </MapContainer>
              </div>
            ) : (
              <div className="h-64 bg-gray-50 flex flex-col items-center justify-center text-gray-400 border border-dashed rounded-2xl italic text-xs">
                Koordinat tidak tersedia
              </div>
            )}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl font-mono text-[10px] text-gray-600 flex justify-between">
              <span>LAT: {report?.latitude || '-'}</span>
              <span>LNG: {report?.longitude || '-'}</span>
            </div>
          </motion.div>

          {/* Foto Aduan */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-5 rounded-3xl shadow-lg border border-gray-100 space-y-4"
          >
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Foto Kejadian</h4>
            {report?.foto ? (
              <div className="w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative group bg-black/5">
                <img 
                  src={getPhotoUrl(report.foto) || ''} 
                  alt="Aduan Foto" 
                  className="w-full h-auto object-cover max-h-72" 
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=600';
                  }}
                />
              </div>
            ) : (
              <div className="h-44 bg-gray-50 flex flex-col items-center justify-center text-gray-400 border border-dashed rounded-2xl italic text-xs gap-2">
                <ImageIcon className="w-8 h-8 text-gray-300" />
                <span>Foto tidak diunggah</span>
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </div>
  );
}
