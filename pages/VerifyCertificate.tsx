
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaCertificate, FaUser, FaCalendarAlt, FaIdCard, FaGraduationCap, FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Certificate } from '../types';

const MotionDiv = motion.div as any;

const VerifyCertificate: React.FC = () => {
  const [searchData, setSearchData] = useState({
    serialNumber: '',
    studentName: '',
    fatherName: ''
  });
  const [result, setResult] = useState<Certificate | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { serialNumber, studentName, fatherName } = searchData;
    
    if (!serialNumber.trim() && (!studentName.trim() || !fatherName.trim())) {
      return;
    }

    setLoading(true);
    setHasSearched(false);
    setError(null);

    const path = 'certificates';
    try {
      let q;
      if (serialNumber.trim()) {
        q = query(
          collection(db, path), 
          where('serialNumber', '==', serialNumber.trim())
        );
      } else {
        q = query(
          collection(db, path), 
          where('studentName', '==', studentName.trim()),
          where('fatherName', '==', fatherName.trim())
        );
      }
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setResult({ ...(doc.data() as any), id: doc.id } as Certificate);
      } else {
        setResult(null);
      }
      setHasSearched(true);
    } catch (err: any) {
      console.error("Error verifying certificate:", err);
      
      // Mandatory Error Handling
      const errInfo = {
        code: err.code,
        message: err.message,
        operationType: 'get',
        path: path,
        authInfo: {
          userId: (window as any).firebaseAuth?.currentUser?.uid || 'Not Authenticated',
          email: (window as any).firebaseAuth?.currentUser?.email || 'No Email',
        }
      };
      console.error('Firestore Error Details:', JSON.stringify(errInfo));

      if (err.code === 'permission-denied') {
        setError("Permission Denied: Please ensure your Firestore Security Rules allow public read access to the 'certificates' collection.");
      } else {
        setError("An error occurred while verifying the certificate. Please try again later.");
      }

      setResult(null);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 md:pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-primary/20">
            Official Verification Portal
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-black text-slate-900 mb-4">
            Verify <span className="text-primary">Certificate</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-xl mx-auto text-sm md:text-base">
            Search by Serial Number OR Student Name & Father's Name to verify the authenticity of credentials.
          </p>
        </div>

        <div className="bg-white rounded-[32px] shadow-2xl p-6 md:p-10 border border-slate-100 mb-10">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Search by Serial Number</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter Serial Number (e.g. LM-2024-001)"
                    className="w-full pl-6 pr-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none font-bold text-slate-800 bg-slate-50 text-sm transition-all"
                    value={searchData.serialNumber}
                    onChange={(e) => setSearchData({ ...searchData, serialNumber: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="relative flex items-center md:col-span-2">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">OR</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Student Name</label>
                <input
                  type="text"
                  placeholder="Enter Full Name"
                  className="w-full pl-6 pr-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none font-bold text-slate-800 bg-slate-50 text-sm transition-all"
                  value={searchData.studentName}
                  onChange={(e) => setSearchData({ ...searchData, studentName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Father's Name</label>
                <input
                  type="text"
                  placeholder="Enter Father's Name"
                  className="w-full pl-6 pr-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none font-bold text-slate-800 bg-slate-50 text-sm transition-all"
                  value={searchData.fatherName}
                  onChange={(e) => setSearchData({ ...searchData, fatherName: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-primary hover:bg-orange-600 text-white rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <FaSearch />
                  Verify Now
                </>
              )}
            </button>
          </form>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <MotionDiv
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3"
            >
              <FaExclamationTriangle className="flex-shrink-0" />
              {error}
            </MotionDiv>
          )}

          {hasSearched && (
            <MotionDiv
              key={result ? 'success' : 'error'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              {result ? (
                <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden border border-green-100">
                  <div className="bg-green-500 p-6 text-white flex items-center gap-4">
                    <FaCheckCircle size={32} />
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-widest">Valid Certificate</h3>
                      <p className="text-white/80 text-xs font-bold">This credential has been verified as authentic.</p>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                          <FaUser />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Student Name</p>
                          <p className="text-lg font-black text-slate-900">{result.studentName}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                          <FaIdCard />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Father Name</p>
                          <p className="text-lg font-black text-slate-900">{result.fatherName}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                          <FaGraduationCap />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Course / Trade</p>
                          <p className="text-lg font-black text-slate-900">{result.courseName}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                          <FaCalendarAlt />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Issued Date</p>
                          <p className="text-lg font-black text-slate-900">{result.issuedDate}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                          <FaCertificate />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Serial Number</p>
                          <p className="text-lg font-black text-slate-900">{result.serialNumber}</p>
                        </div>
                      </div>
                    </div>

                    <div className="relative group">
                      <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[24px] blur-xl opacity-50 group-hover:opacity-100 transition-all"></div>
                      <div className="relative bg-slate-100 rounded-[24px] overflow-hidden border-4 border-white shadow-xl aspect-[4/3]">
                        <img 
                          src={result.certificateImage} 
                          alt="Certificate Preview" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                           <a href={result.certificateImage} target="_blank" rel="noreferrer" className="bg-white text-slate-900 px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest">View Full Image</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-[32px] shadow-2xl p-10 md:p-16 border border-red-100 text-center">
                  <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaExclamationTriangle size={40} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">Invalid Certificate</h3>
                  <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
                    We could not find any record matching your search criteria. Please double-check the details and try again.
                  </p>
                  <button 
                    onClick={() => setHasSearched(false)}
                    className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VerifyCertificate;
