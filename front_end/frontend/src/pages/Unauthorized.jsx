// === src/pages/Unauthorized.jsx ===

import React from 'react';
import { Link } from 'react-router-dom';

// Pastikan tidak ada kata 'export' di baris ini
const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">403 - Akses Ditolak</h1>
      <p className="mb-8">Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      <Link 
        to="/" 
        className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
};

// Pastikan Anda memiliki baris ini di paling bawah
export default Unauthorized;