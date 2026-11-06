import React from 'react';
import { Clock } from 'lucide-react'; 

export default function MenuCard({ data, isKecil }) {
  const bgCard = isKecil 
    ? 'bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0]' 
    : 'bg-gradient-to-br from-[#fdfbf7] to-[#e7e1d5]'; 

  const namaPorsi = isKecil ? 'Porsi Kecil' : 'Porsi Besar';

  return (
    <div className={`relative w-full max-w-[420px] mx-auto ${bgCard} rounded-[40px] shadow-2xl p-7 font-sans overflow-hidden border border-white/60 flex flex-col h-[690px] transition-transform duration-300 hover:-translate-y-1`}>
      
      <div className="relative w-full h-[250px] mb-6 z-10 flex justify-center items-center flex-shrink-0 mt-2">
        <div className="absolute top-0 -left-2 w-8 h-8 bg-green-500/80 rounded-br-full rounded-tl-full -rotate-45 blur-[1px]"></div>
        <div className="absolute bottom-4 -right-2 w-6 h-6 bg-green-700/70 rounded-br-full rounded-tl-full rotate-45 blur-[1px]"></div>
        <div className="absolute top-1/2 -right-4 w-4 h-4 bg-green-400/80 rounded-full blur-[1px]"></div>
        
        <img 
          src={data.image} 
          alt={data.title} 
          className="w-full h-full object-contain rounded-[2rem] drop-shadow-xl mix-blend-multiply" 
        />
      </div>

      <div className="flex flex-col flex-grow">
          
          <div className="flex justify-between items-start gap-4 mb-4 z-20 min-h-[72px]">
            {/* Judul diambil dinamis dari data */}
            <h2 className="text-[26px] md:text-[28px] font-black text-[#1f1e1c] leading-tight tracking-tight">
              {data.title}
            </h2>
            <div className="flex items-center gap-1.5 text-gray-700 bg-white/50 backdrop-blur-sm px-3.5 py-2 rounded-full shadow-sm border border-white/60 flex-shrink-0 whitespace-nowrap mt-1">
              <Clock size={14} />
              <span className="text-[12px] font-bold">Maks 2 Jam</span>
            </div>
          </div>

          <div className="mb-5 z-20 min-h-[70px]">
            <p className="text-[#59554d] text-[14px] font-semibold leading-relaxed">
              {data.items.map(item => item.split('(')[0].trim()).join(', ')}. 
              Sajian sehat bergizi seimbang khusus untuk porsi harian.
            </p>
          </div>

          {/* Gizi diambil dinamis dari data */}
          <div className="flex flex-wrap gap-3 mb-4 z-20">
            <span className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl text-[14px] font-semibold text-[#334155] border border-white shadow-sm flex items-center gap-2">
              🥩 Protein {data.protein}
            </span>
            <span className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl text-[14px] font-semibold text-[#334155] border border-white shadow-sm flex items-center gap-2">
              🥑 Lemak {data.lemak}
            </span>
            <span className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl text-[14px] font-semibold text-[#334155] border border-white shadow-sm flex items-center gap-2">
              🍚 Karbohidrat {data.karbohidrat}
            </span>
            <span className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl text-[14px] font-semibold text-[#334155] border border-white shadow-sm flex items-center gap-2">
              🥦 Serat {data.serat}
            </span>
          </div>

          <div className="flex justify-between items-end mt-auto z-20 pt-5 border-t border-gray-300/30">
             <div>
                <p className="text-[13px] text-gray-500 font-bold mb-0.5">Total Energi</p>
                <p className="text-[26px] font-black text-[#1f1e1c] tracking-tight leading-none">
                  {/* Energi diambil dinamis dari data */}
                  {data.energi} <span className="text-[16px] text-gray-600 font-bold">kkal</span>
                </p>
             </div>
             
             <div className="bg-[#111111] text-white px-7 py-3 rounded-[24px] font-bold flex items-center justify-center shadow-xl cursor-pointer hover:bg-black transition-colors">
                <span className="text-[15px] tracking-wide">{namaPorsi}</span>
             </div>
          </div>

      </div>
    </div>
  );
}