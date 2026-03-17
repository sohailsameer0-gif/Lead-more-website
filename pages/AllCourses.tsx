
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourses } from '../hooks/useFirestore';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaUniversity, FaLaptopCode, FaClock } from 'react-icons/fa';

const AllCourses: React.FC = () => {
  const { courses, loading } = useCourses();
  const [activeTab, setActiveTab] = useState<'campus' | 'video'>('campus');

  // Fix: Cast motion.div to any to resolve property missing errors in environment
  const MotionDiv = motion.div as any;

  const filteredCourses = courses.filter(c => (c.courseType || 'campus') === activeTab);

  return (
    <div className="bg-slate-50 min-h-screen relative overflow-x-hidden">
      
      {/* PROFESSIONAL HEADER */}
      <section className="relative h-[300px] md:h-[450px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center brightness-[0.35] scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1590633441399-428666353d9e?q=80&w=1920')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-50" />
        <div className="relative z-10 text-center px-4 pt-12 md:pt-20">
           <span className="inline-block bg-primary/20 backdrop-blur-md border border-primary/30 text-primary px-3 md:px-6 py-1 md:py-2 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-4 md:mb-6">
            NEBOSH & IRCA Accredited Portfolio
          </span>
          <h1 className="text-3xl md:text-7xl font-display font-black text-white mb-3 md:mb-6 tracking-tight">Academic <span className="text-primary">Curriculum</span></h1>
          <p className="text-slate-200 max-w-2xl mx-auto text-sm md:text-xl font-medium leading-relaxed">
            International certifications from NEBOSH, IRCA, OTHM, and OSHA designed for global industrial excellence.
          </p>
        </div>
      </section>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10 -mt-10 md:-mt-16">
        
        {/* PREMIUM TAB SWITCHER */}
        <div className="flex justify-center mb-12 md:mb-24">
           <div className="bg-white p-1.5 md:p-3 rounded-[24px] md:rounded-[40px] shadow-2xl shadow-slate-200 border border-white flex items-center gap-1 md:gap-2">
              <button 
                onClick={() => setActiveTab('campus')}
                className={`flex items-center gap-2 md:gap-4 px-4 md:px-12 py-2.5 md:py-5 rounded-[20px] md:rounded-[32px] font-black text-[8px] md:text-xs uppercase tracking-widest transition-all duration-500 ${activeTab === 'campus' ? 'bg-primary text-white shadow-xl shadow-orange-500/30' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
              >
                <FaUniversity size={12} className="md:w-4 md:h-4" /> Campus
              </button>
              <button 
                onClick={() => setActiveTab('video')}
                className={`flex items-center gap-2 md:gap-4 px-4 md:px-12 py-2.5 md:py-5 rounded-[20px] md:rounded-[32px] font-black text-[8px] md:text-xs uppercase tracking-widest transition-all duration-500 ${activeTab === 'video' ? 'bg-secondary text-white shadow-xl shadow-slate-900/30' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
              >
                <FaLaptopCode size={12} className="md:w-4 md:h-4" /> Video
              </button>
           </div>
        </div>

        {loading ? (
           <div className="text-center py-20 md:py-24 flex flex-col items-center">
             <div className="animate-spin rounded-full h-10 md:h-12 w-10 md:w-12 border-t-4 border-b-4 border-primary"></div>
             <p className="mt-6 md:mt-8 text-slate-400 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[8px] md:text-[10px]">Retrieving Curriculum</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 pb-20 md:pb-32">
            <AnimatePresence mode="wait">
              {filteredCourses.map((course, index) => (
                <MotionDiv
                  key={course.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl shadow-slate-200/50 hover:shadow-primary/10 hover:-translate-y-3 transition-all duration-500 border border-slate-100 flex flex-col h-full"
                >
                  <div className="relative h-48 md:h-72 overflow-hidden bg-slate-200">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                    <div className="absolute top-4 md:top-8 left-4 md:left-8">
                      <span className={`px-2 md:px-5 py-1 md:py-2 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-xl border border-white/20 shadow-lg ${activeTab === 'video' ? 'bg-secondary/60' : 'bg-primary/60'}`}>
                        {activeTab === 'video' ? <><FaLaptopCode className="inline mr-1" /> Video Academy</> : <><FaUniversity className="inline mr-1" /> Campus</>}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-12 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6">
                       <FaClock className="text-primary" size={10} />
                       <span className="text-[8px] md:text-[11px] text-slate-400 font-black uppercase tracking-widest">{course.duration}</span>
                    </div>
                    <h3 className="text-lg md:text-2xl font-display font-black text-slate-900 mb-3 md:mb-6 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed mb-6 md:mb-10 line-clamp-3">
                      {course.description}
                    </p>
                    
                    <div className="pt-6 md:pt-10 border-t border-slate-50 flex flex-wrap items-center justify-between mt-auto gap-3 md:gap-4">
                      <div className="flex flex-col">
                          <span className="text-[7px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5 md:mb-1">Tuition Fee</span>
                          <span className="font-black text-slate-900 text-base md:text-xl leading-none">{course.fee}</span>
                      </div>
                      <Link 
                        to={`/courses/${course.id}`}
                        className={`group/btn inline-flex items-center gap-2 md:gap-3 px-5 md:px-8 py-2.5 md:py-4 rounded-lg md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'video' ? 'bg-slate-950 text-white shadow-lg' : 'bg-primary text-white shadow-lg'}`}
                      >
                        Details <FaArrowRight className="group-hover/btn:translate-x-2 transition-transform" size={8} />
                      </Link>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </AnimatePresence>

            {filteredCourses.length === 0 && (
                <div className="col-span-full py-20 md:py-40 text-center glass rounded-[32px] md:rounded-[56px] border-4 border-dashed border-slate-100">
                    <p className="text-slate-400 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[8px] md:text-xs">Awaiting New Program Releases</p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCourses;
