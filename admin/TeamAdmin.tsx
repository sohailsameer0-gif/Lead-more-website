
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, setDoc, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { TeamMember } from '../types';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaSave, FaUserCircle, FaCloudUploadAlt } from 'react-icons/fa';

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/djrxx2wuz/image/upload";
const UPLOAD_PRESET = "ml_default";

const TeamAdmin: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<TeamMember>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'team'));
      const list: TeamMember[] = [];
      snap.forEach(doc => list.push({ ...doc.data(), id: doc.id } as TeamMember));
      setTeam(list);
    } catch (err) { 
      console.error("Fetch Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchTeam(); }, []);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Cloudinary upload failed');
    }
    
    const data = await response.json();
    return data.secure_url;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;

    setUploading(true);
    try {
      let imageUrl = currentItem.image || 'https://picsum.photos/400/400';
      
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }
      
      const docId = currentItem.id;
      const finalData = { 
        name: currentItem.name || 'Staff Member',
        role: currentItem.role || 'Instructor',
        image: imageUrl,
        updatedAt: serverTimestamp()
      };
      
      if (docId) {
         await setDoc(doc(db, 'team', docId), finalData, { merge: true });
      } else {
         await addDoc(collection(db, 'team'), {
           ...finalData,
           createdAt: serverTimestamp()
         });
      }
      
      setIsModalOpen(false);
      setImageFile(null);
      setCurrentItem({});
      await fetchTeam();
      alert("Faculty profile saved successfully via Cloudinary!");
    } catch (err: any) { 
        console.error("Team Save Error Details:", err);
        alert(`Failed to save instructor. Error: ${err.message}`); 
    } finally { 
        setUploading(false); 
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this team member profile?")) {
      try {
        await deleteDoc(doc(db, 'team', id));
        setTeam(prev => prev.filter(m => m.id !== id));
      } catch (err: any) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Expert Instructors</h1>
            <p className="text-slate-500 text-sm font-medium">Manage faculty profiles and faculty credentials.</p>
        </div>
        <button 
          onClick={() => { setCurrentItem({}); setImageFile(null); setIsModalOpen(true); }} 
          className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-orange-500/20 transition-all active:scale-95"
        >
          <FaPlus /> Add Instructor
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20">
           <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary mb-4 shadow-lg"></div>
           <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Syncing Faculty...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {team.map(member => (
            <div key={member.id} className="bg-white rounded-[40px] shadow-sm overflow-hidden border border-slate-100 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
              <div className="h-64 relative overflow-hidden bg-slate-100">
                 <img src={member.image || 'https://picsum.photos/400/400'} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                 <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => { setCurrentItem(member); setImageFile(null); setIsModalOpen(true); }} className="p-3 bg-white text-blue-600 rounded-xl shadow-xl hover:bg-blue-50 transition-colors">
                        <FaEdit size={16} />
                    </button>
                    <button onClick={() => handleDelete(member.id)} className="p-3 bg-white text-red-500 rounded-xl shadow-xl hover:bg-red-50 transition-colors">
                        <FaTrash size={16} />
                    </button>
                 </div>
              </div>
              <div className="p-8 text-center bg-white relative z-10">
                <h3 className="font-black text-slate-900 text-xl leading-tight tracking-tight">{member.name}</h3>
                <p className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mt-3">{member.role}</p>
              </div>
            </div>
          ))}
          {team.length === 0 && (
              <div className="col-span-full text-center py-32 bg-slate-50 rounded-[56px] border-4 border-dashed border-slate-100">
                  <p className="text-slate-300 font-black uppercase tracking-[0.3em] text-xs">No Faculty Profiles Registered</p>
              </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-md">
          <div className="bg-white rounded-[48px] shadow-2xl p-12 w-full max-w-lg animate-fadeIn relative overflow-hidden">
            
            {uploading && (
                <div className="absolute inset-0 bg-white/90 z-50 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-6 shadow-xl"></div>
                    <h2 className="font-black text-slate-900 text-2xl tracking-tight">Cloudinary Upload...</h2>
                </div>
            )}

            <div className="flex justify-between items-center mb-10">
               <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{currentItem.id ? 'Edit Profile' : 'New Instructor'}</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Institutional Faculty Management</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-full transition-all"><FaTimes size={20} /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
              <div className="flex justify-center mb-8">
                <div className="relative w-32 h-32 rounded-[32px] bg-slate-100 overflow-hidden border-8 border-white shadow-2xl group cursor-pointer">
                    {imageFile ? (
                        <img src={URL.createObjectURL(imageFile)} className="w-full h-full object-cover" />
                    ) : currentItem.image ? (
                        <img src={currentItem.image} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-200">
                            <FaUserCircle size={64} />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <FaCloudUploadAlt size={32} />
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={e => setImageFile(e.target.files?.[0] || null)} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Dr. Salman Khan" 
                  required 
                  className="w-full px-8 py-5 rounded-2xl border-2 border-slate-100 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-800" 
                  value={currentItem.name || ''} 
                  onChange={e => setCurrentItem({...currentItem, name: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Professional Role</label>
                <input 
                  type="text" 
                  placeholder="e.g. Lead NEBOSH Trainer" 
                  required 
                  className="w-full px-8 py-5 rounded-2xl border-2 border-slate-100 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-800" 
                  value={currentItem.role || ''} 
                  onChange={e => setCurrentItem({...currentItem, role: e.target.value})} 
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 px-8 py-5 rounded-2xl text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  disabled={uploading} 
                  className="flex-1 bg-primary text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-orange-500/30 hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploading ? "Uploading..." : <><FaSave /> Save Faculty</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamAdmin;
