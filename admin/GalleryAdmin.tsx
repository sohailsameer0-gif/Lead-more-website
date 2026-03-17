
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, setDoc, addDoc, serverTimestamp, deleteDoc, query, orderBy } from 'firebase/firestore';
import { GalleryItem } from '../types';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaSave, FaImage, FaCloudUploadAlt, FaCheckSquare, FaSquare, FaLayerGroup } from 'react-icons/fa';

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/djrxx2wuz/image/upload";
const UPLOAD_PRESET = "ml_default";

const GalleryAdmin: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<GalleryItem>>({});
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const list: GalleryItem[] = [];
      snap.forEach(doc => list.push({ ...doc.data(), id: doc.id } as GalleryItem));
      setGallery(list);
      setSelectedIds([]);
    } catch (err: any) {
      console.error("Gallery Fetch Error:", err);
      try {
        const snap = await getDocs(collection(db, 'gallery'));
        const list: GalleryItem[] = [];
        snap.forEach(doc => list.push({ ...doc.data(), id: doc.id } as GalleryItem));
        setGallery(list);
      } catch (innerErr) {
        console.error("Gallery Fallback Fetch Error:", innerErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGallery(); }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

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
    
    if (imageFiles.length === 0 && !currentItem.imageUrl) {
      alert("Please select at least one image asset.");
      return;
    }

    setUploading(true);
    console.log("Starting Gallery Asset Synchronization with Cloudinary...");

    try {
      if (currentItem.id) {
        let imageUrl = currentItem.imageUrl || '';
        if (imageFiles.length > 0) {
          imageUrl = await uploadToCloudinary(imageFiles[0]);
        }

        const finalData = {
          title: currentItem.title || 'Untitled Asset',
          description: currentItem.description || '',
          category: currentItem.category || 'General',
          imageUrl: imageUrl,
          updatedAt: serverTimestamp()
        };
        await setDoc(doc(db, 'gallery', currentItem.id), finalData, { merge: true });
      } 
      else {
        const total = imageFiles.length;
        setUploadProgress({ current: 0, total });

        for (let i = 0; i < total; i++) {
          const file = imageFiles[i];
          setUploadProgress({ current: i + 1, total });
          const imageUrl = await uploadToCloudinary(file);

          const baseTitle = currentItem.title || 'Gallery Asset';
          const displayTitle = total > 1 ? `${baseTitle} (${i + 1})` : baseTitle;

          await addDoc(collection(db, 'gallery'), {
            title: displayTitle,
            description: currentItem.description || '',
            category: currentItem.category || 'General',
            imageUrl: imageUrl,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }
      }
      
      setIsModalOpen(false);
      setImageFiles([]);
      setCurrentItem({});
      await fetchGallery();
      alert("Institutional Media Bank Synchronized via Cloudinary!");
    } catch (err: any) {
      console.error("Gallery Sync Error:", err);
      alert(`Media Sync Failed: ${err.message}`);
    } finally {
      setUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Permanently expel this asset from the registry?")) {
      try {
        await deleteDoc(doc(db, 'gallery', id));
        await fetchGallery();
      } catch (err: any) {
        alert("Expulsion failed: " + err.message);
      }
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="p-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Media Registry</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">Institutional Visual Archives</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => { setCurrentItem({}); setImageFiles([]); setIsModalOpen(true); }} 
            className="bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-3 transition-all hover:bg-orange-600 active:scale-95"
          >
            <FaLayerGroup /> Enroll Media
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-32 text-center flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary shadow-lg mb-6"></div>
          <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Accessing Media Bank...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {gallery.map(item => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <div key={item.id} className={`bg-white rounded-2xl shadow-sm overflow-hidden border transition-all group relative ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-slate-100'}`}>
                <div className="h-48 relative overflow-hidden bg-slate-100">
                  <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button onClick={() => { setCurrentItem(item); setImageFiles([]); setIsModalOpen(true); }} className="p-2 bg-white text-blue-600 rounded-lg shadow hover:bg-blue-50">
                      <FaEdit size={14} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-white text-red-500 rounded-lg shadow hover:bg-red-50">
                      <FaTrash size={14} />
                    </button>
                  </div>
                  <button onClick={() => toggleSelect(item.id)} className="absolute top-2 left-2 z-10 text-2xl drop-shadow-md transition-colors">
                    {isSelected ? <FaCheckSquare className="text-primary" /> : <FaSquare className="text-white/70 hover:text-white" />}
                  </button>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-slate-800 text-sm truncate">{item.title || 'Untitled Asset'}</h4>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest">{item.category}</p>
                    <p className="text-[9px] text-slate-400">
                      {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : ''}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          {gallery.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-300 font-black uppercase tracking-[0.4em] text-xs border-4 border-dashed border-slate-100 rounded-[48px]">
              No records in media registry.
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/90 p-4 backdrop-blur-xl">
          <div className="bg-white rounded-[48px] shadow-2xl p-12 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fadeIn relative overflow-hidden">
            
            {uploading && (
                <div className="absolute inset-0 bg-white/95 z-[120] flex flex-col items-center justify-center backdrop-blur-md">
                   <div className="relative mb-6">
                      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary shadow-xl"></div>
                      <div className="absolute inset-0 flex items-center justify-center font-black text-primary text-xs">
                          {uploadProgress.total > 0 ? Math.round((uploadProgress.current / uploadProgress.total) * 100) : 0}%
                      </div>
                   </div>
                   <h2 className="font-black text-slate-900 text-2xl tracking-tight">Cloudinary Sync Active</h2>
                   <p className="text-slate-500 mt-2 font-bold uppercase tracking-widest text-[10px]">Processing {uploadProgress.current} of {uploadProgress.total} assets...</p>
                </div>
            )}

            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{currentItem.id ? 'Asset Revision' : 'New Archive Entry'}</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Update institutional visual archives</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-full transition-colors"><FaTimes size={24} /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Archive Title</label>
                    <input type="text" placeholder="e.g. NEBOSH IGC Batch 2024" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none transition-all font-black text-slate-800 bg-slate-50" value={currentItem.title || ''} onChange={e => setCurrentItem({...currentItem, title: e.target.value})} />
                </div>
                
                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Archive Category</label>
                    <select className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none transition-all bg-slate-50 font-black text-slate-700" value={currentItem.category || 'General'} onChange={e => setCurrentItem({...currentItem, category: e.target.value})}>
                        <option value="General">General Records</option>
                        <option value="Training">Technical Training</option>
                        <option value="Events">Institutional Events</option>
                        <option value="Campus">Campus Infrastructure</option>
                        <option value="Certificates">Ceremony Archives</option>
                    </select>
                </div>

                <div className="p-10 bg-slate-950 rounded-[40px] border-4 border-dashed border-primary/20 relative text-center group transition-all hover:border-primary overflow-hidden">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                        <FaCloudUploadAlt size={32} />
                    </div>
                    
                    {imageFiles.length > 0 ? (
                       <div className="space-y-2">
                          <p className="text-white font-black text-sm">{imageFiles.length} Assets Staged</p>
                          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Ready for synchronization</p>
                       </div>
                    ) : currentItem.imageUrl ? (
                       <div className="relative">
                          <img src={currentItem.imageUrl} className="h-24 mx-auto rounded-xl border-2 border-white/10 shadow-lg mb-2" />
                          <p className="text-[10px] text-slate-400 uppercase font-black">Current Stored Record</p>
                       </div>
                    ) : (
                       <div className="space-y-1">
                          <p className="text-white font-black">Select Media Assets</p>
                          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Multiple selection permitted</p>
                       </div>
                    )}
                    
                    <input 
                        type="file" 
                        accept="image/*" 
                        multiple={!currentItem.id}
                        onChange={handleFileChange} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                    />
                  </div>
                </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-5 rounded-2xl text-slate-400 font-black uppercase text-[10px] tracking-widest">Discard</button>
                <button type="submit" disabled={uploading} className="flex-1 bg-slate-950 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl transition-all disabled:opacity-50">
                  {uploading ? "Syncing..." : <><FaSave /> Start Sync</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryAdmin;
