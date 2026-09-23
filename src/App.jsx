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

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.slice(1);
    return ['mengenal-penyu', 'ancaman-penyu', 'peduli-lingkungan', 'aksi-peduli', 'gallery', 'student-dashboard'].includes(hash) ? hash : 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'aksi-peduli' || hash === 'gallery') { setCurrentPage(hash); return; }
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
        onExit={() => setCurrentPage('login')} 
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

  if (currentPage === 'aksi-peduli' || currentPage === 'gallery') {
    return <AksiPeduli key={currentPage} initialTab={currentPage === 'gallery' ? 'gallery' : 'journal'} onBack={() => { window.location.hash = 'student-dashboard'; setCurrentPage('student-dashboard'); }} />;
  }

  return <Login onBack={handleBackToHome} onTeacherSuccess={() => setCurrentPage('teacher-login')} onStudentSuccess={() => setCurrentPage('student-dashboard')} />;
}
