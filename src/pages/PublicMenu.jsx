import React, { useEffect, useState } from 'react';
import MenuCard from '../components/MenuCard';
import { Calendar, MapPin, Instagram, Facebook, Sun, Cloud } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Custom SVG Icon untuk TikTok (karena Lucide tidak menyediakannya secara spesifik)
const TikTokIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
  </svg>
);

export default function PublicMenu() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenu() {
      const { data: menuData, error } = await supabase
        .from('mbg_menu')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (error) console.error("Error fetching data:", error);
      else setData(menuData);
      
      setLoading(false);
    }
    fetchMenu();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-2xl text-green-500 animate-pulse">Memuat menu enak... 🍲</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center font-bold text-2xl text-red-500">Yah, menunya belum siap. 😢</div>;

  // DATA UNTUK PORSI KECIL (KIRI)
  const porsiKecilData = {
    title: "Porsi Kecil (PAUD - SD)",
    namaMenu: "Menu Andalan Anak", // Ini yang akan muncul di tombol hitam kapsul
    image: data.kecil_image,
    items: data.kecil_items,
  };

  // DATA UNTUK PORSI BESAR (KANAN)
  const porsiBesarData = {
    title: "Porsi Besar (SMP - SMA - SMK)",
    namaMenu: "Menu Lengkap Remaja", // Ini yang akan muncul di tombol hitam kapsul
    image: data.besar_image,
    items: data.besar_items,
  };

  // Membuat tautan pencarian Google Maps otomatis berdasarkan Nama SPPG
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.sppg_name)}`;

  return (
    <div className="min-h-screen bg-[#F0FDF4] font-sans overflow-x-hidden relative">
      
      {/* Background Ornamen Awan */}
      <div className="absolute top-10 left-10 text-green-200 opacity-50"><Cloud size={100} /></div>
      <div className="absolute top-24 right-10 text-green-200 opacity-50"><Cloud size={140} /></div>

      {/* HEADER CERIA */}
      <header className="bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 text-white pt-20 pb-20 px-4 shadow-2xl relative rounded-b-[3rem]">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          
          <div className="flex justify-center mb-4">
            <Sun className="text-yellow-300 animate-[spin_10s_linear_infinite]" size={70} />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 tracking-tight drop-shadow-lg">
            Menu Harian Gizi Seimbang
          </h1>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 font-bold text-sm md:text-base">
            {/* Tombol Alamat (Klik menuju Maps) */}
            <a 
              href={mapLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 hover:scale-105 transition-all px-6 py-3.5 rounded-full shadow-lg backdrop-blur-sm border-2 border-white/40 cursor-pointer"
            >
              <MapPin size={22} className="text-yellow-300" />
              <span>{data.sppg_name}</span>
            </a>
            
            {/* Tombol Tanggal */}
            <div className="flex items-center gap-2 bg-white/20 px-6 py-3.5 rounded-full shadow-lg backdrop-blur-sm border-2 border-white/40">
              <Calendar size={22} className="text-yellow-300" />
              <span>{data.menu_date}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 -mt-8 relative z-20">
        <div className="text-center mb-10 bg-white/60 backdrop-blur-sm py-4 px-8 rounded-full inline-block mx-auto border-2 border-green-100 shadow-sm flex justify-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-green-700 tracking-wide">
            Wah, Hari Ini Makan Apa Ya? 😋
          </h2>
        </div>

        {/* GRID KARTU MENU (KECIL DI KIRI, BESAR DI KANAN) */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <MenuCard data={porsiKecilData} isKecil={true} />
          <MenuCard data={porsiBesarData} isKecil={false} />
        </div>
      </main>

      {/* FOOTER MEDIA SOSIAL */}
      <footer className="bg-white rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] py-12 mt-10 border-t-4 border-green-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-xl font-extrabold text-green-700 mb-8">Yuk, Berteman Bersama Kami! 🌈</h3>
          
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-8">
            <a href="https://instagram.com/sppg_semanan4" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-pink-600 hover:scale-110 transition-transform bg-pink-50 border-2 border-pink-100 px-5 py-3 rounded-2xl font-bold shadow-sm">
              <Instagram size={24} /> @sppg_semanan4
            </a>
            <a href="https://tiktok.com/@sppg.semanan4" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-slate-800 hover:scale-110 transition-transform bg-slate-50 border-2 border-slate-200 px-5 py-3 rounded-2xl font-bold shadow-sm">
              <TikTokIcon /> @sppg.semanan4
            </a>
            <a href="https://facebook.com/sppg.semananempat" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-blue-600 hover:scale-110 transition-transform bg-blue-50 border-2 border-blue-100 px-5 py-3 rounded-2xl font-bold shadow-sm">
              <Facebook size={24} /> sppg semananempat
            </a>
          </div>
          
          <p className="text-gray-400 font-bold text-sm">
            &copy; 2026 Pelayanan Operasional Program Badan Gizi Nasional.
          </p>
        </div>
      </footer>
    </div>
  );
}