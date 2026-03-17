
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Course } from '../types';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaImage, FaUniversity, FaLaptopCode } from 'react-icons/fa';

import { uploadToCloudinary } from '../utils/cloudinary';

const CoursesAdmin: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<Course>>({ courseType: 'campus' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'courses'), (snap) => {
      const list: Course[] = [];
      snap.forEach(doc => list.push({ ...doc.data(), id: doc.id } as Course));
      setCourses(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = currentItem.image || '';
      if (imageFile) imageUrl = await uploadToCloudinary(imageFile);

      const finalData = {
          title: currentItem.title || 'New Program',
          description: currentItem.description || '',
          fee: currentItem.fee || 'N/A',
          duration: currentItem.duration || 'N/A',
          courseType: currentItem.courseType || 'campus',
          image: imageUrl,
          updatedAt: serverTimestamp()
      };

      if (currentItem.id) {
          await setDoc(doc(db, 'courses', currentItem.id), finalData, { merge: true });
      } else {
          await addDoc(collection(db, 'courses'), { ...finalData, createdAt: serverTimestamp() });
      }
      setIsModalOpen(false);
      setImageFile(null);
    } catch (err: any) {
        alert(`Sync Failed: ${err.message}`);
    } finally {
        setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Program Registry</h1>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">Curriculum Management</p>
        </div>
        <button onClick={() => { setCurrentItem({ courseType: 'campus' }); setImageFile(null); setIsModalOpen(true); }} className="bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-3">
            <FaPlus /> New Program
        </button>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm overflow-hidden border border-slate-100">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <tr>
              <th className="px-8 py-5">Title</th>
              <th className="px-8 py-5">Type</th>
              <th className="px-8 py-5">Fee</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.map(course => (
              <tr key={course.id} className="hover:bg-slate-50">
                <td className="px-8 py-5 font-black text-slate-800">{course.title}</td>
                <td className="px-8 py-5 uppercase text-[10px] font-black text-primary">{course.courseType}</td>
                <td className="px-8 py-5 font-black text-slate-500">{course.fee}</td>
                <td className="px-8 py-5 text-right flex justify-end gap-3">
                   <button onClick={() => { setCurrentItem(course); setIsModalOpen(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FaEdit /></button>
                   <button onClick={() => deleteDoc(doc(db, 'courses', course.id))} className="p-2 bg-red-50 text-red-500 rounded-lg"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-xl p-4">
          <div className="bg-white rounded-[48px] p-12 w-full max-w-2xl relative overflow-hidden">
            {uploading && <div className="absolute inset-0 bg-white/95 z-50 flex items-center justify-center font-black">Syncing Record...</div>}
            <h2 className="text-3xl font-black mb-8 tracking-tight">Course Detail</h2>
            <form onSubmit={handleSave} className="space-y-6">
              <input type="text" placeholder="Title" required className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 font-bold" value={currentItem.title || ''} onChange={e => setCurrentItem({...currentItem, title: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Fee" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 font-bold" value={currentItem.fee || ''} onChange={e => setCurrentItem({...currentItem, fee: e.target.value})} />
                <input type="text" placeholder="Duration" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 font-bold" value={currentItem.duration || ''} onChange={e => setCurrentItem({...currentItem, duration: e.target.value})} />
              </div>
              <textarea placeholder="Description" rows={4} className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 font-medium" value={currentItem.description || ''} onChange={e => setCurrentItem({...currentItem, description: e.target.value})} />
              <div className="flex gap-4">
                <div className={`flex-1 p-4 border-2 rounded-2xl cursor-pointer text-center font-black text-[10px] uppercase ${currentItem.courseType === 'campus' ? 'border-primary bg-orange-50' : 'border-slate-50'}`} onClick={() => setCurrentItem({...currentItem, courseType: 'campus'})}>Campus</div>
                <div className={`flex-1 p-4 border-2 rounded-2xl cursor-pointer text-center font-black text-[10px] uppercase ${currentItem.courseType === 'video' ? 'border-primary bg-orange-50' : 'border-slate-50'}`} onClick={() => setCurrentItem({...currentItem, courseType: 'video'})}>Video Academy</div>
              </div>
              <input type="file" onChange={e => setImageFile(e.target.files?.[0] || null)} />
              <button type="submit" className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest">Save Program</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesAdmin;
