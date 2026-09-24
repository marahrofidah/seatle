import { Check, Camera } from 'lucide-react';
import turtle from '../assets/images/senang_ingin_membantu.png';
import { challenges } from '../lib/actionJournal';
import tanpaSedotan from '../assets/images/tanpa_sedotan.png';
import botolMinum from '../assets/images/botol_minum.png';
import tasKain from '../assets/images/tas_kain.png';
import tempatSampah from '../assets/images/tempat_sampah.png';
import kurangiPlastik from '../assets/images/kurangi_plastik.png';
import pilahSampah from '../assets/images/pilah_sampah.png';
import bersihRumah from '../assets/images/bersih_rumah.png';

const objects = [
  { name: 'Tanpa sedotan', image: tanpaSedotan, x: 15, y: 49 },
  { name: 'Botol minum', image: botolMinum, x: 31, y: 58 },
  { name: 'Tas kain', image: tasKain, x: 48, y: 48 },
  { name: 'Tempat sampah', image: tempatSampah, x: 66, y: 58 },
  { name: 'Kurangi plastik', image: kurangiPlastik, x: 81, y: 47 },
  { name: 'Pilah sampah', image: pilahSampah, x: 21, y: 75 },
  { name: 'Bersih rumah', image: bersihRumah, x: 77, y: 75 },
];

function Palm({ x, y, scale = 1 }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><path d="M0 150 Q35 80 12 0" fill="none" stroke="#94704a" strokeWidth="17" /><path d="M3 112l18 4M10 85l16 3M13 54l13 1" stroke="#be9869" strokeWidth="4" /><path d="M12 0Q-60-65-105 0Q-35-20 12 0M12 0Q-40-100-72-90Q-35-30 12 0M12 0Q45-98 92-60Q40-40 12 0M12 0Q100-40 119 27Q60-8 12 0M12 0Q-50 0-53 62Q-20 17 12 0M12 0Q65-4 62 61Q32 17 12 0" fill="#3e8b66" stroke="#307355" strokeWidth="2" /><circle cx="8" cy="6" r="10" fill="#84613c" /><circle cx="23" cy="8" r="8" fill="#a47948" /></g>;
}

function Hut({ gallery = false }) {
  return <svg viewBox="0 0 180 145" aria-hidden="true"><ellipse cx="90" cy="135" rx="75" ry="8" fill="#71583525" /><path d="M35 66H145V124H35Z" fill={gallery ? '#507c71' : '#cb965c'} stroke="#7a633f" strokeWidth="3" /><path d="M42 124V139M137 124V139" stroke="#826344" strokeWidth="7" />{gallery ? <><path d="M48 77H78V113H48Z" fill="#fff4d9" /><path d="M89 75H131V113H89Z" fill="#d5e7cd" /><path d="M54 103L62 87L73 103M95 104L108 83L124 104" fill="#60a0a0" /><circle cx="119" cy="84" r="4" fill="#eabf58" /></> : <><path d="M70 82H111V126H70Z" fill="#735d46" /><path d="M41 76H61V99H41Z" fill="#b5dce0" /><path d="M120 76H137V99H120Z" fill="#b5dce0" /></>}<path d="M14 68L88 13L167 68Z" fill="#cba260" stroke="#8c7245" strokeWidth="3" /><path d="M30 64L89 23L151 64M49 65L89 34L132 65M69 66L89 46L113 66" fill="none" stroke="#e9c283" strokeWidth="5" /><path d="M15 68H168" stroke="#896744" strokeWidth="6" strokeLinecap="round" /></svg>;
}

