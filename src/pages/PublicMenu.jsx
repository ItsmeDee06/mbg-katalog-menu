import React, { useEffect, useState } from 'react';
import MenuCard from '../components/MenuCard';
import { Calendar, MapPin, Instagram, Facebook, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
      
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setData(menuData);
      }
      setLoading(false);
    }
    fetchMenu();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat data menu...</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center">Gagal memuat data.</div>;

  const porsiBesarData = {
    title: "Porsi Besar (SMP/SMA)",
    image: data.besar_image,
    calories: "700 - 800 kcal",
    items: data.besar_items,
    description: "Diformulasikan khusus untuk memenuhi kebutuhan kalori dan protein harian anak usia remaja."
  };

  const porsiKecilData = {
    title: "Porsi Kecil (PAUD/SD)",
    image: data.kecil_image,
    calories: "400 - 500 kcal",
    items: data.kecil_items,
    description: "Porsi disesuaikan dengan kapasitas lambung dan kebutuhan gizi seimbang untuk anak sekolah dasar."
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-gradient-to-r from-green-600 to-green-500 text-white pt-16 pb-12 px-4 shadow-lg relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight drop-shadow-sm">Menu Harian MBG</h1>
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 font-medium">
            <div className="flex items-center gap-2 bg-black/15 px-5 py-2.5 rounded-full shadow-inner">
              <MapPin size={18} className="text-green-100" />
              <span>{data.sppg_name}</span>
            </div>
            <div className="flex items-center gap-2 bg-black/15 px-5 py-2.5 rounded-full shadow-inner">
              <Calendar size={18} className="text-green-100" />
              <span>{data.menu_date}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          <MenuCard data={porsiBesarData} />
          <MenuCard data={porsiKecilData} />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-12 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Informasi & Layanan Kami</h3>
          <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
             {/* Statis untuk contoh, bisa dipindah ke DB jika perlu */}
            <span className="flex items-center gap-2 text-gray-600"><Instagram size={22}/> @arabhumi.mbg</span>
            <span className="flex items-center gap-2 text-gray-600"><Facebook size={22}/> ARA Bhumi Mandiri MBG</span>
            <span className="flex items-center gap-2 text-gray-600"><Globe size={22}/> www.arabhumimandiri.org</span>
          </div>
          <p className="text-gray-400 text-sm">&copy; 2026 Pelayanan Operasional Program Badan Gizi Nasional.</p>
        </div>
      </footer>
    </div>
  );
}