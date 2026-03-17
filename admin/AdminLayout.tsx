
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import BrandLogo from '../components/BrandLogo';
import { motion } from 'framer-motion';
import { MdDashboard, MdClass, MdPeople, MdLogout, MdRateReview, MdGroups, MdQuestionAnswer, MdHandshake, MdError, MdPhotoLibrary, MdEmail } from 'react-icons/md';
import { FaBars, FaCertificate } from 'react-icons/fa';

const AdminLayout: React.FC = () => {
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  const MotionDiv = motion.div as any;

  useEffect(() => {
    const verifyAccess = async () => {
      if (loading) return;
      if (!currentUser) { navigate('/admin/login'); return; }
      try {
        const adminDoc = await getDoc(doc(db, 'admins', currentUser.email!));
        if (adminDoc.exists()) { setIsAuthorized(true); setAccessDenied(false); } 
        else { setAccessDenied(true); }
      } catch (error) { 
        setAccessDenied(true); 
      } 
      finally { setAuthChecking(false); }
    };
    verifyAccess();
  }, [currentUser, loading, navigate]);

  const handleLogout = async () => { await logout(); navigate('/admin/login'); };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: MdDashboard },
    { name: 'Admissions Inbox', path: '/admin/messages', icon: MdEmail },
    { name: 'Program Curriculum', path: '/admin/courses', icon: MdClass },
    { name: 'Student Enrollments', path: '/admin/enrollments', icon: MdPeople },
    { name: 'Media Bank', path: '/admin/gallery', icon: MdPhotoLibrary },
    { name: 'Success Stories', path: '/admin/reviews', icon: MdRateReview },
    { name: 'Faculty Profiles', path: '/admin/team', icon: MdGroups },
    { name: 'Support FAQ', path: '/admin/faq', icon: MdQuestionAnswer },
    { name: 'Registry Partners', path: '/admin/partners', icon: MdHandshake },
    { name: 'Certificate Registry', path: '/admin/certificates', icon: FaCertificate },
  ];

  if (loading || authChecking) return <div className="min-h-screen flex items-center justify-center bg-slate-950"><div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-primary"></div></div>;
  if (accessDenied) return <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900"><div className="bg-white p-12 rounded-[48px] text-center max-w-md"><MdError size={60} className="mx-auto text-red-500 mb-8" /><h2 className="text-3xl font-black mb-4">Access Restricted</h2><p className="text-slate-500 mb-8 font-medium">Your email is not on the admin whitelist.</p><button onClick={handleLogout} className="bg-primary text-white w-full py-5 rounded-2xl font-black">Switch Account</button></div></div>;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className={`bg-slate-900 text-white transition-all duration-500 flex flex-col relative z-50 ${isSidebarOpen ? 'w-80' : 'w-24'}`}>
        <div className="h-24 flex items-center px-6 border-b border-white/5 overflow-hidden">
          <BrandLogo variant="light" className={`h-10 w-auto transition-all ${isSidebarOpen ? 'opacity-100' : 'opacity-0 scale-50'}`} />
          {!isSidebarOpen && <div className="absolute left-7 w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black">L</div>}
        </div>
        <nav className="flex-1 py-10 px-4 overflow-y-auto custom-scrollbar">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link to={item.path} className={`flex items-center gap-5 px-6 py-4 rounded-2xl transition-all group ${isActive ? 'bg-primary text-white shadow-2xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                    <item.icon size={24} className={isActive ? 'text-white' : 'group-hover:text-primary transition-colors'} />
                    <span className={`font-black text-[10px] uppercase tracking-widest transition-all ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-6 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-5 px-6 py-4 w-full rounded-2xl text-slate-500 hover:bg-red-500 hover:text-white transition-all"><MdLogout size={24} />{isSidebarOpen && <span className="font-black text-[10px] uppercase tracking-widest">Logout</span>}</button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 bg-[#F5F7FA]">
        <header className="h-24 bg-white/80 backdrop-blur-md flex items-center justify-between px-10 z-40 border-b border-slate-100">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="w-12 h-12 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-2xl transition-all"><FaBars size={20} /></button>
          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100 pr-6">
             <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black">A</div>
             <p className="text-[10px] text-slate-400 font-bold uppercase truncate max-w-[200px]">{currentUser!.email}</p>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-10 bg-mesh"><MotionDiv key={location.pathname} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-full"><Outlet /></MotionDiv></main>
      </div>
    </div>
  );
};

export default AdminLayout;
