
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton: React.FC = () => {
  const whatsappNumber = "+923482312380";
  const message = encodeURIComponent("Hello Lead more Institute! I'm interested in your courses.");

  return (
    <div className="fixed bottom-8 right-8 z-[70] flex flex-col items-end gap-3 pointer-events-none">
      {/* Dynamic Tooltip */}
      <div className="bg-white text-slate-900 px-5 py-2 rounded-2xl shadow-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest animate-bounce pointer-events-auto">
        Questions? Chat now
      </div>
      
      <a
        href={`https://wa.me/${whatsappNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group flex items-center justify-center gap-3 overflow-hidden pointer-events-auto"
        aria-label="Contact us on WhatsApp"
      >
        <span className="max-w-0 group-hover:max-w-[200px] transition-all duration-500 ease-in-out whitespace-nowrap overflow-hidden font-black text-xs uppercase tracking-widest">
          Admissions Chat
        </span>
        <FaWhatsapp size={32} className="relative z-10" />
        
        {/* Visual Pulse */}
        <span className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20 -z-10" />
      </a>
    </div>
  );
};

export default WhatsAppButton;
