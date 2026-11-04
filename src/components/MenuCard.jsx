import React from 'react';

// Ikon Lucide (Menu, Bell, Home, dll) sudah dihapus dari import karena tidak digunakan lagi

export default function MenuCard({ data, isKecil }) {
  const bgCard = isKecil ? 'bg-[#E1E5DF]' : 'bg-[#DCD7CD]'; 

  return (
    // PERUBAHAN: Tinggi (h) disesuaikan dari 820px menjadi 680px karena elemen atas & bawah dihapus
    <div className={`relative w-full max-w-[480px] mx-auto ${bgCard} rounded-[40px] shadow-2xl h-[680px] font-sans border border-white/50`}>
      
      {/* Ornamen daun kecil melayang */}
      <div className="absolute top-8 right-20 w-3 h-3 bg-green-500 rounded-full rounded-tr-none rotate-45 blur-[1px] opacity-80 z-10"></div>
      <div className="absolute top-24 left-48 w-4 h-4 bg-green-600 rounded-full rounded-tr-none rotate-12 blur-[1px] opacity-80 z-10"></div>

      {/* 1. LINGKARAN MERAH: Judul Utama (Posisinya dinaikkan ke top-12) */}
      <div className="absolute top-12 left-10 pr-8 z-20 w-[90%]">
        <h2 className="text-[36px] font-black text-[#1a1a1a] leading-tight tracking-tight">
          {data.title}
        </h2>
      </div>

      {/* 2. LINGKARAN KUNING: Kategori / Nama Menu (Posisinya dinaikkan) */}
      <div className="absolute top-[120px] left-10 z-20">
        <p className="text-[14px] font-bold text-gray-500 mb-3 flex items-center gap-2">
          Categories <span className="w-2.5 h-2.5 bg-green-500 rounded-full rounded-tr-none rotate-45 shadow-sm"></span>
        </p>
        <div className="flex gap-3">
          <span className="bg-[#1a1a1a] text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-wide shadow-lg">
            {data.namaMenu}
          </span>
        </div>
      </div>

      {/* 3. LINGKARAN HIJAU: Info Gizi / Komposisi di Sisi Kiri */}
      {/* Lebar dibatasi (w-[180px]) agar tidak bertabrakan dengan gambar */}
      <div className="absolute top-[220px] left-10 z-20 w-[180px]">
        <ul className="flex flex-col gap-6">
          {data.items.map((item, idx) => {
            const splitItem = item.split('(');
            const nama = splitItem[0].trim();
            const porsi = splitItem[1] ? `${splitItem[1].replace(')', '')}` : '-'; 
            
            return (
              <li key={idx} className="flex flex-col">
                <span className="text-[#73706A] text-[12px] font-extrabold mb-1 tracking-widest uppercase">
                  {porsi}
                </span>
                <span className="text-[#1a1a1a] text-[17px] font-black leading-tight">
                  {nama}
                </span>
              </li>
            )
          })}
        </ul>
      </div>

      {/* PERUBAHAN GAMBAR: 
          - Digeser lebih jauh keluar batas kanan (-right-[90px]) 
          - Lebar diatur menjadi w-[350px] agar tidak menimpa teks nama menu
      */}
      <div className="absolute top-[200px] -right-[90px] z-30 w-[350px]">
        <img 
          src={data.image} 
          alt={data.title} 
          className="w-full h-auto object-contain rounded-3xl drop-shadow-[0_35px_40px_rgba(0,0,0,0.4)] transition-transform duration-500 hover:scale-[1.03]" 
        />
      </div>

      {/* 4. Teks Peringatan (Posisinya dinaikkan ke bottom-12) */}
      <div className="absolute bottom-12 w-full px-12 z-20">
        <p className="text-center text-[14px] font-bold text-[#1a1a1a] leading-relaxed">
          Segera dikonsumsi setelah pengantaran maksimal 2 jam
        </p>
      </div>

    </div>
  );
}