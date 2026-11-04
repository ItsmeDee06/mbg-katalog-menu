import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    sppg_name: '', menu_date: '', besar_image: '', 
    besar_items: '', kecil_image: '', kecil_items: ''
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
        sppg_name: data.sppg_name,
        menu_date: data.menu_date,
        besar_image: data.besar_image,
        besar_items: data.besar_items.join('\n'),
        kecil_image: data.kecil_image,
        kecil_items: data.kecil_items.join('\n')
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

  // Fungsi Otomatisasi Ekstrak dan Konversi URL Google Drive
  const convertDriveUrl = (url) => {
    if (!url) return url;
    // Regex untuk mendeteksi link share Google Drive dan mengambil ID file-nya
    const match = url.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/uc\?id=)([a-zA-Z0-9_-]{25,})/);
    
    if (match && match[1]) {
      // Mengubah menjadi format lh3 (Direct Image Link)
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
    return url; // Jika bukan URL Drive (misal Unsplash), biarkan seperti aslinya
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Menyimpan pembaruan...');
    
    const besarItemsArray = formData.besar_items.split('\n').filter(item => item.trim() !== '');
    const kecilItemsArray = formData.kecil_items.split('\n').filter(item => item.trim() !== '');

    // Eksekusi otomatisasi konversi gambar saat tombol Simpan ditekan
    const finalBesarImage = convertDriveUrl(formData.besar_image);
    const finalKecilImage = convertDriveUrl(formData.kecil_image);

    const { error } = await supabase
      .from('mbg_menu')
      .update({
        sppg_name: formData.sppg_name,
        menu_date: formData.menu_date,
        besar_image: finalBesarImage,
        besar_items: besarItemsArray,
        kecil_image: finalKecilImage,
        kecil_items: kecilItemsArray
      })
      .eq('id', 1);

    if (error) {
      setMessage(`Gagal: ${error.message}`);
    } else {
      setMessage('Menu berhasil diperbarui!');
      // Perbarui tampilan form agar langsung menampilkan URL hasil konversi
      setFormData(prev => ({
        ...prev,
        besar_image: finalBesarImage,
        kecil_image: finalKecilImage
      }));
    }
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin MBG</h1>
          <button onClick={() => supabase.auth.signOut()} className="text-red-600 font-medium">Logout</button>
        </div>
        
        {message && <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg font-medium">{message}</div>}

        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2 flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Nama SPPG</label>
              <input type="text" className="w-full border p-2 rounded" value={formData.sppg_name} onChange={e => setFormData({...formData, sppg_name: e.target.value})} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Tanggal Berlaku</label>
              <input type="text" className="w-full border p-2 rounded" value={formData.menu_date} onChange={e => setFormData({...formData, menu_date: e.target.value})} />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-bold mb-4 text-green-700">Porsi Besar</h3>
            <label className="block text-sm font-semibold mb-1">URL Gambar (Bisa paste link Google Drive)</label>
            <input type="text" className="w-full border p-2 rounded mb-4 focus:ring focus:ring-green-200" value={formData.besar_image} onChange={e => setFormData({...formData, besar_image: e.target.value})} />
            
            <label className="block text-sm font-semibold mb-1">Daftar Menu (Pisahkan dengan Enter)</label>
            <textarea rows="6" className="w-full border p-2 rounded focus:ring focus:ring-green-200" value={formData.besar_items} onChange={e => setFormData({...formData, besar_items: e.target.value})} />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-bold mb-4 text-green-700">Porsi Kecil</h3>
            <label className="block text-sm font-semibold mb-1">URL Gambar (Bisa paste link Google Drive)</label>
            <input type="text" className="w-full border p-2 rounded mb-4 focus:ring focus:ring-green-200" value={formData.kecil_image} onChange={e => setFormData({...formData, kecil_image: e.target.value})} />
            
            <label className="block text-sm font-semibold mb-1">Daftar Menu (Pisahkan dengan Enter)</label>
            <textarea rows="6" className="w-full border p-2 rounded focus:ring focus:ring-green-200" value={formData.kecil_items} onChange={e => setFormData({...formData, kecil_items: e.target.value})} />
          </div>

          <div className="col-span-1 md:col-span-2">
            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition shadow-md">
              {loading ? 'Menyimpan...' : 'Simpan Pembaruan Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}