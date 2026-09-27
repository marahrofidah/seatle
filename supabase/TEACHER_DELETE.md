# Mengaktifkan hapus murid

Jalankan `teacher_delete_student.sql` sekali di SQL Editor proyek Supabase yang sama, setelah `teacher_reports_setup.sql`. Setup ini tidak menghapus murid. Tombol **Hapus data murid** baru menjalankan penghapusan setelah guru mengonfirmasi.

- RPC memeriksa `auth.uid()` terhadap `seatle_teachers`, bukan sekadar status login di browser.
- Satu transaksi menghapus seluruh baris `students` dan riwayat `student_learning_reports` dengan pasangan nama–kelas yang sama (huruf besar/kecil dan spasi dinormalisasi).
- Catatan identitas terhapus mencegah pendaftaran dan unggahan jawaban lama menghidupkan kembali rekap. Nama–kelas itu diblokir sampai pengelola menghapus catatan terkait di `seatle_deleted_students` secara sengaja.
- Sesi murid diperiksa ketika halaman berubah, koneksi kembali, dan setiap 30 detik. Perangkat offline baru mengetahui penghapusan saat terhubung lagi. Data lokal tidak bisa dihapus dari browser lain yang belum terhubung.
- Poster publik tidak dihapus: tabel `posters` lama tidak memiliki identitas pemilik dan kelas yang dapat diandalkan. Jangan menebak kepemilikan berdasarkan nama penulis.
- `students` merupakan daftar murid berbasis nama–kelas, bukan akun Supabase Auth. Akun guru di Auth tidak disentuh.

Verifikasi pada proyek uji: guru dapat menghapus murid uji, murid kelas lain tetap ada, retry penghapusan aman, anon/guru yang belum terdaftar ditolak, dan insert laporan untuk identitas terhapus ditolak dengan `SEATLE_STUDENT_DELETED`.
