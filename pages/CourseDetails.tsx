
import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useCourses } from '../hooks/useFirestore';
import { FaClock, FaCheckCircle, FaUserGraduate, FaArrowRight, FaVideo, FaLock, FaTimes, FaCopy, FaShieldAlt, FaAward } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { courses, loading } = useCourses();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const MotionDiv = motion.div as any;

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;

  const course = courses.find((c) => c.id === id);
  if (!course) return <Navigate to="/courses" replace />;

  const isVideoCourse = course.courseType === 'video';
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-32 overflow-hidden">
      {/* Banner */}
      <div className="relative h-[550px] bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-[4px] scale-110" style={{ backgroundImage: `url(${course.image})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center">
          <MotionDiv initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
             <div className="flex flex-wrap gap-3 mb-8">
                <span className="bg-primary/40 backdrop-blur-xl border border-white/20 text-white font-black uppercase tracking-widest text-[10px] px-6 py-2 rounded-full">
                    <FaShieldAlt /> {isVideoCourse ? 'Video Academy' : 'Campus Program'}
                </span>
             </div>
             <h1 className="text-5xl md:text-7xl font-display font-black text-white leading-[1.1] mb-6 drop-shadow-2xl">{course.title}</h1>
          </MotionDiv>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white rounded-[48px] shadow-2xl p-12 border border-slate-100">
              <h2 className="text-3xl font-display font-black text-slate-900 mb-8">Program Overview</h2>
              <p className="text-slate-600 leading-[1.8] text-lg font-medium whitespace-pre-line">{course.description}</p>
            </div>
            
            {!isVideoCourse && course.details?.programs && (
              <div className="bg-white rounded-[48px] shadow-2xl p-12 border border-slate-100">
                <h3 className="text-3xl font-display font-black text-slate-900 mb-10">Technical Modules</h3>
                <div className="space-y-8">
                  {course.details.programs.map((prog, i) => (
                    <div key={i} className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 group">
                      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
                        <h4 className="text-2xl font-black text-slate-900">{prog.name}</h4>
                        <span className="bg-white px-6 py-2 rounded-2xl text-[10px] font-black text-primary uppercase border border-slate-100">{prog.duration}</span>
                      </div>
                      <ul className="space-y-4">
                        {prog.keyTopics.map((topic, j) => (
                          <li key={j} className="flex items-start gap-4 text-slate-600 font-bold text-sm">
                            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" /> {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8 lg:sticky lg:top-32 h-fit">
            <div className={`bg-white rounded-[48px] shadow-2xl p-12 border-t-[12px] relative overflow-hidden ${isVideoCourse ? 'border-purple-600' : 'border-primary'}`}>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Program Investment</p>
              <div className="flex items-center justify-between mb-10">
                <span className={`text-5xl font-display font-black ${isVideoCourse ? 'text-purple-600' : 'text-primary'}`}>{course.fee}</span>
              </div>
              <div className="space-y-6 mb-12">
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm"><FaClock size={20} /></div>
                    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</p><p className="font-bold text-slate-900">{course.duration}</p></div>
                </div>
              </div>

              <Link 
                to="/enroll"
                className={`w-full py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3 ${isVideoCourse ? 'bg-purple-600 text-white' : 'bg-primary text-white'}`}
              >
                Enroll Today <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
