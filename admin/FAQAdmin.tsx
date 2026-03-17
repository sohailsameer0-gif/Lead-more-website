
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, setDoc, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { FAQItem } from '../types';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaQuestionCircle, FaSave } from 'react-icons/fa';

const FAQAdmin: React.FC = () => {
  const [faq, setFaq] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<FAQItem>>({});
  const [saving, setSaving] = useState(false);

  const fetchFAQ = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'faq'));
      const list: FAQItem[] = [];
      snap.forEach(doc => list.push({ ...doc.data(), id: doc.id } as FAQItem));
      setFaq(list);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { fetchFAQ(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { id } = currentItem as any;
      const finalData = {
          question: currentItem.question || '',
          answer: currentItem.answer || '',
          updatedAt: serverTimestamp()
      };

      if (id) {
          await setDoc(doc(db, 'faq', id), finalData, { merge: true });
      } else {
          await addDoc(collection(db, 'faq'), finalData);
      }
      setIsModalOpen(false);
      fetchFAQ();
      alert("FAQ updated successfully.");
    } catch (err: any) {
        console.error("FAQ Save Error:", err);
        alert("Error: " + err.message);
    } finally {
        setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this FAQ entry?")) {
      try {
          await deleteDoc(doc(db, 'faq', id));
          fetchFAQ();
      } catch (err: any) {
          alert("Error deleting: " + err.message);
      }
    }
  };

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Support Center FAQ</h1>
            <p className="text-slate-500 text-sm">Common questions students ask before enrolling.</p>
        </div>
        <button onClick={() => { setCurrentItem({}); setIsModalOpen(true); }} className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all">
          <FaPlus /> Add New FAQ
        </button>
      </div>

      {loading ? (
          <div className="p-20 text-center flex flex-col items-center">
             <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-4"></div>
             <p className="text-slate-500 font-medium">Loading FAQs...</p>
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faq.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 flex flex-col hover:shadow-lg transition-all border-l-4 border-l-primary">
              <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-slate-800 text-lg leading-tight flex-1 pr-4">{item.question}</h3>
                  <div className="flex gap-1">
                      <button onClick={() => { setCurrentItem(item); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><FaEdit /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><FaTrash /></button>
                  </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed flex-grow">{item.answer}</p>
            </div>
          ))}
          {faq.length === 0 && (
              <div className="col-span-full py-20 text-center text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-2xl">
                  No FAQs found. Add common questions here.
              </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                       <FaQuestionCircle size={20} />
                   </div>
                   <h2 className="text-xl font-bold text-slate-800">FAQ Content</h2>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><FaTimes size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Question Title</label>
                  <input type="text" placeholder="e.g. Is the certification globally recognized?" required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" value={currentItem.question || ''} onChange={e => setCurrentItem({...currentItem, question: e.target.value})} />
              </div>
              <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Detailed Answer</label>
                  <textarea rows={5} placeholder="Provide a clear, helpful response..." required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none" value={currentItem.answer || ''} onChange={e => setCurrentItem({...currentItem, answer: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-all">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {saving ? "Saving..." : <><FaSave /> Save Entry</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQAdmin;
