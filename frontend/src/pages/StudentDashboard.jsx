import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Clock, 
  IndianRupee, 
  Briefcase, 
  Building2, 
  Users, 
  BookOpen,
  TrendingUp,
  Star,
  Heart,
  Eye,
  Calendar,
  Filter,
  ChevronRight,
  Globe,
  Bookmark,
  Bell,
  User,
  Settings,
  LogOut,
  Mail,
  Phone,
  GraduationCap,
  Award,
  Target,
  Activity,
  Loader2,
  AlertCircle,
  Plus,
  ExternalLink
} from 'lucide-react';
import Footer from '../components/shared/Footer';
import Navbar from '../components/shared/Navbar';

const StudentDashboard = () => {
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  
  const [jobs, setJobs] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedJobs, setSavedJobs] = useState(new Set());
  
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    totalNewsletters: 0,
    savedJobs: 0
  });

  // API base URL
  const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

  // Fetch data from APIs
  useEffect(() => {
    // Redirect if not a student
    if (!user || user.role !== 'student') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get auth token
        const token = localStorage.getItem('token') || document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];

        const headers = {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        };

        // Fetch all jobs
        const jobsResponse = await fetch(`${API_BASE_URL}/job/get`, {
          method: 'GET',
          headers,
          credentials: 'include'
        });
        
        if (!jobsResponse.ok) {
          throw new Error(`Jobs API error: ${jobsResponse.status}`);
        }
        
        const jobsData = await jobsResponse.json();
        const fetchedJobs = jobsData.success ? jobsData.jobs : [];

        // Fetch public newsletters
        const newslettersResponse = await fetch(`${API_BASE_URL}/newsletter/public`, {
          method: 'GET',
          headers,
          credentials: 'include'
        });
        
        if (!newslettersResponse.ok) {
          throw new Error(`Newsletters API error: ${newslettersResponse.status}`);
        }
        
        const newslettersData = await newslettersResponse.json();
        const fetchedNewsletters = newslettersData.success ? newslettersData.newsletters : [];

        // Calculate total applications across all jobs
        const totalApplications = fetchedJobs.reduce((sum, job) => {
          return sum + (job.applications ? job.applications.length : 0);
        }, 0);

        // Update state
        setJobs(fetchedJobs);
        setNewsletters(fetchedNewsletters);
        
        setStats({
          totalJobs: fetchedJobs.length,
          totalApplications: totalApplications,
          totalNewsletters: fetchedNewsletters.length,
          savedJobs: savedJobs.size
        });

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate, savedJobs.size]);

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const handleApplyJob = (jobId) => {
    navigate(`/description/${jobId}`);
  };

  const handleViewNewsletter = (newsletterId) => {
    navigate(`/newsletter/${newsletterId}`);
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           job.jobType?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const StatCard = ({ icon: Icon, title, value, color, subtitle, gradient }) => (
    <div className={`rounded-2xl shadow-lg p-6 text-white relative overflow-hidden ${gradient}`}>
      <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-5 rounded-full translate-y-8 -translate-x-8"></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <Icon className="w-8 h-8" />
          <span className="text-3xl font-bold">{value}</span>
        </div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm opacity-90">{subtitle}</p>
      </div>
    </div>
  );

  const JobCard = ({ job }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            {job.company?.logo && (
              <img 
                src={job.company.logo} 
                alt={job.company.name}
                className="w-14 h-14 rounded-xl object-cover shadow-md"
              />
            )}
            <div>
              <h3 className="font-bold text-xl text-gray-900 mb-1">{job.title}</h3>
              <p className="text-gray-600 font-medium">{job.company?.name || 'Company not specified'}</p>
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              toggleSaveJob(job._id);
            }}
            className={`p-3 rounded-full transition-all duration-300 ${
              savedJobs.has(job._id) 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-5 h-5 ${savedJobs.has(job._id) ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-3 text-blue-500" />
            <span className="font-medium">{job.location || 'Location not specified'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <IndianRupee className="w-4 h-4 mr-3 text-green-500" />
            <span className="font-medium">₹{formatSalary(job.salary)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-3 text-purple-500" />
            <span className="font-medium">{job.jobType || 'Type not specified'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-3 text-orange-500" />
            <span className="font-medium">Posted {formatDate(job.createdAt)}</span>
          </div>
        </div>

        {job.description && (
          <p className="text-gray-700 text-sm mb-6 line-clamp-2">
            {job.description.substring(0, 120)}...
          </p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-600">
              {job.applications ? job.applications.length : 0} Applicants
            </span>
          </div>
          <button 
            onClick={() => handleApplyJob(job._id)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );

  const NewsletterCard = ({ newsletter }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
      {newsletter.image && (
        <div className="h-48 overflow-hidden">
          <img 
            src={newsletter.image} 
            alt={newsletter.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-3">
          <Globe className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-green-600">Public</span>
        </div>
        
        <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2">
          {newsletter.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {newsletter.content?.substring(0, 150)}...
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(newsletter.createdAt)}</span>
            </div>
            {newsletter.views && (
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{newsletter.views} views</span>
              </div>
            )}
          </div>
          <button 
            onClick={() => handleViewNewsletter(newsletter._id)}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md text-sm"
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-xl text-gray-600 font-medium">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="flex items-center space-x-3 text-red-600 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-lg font-semibold">Error Loading Dashboard</h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Welcome back, {user?.fullname || user?.name || 'Student'}! 👋
                </h1>
                <p className="text-gray-600 text-lg">Discover amazing opportunities and stay updated with industry insights</p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center space-x-3">
                  {user?.avatar && (
                    <img 
                      src={user.avatar} 
                      alt={user.fullname}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{user?.fullname || 'Student'}</p>
                    <p className="text-sm text-gray-500">{user?.profile?.course || 'Student'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard
              icon={Briefcase}
              title="Available Jobs"
              value={stats.totalJobs}
              gradient="bg-gradient-to-br from-blue-500 to-blue-600"
              subtitle="New opportunities"
            />
            <StatCard
              icon={Users}
              title="Total Applications"
              value={stats.totalApplications}
              gradient="bg-gradient-to-br from-green-500 to-green-600"
              subtitle="Across all jobs"
            />
            <StatCard
              icon={BookOpen}
              title="Newsletters"
              value={stats.totalNewsletters}
              gradient="bg-gradient-to-br from-orange-500 to-pink-500"
              subtitle="Industry insights"
            />
            <StatCard
              icon={Heart}
              title="Saved Jobs"
              value={stats.savedJobs}
              gradient="bg-gradient-to-br from-purple-500 to-purple-600"
              subtitle="Your favorites"
            />
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs by title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'full-time', 'internship', 'part-time'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Jobs Section */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Latest Job Opportunities</h2>
              <div className="text-sm text-gray-500">
                Showing {filteredJobs.length} of {jobs.length} jobs
              </div>
            </div>
            
            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredJobs.slice(0, 6).map(job => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {filteredJobs.length > 6 && (
              <div className="text-center mt-8">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg">
                  View All Jobs
                </button>
              </div>
            )}
          </div>

          {/* Newsletters Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Industry Insights</h2>
              <div className="text-sm text-gray-500">
                {newsletters.length} articles available
              </div>
            </div>
            
            {newsletters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsletters.slice(0, 6).map(newsletter => (
                  <NewsletterCard key={newsletter._id} newsletter={newsletter} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Newsletters Available</h3>
                <p className="text-gray-600">Check back later for industry insights and career tips</p>
              </div>
            )}

            {newsletters.length > 6 && (
              <div className="text-center mt-8">
                <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-lg">
                  View All Articles
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentDashboard;