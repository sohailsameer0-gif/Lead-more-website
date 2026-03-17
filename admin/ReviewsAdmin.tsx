
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, setDoc, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { Review } from '../types';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaStar, FaSave, FaQuoteRight } from 'react-icons/fa';

import { uploadToCloudinary } from '../utils/cloudinary';

const ReviewsAdmin: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<Review>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'reviews'));
      const list: Review[] = [];
      snap.forEach(doc => list.push({ ...doc.data(), id: doc.id } as Review));
      setReviews(list);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = currentItem.image || '';

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const docId = currentItem.id;
      const finalData = { 
        name: currentItem.name || '',
        text: currentItem.text || '',
        role: currentItem.role || '',
        image: imageUrl || '',
        rating: Number(currentItem.rating) || 5,
        updatedAt: serverTimestamp()
      };

      if (docId) {
        await setDoc(doc(db, 'reviews', docId), finalData, { merge: true });
      } else {
        await addDoc(collection(db, 'reviews'), finalData);
      }
      
      alert("Story saved successfully via Cloudinary!");
      setIsModalOpen(false);
      setImageFile(null);
      fetchReviews();
    } catch (error: any) {
      console.error("Review Save Error Details:", error);
      alert(`Failed to save story. Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this student story?")) {
      try {
        await deleteDoc(doc(db, 'reviews', id));
        fetchReviews();
      } catch (err: any) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Student Success Stories</h1>
            <p className="text-slate-500 text-sm">Testimonials and feedback.</p>
        </div>
        <button onClick={() => { setCurrentItem({ rating: 5 }); setImageFile(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all">
          <FaPlus /> Add Student Story
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20">
           <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-4"></div>
           <p className="text-slate-500 font-medium">Loading stories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 flex flex-col md:flex-row gap-6 items-start hover:shadow-xl transition-all duration-300">
              <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-50 shadow-sm">
                  {review.image ? (
                      <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50 uppercase font-bold text-2xl">
                          {review.name?.charAt(0)}
                      </div>
                  )}
              </div>
              
              <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-2">
                      <div>
                          <h3 className="font-bold text-lg text-slate-800">{review.name}</h3>
                          <p className="text-sm text-primary font-bold uppercase tracking-widest text-[10px]">{review.role}</p>
                      </div>
                      <div className="flex text-yellow-400 text-xs">
                          {[...Array(review.rating || 5)].map((_, i) => <FaStar key={i} />)}
                      </div>
                  </div>
                  <div className="relative">
                    <FaQuoteRight className="absolute -top-1 -left-2 text-slate-100 text-4xl -z-10" />
                    <p className="text-slate-600 text-sm leading-relaxed italic line-clamp-3">
                        "{review.text}"
                    </p>
                  </div>
                  
                  <div className="flex gap-4 mt-6 pt-4 border-t border-slate-50">
                    <button onClick={() => { setCurrentItem(review); setImageFile(null); setIsModalOpen(true); }} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-xs font-bold transition-all">
                      <FaEdit size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(review.id)} className="flex items-center gap-2 text-red-400 hover:text-red-600 text-xs font-bold transition-all ml-auto">
                      <FaTrash size={14} /> Remove
                    </button>
                  </div>
              </div>
            </div>
          ))}
          {reviews.length === 0 && (
              <div className="col-span-full text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">No success stories published yet.</p>
              </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-slate-800">{currentItem.id ? 'Edit Story' : 'New Student Story'}</h2>
               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"><FaTimes /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Student Name</label>
                    <input type="text" placeholder="John Doe" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" value={currentItem.name || ''} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Role / Course</label>
                    <input type="text" placeholder="e.g. OSHA Student" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" value={currentItem.role || ''} onChange={e => setCurrentItem({...currentItem, role: e.target.value})} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <div className="col-span-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Student Photo</label>
                      <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-slate-100 file:text-slate-700 file:border-0 file:font-bold hover:file:bg-slate-200" />
                  </div>
                  <div className="col-span-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Rating</label>
                      <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all appearance-none bg-slate-50" value={currentItem.rating || 5} onChange={e => setCurrentItem({...currentItem, rating: Number(e.target.value)})}>
                          <option value="5">5 Stars</option>
                          <option value="4">4 Stars</option>
                          <option value="3">3 Stars</option>
                          <option value="2">2 Stars</option>
                          <option value="1">1 Star</option>
                      </select>
                  </div>
              </div>
              
              <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Testimonial</label>
                  <textarea rows={5} required placeholder="Write the review..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none" value={currentItem.text || ''} onChange={e => setCurrentItem({...currentItem, text: e.target.value})} />
              </div>

              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-all">Cancel</button>
                <button type="submit" disabled={uploading} className="flex-1 bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {uploading ? "Uploading..." : <><FaSave /> Save Story</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsAdmin;
