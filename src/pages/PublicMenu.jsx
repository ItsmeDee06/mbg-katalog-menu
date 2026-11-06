import React, { useEffect, useState } from 'react';
import MenuCard from '../components/MenuCard';
import { Calendar, MapPin, Instagram, Facebook, Sun, Cloud } from 'lucide-react';
import { supabase } from '../lib/supabase';

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

  const porsiKecilData = {
    title: data.kecil_nama || "Menu Andalan Anak",
    image: data.kecil_image,
    items: data.kecil_items,
    energi: data.kecil_energi || "612",
    protein: data.kecil_protein || "19.9g",
    lemak: data.kecil_lemak || "23.6g",
    karbohidrat: data.kecil_karbohidrat || "77.1g",
    serat: data.kecil_serat || "2.3g"
  };

  const porsiBesarData = {
    title: data.besar_nama || "Menu Lengkap Remaja",
    image: data.besar_image,
    items: data.besar_items,
    energi: data.besar_energi || "750",
    protein: data.besar_protein || "25.0g",
    lemak: data.besar_lemak || "30.0g",
    karbohidrat: data.besar_karbohidrat || "85.0g",
    serat: data.besar_serat || "3.0g"
  };

  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.sppg_name)}`;

  return (
    <div className="min-h-screen bg-[#F0FDF4] font-sans overflow-x-hidden relative">
      
      <div className="absolute top-10 left-10 text-green-200 opacity-50"><Cloud size={100} /></div>
      <div className="absolute top-24 right-10 text-green-200 opacity-50"><Cloud size={140} /></div>

      {/* PERBAIKAN 1: Header diperkecil (padding, font size, icon size) agar seimbang */}
      <header className="bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 text-white pt-10 pb-12 px-4 shadow-xl relative rounded-b-[2rem]">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          
          <div className="flex justify-center mb-3">
            <Sun className="text-yellow-300 animate-[spin_10s_linear_infinite]" size={46} />
          </div>

          <h1 className="text-3xl md:text-4xl font-black mb-5 tracking-tight drop-shadow-md">
            Menu Harian Gizi Seimbang
          </h1>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 font-bold text-xs md:text-sm">
            <a 
              href={mapLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 hover:scale-105 transition-all px-5 py-2.5 rounded-full shadow-lg backdrop-blur-sm border-2 border-white/40 cursor-pointer"
            >
              <MapPin size={18} className="text-yellow-300" />
              <span>{data.sppg_name}</span>
            </a>
            
            <div className="flex items-center gap-2 bg-white/20 px-5 py-2.5 rounded-full shadow-lg backdrop-blur-sm border-2 border-white/40">
              <Calendar size={18} className="text-yellow-300" />
              <span>{data.menu_date}</span>
            </div>
          </div>
        </div>
      </header>

      {/* PERBAIKAN 2: Teks "Wah, Hari ini makan apa ya?" sudah dihapus dari sini */}
      
      <main className="max-w-6xl mx-auto px-4 py-12 relative z-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <MenuCard data={porsiKecilData} isKecil={true} />
          <MenuCard data={porsiBesarData} isKecil={false} />
        </div>
      </main>

      <footer className="bg-white rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] py-12 mt-4 border-t-4 border-green-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-xl font-extrabold text-green-700 mb-8">Yuk, Berteman Bersama Kami! 🌈</h3>
          
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-8">
            <a href="https://instagram.com/sppg_semanan4" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-pink-600 hover:scale-110 transition-transform bg-pink-50 border-2 border-pink-100 px-5 py-3 rounded-2xl font-bold shadow-sm">
              <Instagram size={20} /> @sppg_semanan4
            </a>
            <a href="https://tiktok.com/@sppg.semanan4" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-slate-800 hover:scale-110 transition-transform bg-slate-50 border-2 border-slate-200 px-5 py-3 rounded-2xl font-bold shadow-sm">
              <TikTokIcon /> @sppg.semanan4
            </a>
            <a href="https://facebook.com/sppg.semananempat" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-blue-600 hover:scale-110 transition-transform bg-blue-50 border-2 border-blue-100 px-5 py-3 rounded-2xl font-bold shadow-sm">
              <Facebook size={20} /> sppg semananempat
            </a>
          </div>
          
          <p className="text-gray-400 font-bold text-xs">
            &copy; 2026 Pelayanan Operasional Program Badan Gizi Nasional.
          </p>
        </div>
      </footer>
    </div>
  );
}