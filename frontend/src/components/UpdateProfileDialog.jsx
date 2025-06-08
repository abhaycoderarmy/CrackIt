import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Avatar, AvatarImage } from './ui/avatar'
import { Loader2, Camera, Upload, X, User, Mail, Phone, FileText, Brain, Image } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const [previewImage, setPreviewImage] = useState(user?.profile?.profilePhoto || null);

    // Get user role - adjust this based on your auth structure
    const userRole = user?.role || 'student'; // Default to student if no role specified

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(', ') || "",
        file: null,
        profilePhoto: null
    });
    
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file })
    }

    const profilePhotoChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, profilePhoto: file });
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const removeProfilePhoto = () => {
        setInput({ ...input, profilePhoto: null });
        setPreviewImage(user?.profile?.profilePhoto || null);
        // Reset file input
        const fileInput = document.getElementById('profilePhoto');
        if (fileInput) fileInput.value = '';
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("bio", input.bio);
        
        // Only add phone number for non-admin users
        if (userRole !== 'admin') {
            formData.append("phoneNumber", input.phoneNumber);
        }
        
        // Only add skills and resume for students
        if (userRole === 'student') {
            formData.append("skills", input.skills);
            if (input.file) {
                formData.append("file", input.file);
            }
        }
        
        if (input.profilePhoto) {
            formData.append("profilePhoto", input.profilePhoto);
        }
        
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                setOpen(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    // Helper function to determine what sections to show
    const shouldShowPersonalInfo = () => true; // All roles need basic personal info
    const shouldShowPhoneNumber = () => userRole !== 'admin'; // Admin doesn't need phone
    const shouldShowProfessionalInfo = () => userRole === 'student'; // Only students need skills
    const shouldShowResumeUpload = () => userRole === 'student'; // Only students need resume

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-slate-50">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                        <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                        </div>
                        Update Profile
                    </DialogTitle>
                    <p className="text-gray-600 text-sm">
                        Update your {userRole === 'admin' ? 'admin' : userRole === 'recruiter' ? 'recruiter' : 'profile'} information to keep your account current.
                    </p>
                </DialogHeader>

                <form onSubmit={submitHandler} className="space-y-6">
                    {/* Profile Photo Section - All roles */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                                <Avatar className="relative h-20 w-20 ring-4 ring-white shadow-lg">
                                    <AvatarImage 
                                        src={previewImage || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"} 
                                        alt="Profile Preview"
                                        className="object-cover"
                                    />
                                </Avatar>
                                {input.profilePhoto && (
                                    <button
                                        type="button"
                                        onClick={removeProfilePhoto}
                                        className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                )}
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="profilePhoto" className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                    <Image className="h-4 w-4" />
                                    Profile Photo
                                </Label>
                                <div className="flex gap-2">
                                    <Label 
                                        htmlFor="profilePhoto" 
                                        className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-sm font-medium text-blue-600"
                                    >
                                        <Camera className="h-4 w-4" />
                                        Choose Photo
                                    </Label>
                                    <Input
                                        id="profilePhoto"
                                        name="profilePhoto"
                                        type="file"
                                        accept="image/*"
                                        onChange={profilePhotoChangeHandler}
                                        className="hidden"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF up to 5MB</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid gap-6">
                        {/* Personal Information - All roles */}
                        {shouldShowPersonalInfo() && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <User className="h-5 w-5 text-blue-500" />
                                    {userRole === 'admin' ? 'Admin Information' : userRole === 'recruiter' ? 'Recruiter Information' : 'Personal Information'}
                                </h3>
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullname" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Full Name
                                        </Label>
                                        <Input
                                            id="fullname"
                                            name="fullname"
                                            type="text"
                                            value={input.fullname}
                                            onChange={changeEventHandler}
                                            className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={input.email}
                                            onChange={changeEventHandler}
                                            className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg"
                                            placeholder="Enter your email address"
                                        />
                                    </div>

                                    {/* Phone Number - Only for recruiters and students */}
                                    {shouldShowPhoneNumber() && (
                                        <div className="space-y-2">
                                            <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Phone className="h-4 w-4" />
                                                Phone Number
                                            </Label>
                                            <Input
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                type="tel"
                                                value={input.phoneNumber}
                                                onChange={changeEventHandler}
                                                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg"
                                                placeholder="Enter your phone number"
                                            />
                                        </div>
                                    )}

                                    {/* Bio - All roles */}
                                    <div className="space-y-2">
                                        <Label htmlFor="bio" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            {userRole === 'admin' ? 'Admin Bio' : userRole === 'recruiter' ? 'Company/Recruiter Bio' : 'Professional Bio'}
                                        </Label>
                                        <Textarea
                                            id="bio"
                                            name="bio"
                                            value={input.bio}
                                            onChange={changeEventHandler}
                                            className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg min-h-[100px] resize-none"
                                            placeholder={
                                                userRole === 'admin' 
                                                    ? "Write a brief description about your administrative role..."
                                                    : userRole === 'recruiter'
                                                    ? "Write about your company and recruitment focus..."
                                                    : "Write a brief description about yourself and your professional background..."
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Professional Information - Only for students */}
                        {shouldShowProfessionalInfo() && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Brain className="h-5 w-5 text-green-500" />
                                    Skills & Expertise
                                </h3>
                                <div className="space-y-2">
                                    <Label htmlFor="skills" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Brain className="h-4 w-4" />
                                        Skills
                                    </Label>
                                    <Input
                                        id="skills"
                                        name="skills"
                                        value={input.skills}
                                        onChange={changeEventHandler}
                                        className="border-gray-200 focus:border-green-400 focus:ring-green-400 rounded-lg"
                                        placeholder="e.g., JavaScript, React, Node.js, Python (comma separated)"
                                    />
                                    <p className="text-xs text-gray-500">Separate skills with commas</p>
                                </div>
                            </div>
                        )}

                        {/* Resume Upload - Only for students */}
                        {shouldShowResumeUpload() && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Upload className="h-5 w-5 text-purple-500" />
                                    Resume
                                </h3>
                                <div className="space-y-2">
                                    <Label htmlFor="file" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Upload Resume
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="file"
                                            name="file"
                                            type="file"
                                            accept="application/pdf,.doc,.docx"
                                            onChange={fileChangeHandler}
                                            className="border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">PDF, DOC, or DOCX files only (max 5MB)</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="pt-6">
                        <div className="flex gap-3 w-full">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setOpen(false)}
                                className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50"
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Upload className='mr-2 h-4 w-4' />
                                        Update Profile
                                    </>
                                )}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateProfileDialog