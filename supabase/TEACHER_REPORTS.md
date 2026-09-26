# Mengaktifkan rekap guru

1. Buka proyek Supabase yang digunakan website, lalu **SQL Editor → New query**.
2. Salin seluruh isi `teacher_reports_setup.sql`, lalu klik **Run**.
3. Hasil terakhir harus menampilkan ID akun guru. Email pada bagian `INSERT INTO public.seatle_teachers` harus sama dengan akun Supabase Auth guru dan `VITE_TEACHER_EMAIL` website. Jika hasil kosong, periksa email tersebut dan jalankan ulang.
4. Masuk sebagai guru dan klik **Muat ulang**. Di perangkat murid, buka website agar rekap yang tertunda dapat tersinkron.

SQL ini membuat penyimpanan rekap baru dan akses baca khusus akun guru yang terdaftar. SQL tidak menghapus data siswa atau jawaban lama. Murid hanya dapat mengirim rekap; tidak diberi akses membaca rekap murid lain.

Rekap menampilkan jawaban terbaru per nama, kelas, dan bagian pembelajaran, bukan seluruh riwayat percobaan. Foto dokumentasi dan poster ikut disertakan. Jawaban yang belum terkirim disimpan di IndexedDB dan dicoba kirim lagi saat tersambung atau setiap 30 detik selama website terbuka.

Jawaban Peduli Lingkungan, Aksi Peduli, refleksi akhir, dan progres lama yang masih tersimpan di perangkat akan diimpor. Jawaban Mengenal Penyu dan Ancaman Penyu yang sebelumnya hanya berada di memori halaman tidak dapat dipulihkan setelah halaman ditutup; mulai versi ini keduanya disimpan.

Pengujian browser: fixture `artifacts/teacher-review.html` memakai murid contoh dan memalsukan permintaan rekap Supabase. Jalankan hanya dengan profil browser uji terpisah. Fixture tidak termasuk hasil build produksi.
