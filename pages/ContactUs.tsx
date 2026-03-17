
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FaPhoneAlt, FaEnvelope, FaPaperPlane, FaWhatsapp, FaCheckCircle } from 'react-icons/fa';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const MotionDiv = motion.div as any;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'unread'
      });
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-24">
           <h1 className="text-6xl font-display font-black text-slate-900 mb-6">Admissions <span className="text-primary">Help Desk</span></h1>
           <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">Get in touch with our certified support team for global enrollment assistance.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass p-12 rounded-[56px] shadow-2xl space-y-10 border border-white">
              <h3 className="text-2xl font-display font-black text-slate-900">Direct Channels</h3>
              <div className="space-y-10">
                <a href="tel:+923482312380" className="flex items-center gap-6 group">
                  <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all"><FaPhoneAlt size={24} /></div>
                  <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Call Admissions</p><p className="text-xl font-bold text-slate-800">+92 348 2312380</p></div>
                </a>
                <a href="mailto:info@leadmore.uk" className="flex items-center gap-6 group">
                  <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all"><FaEnvelope size={24} /></div>
                  <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Official Email</p><p className="text-xl font-bold text-slate-800">info@leadmore.uk</p></div>
                </a>
              </div>
              <a href="https://wa.me/923482312380" className="flex items-center justify-center gap-3 w-full py-6 bg-green-500 hover:bg-green-600 text-white rounded-[32px] font-black text-xs uppercase tracking-widest shadow-2xl transition-all"><FaWhatsapp size={24} /> WhatsApp Live Chat</a>
            </div>
          </div>

          <div className="lg:col-span-3">
            <MotionDiv initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[64px] shadow-2xl p-16 border border-slate-100 relative overflow-hidden">
              {success ? (
                <div className="text-center py-20 animate-fadeIn">
                   <FaCheckCircle size={80} className="text-green-500 mx-auto mb-8" />
                   <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Message Sent!</h3>
                   <p className="text-slate-500 font-medium text-lg mb-10">Our support team has received your inquiry and will contact you shortly.</p>
                   <button onClick={() => setSuccess(false)} className="bg-primary text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest">Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <input type="text" placeholder="Full Name" required className="w-full px-8 py-5 rounded-3xl border-2 border-slate-50 focus:border-primary outline-none font-bold text-slate-800 bg-slate-50" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <input type="email" placeholder="Email Address" required className="w-full px-8 py-5 rounded-3xl border-2 border-slate-50 focus:border-primary outline-none font-bold text-slate-800 bg-slate-50" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <input type="text" placeholder="Inquiry Subject" required className="w-full px-8 py-5 rounded-3xl border-2 border-slate-50 focus:border-primary outline-none font-bold text-slate-800 bg-slate-50" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                  <textarea rows={5} placeholder="How can we assist you today?" required className="w-full px-8 py-6 rounded-[40px] border-2 border-slate-50 focus:border-primary outline-none font-medium text-slate-600 leading-relaxed bg-slate-50 resize-none" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                  <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-orange-600 text-white font-black py-6 rounded-[32px] shadow-2xl transition-all flex items-center justify-center gap-4 text-xs uppercase tracking-widest">
                    {loading ? 'Sending...' : <><FaPaperPlane /> Dispatch Inquiry</>}
                  </button>
                </form>
              )}
            </MotionDiv>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
