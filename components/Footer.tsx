
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaLock, 
  FaInstagram, 
  FaYoutube, 
  FaTiktok,
  FaExternalLinkAlt
} from 'react-icons/fa';
import BrandLogo from './BrandLogo';

const Footer: React.FC = () => {
  const startYear = 2012;
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaFacebook, url: 'https://www.facebook.com/share/1AHBzuJYeH/', label: 'Facebook' },
    { icon: FaInstagram, url: 'https://www.instagram.com/leadmore_institute?igsh=MXJ2dG40MnBycXdyNQ==', label: 'Instagram' },
    { icon: FaTwitter, url: 'https://x.com/Leadmore963', label: 'Twitter' },
    { icon: FaYoutube, url: 'https://youtube.com/@leadmoreinstitute?si=fo0Qv_puD-FsVeX4', label: 'YouTube' },
    { icon: FaTiktok, url: 'https://www.tiktok.com/@leadmore_institute1?_r=1&_t=ZN-93qwBFrWV9y', label: 'TikTok' },
    { icon: FaLinkedin, url: 'https://www.linkedin.com/company/lead-more-institute/', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
               <BrandLogo variant="light" className="h-20 w-auto -ml-2" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              Lead More Institute is a pioneer in industrial safety education, providing globally recognized certifications like NEBOSH and IRCA since 2012.
            </p>
            
            <div className="pt-4">
              <p className="text-[10px] text-slate-500 mb-3 font-bold uppercase tracking-[0.2em]">Connect With Us</p>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social, idx) => (
                  <a 
                    key={idx} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary transition-all duration-300"
                    title={social.label}
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links - Standardized Names */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b-2 border-primary inline-block pb-1">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all font-medium">Home Portal</Link></li>
              <li><Link to="/courses" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all font-medium">Curriculum</Link></li>
              <li><Link to="/gallery" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all font-medium">Media Gallery</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all font-medium">Institutional Story</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all font-medium">Admissions Help Desk</Link></li>
              <li className="pt-4">
                <Link to="/admin" className="text-slate-600 hover:text-primary inline-flex items-center gap-2 transition-all text-[10px] font-black uppercase tracking-widest">
                  <FaLock size={10} /> Secure Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b-2 border-primary inline-block pb-1">Get In Touch</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 text-slate-400">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-primary flex-shrink-0 mt-1">
                  <FaPhoneAlt size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Admissions</p>
                  <span className="font-semibold text-sm">+92 348 2312380</span>
                </div>
              </li>
              <li className="flex items-start gap-4 text-slate-400">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-primary flex-shrink-0 mt-1">
                  <FaEnvelope size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Official Email</p>
                  <span className="font-semibold text-sm">info@leadmore.uk</span>
                </div>
              </li>
              <li className="flex items-start gap-4 text-slate-400">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-primary flex-shrink-0 mt-1">
                  <FaMapMarkerAlt size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Peshawar Campus</p>
                  <span className="font-semibold text-xs leading-relaxed">5th Floor, New Spinzar IT Tower, Peshawar</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Interactive Map */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-6 border-b-2 border-primary inline-block pb-1">Our Location</h3>
            <div className="relative group rounded-2xl overflow-hidden border border-slate-700 h-44 shadow-2xl">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.494519904301!2d71.5058284!3d34.0055152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d93d44bb1b5851%3A0xf9f2c80ce0ebe242!2sLead%20More%20Institute%20Peshawar%20(%20Best%20Health%20and%20Safety%20Institute)!5e0!3m2!1sen!2s!4v1770880677362!5m2!1sen!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500"
              ></iframe>
              <a 
                href="https://maps.app.goo.gl/NGMDgfUj66BHzNvK9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <span className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg flex items-center gap-2 shadow-xl">
                  Open Map <FaExternalLinkAlt size={10} />
                </span>
              </a>
            </div>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest text-center">Open 9:00 AM - 6:00 PM</p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
          <p>&copy; {startYear} - {currentYear} Lead more Institute. All Rights Reserved.</p>
          <div className="flex gap-6">
             <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
             <a href="#" className="hover:text-primary transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
