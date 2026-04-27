import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Landing from "./pages/Landing";
import Pengaduan from "./pages/masyarakat/Pengaduan";

// Layouts
import TopNavLayout from "./components/layouts/TopNavLayout";

// Dashboards & Pages
import Dashboard from "./pages/admin/Dashboard";
import DetailLaporan from "./pages/admin/DetailLaporan";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/home" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/masyarakat/pengaduan" element={<Pengaduan />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<TopNavLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="detail" element={<DetailLaporan />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* Instansi Routes */}
        <Route path="/instansi" element={<TopNavLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="detail" element={<DetailLaporan />} />
          <Route path="*" element={<Navigate to="/instansi/dashboard" replace />} />
        </Route>

        {/* Default */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;