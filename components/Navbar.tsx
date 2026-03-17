
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import BrandLogo from './BrandLogo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const MotionDiv = motion.div as any;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home Portal', path: '/' },
    { name: 'Curriculum', path: '/courses' },
    { name: 'Media Gallery', path: '/gallery' },
    { name: 'Verify Certificate', path: '/verify' },
    { name: 'Institutional Story', path: '/about' },
    { name: 'Admissions Help Desk', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${
      scrolled 
      ? 'bg-slate-900/95 backdrop-blur-xl shadow-xl py-2' 
      : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link to="/" className="flex items-center">
            <BrandLogo variant={scrolled ? 'light' : 'dark'} className="h-10 lg:h-12 xl:h-14 w-auto" />
          </Link>

          <div className={`hidden xl:flex gap-1 items-center p-1 rounded-2xl border transition-all duration-300 ${scrolled ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-100/50 border-slate-200/50'}`}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  isActive(link.path) 
                  ? 'bg-white text-primary shadow-sm' 
                  : scrolled 
                    ? 'text-slate-300 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-primary hover:bg-white/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden xl:block">
            <Link
              to="/enroll"
              className="bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-orange-500/30 hover:scale-105 whitespace-nowrap"
            >
              Enroll Now
            </Link>
          </div>

          <div className="xl:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className={`focus:outline-none p-2.5 md:p-3 rounded-xl transition-all ${scrolled ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`}>
              {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-slate-100 p-4 space-y-2"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest ${
                  isActive(link.path)
                    ? 'bg-orange-50 text-primary'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/enroll" onClick={() => setIsOpen(false)} className="block w-full text-center bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">
              Enroll Now
            </Link>
          </MotionDiv>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
