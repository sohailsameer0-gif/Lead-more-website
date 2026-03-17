
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AllCourses from './pages/AllCourses';
import CourseDetails from './pages/CourseDetails';
import EnrollNow from './pages/EnrollNow';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import Gallery from './pages/Gallery';
import PrivacyPolicy from './pages/PrivacyPolicy';
import WhatsAppButton from './components/WhatsAppButton';

// Admin Imports
import Login from './admin/Login';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import CoursesAdmin from './admin/CoursesAdmin';
import EnrollmentsAdmin from './admin/EnrollmentsAdmin';
import ReviewsAdmin from './admin/ReviewsAdmin';
import TeamAdmin from './admin/TeamAdmin';
import FAQAdmin from './admin/FAQAdmin';
import PartnersAdmin from './admin/PartnersAdmin';
import GalleryAdmin from './admin/GalleryAdmin';
import MessagesAdmin from './admin/MessagesAdmin';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const PublicLayout = ({ children }: { children?: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
    <WhatsAppButton />
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/courses" element={<PublicLayout><AllCourses /></PublicLayout>} />
          <Route path="/courses/:id" element={<PublicLayout><CourseDetails /></PublicLayout>} />
          <Route path="/enroll" element={<PublicLayout><EnrollNow /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactUs /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutUs /></PublicLayout>} />
          <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
          <Route path="/privacy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="messages" element={<MessagesAdmin />} />
            <Route path="courses" element={<CoursesAdmin />} />
            <Route path="enrollments" element={<EnrollmentsAdmin />} />
            <Route path="gallery" element={<GalleryAdmin />} />
            <Route path="reviews" element={<ReviewsAdmin />} />
            <Route path="team" element={<TeamAdmin />} />
            <Route path="faq" element={<FAQAdmin />} />
            <Route path="partners" element={<PartnersAdmin />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
