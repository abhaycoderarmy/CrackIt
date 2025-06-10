import React, { useEffect, useState } from 'react';
import { BookOpen, Calendar, User, Lock, ArrowRight, TrendingUp, X, ChevronLeft, ChevronRight, Zap, Star, Award, Globe } from 'lucide-react';
import Footer from './shared/Footer';

const NewsletterModal = ({ newsletter, isOpen, onClose }) => {
  if (!isOpen || !newsletter) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <div className="relative bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full filter blur-xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full filter blur-xl animate-float-delayed"></div>
        </div>

        {/* Header */}
        <div className="relative flex items-center justify-between p-8 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {newsletter.title}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{newsletter.createdBy?.name || newsletter.createdBy?.fullname || 'Anonymous'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(newsletter.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="relative group p-3 hover:bg-white/10 rounded-xl transition-all duration-300"
          >
            <X className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-300" />
          </button>
        </div>

        {/* Content */}
        <div className="relative p-8 max-h-[50vh] overflow-y-auto custom-scrollbar">
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
              {newsletter.content}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative p-8 border-t border-white/10 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-xl border transition-all duration-300 ${
                newsletter.isPrivate 
                  ? 'bg-gray-500/20 text-gray-300 border-gray-500/30' 
                  : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30'
              }`}>
                {newsletter.isPrivate ? 'Private' : 'Public'}
              </span>
              {newsletter.isPrivate && <Lock className="w-4 h-4 text-gray-400" />}
            </div>
            <button
              onClick={onClose}
              className="relative group px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              <span className="relative">Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewsletterCard = ({ newsletter, onClick }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (!content || content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="group cursor-pointer transform hover:scale-105 transition-all duration-500">
      <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-r from-cyan-400/10 to-purple-500/10 rounded-full filter blur-xl"></div>
          <div className="absolute bottom-4 left-4 w-32 h-32 bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-full filter blur-xl"></div>
        </div>

        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative group/icon">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur-md opacity-50 group-hover/icon:opacity-75 transition-opacity duration-300"></div>
                <div className="relative w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-purple-300 transition-all duration-300 line-clamp-2">
                  {newsletter.title}
                </h3>
              </div>
            </div>
            {newsletter.isPrivate && (
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 group-hover:text-gray-300 transition-colors duration-300" />
              </div>
            )}
          </div>
          
          <p className="text-gray-400 mb-6 line-clamp-3 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
            {truncateContent(newsletter.content)}
          </p>
          
          <div className="flex items-center justify-between mb-4 text-sm">
            <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
              <User className="w-4 h-4" />
              <span className="truncate">{newsletter.createdBy?.name || newsletter.createdBy?.fullname || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(newsletter.createdAt)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-xl border transition-all duration-300 ${
              newsletter.isPrivate 
                ? 'bg-gray-500/20 text-gray-400 border-gray-500/30 group-hover:bg-gray-500/30' 
                : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30 group-hover:from-purple-500/30 group-hover:to-pink-500/30'
            }`}>
              {newsletter.isPrivate ? 'Private' : 'Public'}
            </span>
            <button 
              className="relative group/btn flex items-center gap-2 px-4 py-2 text-cyan-400 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg transition-all duration-300 border border-cyan-500/30 hover:border-cyan-500/50"
              onClick={() => onClick(newsletter)}
            >
              <span className="relative">Read More</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="relative bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-2xl p-6 border border-white/10 animate-pulse">
    <div className="absolute inset-0">
      <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-r from-gray-500/10 to-gray-600/10 rounded-full filter blur-xl"></div>
    </div>
    <div className="relative">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-xl"></div>
        <div className="h-6 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded flex-1"></div>
      </div>
      <div className="space-y-3 mb-4">
        <div className="h-4 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded"></div>
        <div className="h-4 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded w-3/4"></div>
        <div className="h-4 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded w-1/2"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded w-16"></div>
        <div className="h-8 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded w-20"></div>
      </div>
    </div>
  </div>
);

