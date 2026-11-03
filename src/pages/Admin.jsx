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
        besar_items: data.besar_items.join('\n'), // Gabungkan array jadi string per baris
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Menyimpan pembaruan...');
    
    // Ubah string multiline kembali menjadi array JSON
    const besarItemsArray = formData.besar_items.split('\n').filter(item => item.trim() !== '');
    const kecilItemsArray = formData.kecil_items.split('\n').filter(item => item.trim() !== '');

    const { error } = await supabase
      .from('mbg_menu')
      .update({
        sppg_name: formData.sppg_name,
        menu_date: formData.menu_date,
        besar_image: formData.besar_image,
        besar_items: besarItemsArray,
        kecil_image: formData.kecil_image,
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin MBG</h1>
          <button onClick={() => supabase.auth.signOut()} className="text-red-600 font-medium">Logout</button>
        </div>
        
        {message && <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg">{message}</div>}

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
            <label className="block text-sm font-semibold mb-1">URL Gambar</label>
            <input type="text" className="w-full border p-2 rounded mb-4" value={formData.besar_image} onChange={e => setFormData({...formData, besar_image: e.target.value})} />
            
            <label className="block text-sm font-semibold mb-1">Daftar Menu (Pisahkan dengan Enter)</label>
            <textarea rows="6" className="w-full border p-2 rounded" value={formData.besar_items} onChange={e => setFormData({...formData, besar_items: e.target.value})} />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-bold mb-4 text-green-700">Porsi Kecil</h3>
            <label className="block text-sm font-semibold mb-1">URL Gambar</label>
            <input type="text" className="w-full border p-2 rounded mb-4" value={formData.kecil_image} onChange={e => setFormData({...formData, kecil_image: e.target.value})} />
            
            <label className="block text-sm font-semibold mb-1">Daftar Menu (Pisahkan dengan Enter)</label>
            <textarea rows="6" className="w-full border p-2 rounded" value={formData.kecil_items} onChange={e => setFormData({...formData, kecil_items: e.target.value})} />
          </div>

          <div className="col-span-1 md:col-span-2">
            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition">
              {loading ? 'Menyimpan...' : 'Simpan Pembaruan Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}