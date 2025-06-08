import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { 
    MapPin, 
    Building2, 
    Clock, 
    DollarSign, 
    Calendar, 
    Users, 
    Briefcase,
    ArrowLeft,
    CheckCircle,
    Star,
    Share2,
    Bookmark,
    Eye,
    TrendingUp,
    Award,
    Globe
} from 'lucide-react';

const JobDescription = () => {
    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const applyJobHandler = async () => {
        // Check if user is authenticated
        if (!user) {
            toast.error('Please login to apply for jobs');
            navigate('/signup');
            return;
        }

        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {withCredentials:true});
            
            if(res.data.success){
                setIsApplied(true);
                const updatedSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id}]}
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to apply for job');
        }
    }

    const handleCompanyProfile = () => {
        if (singleJob?.company?._id) {
            navigate(`/company/${singleJob.company._id}`);
        } else {
            toast.error('Company information not available');
        }
    };

    const handleBackToJobs = () => {
        navigate('/jobs');
    };

    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application=>application.applicant === user?._id))
                }
            } catch (error) {
                console.log(error);
                toast.error('Failed to fetch job details');
            }
        }
        fetchSingleJob(); 
    },[jobId,dispatch, user?._id]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Recently posted';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric',
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Loading state
    if (!singleJob) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading job details...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Navbar />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-4 mb-6">
                        <button 
                            onClick={handleBackToJobs}
                            className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Jobs</span>
                        </button>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                    {singleJob?.company?.logo ? (
                                        <img 
                                            src={singleJob.company.logo} 
                                            alt={singleJob.company.name}
                                            className="w-8 h-8 object-contain"
                                        />
                                    ) : (
                                        <Building2 className="w-8 h-8 text-white" />
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">{singleJob?.title}</h1>
                                    <p className="text-blue-100 text-lg">{singleJob?.company?.name || 'Company Name'}</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 mb-6">
                                <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                    <MapPin className="w-4 h-4" />
                                    <span>{singleJob?.location}</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                    <Clock className="w-4 h-4" />
                                    <span>{singleJob?.jobType}</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                    <DollarSign className="w-4 h-4" />
                                    <span>{singleJob?.salary} LPA</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                    <Users className="w-4 h-4" />
                                    <span>{singleJob?.applications?.length} Applicants</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 lg:ml-8">
                            <Button
                                variant="outline"
                                className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                                onClick={() => {
                                    if (!user) {
                                        toast.error('Please login to save jobs');
                                        navigate('/login');
                                        return;
                                    }
                                    // Add save job functionality here
                                    toast.success('Job saved!');
                                }}
                            >
                                <Bookmark className="w-4 h-4 mr-2" />
                                Save Job
                            </Button>
                            <Button
                                variant="outline"
                                className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: singleJob?.title,
                                            text: `Check out this job: ${singleJob?.title} at ${singleJob?.company?.name}`,
                                            url: window.location.href,
                                        });
                                    } else {
                                        navigator.clipboard.writeText(window.location.href);
                                        toast.success('Job link copied to clipboard!');
                                    }
                                }}
                            >
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Job Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Job Overview */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <Briefcase className="w-6 h-6 mr-3 text-blue-600" />
                                Job Overview
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Briefcase className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Role</h3>
                                            <p className="text-gray-600">{singleJob?.title}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Location</h3>
                                            <p className="text-gray-600">{singleJob?.location}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <TrendingUp className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Experience</h3>
                                            <p className="text-gray-600">{singleJob?.experienceLevel || singleJob?.experience} years</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <DollarSign className="w-4 h-4 text-yellow-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Salary</h3>
                                            <p className="text-gray-600">{singleJob?.salary} LPA</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Users className="w-4 h-4 text-red-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Applicants</h3>
                                            <p className="text-gray-600">{singleJob?.applications?.length} candidates</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Calendar className="w-4 h-4 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Posted Date</h3>
                                            <p className="text-gray-600">{formatDate(singleJob?.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Job Description */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Description</h2>
                            <div className="prose max-w-none">
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {singleJob?.description}
                                </p>
                            </div>
                        </div>

                        {/* Requirements */}
                        {singleJob?.requirements && singleJob.requirements.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h2>
                                <div className="flex flex-wrap gap-3">
                                    {singleJob.requirements.map((requirement, index) => (
                                        <Badge 
                                            key={index}
                                            className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                                        >
                                            {requirement}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Apply Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Apply Card */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Briefcase className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Apply?</h3>
                                    <p className="text-gray-600">Join {singleJob?.applications?.length} other candidates</p>
                                </div>
                                
                                <Button
                                    onClick={applyJobHandler}
                                    disabled={isApplied}
                                    className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-200 ${
                                        isApplied 
                                            ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' 
                                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:scale-105'
                                    }`}
                                >
                                    {isApplied ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <CheckCircle className="w-5 h-5" />
                                            <span>Already Applied</span>
                                        </div>
                                    ) : (
                                        'Apply Now'
                                    )}
                                </Button>
                                
                                {!isApplied && (
                                    <p className="text-sm text-gray-500 text-center mt-4">
                                        {!user ? 'Please login to apply' : 'Application takes less than 2 minutes'}
                                    </p>
                                )}
                            </div>

                            {/* Job Stats */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                                    Job Stats
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Views</span>
                                        <div className="flex items-center space-x-1">
                                            <Eye className="w-4 h-4 text-gray-400" />
                                            <span className="font-semibold">1,247</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Applications</span>
                                        <div className="flex items-center space-x-1">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <span className="font-semibold">{singleJob?.applications?.length}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Success Rate</span>
                                        <div className="flex items-center space-x-1">
                                            <Star className="w-4 h-4 text-yellow-400" />
                                            <span className="font-semibold">78%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Company Info */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                                    <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                                    About Company
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                            {singleJob?.company?.logo ? (
                                                <img 
                                                    src={singleJob.company.logo} 
                                                    alt={singleJob.company.name}
                                                    className="w-8 h-8 object-contain rounded"
                                                />
                                            ) : (
                                                <Building2 className="w-6 h-6 text-white" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{singleJob?.company?.name || 'Company Name'}</h4>
                                            <p className="text-sm text-gray-600">{singleJob?.company?.industry || 'Technology Company'}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        {singleJob?.company?.description || 'Leading technology company focused on innovation and growth.'}
                                    </p>
                                    <Button 
                                        variant="outline" 
                                        className="w-full"
                                        onClick={handleCompanyProfile}
                                    >
                                        View Company Profile
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    )
}

export default JobDescription