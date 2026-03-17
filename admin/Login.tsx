
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BrandLogo from '../components/BrandLogo';
import { motion } from 'framer-motion';
import { FaLock, FaEnvelope, FaExclamationTriangle, FaSignInAlt, FaShieldAlt } from 'react-icons/fa';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<{title: string, msg: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const MotionDiv = motion.div as any;

  useEffect(() => {
    if (currentUser) {
      navigate('/admin', { replace: true });
    }
  }, [currentUser, navigate]);

  const checkAdminWhitelist = async (userEmail: string | null) => {
    if (!userEmail) return false;
    try {
      const adminDoc = await getDoc(doc(db, 'admins', userEmail));
      return adminDoc.exists();
    } catch (err) {
      console.error("Whitelist check failed", err);
      return false;
    }
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      const isWhitelisted = await checkAdminWhitelist(result.user?.email || null);
      
      if (!isWhitelisted) {
          await signOut(auth);
          setError({ title: "Unauthorized", msg: "You do not have administrative privileges." });
          setLoading(false);
          return;
      }
      navigate('/admin');
    } catch (err: any) {
      setError({ title: "Login Error", msg: "Incorrect email or password. Please try again." });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <MotionDiv
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-48 -right-48 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"
        />
        <MotionDiv
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            x: [0, -100, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-48 -left-48 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"
        />
      </div>

      <MotionDiv 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[48px] shadow-[0_0_80px_rgba(0,0,0,0.5)] p-10 md:p-12 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-orange-400 to-primary" />
          
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center text-primary mb-6 shadow-2xl border border-primary/30">
              <FaShieldAlt size={40} />
            </div>
            <BrandLogo variant="light" className="h-10 w-auto mb-4" />
            <h2 className="text-2xl font-black text-white tracking-tight">Admin Gateway</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] mt-2">Secure Institutional Portal</p>
          </div>
          
          {error && (
            <MotionDiv initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-500/10 border border-red-500/20 rounded-2xl mb-8 p-4">
               <div className="flex items-start gap-3">
                  <FaExclamationTriangle className="text-red-500 mt-1" />
                  <div>
                     <h4 className="font-black text-red-500 text-sm uppercase tracking-widest">{error.title}</h4>
                     <p className="text-slate-300 text-xs mt-1 font-medium leading-relaxed">{error.msg}</p>
                  </div>
               </div>
            </MotionDiv>
          )}

          <div className="space-y-6">
            <form onSubmit={handleAuthAction} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-primary transition-all font-bold placeholder:text-slate-600"
                    placeholder="name@leadmore.uk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Key</label>
                <div className="relative">
                  <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    required
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-primary transition-all font-bold placeholder:text-slate-600"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-2xl shadow-2xl shadow-orange-500/20 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.3em] transition-all active:scale-95 disabled:opacity-50 mt-4"
              >
                {loading ? "Authenticating..." : <><FaSignInAlt /> Secure Entry</>}
              </button>
            </form>

            <div className="flex items-center gap-4 py-2 opacity-30">
              <div className="h-px flex-1 bg-white/10"></div>
              <span className="text-slate-500 text-[8px] font-black uppercase tracking-widest whitespace-nowrap">Identity Protection Active</span>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            <p className="text-center text-slate-600 text-[9px] font-black uppercase tracking-widest">
                System access is encrypted and logged.
            </p>
          </div>
        </div>
      </MotionDiv>
    </div>
  );
};

export default Login;
