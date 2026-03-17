
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { MdClass, MdPeople, MdAttachMoney, MdPendingActions, MdPhotoLibrary } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ courses: 0, students: 0, pending: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  const MotionDiv = motion.div as any;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const coursesSnap = await getDocs(collection(db, 'courses'));
        const enrollmentsSnap = await getDocs(collection(db, 'enrollments'));
        const allEnrollments: any[] = [];
        enrollmentsSnap.forEach(doc => allEnrollments.push(doc.data()));
        
        const pending = allEnrollments.filter(e => e.status === 'pending').length;
        const approvedCount = allEnrollments.filter(e => e.status === 'approved').length;
        const estimatedRevenue = approvedCount * 35000;

        setStats({ 
          courses: coursesSnap.size, 
          students: enrollmentsSnap.size, 
          pending, 
          revenue: estimatedRevenue 
        });
      } catch (error: any) {
        // Silently fail stats if permission denied during check
        console.info("Dashboard stats temporarily unavailable (Permissions).", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Academic Programs', value: stats.courses, icon: MdClass, color: 'bg-primary', shadow: 'shadow-orange-200' },
    { title: 'Global Enrollments', value: stats.students, icon: MdPeople, color: 'bg-blue-600', shadow: 'shadow-blue-200' },
    { title: 'Queue Reviews', value: stats.pending, icon: MdPendingActions, color: 'bg-purple-600', shadow: 'shadow-purple-200' },
    { title: 'Est. Revenue', value: `PKR ${stats.revenue.toLocaleString()}`, icon: MdAttachMoney, color: 'bg-emerald-600', shadow: 'shadow-emerald-200' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">System Oversight</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-2">Real-time Institutional Metrics</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, idx) => (
          <MotionDiv 
            key={idx} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 p-10 border border-slate-100 group relative overflow-hidden"
          >
            <div className={`w-16 h-16 rounded-2xl text-white flex items-center justify-center shadow-2xl ${card.color} ${card.shadow} mb-8`}>
              <card.icon size={28} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">{card.title}</p>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">
                {loading ? '...' : card.value}
              </h3>
            </div>
          </MotionDiv>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <MotionDiv 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-white p-12 rounded-[56px] shadow-2xl shadow-slate-200/50 border border-slate-100"
        >
          <div className="flex justify-between items-end mb-12">
             <div>
                <h3 className="font-black text-slate-800 text-2xl tracking-tight">Growth Trend</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Student Registration Lifecycle</p>
             </div>
             <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-6 py-2 rounded-full border border-emerald-100 uppercase tracking-widest shadow-inner">
               +12.5% Optimal
             </span>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-6 px-4">
            {[40, 65, 30, 80, 55, 90].map((height, i) => (
                <div key={i} className="flex flex-col items-center flex-1 group h-full justify-end">
                    <div className="relative w-full bg-slate-50 rounded-3xl overflow-hidden flex items-end h-full">
                        <MotionDiv 
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className="w-full bg-primary/80 group-hover:bg-primary transition-all duration-500 rounded-t-3xl relative"
                        />
                    </div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-6">Month {i+1}</span>
                </div>
            ))}
          </div>
        </MotionDiv>

         <div className="bg-white p-12 rounded-[56px] shadow-2xl shadow-slate-200/50 border border-slate-100">
          <h3 className="font-black text-slate-800 text-2xl tracking-tight mb-10">Command Center</h3>
          <div className="space-y-4">
             {[
               { path: '/admin/courses', label: 'Program Registry', icon: MdClass, color: 'text-blue-600', bg: 'bg-blue-50' },
               { path: '/admin/enrollments', label: 'Review Queue', icon: MdPendingActions, color: 'text-orange-600', bg: 'bg-orange-50' },
               { path: '/admin/gallery', label: 'Media Assets', icon: MdPhotoLibrary, color: 'text-purple-600', bg: 'bg-purple-50' },
             ].map((action, i) => (
               <Link 
                key={i}
                to={action.path} 
                className="w-full text-left p-6 bg-slate-50 hover:bg-white hover:shadow-2xl border border-slate-50 rounded-[32px] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-between group"
               >
                  <span className="flex items-center gap-5">
                      <span className={`w-12 h-12 rounded-2xl ${action.bg} ${action.color} flex items-center justify-center transition-all group-hover:scale-110 shadow-sm`}><action.icon size={20} /></span>
                      {action.label}
                  </span>
                  <span className="text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1">→</span>
               </Link>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
