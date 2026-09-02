import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Heart, ExternalLink, Filter, Sparkles } from 'lucide-react';
import { fetchUserData } from '../lib/supabase';

export default function Gallery({ setActivePage }) {
  const [activeFilter, setActiveFilter] = useState('semua');
  const [posters, setPosters] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [likes, setLikes] = useState({});

  useEffect(() => {
    loadGalleryData();
  }, []);

  const loadGalleryData = async () => {
    const pData = await fetchUserData('posters');
    const cData = await fetchUserData('challenge_logs');

    // Default mock data jika belum ada yang upload
    const defaultPosters = [
      {
        id: 'p1',
        title: 'Jaga Lautan, Selamatkan Penyu Kita',
        authors: 'Siti Rahma & Budi Santoso',
        canva_url: 'https://canva.com',
        image_url: 'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?w=600&auto=format&fit=crop&q=80',
        type: 'poster'
      },
      {
        id: 'p2',
        title: 'Bebaskan Penyu dari Plastik!',
        authors: 'Andi Wijaya & Rina Putri',
        canva_url: 'https://canva.com',
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80',
        type: 'poster'
      }
    ];

    const defaultChallenges = [
      {
        id: 'c1',
        day: 1,
        action: 'Membawa botol minum sendiri',
        caption: 'Meminta minuman tanpa sedotan plastik saat di kantin sekolah',
        photo: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?w=600&auto=format&fit=crop&q=80',
        type: 'challenge'
      }
    ];

    setPosters(pData && pData.length > 0 ? pData.map(d => ({ ...d, type: 'poster' })) : defaultPosters);
    setChallenges(cData && cData.length > 0 ? cData.map(d => ({ ...d, type: 'challenge' })) : defaultChallenges);
  };

  const handleToggleLike = (id) => {
    setLikes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const combinedItems = [
    ...(activeFilter === 'semua' || activeFilter === 'poster' ? posters : []),
    ...(activeFilter === 'semua' || activeFilter === 'challenge' ? challenges : [])
  ];

  return (
    <div className="space-y-12 py-4">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-950 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider">
          <ImageIcon className="w-4 h-4 text-teal-400" />
          Modul 8: Gallery Sahabat Penyu
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Pameran Karya & Dokumentasi</h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Lihat kumpulan poster digital Canva dan aksi nyata dokumentasi 7 hari dari para Sahabat Penyu.
        </p>
      </div>

      {/* FILTER BUTTONS & ACTION BUTTON */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-cyan-500/20">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400 ml-2" />
          {[
            { id: 'semua', label: 'Semua Karya' },
            { id: 'poster', label: 'Poster Digital Canva' },
            { id: 'challenge', label: 'Dokumentasi 7 Hari' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === f.id
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setActivePage('perilaku')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:scale-105 transition-all shadow-md flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Upload Karyamu Sekarang</span>
        </button>
      </div>

      {/* GALLERY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {combinedItems.map((item, idx) => {
          const itemId = item.id || idx;
          const isLiked = likes[itemId];
          const isPoster = item.type === 'poster';

          return (
            <div key={itemId} className="glass-card glass-card-hover rounded-2xl p-5 border border-cyan-500/20 space-y-4 flex flex-col justify-between">
              
              <div className="space-y-3">
                <div className="relative h-56 rounded-xl overflow-hidden bg-slate-950 group">
                  <img
                    src={isPoster ? item.image_url : item.photo}
                    alt={isPoster ? item.title : item.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold border ${
                    isPoster 
                      ? 'bg-purple-950/90 text-purple-300 border-purple-500/40' 
                      : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {isPoster ? '🎨 Poster Canva' : `📸 Hari Ke-${item.day}`}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isPoster ? item.title : item.action}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 font-medium italic">
                    {isPoster ? `Karya: ${item.authors}` : `"${item.caption}"`}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleToggleLike(itemId)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                    isLiked 
                      ? 'bg-rose-950 border-rose-500 text-rose-300 font-bold' 
                      : 'bg-slate-900 border-white/10 text-slate-400 hover:text-rose-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                  <span>{isLiked ? 'Disukai' : 'Suka'}</span>
                </button>

                {isPoster && item.canva_url && (
                  <a
                    href={item.canva_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:text-cyan-200 text-xs font-semibold flex items-center gap-1"
                  >
                    <span>Buka Canva</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
