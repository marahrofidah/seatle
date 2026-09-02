import React, { useState } from 'react';
import { 
  Waves, 
  Target, 
  BookOpen, 
  AlertTriangle, 
  Heart, 
  Award, 
  Sparkles, 
  BookMarked, 
  Image as ImageIcon,
  Menu,
  X,
  Home
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Utama', icon: Home },
    { id: 'tujuan', label: 'Tujuan', icon: Target },
    { id: 'pengetahuan', label: 'Mengenal Penyu', icon: BookOpen },
    { id: 'keterampilan', label: 'Ancaman Penyu', icon: AlertTriangle },
    { id: 'sikap', label: 'Peduli Lingkungan', icon: Heart },
    { id: 'perilaku', label: 'Aksi Peduli', icon: Award },
    { id: 'refleksi', label: 'Refleksi', icon: Sparkles },
    { id: 'glosarium', label: 'Glosarium', icon: BookMarked },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-cyan-500/20 shadow-xl shadow-cyan-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand SEATLE */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Waves className="w-7 h-7 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                SEATLE
              </span>
              <p className="text-[10px] text-cyan-300/80 font-medium tracking-wide uppercase">
                Learn with Sea Turtle, Care for the Ocean
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-white/5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold scale-[1.02]'
                      : 'text-slate-300 hover:text-cyan-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-800/80 border border-cyan-500/30 text-cyan-400 hover:text-cyan-200 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden glass-panel border-t border-cyan-500/20 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold'
                      : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
