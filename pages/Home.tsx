
import React from 'react';
import Slider from 'react-slick';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaArrowRight, FaStar, FaPlus, FaMinus, FaShieldAlt, FaQuoteLeft, FaLaptopCode, FaUniversity
} from 'react-icons/fa';
import { useCourses, useFAQ, usePartners, useReviews, useTeam } from '../hooks/useFirestore';

const MotionDiv = motion.div as any;

const Home: React.FC = () => {
  const { courses } = useCourses();
  const { data: faq } = useFAQ();
  const { data: partners } = usePartners();
  const { reviews } = useReviews();
  const { team } = useTeam();

  const TypedCountUp = CountUp as any;

  const heroSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    fade: true,
    arrows: false,
  };

  const partnerSettings = {
    dots: false,
    infinite: partners.length > 2, 
    speed: 3000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: false,
    arrows: false,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } }
    ]
  };

  const reviewSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };

  const defaultReviews = [
    { id: '1', name: 'Muhammad Ahmed', role: 'NEBOSH IGC Certified', text: 'The training at Lead More was exceptional. The instructors simplified the IDIP Level 6 modules which helped me secure a job in Dubai.', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200' },
    { id: '2', name: 'Zainab Bibi', role: 'IRCA ISO Auditor', text: 'Lead More Peshawar is the best place for health and safety. Their campus facilities and dedicated instructors make learning easy.', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200' },
    { id: '3', name: 'Syed Hassan Shah', role: 'OSHA Professional', text: 'Highly recommended for anyone looking to build a career in HSE. Professional environment and globally recognized certifications.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200' }
  ];

  const actualReviews = reviews.length > 0 ? reviews : defaultReviews;

  return (
    <div className="relative overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="relative h-[65vh] md:h-[70vh] min-h-[450px] overflow-hidden">
        <Slider {...heroSettings} className="h-full">
          {[
            {
              img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1920",
              title: "NEBOSH IDIP Level 06 & IRCA ISO",
              desc: "Pakistan's Premier Institute for International Safety & Quality Certifications."
            },
            {
              img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1920",
              title: "Institutional Training Excellence",
              desc: "Peshawar's leading safety center with state-of-the-art facilities and expert faculty."
            }
          ].map((slide, index) => (
            <div key={index} className="relative h-[65vh] md:h-[70vh] min-h-[450px] outline-none">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.img})` }} />
              <div className="absolute inset-0 bg-slate-900/60" />
              <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex flex-col justify-center">
                <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
                  <span className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 border border-primary/30">
                    <FaShieldAlt /> Accredited Provider
                  </span>
                  <h1 className="text-3xl md:text-5xl font-display font-black text-white leading-[1.15] mb-4">{String(slide.title)}</h1>
                  <p className="text-sm md:text-lg text-slate-200 mb-8 font-medium max-w-lg">{String(slide.desc)}</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/courses" className="bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-black text-xs uppercase tracking-widest transition-all text-center">
                      Curriculum
                    </Link>
                    <Link to="/enroll" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3 rounded-lg font-black text-xs uppercase tracking-widest transition-all text-center">
                      Enroll Today
                    </Link>
                  </div>
                </MotionDiv>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* STATS GRID */}
      <section className="relative z-20 -mt-10 md:-mt-14 max-w-6xl mx-auto px-6">
        <div className="glass shadow-xl rounded-2xl p-6 md:p-8 border border-white/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Academic Years', end: 13, suffix: '+' },
              { label: 'Certified Alumni', end: 2000, suffix: '+' },
              { label: 'Available Courses', end: 150, suffix: '+' },
              { label: 'Global Affiliations', end: 50, suffix: '+' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <h3 className="text-2xl md:text-3xl font-display font-black text-slate-900 mb-1 leading-none">
                  <TypedCountUp end={item.end} duration={2} enableScrollSpy />
                  {String(item.suffix)}
                </h3>
                <p className="text-slate-500 font-black uppercase text-[8px] md:text-[9px] tracking-widest">{String(item.label)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACCREDITATIONS */}
      <section className="py-12 bg-white/40">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8">Institutional Partners & Accreditation</p>
          <div className="px-2">
            <Slider {...partnerSettings}>
              {partners.map((p) => (
                <div key={p.id} className="px-3 outline-none">
                  <div className="bg-white rounded-xl p-3 md:p-4 h-24 md:h-32 flex items-center justify-center border border-slate-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden">
                    <img 
                      src={String(p.logo)} 
                      alt={String(p.name)} 
                      className="max-h-full max-w-full object-contain transition-all duration-500 transform group-hover:scale-105" 
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* FEATURED PROGRAMS */}
      <section className="py-16 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div className="max-w-xl">
              <h2 className="text-2xl md:text-3xl font-display font-black text-slate-900 mb-2">Academic <span className="text-primary">Safety</span> Excellence</h2>
              <p className="text-slate-500 text-xs md:text-sm font-medium">NEBOSH, IGC, and IRCA ISO Lead Auditor programs.</p>
            </div>
            <Link to="/courses" className="text-primary font-black uppercase tracking-widest text-[8px] flex items-center gap-2 group bg-white px-5 py-2 rounded-lg shadow-sm border border-slate-100">
              View All <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {courses.slice(0, 3).map((course) => (
              <MotionDiv key={course.id} whileHover={{ y: -5 }} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 flex flex-col group h-full">
                <div className="h-44 md:h-52 relative overflow-hidden">
                  <img src={String(course.image)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={String(course.title)} />
                  <div className="absolute top-4 right-4 bg-primary text-white text-[8px] font-black px-3 py-1 rounded-full shadow-lg">{String(course.fee)}</div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-md border border-white/20 ${course.courseType === 'video' ? 'bg-secondary/60' : 'bg-primary/60'}`}>
                      {String(course.courseType === 'video' ? 'Online' : 'Campus')}
                    </span>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <h3 className="text-lg md:text-xl font-display font-black text-slate-900 mb-2 line-clamp-1">{String(course.title)}</h3>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 w-fit mb-4">{String(course.duration)}</p>
                  <p className="text-slate-500 text-xs mb-8 line-clamp-3 font-medium leading-relaxed">{String(course.description)}</p>
                  <Link to={`/courses/${course.id}`} className="mt-auto block text-center py-3 bg-slate-950 text-white hover:bg-primary transition-all rounded-xl font-black text-[8px] uppercase tracking-widest">
                    Details
                  </Link>
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERT FACULTY */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="text-primary font-black uppercase tracking-[0.3em] text-[8px] mb-2 block">Institutional Faculty</span>
          <h2 className="text-2xl md:text-3xl font-display font-black text-slate-900 mb-12 tracking-tight">Learn from <span className="text-primary">Certified</span> Experts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {(team.length > 0 ? team : [...Array(4)]).map((member, idx) => (
              <MotionDiv key={member?.id || idx} className="group flex flex-col items-center">
                <div className="w-24 h-24 md:w-40 md:h-40 rounded-2xl md:rounded-[32px] overflow-hidden mb-3 md:mb-4 border-4 border-slate-50 shadow-md group-hover:border-white transition-all">
                  <img src={String(member?.image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800')} className="w-full h-full object-cover transition-all duration-700" alt={String(member?.name)} />
                </div>
                <h4 className="text-xs md:text-base font-black text-slate-900 group-hover:text-primary transition-colors">{String(member?.name || 'Faculty Member')}</h4>
                <p className="text-primary font-black uppercase tracking-widest text-[7px] md:text-[8px] bg-orange-50 px-3 py-1 rounded-lg border border-orange-100 mt-1">{String(member?.role || 'Instructor')}</p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* STUDENT SUCCESS STORIES */}
      <section className="py-16 bg-slate-900 overflow-hidden relative">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <span className="text-primary font-black uppercase tracking-[0.3em] text-[8px] mb-2 block">Alumni Success</span>
            <h2 className="text-2xl md:text-3xl font-display font-black text-white mb-3">Student <span className="text-primary">Success</span> Stories</h2>
            <p className="text-slate-400 font-medium text-xs max-w-xl mx-auto">Real experiences from our certified Pakistani alumni working globally.</p>
          </div>
          
          <div className="px-2">
            <Slider {...reviewSettings}>
              {actualReviews.map((r) => (
                <div key={r.id} className="px-3 outline-none">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 h-full flex flex-col relative group hover:bg-white/10 transition-all">
                    <FaQuoteLeft className="text-primary text-2xl opacity-20 absolute top-6 right-6" />
                    <div className="flex gap-1 mb-4 text-yellow-400">
                      {[...Array(5)].map((_, i) => <FaStar key={i} size={10} />)}
                    </div>
                    <p className="text-slate-200 italic leading-relaxed text-xs md:text-sm mb-8 flex-grow">"{String(r.text)}"</p>
                    <div className="flex items-center gap-3 mt-auto border-t border-white/5 pt-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border border-primary/30 shadow-xl flex-shrink-0">
                        {r.image ? <img src={String(r.image)} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-black bg-primary text-white text-base">{String(r.name).charAt(0)}</div>}
                      </div>
                      <div>
                        <h5 className="font-black text-white text-xs md:text-sm">{String(r.name)}</h5>
                        <p className="text-[7px] md:text-[8px] text-primary font-black uppercase tracking-widest">{String(r.role || 'Graduate')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* FAQ HELP DESK */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-primary font-black uppercase tracking-[0.3em] text-[8px] mb-2 block">Help Desk</span>
            <h2 className="text-2xl md:text-3xl font-display font-black text-slate-900 tracking-tight">Common <span className="text-primary">Questions</span></h2>
          </div>
          <div className="space-y-4">
            {faq.map((item) => (
              <FAQItem key={item.id} question={String(item.question)} answer={String(item.answer)} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

const FAQItem: React.FC<{question: string, answer: string}> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className={`rounded-xl border transition-all duration-300 ${isOpen ? 'bg-slate-50 border-primary/20 shadow-md' : 'bg-white border-slate-100'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-5 md:p-6 text-left outline-none group">
        <span className="font-bold text-slate-800 text-sm md:text-base group-hover:text-primary transition-colors">{String(question)}</span>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ml-4 ${isOpen ? 'bg-primary text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
          {isOpen ? <FaMinus size={8} /> : <FaPlus size={8} />}
        </div>
      </button>
      {isOpen && (
        <MotionDiv initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="px-5 md:px-6 pb-6 text-slate-600 text-xs md:text-sm leading-relaxed font-medium">
          {String(answer)}
        </MotionDiv>
      )}
    </div>
  );
};

export default Home;
