export const suspectedCauses = [
  'Sampah plastik', 'Penyu terlilit jaring atau tali pancing',
  'Penyu tertabrak kapal yang melintas', 'Laut yang tercemar',
  'Penyu mengalami penyakit atau cedera', 'Air laut terlalu dingin',
  'Kehabisan tenaga setelah berenang jauh', 'Mengikuti sekumpulan ikan',
  'Mencari tempat beristirahat', 'Ombak sedang besar',
];

export const causes = [
  { title: 'Sampah plastik di laut', effect: 1, explanation: 'Kantong plastik sering dikira ubur-ubur sehingga dapat tertelan oleh penyu.' },
  { title: 'Jaring atau tali pancing', effect: 0, explanation: 'Jaring atau tali pancing dapat melilit tubuh penyu sehingga sulit berenang.' },
  { title: 'Tabrakan kapal', effect: 2, explanation: 'Benturan kapal dapat menyebabkan luka serius pada penyu.' },
  { title: 'Pencemaran laut', effect: 3, explanation: 'Laut yang tercemar dapat merusak habitat dan mengurangi sumber makanan penyu.' },
  { title: 'Penyakit atau cedera', effect: 4, explanation: 'Penyu yang sakit atau terluka dapat menjadi lemah dan akhirnya terdampar.' },
];

export const effects = [
  'Penyu sulit berenang sehingga mudah terdampar.',
  'Penyu mengira plastik adalah ubur-ubur lalu memakannya.',
  'Tubuh penyu terluka atau mengalami patah tempurung.',
  'Habitat penyu rusak sehingga sumber makanan berkurang.',
  'Penyu menjadi lemah dan tidak mampu kembali ke laut.',
];

export const actionQuestions = [
  {
    title: 'Menemukan penyu terdampar',
    question: 'Saat berwisata ke pantai, kamu menemukan seekor penyu laut yang terdampar. Penyu masih hidup, tetapi tampak lemah dan sulit bergerak. Apa tindakan pertama yang paling tepat dilakukan?',
    options: [
      'Mengangkat penyu ke tempat yang teduh, kemudian segera menghubungi instansi yang berwenang agar penyu mendapatkan penanganan yang sesuai.',
      'Mengajak beberapa teman mendorong penyu kembali ke laut agar penyu dapat segera berenang dan tidak terlalu lama berada di pantai.',
      'Memindahkan penyu ke tempat yang lebih jauh dari ombak sambil menunggu hingga penyu dapat bergerak sendiri.',
      'Membawa penyu ke rumah untuk dirawat terlebih dahulu, kemudian mengembalikannya ke laut setelah kondisinya terlihat lebih baik.',
    ],
    explanation: 'Melaporkan kepada instansi berwenang merupakan tindakan yang paling tepat. Petugas memiliki pengetahuan dan peralatan yang diperlukan untuk menangani penyu dengan aman.',
  },
  {
    title: 'Penyu sedang bertelur',
    question: 'Pada malam hari, kamu melihat seekor penyu sedang bertelur di pantai. Apa tindakan yang paling tepat?',
    options: [
      'Menjaga jarak agar penyu tidak terganggu, mengingatkan orang lain untuk tidak mendekat, dan menghapus jejak penyu saat naik dan kembali ke laut.',
      'Mendekati penyu secara perlahan agar dapat mengambil foto tanpa menggunakan lampu kilat agar penyu tetap terlihat tenang.',
      'Membantu memindahkan beberapa telur ke tempat yang dianggap lebih aman agar telur tidak terkena ombak saat air pasang.',
      'Menunggu hingga penyu selesai bertelur, kemudian mengambil beberapa telur untuk diamankan agar tidak dimakan hewan lain.',
    ],
    explanation: 'Penyu yang sedang bertelur membutuhkan suasana yang tenang. Menjaga jarak membantu penyu menyelesaikan proses bertelur tanpa gangguan.',
  },
  {
    title: 'Plastik di tepi pantai',
    question: 'Ketika bermain di pantai, temanmu hendak membuang kantong plastik ke laut karena menganggap sampah tersebut akan terbawa ombak. Apa tindakan yang paling tepat?',
    options: [
      'Mengingatkan teman agar membuang sampah pada tempatnya, lalu bersama-sama membersihkan sampah di sekitar pantai.',
      'Meminta teman membuang plastik sedikit lebih jauh dari bibir pantai agar tidak terlihat oleh pengunjung yang sedang berada di sekitar pantai.',
      'Membiarkan teman membuang sampah tersebut karena ombak diperkirakan akan membawa plastik ke laut lepas sehingga tidak mengganggu pantai.',
      'Mengambil plastik tersebut, kemudian menguburnya di pasir pantai agar tidak lagi terlihat oleh orang lain.',
    ],
    explanation: 'Mengurangi sampah plastik merupakan salah satu cara sederhana untuk melindungi penyu laut dari bahaya tertelan plastik.',
  },
  {
    title: 'Jaring yang tertinggal',
    question: 'Saat berjalan di pantai, kamu menemukan jaring bekas yang tersangkut di bebatuan dekat laut. Apa tindakan yang paling tepat dilakukan?',
    options: [
      'Melaporkan keberadaan jaring kepada petugas atau membersihkannya bersama orang dewasa jika aman dilakukan agar tidak membahayakan penyu dan hewan laut lainnya.',
      'Memindahkan jaring ke tempat yang lebih dekat dengan air laut agar tidak mengganggu pengunjung yang sedang berada di pantai.',
      'Membiarkan jaring tetap berada di tempatnya karena jaring tersebut kemungkinan masih akan digunakan oleh nelayan.',
      'Menyembunyikan jaring di balik bebatuan agar tidak terlihat oleh wisatawan yang sedang berkunjung ke pantai.',
    ],
    explanation: 'Jaring bekas dapat melilit penyu dan hewan laut lainnya. Membersihkannya dengan aman atau melaporkannya kepada petugas merupakan tindakan yang tepat.',
  },
  {
    title: 'Bergerak bersama sekolah',
    question: 'Sekolahmu akan mengadakan kegiatan peduli lingkungan sebagai bentuk dukungan terhadap konservasi penyu laut. Kegiatan manakah yang memberikan manfaat paling besar bagi kelestarian penyu?',
    options: [
      'Mengadakan aksi bersih pantai, mengurangi penggunaan plastik sekali pakai, serta mengajak warga menjaga kebersihan pantai.',
      'Membagikan hiasan berbentuk penyu kepada seluruh siswa agar mereka lebih mengenal berbagai jenis penyu yang ada di Indonesia.',
      'Mengadakan lomba membuat miniatur penyu dari berbagai bahan bekas sebagai bentuk kepedulian terhadap lingkungan laut.',
      'Mengumpulkan cangkang hewan laut yang ditemukan di pantai untuk dijadikan hiasan di lingkungan sekolah.',
    ],
    explanation: 'Membersihkan pantai dan mengurangi penggunaan plastik membantu menjaga habitat penyu tetap bersih dan aman.',
  },
];

export function createEffectOrder() {
  // Choose uniformly from arrangements without answers beside their causes.
  const arrangements = [];
  function visit(order, remaining) {
    if (!remaining.length) { arrangements.push(order); return; }
    remaining.forEach((effect) => {
      if (effect !== causes[order.length].effect) {
        visit([...order, effect], remaining.filter((item) => item !== effect));
      }
    });
  }
  visit([], effects.map((_, index) => index));
  return arrangements[Math.floor(Math.random() * arrangements.length)];
}
