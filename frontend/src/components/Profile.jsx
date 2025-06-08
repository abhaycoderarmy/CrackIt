import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, Download, MapPin, Calendar, Briefcase, Building2, Users, TrendingUp, Settings, Shield, BarChart3, UserCheck, Building, Globe, Eye, Plus, FileText } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const {user} = useSelector(store=>store.auth);

    // Role-based rendering functions
    const renderStudentSections = () => (
        <>
            {/* Skills Section - Student Only */}
            <div className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 mb-8'>
                <h2 className='text-xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
                    <div className='h-8 w-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center'>
                        <Briefcase className='h-4 w-4 text-white' />
                    </div>
                    Skills & Expertise
                </h2>
                
                <div className='flex flex-wrap gap-3'>
                    {user?.profile?.skills?.length > 0 ? (
                        user.profile.skills.map((skill, index) => (
                            <Badge 
                                key={index} 
                                className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200 hover:from-emerald-200 hover:to-teal-200 transition-all duration-200 transform hover:scale-105 shadow-sm text-sm font-medium rounded-full"
                            >
                                {skill}
                            </Badge>
                        ))
                    ) : (
                        <div className='text-center w-full py-8'>
                            <div className='h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <Briefcase className='h-8 w-8 text-gray-400' />
                            </div>
                            <p className='text-gray-500 mb-4'>No skills added yet</p>
                            <Button 
                                variant="outline" 
                                onClick={() => setOpen(true)}
                                className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                            >
                                Add Skills
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Applied Jobs Section - Student Only */}
            <div className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
                    <h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
                        <div className='h-8 w-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center'>
                            <Briefcase className='h-4 w-4 text-white' />
                        </div>
                        Applied Jobs
                    </h2>
                    <Badge className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200 px-3 py-1 rounded-full">
                        Recent Applications
                    </Badge>
                </div>
                
                <div className='overflow-hidden rounded-xl border border-gray-200'>
                    <AppliedJobTable />
                </div>
            </div>
        </>
    );

    const renderRecruiterSections = () => (
        <>
            {/* Recruiter Welcome Section */}
            {/* <div className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 mb-8'>
                <h2 className='text-xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
                    <div className='h-8 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center'>
                        <Users className='h-4 w-4 text-white' />
                    </div>
                    Recruiter Dashboard
                </h2>
                
                <div className='text-center py-8'>
                    <div className='h-20 w-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <Users className='h-10 w-10 text-blue-600' />
                    </div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>Welcome to Your Recruiter Profile</h3>
                    <p className='text-gray-600 max-w-md mx-auto'>
                        As a recruiter, you can manage your profile information including your name, email, phone number, profile picture, and bio. 
                        Use the "Edit Profile" button above to update your information.
                    </p>
                </div>
            </div> */}

            {/* Profile Information Summary */}
            <div className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6'>
                <h2 className='text-xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
                    <div className='h-8 w-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center'>
                        <UserCheck className='h-4 w-4 text-white' />
                    </div>
                    Profile Information
                </h2>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100'>
                        <div className='flex items-center gap-3'>
                            <div className='h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center'>
                                <Contact className='h-5 w-5 text-white' />
                            </div>
                            <div>
                                <p className='text-sm text-gray-500 font-medium'>Full Name</p>
                                <p className='text-gray-800 font-semibold'>{user?.fullname || 'Not set'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className='p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100'>
                        <div className='flex items-center gap-3'>
                            <div className='h-10 w-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center'>
                                <Shield className='h-5 w-5 text-white' />
                            </div>
                            <div>
                                <p className='text-sm text-gray-500 font-medium'>Account Type</p>
                                <p className='text-gray-800 font-semibold capitalize'>{user?.role || 'Recruiter'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className='p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100'>
                        <div className='flex items-center gap-3'>
                            <div className='h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center'>
                                <Calendar className='h-5 w-5 text-white' />
                            </div>
                            <div>
                                <p className='text-sm text-gray-500 font-medium'>Member Since</p>
                                <p className='text-gray-800 font-semibold'>{new Date(user?.createdAt || Date.now()).getFullYear()}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className='p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100'>
                        <div className='flex items-center gap-3'>
                            <div className='h-10 w-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center'>
                                <div className={`h-3 w-3 rounded-full ${user?.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            </div>
                            <div>
                                <p className='text-sm text-gray-500 font-medium'>Account Status</p>
                                <p className='text-gray-800 font-semibold capitalize'>{user?.status || 'Active'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* <div className='mt-6 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200'>
                    <h4 className='text-sm font-semibold text-gray-700 mb-2'>Bio</h4>
                    <p className='text-gray-600 text-sm leading-relaxed'>
                        {user?.profile?.bio || 'No bio added yet. Click "Edit Profile" to add your professional bio.'}
                    </p>
                </div> */}
            </div>
        </>
    );

    const renderAdminSections = () => (
        <>
            {/* Admin Dashboard Stats */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
                <div className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg p-6'>
                    <div className='flex items-center gap-3 mb-4'>
                        <div className='h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center'>
                            <Users className='h-5 w-5 text-white' />
                        </div>
                        <div>
                            <p className='text-sm text-gray-500'>Total Users</p>
                            <p className='text-2xl font-bold text-gray-900'>0</p>
                        </div>
                    </div>
                </div>
                
                <div className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg p-6'>
                    <div className='flex items-center gap-3 mb-4'>
                        <div className='h-10 w-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center'>
                            <Briefcase className='h-5 w-5 text-white' />
                        </div>
                        <div>
                            <p className='text-sm text-gray-500'>Active Jobs</p>
                            <p className='text-2xl font-bold text-gray-900'>0</p>
                        </div>
                    </div>
                </div>
                
                <div className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg p-6'>
                    <div className='flex items-center gap-3 mb-4'>
                        <div className='h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
                            <Building2 className='h-5 w-5 text-white' />
                        </div>
                        <div>
                            <p className='text-sm text-gray-500'>Companies</p>
                            <p className='text-2xl font-bold text-gray-900'>0</p>
                        </div>
                    </div>
                </div>
                
                <div className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg p-6'>
                    <div className='flex items-center gap-3 mb-4'>
                        <div className='h-10 w-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center'>
                            <TrendingUp className='h-5 w-5 text-white' />
                        </div>
                        <div>
                            <p className='text-sm text-gray-500'>Applications</p>
                            <p className='text-2xl font-bold text-gray-900'>0</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin Management Sections */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
                {/* User Management */}
                <div className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6'>
                    <div className='flex items-center justify-between mb-6'>
                        <h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
                            <div className='h-8 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center'>
                                <UserCheck className='h-4 w-4 text-white' />
                            </div>
                            User Management
                        </h2>
                        <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View All
                        </Button>
                    </div>
                    
                    <div className='space-y-3'>
                        <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                            <span className='text-sm text-gray-600'>Active Students</span>
                            <Badge variant="secondary">0</Badge>
                        </div>
                        <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                            <span className='text-sm text-gray-600'>Active Recruiters</span>
                            <Badge variant="secondary">0</Badge>
                        </div>
                        <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                            <span className='text-sm text-gray-600'>Blocked Users</span>
                            <Badge variant="destructive">0</Badge>
                        </div>
                    </div>
                </div>

                {/* System Overview */}
                <div className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6'>
                    <div className='flex items-center justify-between mb-6'>
                        <h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
                            <div className='h-8 w-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center'>
                                <Settings className='h-4 w-4 text-white' />
                            </div>
                            System Overview
                        </h2>
                        <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </Button>
                    </div>
                    
                    <div className='space-y-4'>
                        <div className='flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200'>
                            <div className='flex items-center gap-2'>
                                <div className='h-2 w-2 bg-green-500 rounded-full'></div>
                                <span className='text-sm text-gray-600'>System Status</span>
                            </div>
                            <Badge className="bg-green-100 text-green-700">Operational</Badge>
                        </div>
                        <div className='flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200'>
                            <span className='text-sm text-gray-600'>Platform Version</span>
                            <Badge variant="secondary">v1.0.0</Badge>
                        </div>
                        <div className='flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200'>
                            <span className='text-sm text-gray-600'>Last Updated</span>
                            <span className='text-sm text-gray-500'>{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Navbar />
            
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Main Profile Card - Common for all roles */}
                <div className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 sm:p-8 lg:p-12 mb-8'>
                    <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8'>
                        <div className='flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1'>
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                                <Avatar className="relative h-28 w-28 sm:h-32 sm:w-32 lg:h-36 lg:w-36 ring-4 ring-white shadow-xl">
                                    <AvatarImage 
                                        src={user?.profile?.profilePhoto || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"} 
                                        alt={`${user?.fullname || 'User'}'s profile`}
                                        className="object-cover" 
                                    />
                                </Avatar>
                            </div>
                            
                            <div className='flex-1 text-center sm:text-left space-y-3'>
                                <div>
                                    <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent'>
                                        {user?.fullname || 'Your Name'}
                                    </h1>
                                    <p className='text-gray-600 text-base sm:text-lg mt-2 leading-relaxed max-w-2xl'>
                                        {user?.profile?.bio || `Professional ${user?.role || 'user'} profile. Add your bio to showcase your expertise and experience.`}
                                    </p>
                                </div>
                                
                                <div className='flex flex-wrap justify-center sm:justify-start gap-4 pt-2'>
                                    <div className='flex items-center gap-2 text-sm text-gray-500'>
                                        <Calendar className='h-4 w-4' />
                                        <span>Member since {new Date(user?.createdAt || Date.now()).getFullYear()}</span>
                                    </div>
                                    <div className='flex items-center gap-2 text-sm text-gray-500'>
                                        <Shield className='h-4 w-4' />
                                        <span className="capitalize">{user?.role || 'User'}</span>
                                    </div>
                                    <div className='flex items-center gap-2 text-sm text-gray-500'>
                                        <div className={`h-2 w-2 rounded-full ${user?.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <span className="capitalize">{user?.status || 'Active'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <Button 
                            onClick={() => setOpen(true)} 
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-6 py-3 rounded-xl"
                            size="lg"
                        >
                            <Pen className="h-4 w-4 mr-2" />
                            Edit Profile
                        </Button>
                    </div>
                </div>

                {/* Contact Information - Common for all roles */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
                    <div className={`${user?.role === 'student' ? 'lg:col-span-2' : 'lg:col-span-3'} bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6`}>
                        <h2 className='text-xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
                            <div className='h-8 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center'>
                                <Contact className='h-4 w-4 text-white' />
                            </div>
                            Contact Information
                        </h2>
                        
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors duration-200'>
                                <div className='h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md'>
                                    <Mail className='h-5 w-5 text-white' />
                                </div>
                                <div>
                                    <p className='text-sm text-gray-500 font-medium'>Email Address</p>
                                    <p className='text-gray-800 font-semibold'>{user?.email || 'email@example.com'}</p>
                                </div>
                            </div>
                            
                            <div className='flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors duration-200'>
                                <div className='h-10 w-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md'>
                                    <Contact className='h-5 w-5 text-white' />
                                </div>
                                <div>
                                    <p className='text-sm text-gray-500 font-medium'>Phone Number</p>
                                    <p className='text-gray-800 font-semibold'>{user?.phoneNumber || '+1 (555) 123-4567'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resume Section - Only for students */}
                    {user?.role === 'student' && (
                        <div className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6'>
                            <h2 className='text-xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
                                <div className='h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
                                    <Download className='h-4 w-4 text-white' />
                                </div>
                                Resume
                            </h2>
                            
                            {user?.profile?.resume ? (
                                <div className='space-y-4'>
                                    <div className='p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100'>
                                        <p className='text-sm text-gray-600 mb-2'>Current Resume</p>
                                        <a 
                                            target='_blank' 
                                            href={user.profile.resume} 
                                            className='text-purple-600 hover:text-purple-800 font-semibold hover:underline cursor-pointer transition-colors duration-200 flex items-center gap-2'
                                            rel="noopener noreferrer"
                                        >
                                            <Download className='h-4 w-4' />
                                            {user.profile.resumeOriginalName || 'Resume.pdf'}
                                        </a>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
                                        onClick={() => {
                                            if (user.profile.resume) {
                                                const link = document.createElement('a');
                                                link.href = user.profile.resume;
                                                link.download = user.profile.resumeOriginalName || 'resume.pdf';
                                                link.target = '_blank';
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                            }
                                        }}
                                    >
                                        <Download className='h-4 w-4 mr-2' />
                                        Download Resume
                                    </Button>
                                </div>
                            ) : (
                                <div className='text-center py-8'>
                                    <div className='h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                        <Download className='h-8 w-8 text-gray-400' />
                                    </div>
                                    <p className='text-gray-500 mb-4'>No resume uploaded</p>
                                    <Button variant="outline" className="w-full" onClick={() => setOpen(true)}>
                                        Upload Resume
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Role-specific sections */}
                {user?.role === 'student' && renderStudentSections()}
                {user?.role === 'recruiter' && renderRecruiterSections()}
                {user?.role === 'admin' && renderAdminSections()}
            </div>

            {/* Update Profile Dialog */}
            <UpdateProfileDialog open={open} setOpen={setOpen}/>
        </div>
    )
}

export default Profile