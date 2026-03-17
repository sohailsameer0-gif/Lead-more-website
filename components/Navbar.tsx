
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
    { name: 'Institutional Story', path: '/about' },
    { name: 'Admissions Help Desk', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${
      scrolled 
      ? 'bg-white/80 backdrop-blur-xl shadow-xl py-2' 
      : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center">
            <BrandLogo variant="dark" className="h-14 w-auto" />
          </Link>

          <div className="hidden md:flex space-x-1 items-center bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  isActive(link.path) 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-slate-600 hover:text-primary hover:bg-white/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Link
              to="/enroll"
              className="bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-orange-500/30 hover:scale-105"
            >
              Enroll Now
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-900 focus:outline-none p-3 bg-slate-100 rounded-xl">
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
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
