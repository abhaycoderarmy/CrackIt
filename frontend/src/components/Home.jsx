import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import NewsletterSection from './NewsletterSection'
import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/recruiter/dashboard");
    }
    else if (user?.role === 'student') {
      navigate("/student/dashboard");
    }
    else if (user?.role === 'admin') {
      navigate("/admin/dashboard");
    }
    else {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      <NewsletterSection />
      <Footer />
    </div>
  )
}

export default Home