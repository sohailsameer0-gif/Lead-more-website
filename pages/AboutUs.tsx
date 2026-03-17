
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaLightbulb, FaGlobeAmericas, FaAward, FaPlus, FaMinus } from 'react-icons/fa';
import { useTeam, useFAQ } from '../hooks/useFirestore';

const AboutUs: React.FC = () => {
  const { team } = useTeam();
  const { data: faq, loading: faqLoading } = useFAQ();
  const MotionDiv = motion.div as any;

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* PROFESSIONAL HERO SECTION - Scaled Down */}
      <section className="relative h-[300px] md:h-[450px] overflow-hidden flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center brightness-[0.35] scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1920')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-50" />
        
        <div className="relative z-10 text-center max-w-3xl px-4 pt-12 md:pt-16">
          <span className="inline-block bg-primary/20 backdrop-blur-md border border-primary/30 text-primary px-3 md:px-5 py-1 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-4 md:mb-6">
             Global Safety Education Since 2012
          </span>
          <h1 className="text-3xl md:text-6xl font-display font-black text-white mb-4 md:mb-6 tracking-tight">
            Our <span className="text-primary">Institutional</span> Story
          </h1>
          <p className="text-sm md:text-lg text-slate-200 font-medium leading-relaxed max-w-xl mx-auto">
            Lead more Institute provides NEBOSH IGC, IDIP Level 06, and IRCA ISO certifications for modern industrial professionals.
          </p>
        </div>
      </section>

      {/* Story & Values */}
      <section className="py-16 md:py-20 max-w-6xl mx-auto px-4 relative z-10 -mt-10 md:-mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <MotionDiv initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} className="space-y-4 md:space-y-6">
            <h2 className="text-2xl md:text-4xl font-display font-black text-slate-900 leading-tight">
              A Global Benchmark for <span className="text-primary">NEBOSH & IRCA</span>
            </h2>
            <p className="text-slate-500 text-sm md:text-lg leading-relaxed font-medium">
              We specialize in advanced Health, Safety, and Quality Management systems. Our curriculum covers the highest international standards.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
               <div className="bg-white p-5 md:p-8 rounded-[20px] md:rounded-[24px] shadow-xl border border-slate-100 group">
                  <FaShieldAlt className="text-primary text-xl md:text-2xl mb-3 md:mb-4" />
                  <h4 className="font-black text-slate-900 mb-1.5 md:mb-2 text-sm md:text-base">NEBOSH Excellence</h4>
                  <p className="text-slate-500 text-[9px] md:text-xs font-medium leading-relaxed">Providing the Gold Standard in health and safety qualifications globally.</p>
               </div>
               <div className="bg-white p-5 md:p-8 rounded-[20px] md:rounded-[24px] shadow-xl border border-slate-100 group">
                  <FaLightbulb className="text-primary text-xl md:text-2xl mb-3 md:mb-4" />
                  <h4 className="font-black text-slate-900 mb-1.5 md:mb-2 text-sm md:text-base">ISO Auditing</h4>
                  <p className="text-slate-500 text-[9px] md:text-xs font-medium leading-relaxed">IRCA certified ISO 45001, 9001, and 14001 lead auditor training.</p>
               </div>
            </div>
          </MotionDiv>
          
          <div className="relative mt-12 lg:mt-0">
             <div className="absolute inset-0 bg-primary/20 blur-[40px] md:blur-[60px] rounded-full -z-10" />
             <img src="https://images.unsplash.com/photo-1544725121-be3b5d02e9b1?q=80&w=1200" alt="Campus" className="rounded-[32px] md:rounded-[40px] shadow-2xl border-4 md:border-8 border-white" />
             <div className="absolute -bottom-4 -left-4 md:-bottom-10 md:-left-10 bg-slate-900 text-white p-5 md:p-10 rounded-[20px] md:rounded-[40px] shadow-2xl max-w-[240px] md:max-w-xs">
                <FaAward className="text-primary text-2xl md:text-3xl mb-3 md:mb-4" />
                <h4 className="text-base md:text-xl font-black mb-1">Accredited Center</h4>
                <p className="text-slate-400 text-[9px] md:text-xs font-medium leading-relaxed">Official training provider for NEBOSH, IRCA, OTHM, and OSHA.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Mission Vision */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-white">
        <div className="max-w-6xl mx-auto px-4 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
           <div className="glass p-6 md:p-12 rounded-[24px] md:rounded-[48px] border-white/50 shadow-2xl">
              <h3 className="text-xl md:text-3xl font-display font-black text-slate-900 mb-3 md:mb-4 flex items-center gap-3 md:gap-4">
                 <span className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl flex items-center justify-center text-white"><FaGlobeAmericas size={18} className="md:w-5 md:h-5" /></span>
                 Our Mission
              </h3>
              <p className="text-slate-600 text-xs md:text-lg font-medium leading-relaxed">
                 To empower the workforce with <strong>NEBOSH IGC</strong>, <strong>NEBOSH IDIP Level 06</strong>, and <strong>IRCA ISO</strong> certifications that set global benchmarks.
              </p>
           </div>
           <div className="glass p-6 md:p-12 rounded-[24px] md:rounded-[48px] border-white/50 shadow-2xl">
              <h3 className="text-xl md:text-3xl font-display font-black text-slate-900 mb-3 md:mb-4 flex items-center gap-3 md:gap-4">
                 <span className="w-10 h-10 md:w-12 md:h-12 bg-secondary rounded-xl flex items-center justify-center text-white"><FaAward size={18} className="md:w-5 md:h-5" /></span>
                 Our Vision
              </h3>
              <p className="text-slate-600 text-xs md:text-lg font-medium leading-relaxed">
                 To be the most trusted provider of NEBOSH and IRCA qualifications in Pakistan, bridging the gap with global requirements.
              </p>
           </div>
        </div>
      </section>

      {/* SUPPORT CENTER FAQ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-primary font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[8px] md:text-[9px] mb-3 md:mb-4 block">Support Center</span>
            <h2 className="text-2xl md:text-4xl font-display font-black text-slate-900 tracking-tight">Frequently Asked <span className="text-primary">Questions</span></h2>
          </div>
          <div className="space-y-3 md:space-y-4">
            {faq.map((item) => (
              <AboutFAQItem key={item.id} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

const AboutFAQItem: React.FC<{question: string, answer: string}> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const MotionDiv = motion.div as any;
  return (
    <div className={`rounded-2xl border transition-all duration-300 ${isOpen ? 'bg-slate-50 border-primary/20 shadow-lg' : 'bg-white border-slate-100'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-6 text-left outline-none group">
        <span className="font-bold text-slate-800 text-sm md:text-base group-hover:text-primary transition-colors">{question}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ml-4 ${isOpen ? 'bg-primary text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
          {isOpen ? <FaMinus size={10} /> : <FaPlus size={10} />}
        </div>
      </button>
      {isOpen && (
        <MotionDiv initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="px-6 pb-6 text-slate-600 text-sm md:text-base leading-relaxed font-medium">
          {answer}
        </MotionDiv>
      )}
    </div>
  );
};

export default AboutUs;
