import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// KOMPONEN HELPER DIPINDAHKAN KE LUAR AGAR TIDAK HILANG FOKUS SAAT MENGETIK
const InputField = ({ label, name, value, onChange, placeholder = "" }) => (
  <div className="mb-3">
    <label className="block text-xs font-semibold mb-1 text-gray-600">{label}</label>
    <input 
      type="text" 
      name={name} 
      value={value || ''} 
      onChange={onChange} 
      placeholder={placeholder} 
      className="w-full border p-2 rounded bg-white text-sm focus:ring focus:ring-green-200" 
    />
  </div>
);

export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    sppg_name: '', menu_date: '', 
    besar_nama: '', besar_image: '', besar_items: '',
    besar_energi: '', besar_protein: '', besar_lemak: '', besar_karbohidrat: '', besar_serat: '',
    kecil_nama: '', kecil_image: '', kecil_items: '',
    kecil_energi: '', kecil_protein: '', kecil_lemak: '', kecil_karbohidrat: '', kecil_serat: ''
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  useEffect(() => {
    if (session) fetchCurrentData();
  }, [session]);

  const fetchCurrentData = async () => {
    const { data, error } = await supabase.from('mbg_menu').select('*').eq('id', 1).single();
    if (data) {
      setFormData({
        sppg_name: data.sppg_name || '', menu_date: data.menu_date || '',
        besar_nama: data.besar_nama || '', besar_image: data.besar_image || '', besar_items: data.besar_items ? data.besar_items.join('\n') : '',
        besar_energi: data.besar_energi || '', besar_protein: data.besar_protein || '', besar_lemak: data.besar_lemak || '', besar_karbohidrat: data.besar_karbohidrat || '', besar_serat: data.besar_serat || '',
        kecil_nama: data.kecil_nama || '', kecil_image: data.kecil_image || '', kecil_items: data.kecil_items ? data.kecil_items.join('\n') : '',
        kecil_energi: data.kecil_energi || '', kecil_protein: data.kecil_protein || '', kecil_lemak: data.kecil_lemak || '', kecil_karbohidrat: data.kecil_karbohidrat || '', kecil_serat: data.kecil_serat || ''
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    setLoading(false);
  };

  const convertDriveUrl = (url) => {
    if (!url) return url;
    const match = url.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/uc\?id=)([a-zA-Z0-9_-]{25,})/);
    return match && match[1] ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Menyimpan pembaruan...');
    
    const besarItemsArray = formData.besar_items.split('\n').filter(item => item.trim() !== '');
    const kecilItemsArray = formData.kecil_items.split('\n').filter(item => item.trim() !== '');
    const finalBesarImage = convertDriveUrl(formData.besar_image);
    const finalKecilImage = convertDriveUrl(formData.kecil_image);

    const { error } = await supabase
      .from('mbg_menu')
      .update({
        ...formData, 
        besar_image: finalBesarImage,
        besar_items: besarItemsArray,
        kecil_image: finalKecilImage,
        kecil_items: kecilItemsArray
      })
      .eq('id', 1);

    if (error) setMessage(`Gagal: ${error.message}`);
    else setMessage('Menu berhasil diperbarui!');
    
    setLoading(false);
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Login Admin MBG</h2>
          {message && <div className="mb-4 text-red-500 text-sm text-center">{message}</div>}
          <input type="email" placeholder="Email Admin" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded mb-4"/>
          <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded mb-6"/>
          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">{loading ? 'Proses...' : 'Masuk'}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin MBG</h1>
          <button onClick={() => supabase.auth.signOut()} className="text-red-600 font-medium">Logout</button>
        </div>
        
        {message && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg font-medium border border-green-200">{message}</div>}

        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Header Info */}
          <div className="col-span-1 md:col-span-2 flex gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex-1"><InputField label="Nama SPPG" name="sppg_name" value={formData.sppg_name} onChange={handleChange} /></div>
            <div className="flex-1"><InputField label="Tanggal Berlaku" name="menu_date" value={formData.menu_date} onChange={handleChange} /></div>
          </div>

          {/* Form Porsi Kecil (KIRI) */}
          <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
            <h3 className="font-bold mb-4 text-blue-700 text-lg border-b border-blue-200 pb-2">🍱 PORSI KECIL (PAUD - SD)</h3>
            <InputField label="Nama Menu Porsi Kecil" name="kecil_nama" value={formData.kecil_nama} onChange={handleChange} placeholder="Contoh: Menu Andalan Anak" />
            <InputField label="URL Gambar (Google Drive/Unsplash)" name="kecil_image" value={formData.kecil_image} onChange={handleChange} />
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1 text-gray-600">Daftar Lauk (Pisahkan dengan Enter)</label>
              <textarea rows="4" name="kecil_items" value={formData.kecil_items} onChange={handleChange} className="w-full border p-2 rounded bg-white text-sm focus:ring focus:ring-blue-200" />
            </div>
            <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-gray-200">
              <InputField label="Total Energi (Contoh: 612)" name="kecil_energi" value={formData.kecil_energi} onChange={handleChange} />
              <InputField label="Protein (Contoh: 19.9g)" name="kecil_protein" value={formData.kecil_protein} onChange={handleChange} />
              <InputField label="Lemak (Contoh: 23.6g)" name="kecil_lemak" value={formData.kecil_lemak} onChange={handleChange} />
              <InputField label="Karbohidrat (Contoh: 77.1g)" name="kecil_karbohidrat" value={formData.kecil_karbohidrat} onChange={handleChange} />
              <div className="col-span-2"><InputField label="Serat (Contoh: 2.3g)" name="kecil_serat" value={formData.kecil_serat} onChange={handleChange} /></div>
            </div>
          </div>

          {/* Form Porsi Besar (KANAN) */}
          <div className="bg-orange-50/50 p-5 rounded-xl border border-orange-100">
            <h3 className="font-bold mb-4 text-orange-700 text-lg border-b border-orange-200 pb-2">🍱 PORSI BESAR (SMP - SMK)</h3>
            <InputField label="Nama Menu Porsi Besar" name="besar_nama" value={formData.besar_nama} onChange={handleChange} placeholder="Contoh: Menu Lengkap Remaja" />
            <InputField label="URL Gambar (Google Drive/Unsplash)" name="besar_image" value={formData.besar_image} onChange={handleChange} />
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1 text-gray-600">Daftar Lauk (Pisahkan dengan Enter)</label>
              <textarea rows="4" name="besar_items" value={formData.besar_items} onChange={handleChange} className="w-full border p-2 rounded bg-white text-sm focus:ring focus:ring-orange-200" />
            </div>
            <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-gray-200">
              <InputField label="Total Energi (Contoh: 750)" name="besar_energi" value={formData.besar_energi} onChange={handleChange} />
              <InputField label="Protein (Contoh: 25.0g)" name="besar_protein" value={formData.besar_protein} onChange={handleChange} />
              <InputField label="Lemak (Contoh: 30.0g)" name="besar_lemak" value={formData.besar_lemak} onChange={handleChange} />
              <InputField label="Karbohidrat (Contoh: 85.0g)" name="besar_karbohidrat" value={formData.besar_karbohidrat} onChange={handleChange} />
              <div className="col-span-2"><InputField label="Serat (Contoh: 3.0g)" name="besar_serat" value={formData.besar_serat} onChange={handleChange} /></div>
            </div>
          </div>

          {/* Tombol Simpan */}
          <div className="col-span-1 md:col-span-2 mt-4">
            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition shadow-lg text-lg">
              {loading ? 'Menyimpan ke Database...' : 'SIMPAN PEMBARUAN MENU SEKARANG'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}