export default function ActionIsland({ data, busy, onChallenge, onDay, onNavigate }) {
  const count = Object.keys(data.days).length;
  const nextDay = Array.from({ length: 7 }, (_, i) => i + 1).find(i => !data.days[i]) || 7;
  return <section className="island-experience" aria-label="Pulau Aksi Penyu interaktif">
    <div className="island-scene">
      <div className="island-location"><h2>Pulau Penyu</h2><p>{count === 7 ? 'Lihat, pantainya kembali bersih!' : 'Satu aksi darimu, satu harapan untuk laut.'}</p></div>
      <div className="island-object-instruction">① Pilih benda untuk menentukan tantanganmu</div>
      <div className="island-stage">
      <svg className="island-landscape" viewBox="0 0 1100 740" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="island-sea" x2="0" y2="1"><stop stopColor="#a6dee4" /><stop offset="1" stopColor="#399eaf" /></linearGradient><linearGradient id="island-sand" x2="0.5" y2="1"><stop stopColor="#fff1c7" /><stop offset="1" stopColor="#ebd29a" /></linearGradient></defs><rect width="1100" height="740" fill="url(#island-sea)" /><path d="M-50 100Q220 65 430 108T1150 92M-50 157Q170 126 405 163T1150 148M-50 673Q210 644 440 682T1150 660M-50 711Q240 680 470 715T1150 700" fill="none" stroke="#e4ffff60" strokeWidth="3" /><ellipse cx="548" cy="427" rx="507" ry="278" fill="#c4ede5" /><path d="M86 402C70 240 251 155 473 169C633 97 976 224 1012 390C1080 553 858 657 602 641C388 697 114 597 86 402Z" fill="#fff9e5" /><path d="M104 397C94 250 255 170 476 187C641 119 958 239 991 392C1056 540 850 641 603 623C389 679 127 584 104 397Z" fill="url(#island-sand)" /><path d="M173 326C160 254 307 190 477 208C647 152 870 248 917 322C724 287 667 332 521 303C377 328 309 280 173 326Z" fill="#91b984" /><path d="M193 303C269 210 397 237 475 224C616 179 790 260 879 293C699 263 662 310 517 287C385 305 313 267 193 303Z" fill="#b4cf95" /><g fill="#c4a96d" opacity=".45"><ellipse cx="342" cy="472" rx="4" ry="2" /><ellipse cx="450" cy="564" rx="3" ry="2" /><ellipse cx="614" cy="420" rx="4" ry="2" /><ellipse cx="816" cy="476" rx="4" ry="2" /><ellipse cx="305" cy="602" rx="3" ry="2" /></g><Palm x={150} y={178} scale={.85} /><Palm x={924} y={190} scale={.72} /><Palm x={860} y={204} scale={.5} /><path d="M445 553Q485 600 564 646" stroke="#b49d6d" strokeWidth="3" strokeDasharray="2 12" fill="none" /><g fill="#fff" opacity=".8"><path d="M48 46q10-12 20 0q10-12 20 0q-10-6-20 4q-10-10-20-4M918 91q8-10 16 0q8-10 16 0q-8-5-16 3q-8-8-16-3" /></g></svg>
      <svg className="island-landscape-mobile" viewBox="0 0 400 820" aria-hidden="true">
        <rect width="400" height="820" fill="url(#island-sea)" />
        <g fill="none" stroke="#e4ffff60" strokeWidth="2">
          <path d="M-20 55Q100 20 210 55T420 45M-20 90Q120 60 230 90T420 75M-20 745Q100 715 230 745T420 730M-20 780Q120 750 240 780T420 765" />
        </g>
        <path d="M25 395C18 235 70 128 200 125C330 128 382 235 375 395C383 585 326 732 200 740C74 732 17 585 25 395Z" fill="#c4ede5" />
        <path d="M36 387C30 240 80 139 200 137C320 139 370 240 364 387C370 571 316 700 200 712C84 700 30 571 36 387Z" fill="#fff9e5" />
        <path d="M49 390C43 250 86 153 200 150C314 153 357 250 351 390C357 557 306 685 200 695C94 685 43 557 49 390Z" fill="url(#island-sand)" />
        <path d="M62 278C71 191 118 171 200 172C282 171 329 191 338 278Q277 263 223 282Q168 297 125 275Q90 265 62 278Z" fill="#91b984" />
        <path d="M77 253Q104 187 200 188Q296 187 323 253Q273 241 222 260Q170 275 126 253Q100 244 77 253Z" fill="#b4cf95" />
        <Palm x={48} y={165} scale={.38} />
        <Palm x={351} y={176} scale={.34} />
        <path d="M175 616Q195 659 213 701" fill="none" stroke="#b49d6d" strokeWidth="2" strokeDasharray="2 10" />
      </svg>
      <button className="island-building island-hut" onClick={() => onNavigate('campaign')}><Hut /><span>Pondok kreativitas</span></button>
      <button className="island-building island-board" onClick={() => onNavigate('gallery')}><Hut gallery /><span>Papan kampanye</span></button>
      <div className="island-objects" role="group" aria-label="Pilih satu tantangan untuk tujuh hari">{objects.map((object, index) => <button key={object.name} className={`island-object ${data.challenge === challenges[index][1] ? 'is-selected' : ''}`} style={{ '--object-x': `${object.x}%`, '--object-y': `${object.y}%` }} disabled={busy || (count > 0 && data.challenge !== challenges[index][1])} aria-pressed={data.challenge === challenges[index][1]} aria-label={challenges[index][1]} onClick={() => onChallenge(challenges[index][1])}><span className="island-object-art" aria-hidden="true"><img src={object.image} alt="" draggable={false} /></span><span className="island-object-name">{object.name}{data.challenge === challenges[index][1] && <Check size={12} />}</span></button>)}</div>
      <div className="island-litter" aria-hidden="true">{[[39,74,'🥤'],[52,69,'🧴'],[58,79,'🥡'],[35,85,'🥤'],[64,87,'🧴'],[44,91,'🥡'],[71,91,'🥤']].map(([x,y,icon],i) => <span key={i} className={i < count ? 'is-cleaned' : ''} style={{ left: `${x}%`, top: `${y}%`, rotate: `${i * 37 - 30}deg` }}>{icon}</span>)}</div>
      <div className={`island-turtle ${count === 7 ? 'is-swimming' : ''}`} style={{ '--turtle-x': `${43 + count * 2.2}%`, '--turtle-y': `${72 + count * 2.7}%` }}><img src={turtle} alt={count === 7 ? 'Penyu sudah mencapai laut yang bersih' : 'Penyu bergerak menuju laut seiring aksi yang kamu simpan'} /><span>{count === 7 ? 'Terima kasih, sahabat!' : count ? 'Pantainya makin bersih!' : 'Bantu jaga rumahku, yuk!'}</span></div>
      </div>
      <div className="island-clean-meter" role="progressbar" aria-label="Progres tantangan tujuh hari" aria-valuemin={0} aria-valuemax={7} aria-valuenow={count}><span><strong>{count}/7</strong> aksi tersimpan</span><div>{Array.from({ length: 7 }, (_, i) => <i key={i} className={i < count ? 'is-filled' : ''} />)}</div></div>
    </div>
    <div className="island-action-dock"><div className="island-current-action"><span>TANTANGAN PILIHANMU</span><h3>{data.challenge || 'Mulai dari benda pilihanmu di pantai.'}</h3><p>{count ? 'Lanjutkan aksi yang sama setiap hari. Pantai berubah setelah dokumentasimu tersimpan.' : 'Pilih satu aksi yang paling sering kamu lakukan, lalu dokumentasikan selama 7 hari.'}</p></div><button className="action-primary" disabled={!data.challenge || busy} onClick={() => onDay(nextDay)}><Camera size={18} />{count === 7 ? 'Lihat dokumentasiku' : `Dokumentasi hari ke-${nextDay}`}</button></div>
    <div className="island-days">
      <div className="island-days-heading">
        <div><span>JEJAK AKSIMU</span><h3>Satu hari, satu aksi baik.</h3></div>
        <span className="island-days-count">{count} dari 7 selesai</span>
      </div>
      <nav aria-label="Dokumentasi tujuh hari">
        {Array.from({ length: 7 }, (_, i) => i + 1).map(day => {
          const entry = data.days[day];
          const isNext = !entry && day === nextDay;
          return <button key={day} type="button" disabled={busy} onClick={() => onDay(day)} aria-current={isNext ? 'step' : undefined} aria-label={`Dokumentasi hari ${day}${entry ? ', tersimpan' : isNext ? ', berikutnya' : ''}`} className={entry ? 'is-done' : isNext ? 'is-next' : ''}>
            {entry && <img src={entry.photo} alt="" />}
            <span className="island-day-number">{entry ? <Check size={18} /> : isNext ? <Camera size={20} /> : String(day).padStart(2, '0')}</span>
            <span className="island-day-label">Hari {day}</span>
            <span className="island-day-status">{entry ? 'Tersimpan' : isNext ? 'Berikutnya' : 'Belum diisi'}</span>
          </button>;
        })}
      </nav>
    </div>
    <p className="island-footnote">Lakukan aksi nyata, lalu ceritakan lewat foto dan caption. Setiap aksi membuat ilustrasi pantaimu semakin bersih.</p>
  </section>;
}