const NewsletterSection = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // API Configuration
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL 
  ? `${import.meta.env.VITE_BACKEND_URL}/api/v1`
  : 'http://localhost:9000/api/v1'; 

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const getAuthToken = () => {
    // Check common token storage locations
    const sources = [
      () => localStorage.getItem('authToken'),
      () => sessionStorage.getItem('token'),
      () => localStorage.getItem('token'),
      () => sessionStorage.getItem('authToken')
    ];

    for (const getToken of sources) {
      try {
        const token = getToken();
        if (token && token !== 'undefined' && token !== 'null') {
          return token;
        }
      } catch (e) {
        continue;
      }
    }
    return null;
  };

  const isValidToken = (token) => {
    if (!token || typeof token !== 'string') return false;
    
    try {
      const parts = token.split('.');
      return parts.length === 3 && parts.every(part => part.length > 0);
    } catch {
      return false;
    }
  };

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      const isAuthenticated = token && isValidToken(token);
      
      // Endpoints to try in order
      const endpoints = [
        `${API_BASE_URL}/newsletter${isAuthenticated ? '' : '/public'}`,
        `${API_BASE_URL}/newsletter/public`,
        `${API_BASE_URL}/newsletter`,
        '/api/v1/newsletter/public',
        '/api/v1/newsletter'
      ];

      const headers = {
        'Content-Type': 'application/json',
        ...(isAuthenticated && { 'Authorization': `Bearer ${token}` })
      };

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, { method: 'GET', headers });
          
          if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType?.includes('application/json')) {
              const data = await response.json();
              
              let newsletterData = [];
              if (data.success && data.newsletters) {
                newsletterData = data.newsletters;
              } else if (Array.isArray(data)) {
                newsletterData = data;
              }

              // Filter private newsletters for unauthenticated users
              const filteredNewsletters = isAuthenticated 
                ? newsletterData 
                : newsletterData.filter(newsletter => !newsletter.isPrivate);
              
              setNewsletters(filteredNewsletters);
              return; // Success, exit function
            }
          }
        } catch (fetchError) {
          console.log(`Failed to fetch from ${endpoint}:`, fetchError.message);
        }
      }

      // If all endpoints fail
      setError('Unable to load newsletters. Please check your connection and try again.');
      
    } catch (err) {
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterClick = (newsletter) => {
    setSelectedNewsletter(newsletter);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNewsletter(null);
  };

  const displayedNewsletters = showAll ? newsletters : newsletters.slice(0, 6);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-60 right-20 w-56 h-56 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-screen filter blur-xl opacity-15 animate-float-delayed"></div>
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-float-slow"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mix-blend-screen filter blur-xl opacity-25 animate-pulse"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Spotlight Effect */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-radial from-white/5 to-transparent rounded-full filter blur-3xl"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-white/10 rounded-full animate-float-particle-${i % 3}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Premium Badge */}
          <div className="mb-8 transform hover:scale-110 transition-all duration-500 cursor-pointer inline-block">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-pulse"></div>
              <span className="relative inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 text-white font-bold text-sm shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-full"></div>
                <TrendingUp className="w-5 h-5 mr-3 text-cyan-400" />
                <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  📰 Latest Industry Insights
                </span>
                <div className="ml-3 flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                  ))}
                </div>
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6">
              <span className="block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                Stay Ahead with
              </span>
              <span 
                className="block"
                style={{
                  background: 'linear-gradient(45deg, #06b6d4, #8b5cf6, #ec4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.3))'
                }}
              >
                Expert Insights
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover the latest trends, tips, and insights from industry experts. 
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold"> AI-curated content</span> 
              {" "}to accelerate your career growth.
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="relative group mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-xl"></div>
              <div className="relative text-8xl mb-4 filter drop-shadow-2xl">📰</div>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4">
              Unable to Load Newsletters
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">{error}</p>
            <button 
              onClick={fetchNewsletters}
              className="relative group px-8 py-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 text-white rounded-2xl font-bold shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Try Again
              </span>
            </button>
          </div>
        ) : newsletters.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative group mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-full blur-xl"></div>
              <div className="relative text-8xl mb-4 filter drop-shadow-2xl">📝</div>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent mb-4">
              No Newsletters Available
            </h3>
            <p className="text-gray-400 text-lg">Check back later for the latest insights and updates</p>
          </div>
        ) : (
          <>
            {/* Newsletter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {displayedNewsletters.map((newsletter) => (
                <NewsletterCard 
                  key={newsletter._id} 
                  newsletter={newsletter} 
                  onClick={handleNewsletterClick}
                />
              ))}
            </div>
            
            {/* Show More/Less Button */}
            {newsletters.length > 6 && (
              <div className="text-center">
                <button 
                  className="relative group px-12 py-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/25 overflow-hidden"
                  onClick={() => setShowAll(!showAll)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center">
                    {showAll ? (
                      <>
                        <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <Globe className="w-5 h-5 mr-2" />
                        View All Newsletters ({newsletters.length})
                        <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Newsletter Modal */}
      <NewsletterModal 
        newsletter={selectedNewsletter}
        isOpen={showModal}
        onClose={handleCloseModal}
      />

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-180deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(90deg); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        
        .animate-float-particle-0 { animation: float 3s ease-in-out infinite; }
        .animate-float-particle-1 { animation: float-delayed 4s ease-in-out infinite; }
        .animate-float-particle-2 { animation: float-slow 5s ease-in-out infinite; }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgb(51 65 85 / 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #06b6d4, #8b5cf6);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #0891b2, #7c3aed);
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default NewsletterSection;