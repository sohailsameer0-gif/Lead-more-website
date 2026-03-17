
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { Partner } from '../types';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaSave, FaHandshake, FaImage } from 'react-icons/fa';

import { uploadToCloudinary } from '../utils/cloudinary';

const PartnersAdmin: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<Partner>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Use Real-Time sync for the admin view as well
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'partners'), (snap) => {
      const list: Partner[] = [];
      snap.forEach(doc => list.push({ ...doc.data(), id: doc.id } as Partner));
      setPartners(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let logoUrl = currentItem.logo || '';
      if (imageFile) logoUrl = await uploadToCloudinary(imageFile);

      const finalData = {
          name: currentItem.name || 'Unnamed Partner',
          desc: currentItem.desc || 'Institutional Partner',
          logo: logoUrl,
          updatedAt: serverTimestamp()
      };

      if (currentItem.id) {
          await setDoc(doc(db, 'partners', currentItem.id), finalData, { merge: true });
      } else {
          await addDoc(collection(db, 'partners'), { ...finalData, createdAt: serverTimestamp() });
      }
      setIsModalOpen(false);
      setImageFile(null);
    } catch (err: any) {
        alert(`Registry Sync Failed: ${err.message}`);
    } finally {
        setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Expel this partner?")) {
      try {
        await deleteDoc(doc(db, 'partners', id));
      } catch (error) {
        console.error("Error deleting partner:", error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Accreditation Registry</h1>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">Institutional Logo Board</p>
        </div>
        <button onClick={() => { setCurrentItem({}); setImageFile(null); setIsModalOpen(true); }} className="bg-primary hover:bg-orange-600 text-white px-10 py-5 rounded-2xl font-black shadow-2xl flex items-center gap-3 transition-all active:scale-95">
            <FaPlus /> Enroll Partner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {partners.map(p => (
          <div key={p.id} className="bg-white rounded-[40px] shadow-sm p-10 border border-slate-100 flex flex-col items-center text-center hover:shadow-2xl transition-all group">
            <div className="h-48 w-full flex items-center justify-center bg-slate-50 rounded-[32px] mb-8 p-10 border border-slate-50">
                <img src={p.logo} alt={p.name} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-black text-slate-800 text-xl tracking-tight mb-8">{p.name}</h3>
            <div className="flex gap-4 w-full">
              <button onClick={() => { setCurrentItem(p); setImageFile(null); setIsModalOpen(true); }} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-black text-[10px] uppercase hover:bg-primary hover:text-white transition-all">Modify</button>
              <button onClick={() => handleDelete(p.id)} className="flex-1 bg-red-50 text-red-500 py-4 rounded-xl font-black text-[10px] uppercase hover:bg-red-500 hover:text-white transition-all">Expel</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-xl p-4">
          <div className="bg-white rounded-[56px] shadow-2xl p-12 w-full max-w-md relative overflow-hidden">
            {uploading && <div className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary mb-4"></div><p className="font-black text-[10px] uppercase tracking-widest text-primary">Synchronizing...</p></div>}
            <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Partner Detail</h2>
            <form onSubmit={handleSave} className="space-y-6">
              <input type="text" placeholder="Name" required className="w-full px-8 py-5 rounded-2xl border-2 border-slate-100 font-black text-slate-800" value={currentItem.name || ''} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} />
              <div className="p-10 bg-slate-50 rounded-3xl border-4 border-dashed border-slate-200 text-center relative">
                  <p className="text-[10px] font-black uppercase text-slate-400">Click to Upload Brandmark</p>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              <button type="submit" className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl">Sync Registry</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnersAdmin;
