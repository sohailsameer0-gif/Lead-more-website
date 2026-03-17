
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Certificate } from '../types';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaCertificate, FaUser, FaCalendarAlt, FaIdCard, FaGraduationCap } from 'react-icons/fa';

import { uploadToCloudinary } from '../utils/cloudinary';

const CertificatesAdmin: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<Certificate>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'certificates'), (snap) => {
      const list: Certificate[] = [];
      snap.forEach(doc => list.push({ ...doc.data(), id: doc.id } as Certificate));
      setCertificates(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = currentItem.certificateImage || '';
      if (imageFile) imageUrl = await uploadToCloudinary(imageFile);

      if (!imageUrl) throw new Error('Certificate image is required');

      const finalData = {
          studentName: currentItem.studentName || '',
          fatherName: currentItem.fatherName || '',
          courseName: currentItem.courseName || '',
          issuedDate: currentItem.issuedDate || '',
          serialNumber: currentItem.serialNumber || '',
          certificateImage: imageUrl,
          updatedAt: serverTimestamp()
      };

      if (currentItem.id) {
          await setDoc(doc(db, 'certificates', currentItem.id), finalData, { merge: true });
      } else {
          await addDoc(collection(db, 'certificates'), { ...finalData, createdAt: serverTimestamp() });
      }
      setIsModalOpen(false);
      setImageFile(null);
      setCurrentItem({});
    } catch (err: any) {
        alert(`Sync Failed: ${err.message}`);
    } finally {
        setUploading(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Certificate Registry</h1>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">Credential Management</p>
        </div>
        <button onClick={() => { setCurrentItem({}); setImageFile(null); setIsModalOpen(true); }} className="bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-3 w-full md:w-auto justify-center">
            <FaPlus /> Issue New Certificate
        </button>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm overflow-hidden border border-slate-100 overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <tr>
              <th className="px-8 py-5">Serial Number</th>
              <th className="px-8 py-5">Student Name</th>
              <th className="px-8 py-5">Course</th>
              <th className="px-8 py-5">Issued Date</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {certificates.map(cert => (
              <tr key={cert.id} className="hover:bg-slate-50">
                <td className="px-8 py-5 font-black text-primary">{cert.serialNumber}</td>
                <td className="px-8 py-5 font-black text-slate-800">{cert.studentName}</td>
                <td className="px-8 py-5 font-black text-slate-500">{cert.courseName}</td>
                <td className="px-8 py-5 font-black text-slate-500">{cert.issuedDate}</td>
                <td className="px-8 py-5 text-right flex justify-end gap-3">
                   <button onClick={() => { setCurrentItem(cert); setIsModalOpen(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FaEdit /></button>
                   <button onClick={() => { if(window.confirm('Delete this certificate?')) deleteDoc(doc(db, 'certificates', cert.id)) }} className="p-2 bg-red-50 text-red-500 rounded-lg"><FaTrash /></button>
                </td>
              </tr>
            ))}
            {certificates.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="px-8 py-10 text-center text-slate-400 font-bold">No certificates issued yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-xl p-4 overflow-y-auto">
          <div className="bg-white rounded-[48px] p-8 md:p-12 w-full max-w-2xl relative my-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-all">
              <FaTimes size={24} />
            </button>
            
            {uploading && (
              <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center font-black">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                Syncing Record...
              </div>
            )}
            
            <h2 className="text-3xl font-black mb-8 tracking-tight">Certificate Details</h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Serial / Roll Number</label>
                  <input type="text" placeholder="LM-2024-001" required className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 font-bold focus:border-primary outline-none" value={currentItem.serialNumber || ''} onChange={e => setCurrentItem({...currentItem, serialNumber: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Issued Date</label>
                  <input type="text" placeholder="March 15, 2024" required className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 font-bold focus:border-primary outline-none" value={currentItem.issuedDate || ''} onChange={e => setCurrentItem({...currentItem, issuedDate: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Student Name</label>
                  <input type="text" placeholder="Full Name" required className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 font-bold focus:border-primary outline-none" value={currentItem.studentName || ''} onChange={e => setCurrentItem({...currentItem, studentName: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Father Name</label>
                  <input type="text" placeholder="Father's Name" required className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 font-bold focus:border-primary outline-none" value={currentItem.fatherName || ''} onChange={e => setCurrentItem({...currentItem, fatherName: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Course / Trade</label>
                <input type="text" placeholder="e.g. Graphic Design" required className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 font-bold focus:border-primary outline-none" value={currentItem.courseName || ''} onChange={e => setCurrentItem({...currentItem, courseName: e.target.value})} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Certificate Image</label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    className="hidden" 
                    id="cert-image"
                    onChange={e => setImageFile(e.target.files?.[0] || null)} 
                  />
                  <label 
                    htmlFor="cert-image"
                    className="w-full px-6 py-4 rounded-2xl border-2 border-dashed border-slate-200 font-bold flex items-center justify-center gap-3 cursor-pointer hover:border-primary hover:bg-orange-50 transition-all"
                  >
                    {imageFile ? imageFile.name : currentItem.certificateImage ? 'Change Image' : 'Upload Certificate Image'}
                  </label>
                </div>
              </div>

              <button type="submit" className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary transition-all shadow-xl">
                {currentItem.id ? 'Update Certificate' : 'Issue Certificate'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatesAdmin;
