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

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const student = restoreStudentSession();
    const hash = window.location.hash.slice(1);
    if (!student) return hash === 'gallery' ? 'gallery' : 'home';
    return ['mengenal-penyu', 'ancaman-penyu', 'peduli-lingkungan', 'aksi-peduli', 'aksi-peduli/campaign', 'gallery', 'refleksi', 'glosarium', 'student-dashboard'].includes(hash) ? hash : 'student-dashboard';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
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

  if (currentPage === 'home') {
    return <Home onStart={handleStart} />;
  }

  if (currentPage === 'student-login') {
    return <StudentLogin onBack={() => setCurrentPage('login')} />;
  }

  if (currentPage === 'teacher-login') {
    return <TeacherLogin onBack={() => setCurrentPage('login')} />;
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

  return <Login onBack={handleBackToHome} onTeacherSuccess={() => setCurrentPage('teacher-login')} onStudentSuccess={() => setCurrentPage('student-dashboard')} />;
}
