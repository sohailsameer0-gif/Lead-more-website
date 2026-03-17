
import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaUserLock, FaDatabase, FaRegFileAlt } from 'react-icons/fa';

const PrivacyPolicy: React.FC = () => {
  const MotionDiv = motion.div as any;

  const sections = [
    {
      title: "1. Information We Collect",
      icon: FaDatabase,
      content: "We collect personal identification information including Full Name, Email, WhatsApp/Phone Number, and Academic Background during enrollment for programs such as NEBOSH, IRCA, and OTHM. We also securely collect payment proof (screenshots/receipts) for admission verification."
    },
    {
      title: "2. How We Use Your Data",
      icon: FaRegFileAlt,
      content: "Your data is primarily used to process your academic registrations with international awarding bodies (NEBOSH UK, IRCA, etc.), verify payment authenticity, and facilitate the delivery of certification documents to your provided address in Peshawar or elsewhere."
    },
    {
      title: "3. Data Protection & Security",
      icon: FaUserLock,
      content: "Lead More (SMC-Private) Limited employs secure cloud-based encryption (via Firebase) to protect your sensitive documents. Payment information is used solely for verification and is not stored for future transactions."
    },
    {
      title: "4. Third-Party Disclosure",
      icon: FaShieldAlt,
      content: "We only share your information with accredited international educational boards and logistics partners for certification purposes. We do not sell or trade your personal data to marketing third parties."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Header */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center brightness-[0.2] scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?q=80&w=1920')" }}
        />
        <div className="relative z-10 text-center px-4 pt-10">
          <span className="inline-block bg-primary/20 backdrop-blur-md border border-primary/30 text-primary px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            Institutional Standards
          </span>
          <h1 className="text-5xl md:text-6xl font-display font-black text-white mb-6 tracking-tight">Privacy <span className="text-primary">Governance</span></h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg font-medium">
            How Lead More Institute protects your academic and personal information.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-24">
        <div className="space-y-16">
          {sections.map((section, idx) => (
            <MotionDiv 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-10 md:p-12 rounded-[48px] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-8 items-start"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary shadow-inner flex-shrink-0">
                <section.icon size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{section.title}</h3>
                <p className="text-slate-500 text-lg leading-relaxed font-medium">
                  {section.content}
                </p>
              </div>
            </MotionDiv>
          ))}
        </div>

        <MotionDiv 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 p-12 bg-slate-900 rounded-[56px] text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32" />
          <h4 className="text-xl font-black mb-4">Questions about your data?</h4>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">Contact our Compliance Office at Lead More Institute Peshawar for any inquiries regarding data rectification.</p>
          <a href="mailto:info@leadmore.uk" className="text-primary font-black uppercase tracking-widest text-xs border-b-2 border-primary/30 hover:border-primary transition-all pb-1">info@leadmore.uk</a>
        </MotionDiv>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
