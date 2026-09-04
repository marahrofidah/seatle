import { useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import StudentLogin from './pages/StudentLogin';
import TeacherLogin from './pages/TeacherLogin';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

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

  return <Login onBack={handleBackToHome} onTeacherSuccess={() => setCurrentPage('teacher-login')} />;
}
