import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { setAllApplicants } from '@/redux/applicationSlice';
import { toast } from 'sonner';
import { EMAIL_API_END_POINT } from '../../config/api';
import Navbar from '../shared/Navbar';
import { 
  MoreHorizontal, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Calendar, 
  Eye, 
  Send,
  Download,
  MapPin,
  Briefcase,
  GraduationCap,
  Star,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Building,
  Loader2,
  Filter
} from 'lucide-react'

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsManagement = () => {
  const { applicants } = useSelector(store => store.application);
  const params = useParams();
  const dispatch = useDispatch();
  
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: '',
    message: ''
  });

  // Fetch all applicants from database
  const fetchAllApplicants = async () => {
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
      dispatch(setAllApplicants(res.data.job));
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch applicants');
    }
  };

  useEffect(() => {
    fetchAllApplicants();
  }, [params.id, dispatch]);

  // Handle status updates with proper data refresh
  const statusHandler = async (status, id) => {
    if (isUpdatingStatus) return; // Prevent multiple clicks
    
    try {
      setIsUpdatingStatus(true);
      
      const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, 
        { status }, 
        { withCredentials: true }
      );
      
      if (res.data.success) {
        toast.success(res.data.message);
        
        // Refresh the applicants data immediately after status update
        await fetchAllApplicants();
        
        // Show email dialog for sending notification
        const applicant = applicants?.applications?.find(app => app._id === id);
        if (applicant) {
          setSelectedApplicant(applicant);
          setEmailData({
            subject: `Application Status Update - ${status}`,
            message: status === 'Accepted' 
              ? `Dear ${applicant.applicant.fullname},\n\nCongratulations! We are pleased to inform you that your application has been accepted. We will contact you soon with next steps.\n\nBest regards,\nHR Team`
              : `Dear ${applicant.applicant.fullname},\n\nThank you for your interest in our position. After careful consideration, we have decided to move forward with other candidates. We appreciate the time you invested in the application process.\n\nBest regards,\nHR Team`
          });
          setIsEmailOpen(true);
        }
      }
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Send email notification function
  const sendEmail = async () => {
    if (!emailData.subject.trim() || !emailData.message.trim()) {
      toast.error('Please fill in both subject and message');
      return;
    }

    if (!selectedApplicant?.applicant?.email) {
      toast.error('Applicant email not found');
      return;
    }

    try {
      setIsEmailSending(true);
      
      const response = await axios.post(EMAIL_API_END_POINT, {
        to: selectedApplicant.applicant.email,
        subject: emailData.subject,
        message: emailData.message
      });

      if (response.data.success) {
        toast.success('Email sent successfully!');
        setEmailData({ subject: '', message: '' });
        setIsEmailOpen(false);
      } else {
        throw new Error(response.data.error || 'Failed to send email');
      }
      
    } catch (error) {
      console.error('Error sending email:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to send email';
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsEmailSending(false);
    }
  };

  // Handle manual email sending
  const handleManualEmail = (applicant) => {
    setSelectedApplicant(applicant);
    setEmailData({
      subject: 'Regarding Your Job Application',
      message: `Dear ${applicant.applicant.fullname},\n\nThank you for your interest in our position. We wanted to reach out to you regarding your application.\n\nBest regards,\nHR Team`
    });
    setIsEmailOpen(true);
  };

  // Get status badge component - normalize status values
  const getStatusBadge = (status) => {
    // Normalize status to handle different possible values
    const normalizedStatus = status ? status.toLowerCase() : '';
    
    switch (normalizedStatus) {
      case 'accepted':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Accepted</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</span>;
    }
  };

  // Filter applicants based on status - normalize comparisons
  const filteredApplicants = applicants?.applications?.filter(app => {
    if (statusFilter === 'All') return true;
    
    const appStatus = app.status ? app.status.toLowerCase() : '';
    const filterStatus = statusFilter.toLowerCase();
    
    if (filterStatus === 'pending') {
      return !app.status || appStatus === 'pending' || appStatus === '';
    }
    
    return appStatus === filterStatus;
  }) || [];

  // Calculate stats - normalize status comparisons
  const totalApplicants = applicants?.applications?.length || 0;
  const pendingCount = applicants?.applications?.filter(app => {
    const status = app.status ? app.status.toLowerCase() : '';
    return !app.status || status === 'pending' || status === '';
  }).length || 0;
  const acceptedCount = applicants?.applications?.filter(app => 
    app.status && app.status.toLowerCase() === 'accepted'
  ).length || 0;
  const rejectedCount = applicants?.applications?.filter(app => 
    app.status && app.status.toLowerCase() === 'rejected'
  ).length || 0;

  // Get profile picture URL or generate initials
  const getProfilePicture = (applicant) => {
    if (applicant?.profile?.profilePhoto) {
      return (
        <img 
          src={applicant.profile.profilePhoto} 
          alt={applicant.fullname}
          className="h-12 w-12 rounded-full object-cover"
          onError={(e) => {
            // If image fails to load, show initials
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      );
    }
    
    // Generate initials
    const initials = applicant?.fullname
      ? applicant.fullname.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2)
      : 'NA';
    
    return (
      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
        {initials}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar/>
       
      

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Users className="h-8 w-8 mr-3 text-blue-600" />
                Applicants Management
              </h1>
              <p className="text-gray-600 mt-2">
                Total Applicants: <span className="font-semibold text-blue-600">{totalApplicants}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{totalApplicants}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-gray-900">{acceptedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{rejectedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <div className="flex space-x-2">
              {['All', 'Pending', 'Accepted', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status} ({status === 'All' ? totalApplicants : 
                    status === 'Pending' ? pendingCount :
                    status === 'Accepted' ? acceptedCount : rejectedCount})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Applicants Cards */}
        <div className="space-y-4">
          {filteredApplicants.length > 0 ? (
            filteredApplicants.map((item) => (
              <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Profile Picture */}
                    <div className="flex-shrink-0 relative">
                      {getProfilePicture(item?.applicant)}
                      {/* Fallback initials div (initially hidden) */}
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold absolute top-0 left-0" style={{display: 'none'}}>
                        {item?.applicant?.fullname
                          ? item.applicant.fullname.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2)
                          : 'NA'}
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {item?.applicant?.fullname || 'N/A'}
                        </h3>
                        {getStatusBadge(item.status)}
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {item?.applicant?.email || 'N/A'}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {item?.applicant?.phoneNumber || 'N/A'}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {item?.applicant?.createdAt ? item.applicant.createdAt.split("T")[0] : 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Resume */}
                    <div className="flex-shrink-0">
                      {item.applicant?.profile?.resume ? (
                        <a 
                          href={item?.applicant?.profile?.resume} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Resume
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">No Resume</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedApplicant(item);
                        setIsProfileOpen(true);
                      }}
                      className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>

                    <button
                      onClick={() => handleManualEmail(item)}
                      className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Email
                    </button>
                    
                    {/* Status Update Dropdown */}
                    <div className="relative group">
                      <button 
                        className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                        disabled={isUpdatingStatus}
                      >
                        {isUpdatingStatus ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <MoreHorizontal className="h-4 w-4 mr-1" />
                        )}
                        Update Status
                      </button>
                      <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg z-10 border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        {shortlistingStatus.map((status, index) => {
                          const currentStatus = item.status ? item.status.toLowerCase() : '';
                          const isCurrentStatus = currentStatus === status.toLowerCase();
                          
                          return (
                            <button
                              key={index}
                              onClick={() => statusHandler(status, item?._id)}
                              className={`block w-full text-left px-4 py-3 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                                status === 'Accepted' 
                                  ? 'text-green-700 hover:bg-green-50' 
                                  : 'text-red-700 hover:bg-red-50'
                              } ${isCurrentStatus ? 'bg-gray-100 opacity-50' : ''}`}
                              disabled={isCurrentStatus || isUpdatingStatus}
                            >
                              {status === 'Accepted' ? (
                                <div className="flex items-center">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  {isCurrentStatus ? '✓ Accepted' : 'Accept'}
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <XCircle className="h-4 w-4 mr-2" />
                                  {isCurrentStatus ? '✓ Rejected' : 'Reject'}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {statusFilter === 'All' ? 'No Applicants Found' : `No ${statusFilter} Applicants`}
              </h3>
              <p className="text-gray-500">
                {statusFilter === 'All' 
                  ? 'There are no applicants for this job position yet.' 
                  : `There are no ${statusFilter.toLowerCase()} applicants to display.`
                }
              </p>
            </div>
          )}
        </div>

        {/* Profile Modal */}
        {isProfileOpen && selectedApplicant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Applicant Profile</h2>
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center mr-4 text-white font-bold text-lg">
                    {selectedApplicant.applicant?.profile?.profilePhoto ? (
                      <img 
                        src={selectedApplicant.applicant.profile.profilePhoto} 
                        alt={selectedApplicant.applicant.fullname}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      selectedApplicant.applicant?.fullname
                        ? selectedApplicant.applicant.fullname.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2)
                        : 'NA'
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedApplicant.applicant?.fullname || 'N/A'}</h3>
                    <p className="text-gray-600">{selectedApplicant.applicant?.email || 'N/A'}</p>
                    <div className="mt-2">{getStatusBadge(selectedApplicant.status)}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{selectedApplicant.applicant?.phoneNumber || 'N/A'}</span>
                  </div>
                  
                  {selectedApplicant.applicant?.profile?.bio && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Bio</h4>
                      <p className="text-gray-700">{selectedApplicant.applicant.profile.bio}</p>
                    </div>
                  )}
                  
                  {selectedApplicant.applicant?.profile?.skills && selectedApplicant.applicant.profile.skills.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplicant.applicant.profile.skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedApplicant.applicant?.profile?.resume && (
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <a 
                        href={selectedApplicant.applicant.profile.resume} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {selectedApplicant.applicant.profile.resumeOriginalName || 'Download Resume'}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">
                      Applied on {selectedApplicant.applicant?.createdAt ? selectedApplicant.applicant.createdAt.split("T")[0] : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Modal */}
        {isEmailOpen && selectedApplicant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Send className="h-5 w-5 mr-2" />
                    Send Email
                  </h2>
                  <button
                    onClick={() => {
                      setIsEmailOpen(false);
                      setEmailData({ subject: '', message: '' });
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isEmailSending}
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">To: {selectedApplicant.applicant?.email || 'N/A'}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      value={emailData.subject}
                      onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter email subject"
                      disabled={isEmailSending}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      rows={6}
                      value={emailData.message}
                      onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your message here..."
                      disabled={isEmailSending}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setIsEmailOpen(false);
                      setEmailData({ subject: '', message: '' });
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    disabled={isEmailSending}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendEmail}
                    disabled={!emailData.subject.trim() || !emailData.message.trim() || isEmailSending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEmailSending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Email
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantsManagement;