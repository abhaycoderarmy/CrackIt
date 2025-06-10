

import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import { Loader2, Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "" });
  const { loading, user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        localStorage.setItem("token", res.data.token);

        console.log("User after login:", res.data.user);

        const role = res.data.user.role;
        toast.success(res.data.message);
        if (role === "admin") navigate("/admin/dashboard");
        else if (role === "recruiter") navigate("/recruiter/dashboard");
        else navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };



  useEffect(() => {
  console.log("useEffect triggered with user:", user);
  if (user?.role === "admin") navigate("/admin/dashboard");
}, [user]);




  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className='flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8'>
        <div className='w-full max-w-md sm:max-w-lg'>
          <form
            onSubmit={submitHandler}
            className='bg-white shadow-2xl rounded-2xl p-6 sm:p-8 lg:p-10 border border-gray-100'
          >
            <div className='text-center mb-8'>
              <div className='mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4'>
                <LogIn className='w-8 h-8 text-white' />
              </div>
              <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-2'>Welcome Back</h1>
              <p className='text-gray-600'>Sign in to your account</p>
            </div>

            <div className='space-y-6'>
              <div className='space-y-2'>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className='w-4 h-4' /> Email Address
                </Label>
                <Input
                  type="email"
                  value={input.email}
                  name="email"
                  onChange={changeEventHandler}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className='w-4 h-4' /> Password
                </Label>
                <Input
                  type="password"
                  value={input.password}
                  name="password"
                  onChange={changeEventHandler}
                  required
                />
              </div>
            </div>

            <div className='mt-8'>
              {loading ? (
                <Button disabled className="w-full">
                  <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                  Signing In...
                </Button>
              ) : (
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  Sign In
                </Button>
              )}
            </div>

            <div className='mt-6 text-center'>
              <Link to="/forgot-password" className='text-sm text-blue-600 hover:underline'>
                Forgot your password?
              </Link>
              <div className='mt-4 text-gray-600'>
                Don’t have an account?{" "}
                <Link to="/signup" className='text-blue-600 hover:underline'>Create Account</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
