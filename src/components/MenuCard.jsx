import React from 'react';
import { Info, Utensils } from 'lucide-react';

export default function MenuCard({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
      {/* Gambar Menu */}
      <div className="relative h-56 w-full">
        <img 
          src={data.image} 
          alt={data.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <span className="text-xs font-bold text-green-700 flex items-center gap-1">
            <Utensils size={14} />
            {data.calories}
          </span>
        </div>
      </div>

      {/* Konten Menu */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-gray-800 mb-3">{data.title}</h3>
        <p className="text-sm text-gray-500 mb-5 flex-grow">{data.description}</p>
        
        {/* Komposisi */}
        <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
          <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2 text-sm">
            <Info size={18} className="text-green-600" /> 
            Komposisi Menu Harian
          </h4>
          <ul className="grid grid-cols-1 gap-2">
            {data.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}