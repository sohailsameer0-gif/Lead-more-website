
import React, { useState } from 'react';
import { useCourses } from '../hooks/useFirestore';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FaUniversity, FaFileInvoiceDollar, FaCheckCircle, FaExclamationCircle, FaUserEdit, FaCloudUploadAlt, FaCopy, FaTimesCircle, FaCheck } from 'react-icons/fa';

import { uploadToCloudinary } from '../utils/cloudinary';

const EnrollNow: React.FC = () => {
  const { courses } = useCourses();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const MotionDiv = motion.div as any;

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    course: '',
    address: '',
    consent1: false,
    consent2: false
  });
  const [paymentFile, setPaymentFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.email || !formData.course || !paymentFile) {
      setErrorMessage("Please fill all required fields and upload the bank receipt.");
      setStatus('error');
      return;
    }

    if (!formData.consent1 || !formData.consent2) {
      setErrorMessage("You must agree to the institutional terms.");
      setStatus('error');
      return;
    }

    setLoading(true);
    setStatus('idle');

    try {
      const proofUrl = await uploadToCloudinary(paymentFile);
      
      // Ensure the collection name matches and data is well-formed for Firestore
      await addDoc(collection(db, 'enrollments'), {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        course: formData.course,
        address: formData.address.trim(),
        paymentProofUrl: proofUrl,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      setStatus('success');
      setFormData({ fullName: '', phone: '', email: '', course: '', address: '', consent1: false, consent2: false });
      setPaymentFile(null);
    } catch (err: any) {
      console.error("Enrollment Submission Error:", err);
      // Detailed error for better debugging
      const displayError = err.code === 'permission-denied' 
        ? "Access Restricted: The enrollment portal is temporarily locked for maintenance. Please contact admissions on WhatsApp."
        : err.message || "Something went wrong during submission. Please try again.";
      
      setErrorMessage(displayError);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 md:py-32 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-6 md:pt-10">
        
        <div className="text-center mb-12 md:mb-20">
          <span className="text-primary font-black uppercase tracking-[0.3em] text-[8px] md:text-[10px] mb-3 md:mb-4 block">Centralized Admissions</span>
          <h1 className="text-3xl md:text-5xl font-display font-black text-slate-900 tracking-tight">Academic <span className="text-primary">Enrollment</span> Portal</h1>
          <p className="text-slate-500 mt-3 md:mt-4 text-base md:text-xl font-medium max-w-2xl mx-auto">Follow the institutional pathway to secure your global safety certification.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          <div className="lg:col-span-4 space-y-6 md:space-y-8">
            <div className="bg-white rounded-[32px] md:rounded-[48px] shadow-2xl border border-slate-100 overflow-hidden lg:sticky lg:top-32">
                <div className="bg-slate-900 px-6 md:px-10 py-6 md:py-8 flex items-center gap-4 text-white">
                    <FaUniversity size={24} className="text-primary md:w-7 md:h-7" />
                    <h3 className="font-black text-lg md:text-xl uppercase tracking-widest">Fee Transfer</h3>
                </div>
                <div className="p-6 md:p-10 space-y-6 md:space-y-8">
                    <div className="p-4 md:p-6 bg-orange-50 rounded-[24px] md:rounded-[32px] border border-orange-100 flex items-start gap-3 md:gap-4">
                        <FaExclamationCircle className="text-primary mt-1 flex-shrink-0" size={18} />
                        <p className="text-xs md:text-sm text-orange-800 font-bold leading-relaxed">
                            Transfer course fee to Soneri Bank and upload receipt in Step 2.
                        </p>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        <div className="bg-slate-50 p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-slate-100 relative group transition-all hover:bg-white hover:shadow-xl">
                            <button 
                                onClick={() => { navigator.clipboard.writeText('20014657372'); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                                className="absolute top-4 md:top-6 right-4 md:right-6 text-slate-400 hover:text-primary transition-colors p-2 md:p-3 bg-white rounded-xl md:rounded-2xl shadow-sm"
                            >
                                <FaCopy size={14} />
                            </button>
                            {copied && <span className="absolute top-16 md:top-20 right-6 md:right-8 text-[8px] md:text-[10px] font-black text-green-600 uppercase tracking-widest animate-pulse">Copied!</span>}
                            
                            <div className="mb-4 md:mb-6">
                                <p className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 md:mb-2">Account Title</p>
                                <p className="text-xs md:text-sm font-black text-slate-900">LEAD MORE (SMC-PRIVATE) LIMITED</p>
                            </div>
                            <div className="mb-4 md:mb-6">
                                <p className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 md:mb-2">Account Number</p>
                                <p className="text-xl md:text-2xl font-mono font-black text-primary tracking-widest">20014657372</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 md:gap-4 pt-4 md:pt-6 border-t border-slate-200">
                                <div><p className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Branch</p><p className="text-xs md:text-sm font-black text-slate-800">0373</p></div>
                                <div><p className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Bank</p><p className="text-xs md:text-sm font-black text-slate-800">SONERI</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <MotionDiv className="bg-white rounded-[40px] md:rounded-[64px] shadow-2xl p-8 md:p-16 relative border border-slate-100 overflow-hidden">
              <AnimatePresence>
                {loading && (
                  <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center backdrop-blur-md">
                     <div className="animate-spin rounded-full h-16 md:h-20 w-16 md:w-20 border-t-4 border-b-4 border-primary mb-6 md:mb-8 shadow-2xl"></div>
                     <h2 className="font-black text-slate-900 text-2xl md:text-3xl tracking-tight">Submitting Profile...</h2>
                  </MotionDiv>
                )}

                {status === 'success' && (
                  <MotionDiv initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 md:p-16 text-center">
                    <FaCheckCircle className="text-green-500 text-6xl md:text-8xl mb-6 md:mb-8" />
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 md:mb-6 tracking-tight">Admission Submitted!</h2>
                    <p className="text-slate-500 font-medium text-base md:text-lg leading-relaxed mb-8 md:mb-10 max-w-md">Thank you for choosing Lead More Institute. Our verification team will review your payment and contact you on WhatsApp within 24 hours.</p>
                    <button onClick={() => setStatus('idle')} className="bg-slate-900 text-white px-10 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-primary transition-all shadow-xl">New Enrollment</button>
                  </MotionDiv>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12 pb-6 md:pb-10 border-b border-slate-50">
                  <FaUserEdit size={24} className="text-primary md:w-8 md:h-8" />
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Candidate Profile</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                {status === 'error' && (
                  <div className="p-4 md:p-6 bg-red-50 border border-red-100 text-red-600 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold flex items-center gap-3 md:gap-4">
                    <FaTimesCircle size={20} className="flex-shrink-0" /> {errorMessage}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input type="text" name="fullName" required className="w-full rounded-xl md:rounded-2xl border-slate-100 border-2 px-5 md:px-6 py-3.5 md:py-4 outline-none font-bold text-slate-800 bg-slate-50 focus:border-primary transition-colors" value={formData.fullName} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Phone</label>
                    <input type="tel" name="phone" required className="w-full rounded-xl md:rounded-2xl border-slate-100 border-2 px-5 md:px-6 py-3.5 md:py-4 outline-none font-bold text-slate-800 bg-slate-50 focus:border-primary transition-colors" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Email</label>
                    <input type="email" name="email" required className="w-full rounded-xl md:rounded-2xl border-slate-100 border-2 px-5 md:px-6 py-3.5 md:py-4 outline-none font-bold text-slate-800 bg-slate-50 focus:border-primary transition-colors" value={formData.email} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Selected Program</label>
                    <select name="course" required className="w-full rounded-xl md:rounded-2xl border-slate-100 border-2 px-5 md:px-6 py-3.5 md:py-4 outline-none font-bold text-slate-800 bg-slate-50 focus:border-primary transition-colors appearance-none" value={formData.course} onChange={handleChange}>
                      <option value="">-- Choose Course --</option>
                      {courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                      <option value="NEBOSH IDIP">NEBOSH IDIP Level 06</option>
                      <option value="IRCA ISO">IRCA ISO Lead Auditor</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-950 p-6 md:p-10 rounded-[32px] md:rounded-[40px] border-2 border-dashed border-primary/20 text-center relative group">
                  <label className="cursor-pointer block">
                    <FaCloudUploadAlt size={32} className="text-primary mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform md:w-10 md:h-10" />
                    <p className="text-white font-black text-sm md:text-base">Upload Bank Transfer Receipt</p>
                    <p className="text-slate-500 text-[8px] md:text-[10px] uppercase font-bold mt-1">{paymentFile ? paymentFile.name : 'Image, PNG or PDF (Max 5MB)'}</p>
                    <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <label className="flex items-start gap-3 md:gap-4 cursor-pointer">
                    <input type="checkbox" name="consent1" required className="mt-1" checked={formData.consent1} onChange={handleCheckbox} />
                    <span className="text-slate-500 text-[10px] md:text-xs font-bold leading-relaxed">I verify that the uploaded proof is authentic and matches the Soneri Bank transfer.</span>
                  </label>
                  <label className="flex items-start gap-3 md:gap-4 cursor-pointer">
                    <input type="checkbox" name="consent2" required className="mt-1" checked={formData.consent2} onChange={handleCheckbox} />
                    <span className="text-slate-500 text-[10px] md:text-xs font-bold leading-relaxed">I agree to the Lead More Institute privacy and academic policies.</span>
                  </label>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 md:py-6 rounded-2xl md:rounded-3xl shadow-2xl transition-all uppercase tracking-widest text-[10px] md:text-xs">
                   {loading ? "Synchronizing..." : "Submit Enrollment Request"}
                </button>
              </form>
            </MotionDiv>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollNow;
