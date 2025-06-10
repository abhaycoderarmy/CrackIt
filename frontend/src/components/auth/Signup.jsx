import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2, User, Mail, Phone, Lock, Upload, UserCheck, Briefcase } from 'lucide-react'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Navbar />
            <div className='flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8'>
                <div className='w-full max-w-md sm:max-w-lg lg:max-w-xl'>
                    <form 
                        onSubmit={submitHandler} 
                        className='bg-white shadow-2xl rounded-2xl p-6 sm:p-8 lg:p-10 border border-gray-100 backdrop-blur-sm'
                    >
                        {/* Header */}
                        <div className='text-center mb-8'>
                            <div className='mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4'>
                                <UserCheck className='w-8 h-8 text-white' />
                            </div>
                            <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-2'>Create Account</h1>
                            <p className='text-gray-600'>Join us and start your journey</p>
                        </div>

                        {/* Form Fields */}
                        <div className='space-y-6'>
                            {/* Full Name */}
                            <div className='space-y-2'>
                                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <User className='w-4 h-4' />
                                    Full Name
                                </Label>
                                <Input
                                    type="text"
                                    value={input.fullname}
                                    name="fullname"
                                    onChange={changeEventHandler}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className='space-y-2'>
                                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Mail className='w-4 h-4' />
                                    Email Address
                                </Label>
                                <Input
                                    type="email"
                                    value={input.email}
                                    name="email"
                                    onChange={changeEventHandler}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                                    required
                                />
                            </div>

                            {/* Phone Number */}
                            <div className='space-y-2'>
                                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Phone className='w-4 h-4' />
                                    Phone Number
                                </Label>
                                <Input
                                    type="tel"
                                    value={input.phoneNumber}
                                    name="phoneNumber"
                                    onChange={changeEventHandler}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className='space-y-2'>
                                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Lock className='w-4 h-4' />
                                    Password
                                </Label>
                                <Input
                                    type="password"
                                    value={input.password}
                                    name="password"
                                    onChange={changeEventHandler}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                                    required
                                />
                            </div>

                            {/* Role Selection and Profile Upload */}
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                                {/* Role Selection */}
                                <div className='space-y-3'>
                                    <Label className="text-sm font-medium text-gray-700">
                                        Select Role
                                    </Label>
                                    <RadioGroup className="space-y-3">
                                        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                            <Input
                                                type="radio"
                                                name="role"
                                                value="student"
                                                checked={input.role === 'student'}
                                                onChange={changeEventHandler}
                                                className="w-4 h-4 text-blue-600 mr-3"
                                            />
                                            <User className='w-4 h-4 text-gray-500 mr-2' />
                                            <Label className="cursor-pointer text-sm font-medium">Student</Label>
                                        </div>
                                        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                            <Input
                                                type="radio"
                                                name="role"
                                                value="recruiter"
                                                checked={input.role === 'recruiter'}
                                                onChange={changeEventHandler}
                                                className="w-4 h-4 text-blue-600 mr-3"
                                            />
                                            <Briefcase className='w-4 h-4 text-gray-500 mr-2' />
                                            <Label className="cursor-pointer text-sm font-medium">Recruiter</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Profile Upload */}
                                <div className='space-y-3'>
                                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Upload className='w-4 h-4' />
                                        Profile Picture
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            accept="image/*"
                                            type="file"
                                            onChange={changeFileHandler}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className='mt-8'>
                            {loading ? (
                                <Button 
                                    disabled 
                                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow-lg transform transition-all duration-200"
                                >
                                    <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                                    Creating Account...
                                </Button>
                            ) : (
                                <Button 
                                    type="submit" 
                                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                                >
                                    Create Account
                                </Button>
                            )}
                        </div>

                        {/* Login Link */}
                        <div className='text-center mt-6'>
                            <span className='text-sm text-gray-600'>
                                Already have an account?{' '}
                                <Link 
                                    to="/login" 
                                    className='text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200'
                                >
                                    Sign In
                                </Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup