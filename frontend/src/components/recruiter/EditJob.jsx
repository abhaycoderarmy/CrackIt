import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../shared/Navbar'
import { useSelector } from 'react-redux'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { 
  Briefcase, Building2, FileText, Star, DollarSign, MapPin, Clock, Users, 
  Sparkles, Loader2, Trash2, ArrowLeft, AlertTriangle, Save, Edit3 
} from 'lucide-react'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'

const EditJob = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { companies } = useSelector(store => store.company)

  const [input, setInput] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    jobType: '',
    experience: '',
    position: 0,
    companyId: ''
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  // Fetch job data on mount
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, { withCredentials: true })
        if (res.data.success) {
          const job = res.data.job
          setInput({
            title: job.title || '',
            description: job.description || '',
            requirements: job.requirements?.join(", ") || '',
            salary: job.salary || '',
            location: job.location || '',
            jobType: job.jobType || '',
            experience: job.experienceLevel || '',
            position: job.position || 0,
            companyId: job.company?._id || ''
          })
        }
      } catch (error) {
        toast.error('Failed to load job details')
      } finally {
        setFetching(false)
      }
    }
    fetchJob()
  }, [id])

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const selectChangeHandler = (value) => {
    setInput({ ...input, companyId: value })
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...input,
        requirements: input.requirements.split(",").map(req => req.trim())
      }
      const res = await axios.put(`${JOB_API_END_POINT}/update/${id}`, payload, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })
      if (res.data.success) {
        toast.success('Job updated successfully')
        navigate('/admin/jobs')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update job')
    } finally {
      setLoading(false)
    }
  }

  const deleteHandler = async () => {
    if (!window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await axios.delete(`${JOB_API_END_POINT}/jobs/${id}`, { withCredentials: true });
      if (res.data.success) {
        toast.success('Job deleted successfully');
        navigate('/admin/jobs');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    } finally {
      setLoading(false);
    }
  }

  const formFields = [
    { 
      name: 'title', 
      label: 'Job Title', 
      icon: Briefcase, 
      placeholder: 'e.g. Senior Software Engineer',
      description: 'Enter a clear and descriptive job title'
    },
    { 
      name: 'description', 
      label: 'Job Description', 
      icon: FileText, 
      placeholder: 'Provide a detailed description of the role, responsibilities, and what the candidate will be doing...',
      type: 'textarea',
      description: 'Describe the role, responsibilities, and day-to-day activities'
    },
    { 
      name: 'requirements', 
      label: 'Requirements', 
      icon: Star, 
      placeholder: 'React, Node.js, 3+ years experience, Bachelor\'s degree...',
      type: 'textarea',
      description: 'List required skills, qualifications, and experience (comma-separated)'
    },
    { 
      name: 'salary', 
      label: 'Salary Range', 
      icon: DollarSign, 
      placeholder: 'e.g. ₹80,000 - ₹120,000 per month',
      description: 'Specify the salary range or compensation package'
    },
    { 
      name: 'location', 
      label: 'Location', 
      icon: MapPin, 
      placeholder: 'e.g. Mumbai, Maharashtra or Remote',
      description: 'Job location or specify if remote work is available'
    },
    { 
      name: 'jobType', 
      label: 'Job Type', 
      icon: Clock, 
      placeholder: 'e.g. Full-time, Part-time, Contract, Internship',
      description: 'Employment type and work arrangement'
    },
    { 
      name: 'experience', 
      label: 'Experience Level', 
      icon: Sparkles, 
      placeholder: 'e.g. 3-5 years, Entry Level, Senior Level',
      description: 'Required years of experience or experience level'
    },
    { 
      name: 'position', 
      label: 'Number of Positions', 
      icon: Users, 
      placeholder: '1', 
      type: 'number',
      description: 'How many people you want to hire for this role'
    }
  ]

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <Loader2 className="animate-spin w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">Loading job details...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/jobs')}
                className="flex items-center gap-2 hover:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Jobs
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
                  <Edit3 className="w-8 h-8 text-indigo-600" />
                  Edit Job Posting
                </h1>
                <p className="text-slate-600 mt-1">Update job details and requirements</p>
              </div>
            </div>
            <Badge variant="secondary" className="w-fit">
              Job ID: {id}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">Job Information</CardTitle>
                <CardDescription className="text-slate-600">
                  Fill in the details below to update this job posting
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={submitHandler} className="space-y-8">
              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {formFields.map(field => {
                  const IconComponent = field.icon
                  return (
                    <div key={field.name} className={field.type === 'textarea' ? 'lg:col-span-2' : ''}>
                      <Label className="flex items-center gap-2 mb-3 text-slate-700 font-medium">
                        <IconComponent className="w-5 h-5 text-indigo-600" />
                        {field.label}
                      </Label>
                      {field.description && (
                        <p className="text-sm text-slate-500 mb-2">{field.description}</p>
                      )}
                      {field.type === 'textarea' ? (
                        <Textarea
                          name={field.name}
                          value={input[field.name]}
                          onChange={changeEventHandler}
                          placeholder={field.placeholder}
                          className="w-full min-h-[120px] resize-y border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20"
                          required
                        />
                      ) : (
                        <Input
                          type={field.type || 'text'}
                          name={field.name}
                          value={input[field.name]}
                          onChange={changeEventHandler}
                          placeholder={field.placeholder}
                          className="w-full border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 h-12"
                          required
                        />
                      )}
                    </div>
                  )
                })}

                {/* Company Select */}
                <div className="lg:col-span-2">
                  <Label className="flex items-center gap-2 mb-3 text-slate-700 font-medium">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    Company
                  </Label>
                  <p className="text-sm text-slate-500 mb-2">
                    Select the company for this job posting
                  </p>
                  <Select value={input.companyId} onValueChange={selectChangeHandler}>
                    <SelectTrigger className="w-full h-12 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20">
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {companies.map(company => (
                          <SelectItem key={company._id} value={company._id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white h-12 font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating Job...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Update Job
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  disabled={loading}
                  onClick={deleteHandler}
                  variant="destructive"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white h-12 font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Delete Job
                    </>
                  )}
                </Button>
              </div>

              {/* Warning Note */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 mb-1">Important Note</p>
                  <p className="text-amber-700">
                    Make sure all information is accurate before updating. Changes will be visible to job seekers immediately.
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EditJob