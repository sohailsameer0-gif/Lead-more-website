
import React, { useState } from 'react';
import { useGallery } from '../hooks/useFirestore';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSearchPlus } from 'react-icons/fa';

const Gallery: React.FC = () => {
  // Fix: useGallery returns { data, loading } from useCollection, so we destructure data as gallery
  const { data: gallery, loading } = useGallery();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');

  // Fix: Cast motion components to any to resolve property missing errors in environment
  const MotionDiv = motion.div as any;
  const MotionImg = motion.img as any;

  const categories = ['All', ...new Set(gallery.map(item => item.category))];
  const filteredGallery = filter === 'All' ? gallery : gallery.filter(item => item.category === filter);

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* PROFESSIONAL HEADER */}
      <section className="relative h-[450px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center brightness-[0.35] scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-50" />
        <div className="relative z-10 text-center px-4 pt-20">
           <span className="inline-block bg-primary/20 backdrop-blur-md border border-primary/30 text-primary px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            Training Sessions & Graduations
          </span>
          <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tight">Media <span className="text-primary">Gallery</span></h1>
          <p className="text-slate-200 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
            Witness our commitment to health and safety excellence through technical training workshops and industrial seminars.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10 -mt-16">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all border ${
                filter === cat 
                ? 'bg-primary border-primary text-white shadow-xl shadow-orange-500/20' 
                : 'bg-white border-slate-200 text-slate-600 hover:border-primary hover:text-primary shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
            <p className="mt-6 text-slate-400 font-black uppercase tracking-widest text-[10px]">Syncing Media...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-32">
            <AnimatePresence>
              {filteredGallery.map((item) => (
                <MotionDiv
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-[32px] overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer group border border-slate-100"
                  onClick={() => setSelectedImage(item.imageUrl)}
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                      <FaSearchPlus className="text-white text-4xl mb-6 self-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-6 group-hover:translate-y-0" />
                      <h3 className="text-white font-black text-xl leading-tight">{item.title}</h3>
                      <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-2">{item.category}</p>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredGallery.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[48px] border-4 border-dashed border-slate-100 shadow-inner">
            <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-xs">No media found in this category.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <MotionDiv 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 p-6 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-8 right-8 text-white hover:text-primary transition-colors p-4 bg-white/10 rounded-full">
              <FaTimes size={24} />
            </button>
            <MotionImg 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              src={selectedImage} 
              className="max-w-full max-h-[85vh] object-contain rounded-[40px] shadow-[0_0_80px_rgba(0,0,0,0.5)] border-8 border-white/5"
              onClick={(e) => e.stopPropagation()}
            />
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
