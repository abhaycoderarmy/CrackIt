import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, Building2, Globe, MapPin, FileText, Upload, Camera } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'

const CompanySetup = () => {
    const params = useParams();
    const navigate = useNavigate();
    useGetCompanyById(params.id);
    const {singleCompany} = useSelector(store=>store.company);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [existingLogo, setExistingLogo] = useState(null);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, file });
            const reader = new FileReader();
            reader.onload = (e) => setPreviewImage(e.target.result);
            reader.readAsDataURL(file);
        }
    }

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                setInput({ ...input, file });
                const reader = new FileReader();
                reader.onload = (e) => setPreviewImage(e.target.result);
                reader.readAsDataURL(file);
            }
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }
        
        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const navigateBack = () => {
        navigate("/admin/companies");
    }

    const clearLogo = () => {
        setPreviewImage(null);
        setExistingLogo(null);
        setInput({ ...input, file: null });
    }

    useEffect(() => {
        if (singleCompany) {
            setInput({
                name: singleCompany.name || "",
                description: singleCompany.description || "",
                website: singleCompany.website || "",
                location: singleCompany.location || "",
                file: null // Don't set the file directly, handle logo separately
            });

            // Handle existing logo - check multiple possible logo field names
            const logoUrl = singleCompany.logo || singleCompany.logoUrl || singleCompany.image;
            if (logoUrl) {
                setExistingLogo(logoUrl);
            }
        }
    }, [singleCompany]);

    // Determine which logo to display
    const displayLogo = previewImage || existingLogo;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Modern Navbar */}
            <nav className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    CrackIt
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto p-6 sm:p-8">
                {/* Header Section */}
                <div className="mb-8">
                    <Button 
                        onClick={navigateBack} 
                        variant="outline" 
                        className="mb-6 bg-white/80 backdrop-blur-sm border-white/30 hover:bg-white/90 transition-all duration-200 shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Companies
                    </Button>
                    
                    <div className="text-center">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                            Company Setup
                        </h1>
                        <p className="text-slate-600 text-lg">
                            Configure your company profile and settings
                        </p>
                    </div>
                </div>

                {/* Main Form */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
                    <form onSubmit={submitHandler}>
                        <div className="space-y-8">
                            {/* Logo Upload Section */}
                            <div className="text-center">
                                <Label className="text-lg font-semibold text-slate-700 mb-4 block">
                                    Company Logo
                                </Label>
                                <div 
                                    className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                                        dragActive 
                                            ? 'border-blue-500 bg-blue-50/50' 
                                            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/50'
                                    }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    {displayLogo ? (
                                        <div className="relative">
                                            <img 
                                                src={displayLogo} 
                                                alt="Company Logo Preview" 
                                                className="w-24 h-24 object-cover rounded-xl mx-auto shadow-lg"
                                                onError={(e) => {
                                                    console.log('Image failed to load:', displayLogo);
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                            <div className="mt-4 space-x-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="bg-white/80 backdrop-blur-sm"
                                                    onClick={() => document.getElementById('logo-input').click()}
                                                >
                                                    Change Logo
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="bg-red-50 text-red-600 hover:bg-red-100"
                                                    onClick={clearLogo}
                                                >
                                                    Remove Logo
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                                                <Camera className="w-8 h-8 text-white" />
                                            </div>
                                            <p className="text-slate-600 mb-2">Drop your logo here or click to browse</p>
                                            <p className="text-sm text-slate-400">PNG, JPG up to 10MB</p>
                                        </div>
                                    )}
                                    <Input
                                        id="logo-input"
                                        type="file"
                                        accept="image/*"
                                        onChange={changeFileHandler}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-blue-500" />
                                        Company Name
                                    </Label>
                                    <Input
                                        type="text"
                                        name="name"
                                        value={input.name}
                                        onChange={changeEventHandler}
                                        placeholder="Enter company name"
                                        className="h-12 bg-white/60 backdrop-blur-sm border-white/30 focus:bg-white/80 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-green-500" />
                                        Location
                                    </Label>
                                    <Input
                                        type="text"
                                        name="location"
                                        value={input.location}
                                        onChange={changeEventHandler}
                                        placeholder="Enter company location"
                                        className="h-12 bg-white/60 backdrop-blur-sm border-white/30 focus:bg-white/80 transition-all duration-200"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-purple-500" />
                                        Website
                                    </Label>
                                    <Input
                                        type="url"
                                        name="website"
                                        value={input.website}
                                        onChange={changeEventHandler}
                                        placeholder="https://example.com"
                                        className="h-12 bg-white/60 backdrop-blur-sm border-white/30 focus:bg-white/80 transition-all duration-200"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-orange-500" />
                                        Description
                                    </Label>
                                    <textarea
                                        name="description"
                                        value={input.description}
                                        onChange={changeEventHandler}
                                        placeholder="Describe your company..."
                                        rows={4}
                                        className="w-full p-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg focus:bg-white/80 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6">
                                <Button 
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Updating Company...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5 mr-2" />
                                            Update Company
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-10 blur-3xl -z-10"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 blur-3xl -z-10"></div>
            </div>
        </div>
    )
}

export default CompanySetup