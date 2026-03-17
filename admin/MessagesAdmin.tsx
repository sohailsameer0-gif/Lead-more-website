
import React from 'react';
import { useMessages } from '../hooks/useFirestore';
import { db } from '../firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { FaTrash, FaEnvelope, FaClock, FaUser } from 'react-icons/fa';

const MessagesAdmin: React.FC = () => {
  const { messages, loading } = useMessages();

  const deleteMessage = async (id: string) => {
    if (window.confirm("Permanently delete this inquiry?")) {
      try {
        await deleteDoc(doc(db, 'messages', id));
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  const formatTimestamp = (ts: any) => {
    if (!ts) return 'Recent';
    if (typeof ts.toDate === 'function') return ts.toDate().toLocaleString();
    if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleString();
    return String(ts);
  };

  return (
    <div className="p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Institutional Inbox</h1>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Student Admissions Inquiries</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-20 text-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div></div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-start hover:shadow-lg transition-all group">
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg text-[8px] font-black uppercase text-slate-500 tracking-widest"><FaUser className="text-primary" /> {String(msg.name)}</span>
                  <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg text-[8px] font-black uppercase text-slate-500 tracking-widest"><FaEnvelope className="text-primary" /> {String(msg.email)}</span>
                  <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg text-[8px] font-black uppercase text-slate-500 tracking-widest"><FaClock className="text-primary" /> {formatTimestamp(msg.createdAt)}</span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">{String(msg.subject)}</h3>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed bg-slate-50 p-6 rounded-xl">{String(msg.message)}</p>
                </div>
              </div>
              <button onClick={() => deleteMessage(msg.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all md:opacity-0 group-hover:opacity-100"><FaTrash size={12}/></button>
            </div>
          ))
        )}
        {!loading && messages.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-black uppercase tracking-widest text-[9px]">Your inbox is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesAdmin;
