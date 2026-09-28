import { importExistingReports, syncStudentReports } from './lib/studentReports';
import useScrollToTop from './lib/useScrollToTop';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import StudentLogin from './pages/StudentLogin';
import TeacherLogin from './pages/TeacherLogin';
import StudentDashboard from './pages/StudentDashboard';
import MengenalPenyu from './pages/MengenalPenyu';
import AncamanPenyu from './pages/AncamanPenyu';
import PeduliLingkungan from './pages/PeduliLingkungan';
import AksiPeduli from './pages/AksiPeduli';
import Gallery from './pages/Gallery';
import Refleksi from './pages/Refleksi';
import Glosarium from './pages/Glosarium';
import { clearStudentSession, restoreStudentSession } from './lib/studentSession';
import { isStudentDeleted } from './lib/studentDeletion';

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const student = restoreStudentSession();
    const hash = window.location.hash.slice(1);
    if (hash === 'teacher-dashboard') return 'teacher-login';
    if (!student) return hash === 'gallery' ? 'gallery' : 'home';
    return ['mengenal-penyu', 'ancaman-penyu', 'peduli-lingkungan', 'aksi-peduli', 'aksi-peduli/campaign', 'gallery', 'refleksi', 'glosarium', 'student-dashboard'].includes(hash) ? hash : 'student-dashboard';
  });

  const [verifiedPage, setVerifiedPage] = useState(null);
  const [accountError, setAccountError] = useState('');
  const studentPage = !['home', 'login', 'student-login', 'teacher-login', 'gallery'].includes(currentPage);

  useScrollToTop(currentPage);

  useEffect(() => {
    let active = true;
    async function checkAccount() {
      if (!studentPage) { setVerifiedPage(null); setAccountError(''); return; }
      const student = restoreStudentSession();
      if (!student) {
        if (active) setCurrentPage('student-login');
        return;
      }
      try {
        if (await isStudentDeleted(student.name, student.studentClass)) {
          if (!active) return;
          clearStudentSession();
          if (!currentPage.startsWith('teacher')) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
            setCurrentPage('student-login');
          }
        } else if (active) {
          setVerifiedPage(currentPage);
          setAccountError('');
        }
      } catch (error) {
        if (active) { setVerifiedPage(null); setAccountError(error.message); }
      }
    }
    void checkAccount();
    const timer = setInterval(checkAccount, 30000);
    window.addEventListener('online', checkAccount);
    window.addEventListener('focus', checkAccount);
    window.addEventListener('storage', checkAccount);
    return () => { active = false; clearInterval(timer); window.removeEventListener('online', checkAccount); window.removeEventListener('focus', checkAccount); window.removeEventListener('storage', checkAccount); };
  }, [currentPage, studentPage]);

  useEffect(() => {
    const sync = () => { void syncStudentReports().catch(() => {}); };
    void importExistingReports().then(sync).catch(() => {});
    const timer = setInterval(sync, 30000);
    window.addEventListener('online', sync);
    return () => { clearInterval(timer); window.removeEventListener('online', sync); };
  }, []);

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => { window.history.scrollRestoration = previous; };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'teacher-dashboard') { setCurrentPage('teacher-login'); return; }
      if (hash !== 'gallery' && !restoreStudentSession()) { setCurrentPage('login'); return; }
      if (hash === 'aksi-peduli' || hash === 'aksi-peduli/campaign' || hash === 'gallery' || hash === 'refleksi' || hash === 'glosarium') { setCurrentPage(hash); return; }
      if (hash === 'mengenal-penyu') {
        setCurrentPage('mengenal-penyu');
      } else if (hash === 'ancaman-penyu') {
        setCurrentPage('ancaman-penyu');
      } else if (hash === 'peduli-lingkungan') {
        setCurrentPage('peduli-lingkungan');
      } else if (hash === 'student-dashboard') {
        setCurrentPage('student-dashboard');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleStart = () => {
    setCurrentPage(restoreStudentSession() ? 'student-dashboard' : 'login');
  };

  const handleStudentExit = () => {
    clearStudentSession();
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    setCurrentPage('login');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  if (studentPage && verifiedPage !== currentPage) {
    return <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-sky-50 p-6 text-center text-sky-900"><p role={accountError ? 'alert' : 'status'}>{accountError || 'Memeriksa akun murid...'}</p>{accountError && <button type="button" onClick={() => window.location.reload()} className="rounded-full bg-sky-800 px-6 py-3 font-bold text-white">Coba lagi</button>}</main>;
  }

  if (currentPage === 'home') {
    return <Home onStart={handleStart} />;
  }

  if (currentPage === 'student-login') {
    return <StudentLogin onBack={handleBackToHome} onStudentSuccess={() => setCurrentPage('student-dashboard')} onTeacherSuccess={() => { window.location.hash = 'teacher-dashboard'; setCurrentPage('teacher-login'); }} />;
  }

  if (currentPage === 'teacher-login') {
    return <TeacherLogin onStudentSuccess={() => { window.location.hash = 'student-dashboard'; setCurrentPage('student-dashboard'); }} onBack={() => { window.history.replaceState(null, '', window.location.pathname + window.location.search); setCurrentPage('login'); }} />;
  }

  if (currentPage === 'student-dashboard') {
    return (
      <StudentDashboard 
        onExit={handleStudentExit}
        onSelectModule={(slug) => {
          if (slug === 'mengenal-penyu') {
            setCurrentPage('mengenal-penyu');
          } else if (slug === 'ancaman-penyu') {
            setCurrentPage('ancaman-penyu');
          } else if (slug === 'peduli-lingkungan') {
            setCurrentPage('peduli-lingkungan');
          } else if (slug === 'aksi-peduli') {
            setCurrentPage('aksi-peduli');
          }
        }} 
      />
    );
  }

  if (currentPage === 'mengenal-penyu') {
    return <MengenalPenyu onBack={() => setCurrentPage('student-dashboard')} />;
  }

  if (currentPage === 'ancaman-penyu') {
    return <AncamanPenyu onBack={() => setCurrentPage('student-dashboard')} />;
  }

  if (currentPage === 'peduli-lingkungan') {
    return <PeduliLingkungan onBack={() => setCurrentPage('student-dashboard')} />;
  }

  if (currentPage === 'glosarium') {
    return <Glosarium onBack={() => { window.location.hash = 'student-dashboard'; setCurrentPage('student-dashboard'); }} />;
  }

  if (currentPage === 'refleksi') {
    return <Refleksi onBack={() => { window.location.hash = 'student-dashboard'; setCurrentPage('student-dashboard'); }} />;
  }

  if (currentPage === 'gallery') {
    return <Gallery onBack={() => { window.location.hash = 'student-dashboard'; setCurrentPage('student-dashboard'); }} onCreate={() => { window.location.hash = 'aksi-peduli/campaign'; setCurrentPage('aksi-peduli/campaign'); }} />;
  }

  if (currentPage === 'aksi-peduli' || currentPage === 'aksi-peduli/campaign') {
    return <AksiPeduli key={currentPage} initialTab={currentPage === 'aksi-peduli/campaign' ? 'campaign' : 'journal'} onGallery={() => { window.location.hash = 'gallery'; setCurrentPage('gallery'); }} onBack={() => { window.location.hash = 'student-dashboard'; setCurrentPage('student-dashboard'); }} />;
  }

  return <Login onBack={handleBackToHome} onTeacherSuccess={() => { window.location.hash = 'teacher-dashboard'; setCurrentPage('teacher-login'); }} onStudentSuccess={() => setCurrentPage('student-dashboard')} />;
}
