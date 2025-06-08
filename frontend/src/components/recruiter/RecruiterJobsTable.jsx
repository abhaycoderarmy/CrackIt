import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal, Building2, Calendar, Briefcase, Users } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AdminJobsTable = () => { 
    const {allAdminJobs, searchJobByText} = useSelector(store=>store.job);

    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();

    useEffect(()=>{ 
        console.log('called');
        const filteredJobs = allAdminJobs.filter((job)=>{
            if(!searchJobByText){
                return true;
            };
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());

        });
        setFilterJobs(filteredJobs);
    },[allAdminJobs,searchJobByText])

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    return (
        <div className="w-full space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Job Postings</h2>
                    <p className="text-gray-600 mt-1">Manage your company's job listings</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Briefcase className="w-4 h-4" />
                    <span>{filterJobs.length} active jobs</span>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Table>
                    <TableCaption>A list of your recent posted jobs</TableCaption>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead className="font-semibold text-gray-700 py-4">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    Company
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4" />
                                    Role
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Date Posted
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Applicants
                                </div>
                            </TableHead>
                            <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filterJobs?.map((job) => (
                            <TableRow key={job._id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border-2 border-gray-100">
                                            <AvatarImage 
                                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${job?.company?.name}`} 
                                                alt={job?.company?.name}
                                            />
                                        </Avatar>
                                        <div>
                                            <div className="font-medium text-gray-900">{job?.company?.name}</div>
                                            <div className="text-sm text-gray-500">Company</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="font-medium text-gray-900">{job?.title}</div>
                                    <div className="text-sm text-gray-500">Position</div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="font-medium text-gray-900">{formatDate(job?.createdAt)}</div>
                                    <div className="text-sm text-gray-500">Posted</div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="font-medium text-gray-900">{job?.applications?.length || 0}</div>
                                    <div className="text-sm text-gray-500">Total</div>
                                </TableCell>
                                <TableCell className="text-right py-4">
                                    <Popover>
                                        <PopoverTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-100 h-10 w-10">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-48 p-2" align="end">
                                            <div 
                                                onClick={() => navigate(`/admin/jobs/edit/${job._id}`)} 
                                                className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4 text-blue-600" />
                                                <span>Edit Job</span>
                                            </div>
                                            <div 
                                                onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} 
                                                className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
                                            >
                                                <Eye className="w-4 h-4 text-green-600" />
                                                <span>View Applicants</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                
                {filterJobs?.length === 0 && (
                    <div className="text-center py-12">
                        <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
                    </div>
                )}
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {filterJobs?.map((job) => (
                    <div key={job._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12 border-2 border-gray-100">
                                    <AvatarImage 
                                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${job?.company?.name}`} 
                                        alt={job?.company?.name}
                                    />
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{job?.title}</h3>
                                    <p className="text-sm text-gray-600">{job?.company?.name}</p>
                                </div>
                            </div>
                            <Popover>
                                <PopoverTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-100 h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                </PopoverTrigger>
                                <PopoverContent className="w-48 p-2" align="end">
                                    <div 
                                        onClick={() => navigate(`/admin/jobs/edit/${job._id}`)} 
                                        className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4 text-blue-600" />
                                        <span>Edit Job</span>
                                    </div>
                                    <div 
                                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} 
                                        className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
                                    >
                                        <Eye className="w-4 h-4 text-green-600" />
                                        <span>View Applicants</span>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(job?.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Users className="w-4 h-4" />
                                <span>{job?.applications?.length || 0} applicants</span>
                            </div>
                        </div>
                    </div>
                ))}
                
                {filterJobs?.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                        <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminJobsTable