import { ArrowLeft } from 'lucide-react';
import BubbleEffects from '../components/BubbleEffects';
import background from '../assets/images/tanpa_penyu.webp';
import hijau from '../assets/images/penyu_hijau.webp';
import sisik from '../assets/images/penyu_sisik.webp';
import belimbing from '../assets/images/penyu_belimbing.webp';
import lekang from '../assets/images/penyu_lekang.webp';
import tempayan from '../assets/images/penyu_tempayan.webp';
import pipih from '../assets/images/penyu_pipih.webp';
import './Refleksi.css';
import './Glosarium.css';

const terms = [
  ['Penyu Laut', 'Reptil yang hidup di laut dan berkembang biak dengan bertelur di pantai.'],
  ['Tukik', 'Anak penyu yang baru menetas dari telur.'],
  ['Karapas', 'Cangkang bagian atas penyu yang melindungi tubuhnya.'],
  ['Plastron', 'Cangkang bagian bawah penyu.'],
  ['Lamun', 'Tumbuhan berbunga yang hidup di dasar laut sebagai tempat mencari makan penyu hijau.'],
  ['Terumbu Karang', 'Kumpulan karang yang menjadi habitat berbagai hewan laut.'],
  ['Habitat', 'Tempat hidup suatu makhluk hidup.'],
  ['Ekosistem', 'Hubungan antara makhluk hidup dengan lingkungan di sekitarnya.'],
  ['Konservasi', 'Upaya melindungi dan melestarikan makhluk hidup serta lingkungannya.'],
  ['Terdampar', 'Kondisi ketika penyu berada di pantai atau daratan dan tidak dapat kembali ke laut dengan normal.'],
  ['Ghost Fishing', 'Jaring atau alat tangkap yang ditinggalkan di laut tetapi masih dapat menangkap hewan laut.'],
  ['Migrasi', 'Perpindahan penyu dari satu tempat ke tempat lain untuk mencari makan atau bertelur.'],
];
const turtles = [
  ['Penyu Hijau', hijau], ['Penyu Sisik', sisik], ['Penyu Belimbing', belimbing],
  ['Penyu Lekang', lekang], ['Penyu Tempayan', tempayan], ['Penyu Pipih', pipih],
];

export default function Glosarium({ onBack }) {
  return <main className="website-reflection glossary-page page-background" style={{ '--page-background': `url(${background})` }}>
    <BubbleEffects />
    <svg className="absolute h-0 w-0" aria-hidden="true"><defs><clipPath id="glossary-wavy-card" clipPathUnits="objectBoundingBox"><path d="M .03,.04 C .12,.005 .25,.03 .38,.01 C .51,-0.01 .64,.035 .77,.01 C .88,.005 .96,.025 .985,.07 C .995,.18 .975,.32 .99,.45 C 1.005,.58 .98,.72 .985,.85 C .975,.93 .93,.985 .84,.98 C .72,.995 .59,.965 .46,.99 C .33,.97 .21,.995 .09,.97 C .03,.96 .005,.915 .01,.82 C .02,.69 -.005,.55 .01,.42 C .025,.29 -.005,.16 .01,.08 C .015,.05 .025,.04 .03,.04 Z" /></clipPath></defs></svg>
    <div className="reflection-container">
      <button className="reflection-back" onClick={onBack}><ArrowLeft size={18} />Kembali ke halaman utama</button>
      <section className="reflection-sheet glossary-sheet" aria-labelledby="glossary-title">
        <header className="reflection-heading"><h1 id="glossary-title">GLOSARIUM</h1><p>Istilah tentang penyu laut dan lingkungan hidupnya.</p></header>
        <table className="glossary-table">
          <caption className="sr-only">Istilah dan arti tentang penyu laut</caption>
          <thead><tr><th scope="col">Istilah</th><th scope="col">Arti</th></tr></thead>
          <tbody>{terms.map(([term, meaning]) => <tr key={term}><th scope="row">{term}</th><td>{meaning}</td></tr>)}</tbody>
        </table>
      </section>
      <section className="reflection-sheet glossary-sheet glossary-turtles" aria-labelledby="glossary-turtles-title">
        <header className="reflection-heading"><span className="reflection-eyebrow">SAHABAT LAUT KITA</span><h2 id="glossary-turtles-title">Kenali rupa penyu</h2></header>
        <div className="glossary-turtle-grid">{turtles.map(([name, image]) => <figure key={name}><img src={image} alt={name} loading="lazy" width="240" height="180" /><figcaption>{name}</figcaption></figure>)}</div>
      </section>
    </div>
  </main>;
}
