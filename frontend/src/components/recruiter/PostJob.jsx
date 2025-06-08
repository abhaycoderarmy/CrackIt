
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../shared/Navbar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Briefcase, Building2, MapPin, DollarSign, Clock, Users, FileText, Star, Sparkles } from 'lucide-react'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'

const PostJob = () => {
    const { id } = useParams()  // Get job ID from URL param
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const [loadingJob, setLoadingJob] = useState(false); // Separate loading for fetch job data
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);

    // Fetch existing job details if editing
    useEffect(() => {
        if (id) {
            setLoadingJob(true);
            axios.get(`${JOB_API_END_POINT}/jobs/${id}`, { withCredentials: true })
                .then(res => {
                    if (res.data.success) {
                        const job = res.data.job;
                        setInput({
                            title: job.title || "",
                            description: job.description || "",
                            requirements: job.requirements || "",
                            salary: job.salary || "",
                            location: job.location || "",
                            jobType: job.jobType || "",
                            experience: job.experience || "",
                            position: job.position || 0,
                            companyId: job.companyId || ""
                        });
                    } else {
                        toast.error("Failed to load job details");
                    }
                })
                .catch(() => toast.error("Failed to fetch job details"))
                .finally(() => setLoadingJob(false));
        }
    }, [id]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company) => company._id === value);
        if (selectedCompany) {
            setInput({ ...input, companyId: selectedCompany._id });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            let res;
            if (id) {
                // Edit existing job
                res = await axios.put(`${JOB_API_END_POINT}/jobs/${id}`, input, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
            } else {
                // Create new job
                res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
            }

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.error("Error submitting job:", error.data);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const formFields = [
        { name: 'title', label: 'Job Title', icon: Briefcase, placeholder: 'e.g. Senior Software Engineer' },
        { name: 'description', label: 'Job Description', icon: FileText, placeholder: 'Brief description of the role...' },
        { name: 'requirements', label: 'Requirements', icon: Star, placeholder: 'Required skills and qualifications...' },
        { name: 'salary', label: 'Salary Range', icon: DollarSign, placeholder: 'e.g. $80,000 - $120,000' },
        { name: 'location', label: 'Location', icon: MapPin, placeholder: 'e.g. New York, NY' },
        { name: 'jobType', label: 'Job Type', icon: Clock, placeholder: 'e.g. Full-time, Part-time, Remote' },
        { name: 'experience', label: 'Experience Level', icon: Sparkles, placeholder: 'e.g. 3-5 years' },
        { name: 'position', label: 'Number of Positions', icon: Users, placeholder: '1', type: 'number' }
    ];

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-indigo-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                                <p className="text-sm text-gray-500">Job Management</p>
                            </div>
                        </div>
                        <Button 
                            variant="outline" 
                            className="border-indigo-200 hover:bg-indigo-50"
                            onClick={() => navigate("/admin/jobs")}
                        >
                            View All Jobs
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
                        <Briefcase className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Post a New Job</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Create an amazing job opportunity and find the perfect candidates for your team
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <Building2 className="w-6 h-6 mr-3" />
                            Job Details
                        </h2>
                        <p className="text-indigo-100 mt-2">Fill in the information below to create your job posting</p>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {formFields.map((field, index) => {
                                const IconComponent = field.icon;
                                return (
                                    <div key={field.name} className="space-y-3">
                                        <Label className="text-sm font-semibold text-gray-700 flex items-center">
                                            <IconComponent className="w-4 h-4 mr-2 text-indigo-600" />
                                            {field.label}
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                type={field.type || "text"}
                                                name={field.name}
                                                value={input[field.name]}
                                                onChange={changeEventHandler}
                                                placeholder={field.placeholder}
                                                className="h-12 pl-4 pr-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 focus:ring-2 focus:ring-opacity-20 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-indigo-300"
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Company Selection */}
                            {companies && companies.length > 0 && (
                                <div className="md:col-span-2 space-y-3">
                                    <Label className="text-sm font-semibold text-gray-700 flex items-center">
                                        <Building2 className="w-4 h-4 mr-2 text-indigo-600" />
                                        Select Company
                                    </Label>
                                    <Select onValueChange={selectChangeHandler}>
                                        <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-indigo-500 bg-white/50 backdrop-blur-sm hover:border-indigo-300">
                                            <SelectValue placeholder="Choose a company from your registered companies" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-2 border-gray-200">
                                            <SelectGroup>
                                                {companies.map((company) => (
                                                    <SelectItem 
                                                        key={company._id} 
                                                        value={company._id}
                                                        className="hover:bg-indigo-50 rounded-lg"
                                                    >
                                                        <div className="flex items-center">
                                                            <Building2 className="w-4 h-4 mr-2 text-gray-500" />
                                                            {company.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-10 space-y-4">
                            {loading ? (
                                <Button 
                                    disabled 
                                    className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
                                >
                                    <Loader2 className='mr-3 h-5 w-5 animate-spin' />
                                    Creating Job Post...
                                </Button>
                            ) : (
                                <Button 
                                    onClick={submitHandler}
                                    className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    <Briefcase className="w-5 h-5 mr-3" />
                                    Post New Job
                                </Button>
                            )}

                            {(!companies || companies.length === 0) && (
                                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Building2 className="w-6 h-6 text-red-600" />
                                    </div>
                                    <p className="text-red-800 font-semibold mb-2">Company Registration Required</p>
                                    <p className="text-red-600 text-sm">Please register a company first before posting jobs</p>
                                    <Button 
                                        variant="outline" 
                                        className="mt-4 border-red-300 text-red-600 hover:bg-red-50"
                                        onClick={() => navigate("/admin/companies")}
                                    >
                                        Register Company
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-12 text-gray-500">
                    <p>Need help? Contact our support team for assistance with job postings.</p>
                </div>
                </div>
            </div>
        </div>
    )
}

export default PostJob