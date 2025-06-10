import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IndianRupee } from "lucide-react";
import { 
  Building2, 
  Briefcase, 
  Users, 
  FileText, 
  TrendingUp, 
  Plus,
  Eye,
  Edit3,
  Trash2,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Globe,
  Lock,
  Star,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Footer from '../shared/Footer';
import Navbar from '../shared/Navbar';

const RecruiterDashboard = () => {
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    totalCompanies: 0,
    totalNewsletters: 0
  });

  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL - adjust according to your backend
  // const API_BASE_URL = 'http://localhost:8000/api/v1';

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL 
  ? `${import.meta.env.VITE_BACKEND_URL}/api/v1`
  : 'http://localhost:9000/api/v1'; // fallback

  // Navigation helper with multiple route attempts and debugging
  const safeNavigate = (routes, description, id = null) => {
    console.log(`Attempting navigation: ${description}`, id ? `ID: ${id}` : '');
    
    // If routes is a string, convert to array
    const routeArray = Array.isArray(routes) ? routes : [routes];
    
    try {
      // Try the first route
      const route = routeArray[0];
      console.log(`Navigating to: ${route}`);
      navigate(route);
    } catch (error) {
      console.error(`Navigation failed for ${description}:`, error);
      
      // Fallback: try opening in new tab
      try {
        const route = routeArray[0];
        console.log(`Fallback: Opening in new tab: ${route}`);
        window.open(route, '_blank');
      } catch (fallbackError) {
        console.error(`Fallback also failed for ${description}:`, fallbackError);
        alert(`Navigation failed for ${description}. Please check your routes configuration.`);
      }
    }
  };

  // Fetch data from APIs
  useEffect(() => {
    // Redirect if not a recruiter
    if (!user || user.role !== 'recruiter') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get auth token from localStorage/cookies
        const token = localStorage.getItem('token') || document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];

        const headers = {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        };

        // Fetch admin jobs
        const jobsResponse = await fetch(`${API_BASE_URL}/job/getadminjobs`, {
          method: 'GET',
          headers,
          credentials: 'include'
        });
        
        if (!jobsResponse.ok) {
          throw new Error(`Jobs API error: ${jobsResponse.status}`);
        }
        
        const jobsData = await jobsResponse.json();
        const fetchedJobs = jobsData.success ? jobsData.jobs : [];

        // Fetch companies
        const companiesResponse = await fetch(`${API_BASE_URL}/company/get`, {
          method: 'GET',
          headers,
          credentials: 'include'
        });
        
        if (!companiesResponse.ok) {
          throw new Error(`Companies API error: ${companiesResponse.status}`);
        }
        
        const companiesData = await companiesResponse.json();
        const fetchedCompanies = companiesData.success ? companiesData.companies : [];

        // Fetch newsletters by current user
        const newslettersResponse = await fetch(`${API_BASE_URL}/newsletter/by-author?authorId=${user._id}&includePrivate=true`, {
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
        setCompanies(fetchedCompanies);
        setNewsletters(fetchedNewsletters);
        
        setStats({
          totalJobs: fetchedJobs.length,
          totalApplications: totalApplications,
          totalCompanies: fetchedCompanies.length,
          totalNewsletters: fetchedNewsletters.length
        });

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token') || document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch(`${API_BASE_URL}/job/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        credentials: 'include'
      });

      if (response.ok) {
        const deletedJob = jobs.find(j => j._id === jobId);
        setJobs(jobs.filter(job => job._id !== jobId));
        setStats(prev => ({ 
          ...prev, 
          totalJobs: prev.totalJobs - 1,
          totalApplications: prev.totalApplications - (deletedJob?.applications?.length || 0)
        }));
        alert('Job deleted successfully!');
      } else {
        throw new Error('Failed to delete job');
      }
    } catch (err) {
      console.error('Error deleting job:', err);
      alert('Error deleting job. Please try again.');
    }
  };

  const handleDeleteNewsletter = async (newsletterId) => {
    if (!window.confirm('Are you sure you want to delete this newsletter?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token') || document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch(`${API_BASE_URL}/newsletter/${newsletterId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        credentials: 'include'
      });

      if (response.ok) {
        setNewsletters(newsletters.filter(newsletter => newsletter._id !== newsletterId));
        setStats(prev => ({ ...prev, totalNewsletters: prev.totalNewsletters - 1 }));
        alert('Newsletter deleted successfully!');
      } else {
        throw new Error('Failed to delete newsletter');
      }
    } catch (err) {
      console.error('Error deleting newsletter:', err);
      alert('Error deleting newsletter. Please try again.');
    }
  };

  // Navigation handlers with multiple route options
  const handleViewJob = (jobId) => {
    const routes = [
      `/description/${jobId}`,
      `/job/${jobId}`,
      `/job-details/${jobId}`,
      `/jobs/view/${jobId}`,
      `/view-job/${jobId}`
    ];
    safeNavigate(routes, 'View Job', jobId);
  };

  const handleEditJob = (jobId) => {
    const routes = [
      `/admin/jobs/edit/${jobId}`,
      `/admin/job/edit/${jobId}`,
      `/jobs/edit/${jobId}`,
      `/edit-job/${jobId}`,
      `/admin/jobs/${jobId}/edit`
    ];
    safeNavigate(routes, 'Edit Job', jobId);
  };

  const handleCreateJob = () => {
    const routes = [
      '/admin/jobs/create',
      '/admin/job/create',
      '/post-job',
      '/create-job',
      '/jobs/create',
      '/job/create'
    ];
    safeNavigate(routes, 'Create Job');
  };

  const handleViewNewsletter = (newsletterId) => {
    const routes = [
      `/newsletter/${newsletterId}`,
      `/newsletters/${newsletterId}`,
      `/newsletter/view/${newsletterId}`,
      `/view-newsletter/${newsletterId}`
    ];
    safeNavigate(routes, 'View Newsletter', newsletterId);
  };

  const handleEditNewsletter = (newsletterId) => {
    const routes = [
      `/newsletter/edit/${newsletterId}`,
      `/newsletters/edit/${newsletterId}`,
      `/admin/newsletter/edit/${newsletterId}`,
      `/edit-newsletter/${newsletterId}`
    ];
    safeNavigate(routes, 'Edit Newsletter', newsletterId);
  };

  const handleCreateNewsletter = () => {
    const routes = [
      '/newsletter/create',
      '/newsletters/create',
      '/create-newsletter',
      '/admin/newsletter/create'
    ];
    safeNavigate(routes, 'Create Newsletter');
  };

  const handleAddCompany = () => {
    const routes = [
    //   '/admin/companies/register',
    //   '/admin/company/register',
      '/admin/companies/create'
    //   '/admin/company/create',
    //   '/register-company',
    //   '/create-company',
    //   '/companies/register'
    ];
    safeNavigate(routes, 'Add Company');
  };

  const handleManageCompany = (companyId) => {
    const routes = [
      `/admin/companies/${companyId}`,
      
    ];
    safeNavigate(routes, 'Manage Company', companyId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    return new Intl.NumberFormat('en-IN', {
    //   style: 'currency',
    //   currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const JobCard = ({ job }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {job.company?.logo && (
            <img 
              src={job.company.logo} 
              alt={job.company.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          )}
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
            <p className="text-gray-600">{job.company?.name || 'Company not specified'}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {/* <button 
            onClick={(e) => {
              e.preventDefault();
              console.log('View job button clicked:', job._id);
              handleViewJob(job._id);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Job"
            type="button"
          >
            <Eye className="w-4 h-4" />
          </button> */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              console.log('Edit job button clicked:', job._id);
              handleEditJob(job._id);
            }}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit Job"
            type="button"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault();  
              console.log('Delete job button clicked:', job._id);
              handleDeleteJob(job._id);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Job"
            type="button"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="w-4 h-4 mr-2" />
          {job.location || 'Location not specified'}
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <IndianRupee className="w-4 h-4 mr-2" />
            {formatSalary(job.salary)}
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <Clock className="w-4 h-4 mr-2" />
          {job.jobType || 'Type not specified'} • {job.experienceLevel || 'Experience not specified'}
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <Calendar className="w-4 h-4 mr-2" />
          Posted {formatDate(job.createdAt)}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-blue-600">
            {job.applications ? job.applications.length : 0} Applications
          </span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          job.applications && job.applications.length > 10 
            ? 'bg-green-100 text-green-800' 
            : job.applications && job.applications.length > 5
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {job.applications && job.applications.length > 10 ? 'High Interest' : 
           job.applications && job.applications.length > 5 ? 'Moderate Interest' : 'New Posting'}
        </span>
      </div>
    </div>
  );

  const CompanyCard = ({ company }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          {company.logo && (
            <img 
              src={company.logo} 
              alt={company.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          )}
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{company.name}</h3>
            <p className="text-gray-600 text-sm">{company.description || 'No description available'}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        {company.location && (
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-2" />
            {company.location}
          </div>
        )}
        {company.website && (
          <div className="flex items-center text-gray-600 text-sm">
            <Globe className="w-4 h-4 mr-2" />
            <a 
              href={company.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {company.website}
            </a>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <Briefcase className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-green-600">
            {jobs.filter(job => job.company?._id === company._id || job.company === company._id).length} Active Jobs
          </span>
        </div>
        <button 
          onClick={(e) => {
            e.preventDefault();
            console.log('Manage company button clicked:', company._id);
            handleManageCompany(company._id);
          }}
          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
          type="button"
        >
          Manage
        </button>
      </div>
    </div>
  );

  const NewsletterCard = ({ newsletter }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-lg text-gray-900">{newsletter.title}</h3>
            {newsletter.isPrivate ? (
              <Lock className="w-4 h-4 text-gray-500" title="Private Newsletter" />
            ) : (
              <Globe className="w-4 h-4 text-green-500" title="Public Newsletter" />
            )}
          </div>
          <p className="text-gray-600 text-sm line-clamp-2">
            {newsletter.content?.substring(0, 150)}...
          </p>
        </div>
        <div className="flex space-x-2">
          {/* <button 
            onClick={(e) => {
              e.preventDefault();
              console.log('View newsletter button clicked:', newsletter._id);
              handleViewNewsletter(newsletter._id);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Newsletter"
            type="button"
          >
            <Eye className="w-4 h-4" />
          </button> */}
          {/* <button 
            onClick={(e) => {
              e.preventDefault();
              console.log('Edit newsletter button clicked:', newsletter._id);
              handleEditNewsletter(newsletter._id);
            }}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit Newsletter"
            type="button"
          >
            <Edit3 className="w-4 h-4" />
          </button> */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              console.log('Delete newsletter button clicked:', newsletter._id);
              handleDeleteNewsletter(newsletter._id);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Newsletter"
            type="button"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
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
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          newsletter.isPrivate 
            ? 'bg-gray-100 text-gray-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {newsletter.isPrivate ? 'Private' : 'Public'}
        </span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center space-x-3 text-red-600 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-lg font-semibold">Error Loading Dashboard</h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
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
    <div className="min-h-screen bg-gray-50 p-6">
       
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.fullname || user?.name || 'Recruiter'}!
          </h1>
          <p className="text-gray-600">Manage your jobs, companies, and newsletters all in one place</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Briefcase}
            title="Total Jobs"
            value={stats.totalJobs}
            color="text-blue-600"
            subtitle="Active job postings"
          />
          <StatCard
            icon={Users}
            title="Applications"
            value={stats.totalApplications}
            color="text-green-600"
            subtitle="Across all jobs"
          />
          <StatCard
            icon={Building2}
            title="Companies"
            value={stats.totalCompanies}
            color="text-purple-600"
            subtitle="Registered companies"
          />
          <StatCard
            icon={FileText}
            title="Newsletters"
            value={stats.totalNewsletters}
            color="text-orange-600"
            subtitle="Published articles"
          />
        </div>

        {/* Jobs Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Job Postings</h2>
            <button 
              onClick={handleCreateJob}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Job</span>
            </button>
          </div>
          
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobs.map(job => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Jobs Posted Yet</h3>
              <p className="text-gray-600 mb-4">Start by creating your first job posting</p>
              <button 
                onClick={handleCreateJob}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Post Your First Job
              </button>
            </div>
          )}
        </div>

        {/* Companies Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Companies</h2>
            <button 
              onClick={handleAddCompany}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Company</span>
            </button>
          </div>
          
          {companies.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {companies.map(company => (
                <CompanyCard key={company._id} company={company} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Companies Registered</h3>
              <p className="text-gray-600 mb-4">Register your first company to start posting jobs</p>
              <button 
                onClick={handleAddCompany}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Register Company
              </button>
            </div>
          )}
        </div>

        {/* Newsletters Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Newsletters</h2>
            <button 
              onClick={handleCreateNewsletter}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Newsletter</span>
            </button>
          </div>
          
          {newsletters.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {newsletters.map(newsletter => (
                <NewsletterCard key={newsletter._id} newsletter={newsletter} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Newsletters Published</h3>
              <p className="text-gray-600 mb-4">Share your insights by creating your first newsletter</p>
              <button 
                onClick={handleCreateNewsletter}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Create Newsletter
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

export default RecruiterDashboard;