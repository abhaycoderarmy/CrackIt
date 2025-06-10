import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { 
    LogOut, 
    User2, 
    Menu, 
    X, 
    Briefcase, 
    Home, 
    Search, 
    Globe, 
    LayoutDashboard, 
    Newspaper,
    Bell,
    BookOpen,
    Users,
    Building,
    Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Navigation links based on user role
    let navLinks = [];

    if (user?.role === 'admin') {
        navLinks = [
            { to: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
            // { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
            { to: '/admin/job-management', label: 'Jobs', icon: <Search className="w-4 h-4" /> },
            { to: '/admin/users', label: 'Users', icon: <Users className="w-4 h-4" /> },
            { to: '/newsletter', label: 'Newsletter', icon: <Newspaper className="w-4 h-4" />, highlight: true },
        ];
    } else if (user?.role === 'recruiter') {
        navLinks = [
            { to: '/recruiter/dashboard', label: 'Home', icon: <Home className="w-4 h-4" /> },
            { to: '/admin/companies', label: 'Companies', icon: <Briefcase className="w-4 h-4" /> },
            { to: '/admin/jobs', label: 'Jobs', icon: <Search className="w-4 h-4" /> },
            { to: '/newsletter', label: 'Newsletter', icon: <Newspaper className="w-4 h-4" />, highlight: true },
        ];
    } else if (user?.role === 'student') {
        navLinks = [
            { to: '/student/dashboard', label: 'Home', icon: <Home className="w-4 h-4" /> },
            { to: '/jobs', label: 'Find Jobs', icon: <Search className="w-4 h-4" /> },
            // { to: '/learn', label: 'Learn', icon: <BookOpen className="w-4 h-4" /> },
            { to: '/newsletter', label: 'Newsletter', icon: <Newspaper className="w-4 h-4" />, highlight: true },
        ];
    } else {
        // Guest/not logged in
        navLinks = [
            { to: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
            { to: '/jobs', label: 'Jobs', icon: <Search className="w-4 h-4" /> },
            { to: '/browse', label: 'Browse', icon: <Globe className="w-4 h-4" /> },
            { to: '/newsletter', label: 'Newsletter', icon: <Newspaper className="w-4 h-4" />, highlight: true },
        ];
    }

    return (
        <nav className="bg-white/90 backdrop-blur-lg border-b border-gray-200/60 sticky top-0 z-50 shadow-lg">
            <div className="relative">
                {/* Gradient overlay for visual appeal */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/20 to-orange-50/30 pointer-events-none" />
                
                <div className='relative flex items-center justify-between mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16'>
                    {/* Logo */}
                    <div className="flex items-center">
                        {/* <Link to="/" className="flex items-center space-x-3 group"> */}
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transform group-hover:scale-105 transition-all duration-300">
                                    <span className="text-white font-bold text-lg">C</span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse" />
                            </div>
                            <div>
                                <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent'>
                                    Crack<span className='text-orange-500'>It</span>
                                </h1>
                                <p className="text-xs text-gray-500 -mt-1">Career Platform</p>
                            </div>
                        {/* </Link> */}
                    </div>

                    {/* Desktop Navigation */}
                    <div className='hidden lg:flex items-center gap-8'>
                        <ul className='flex font-medium items-center gap-2'>
                            {navLinks.map((link, index) => (
                                <li key={index}>
                                    <Link 
                                        to={link.to}
                                        className={`
                                            relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 group
                                            ${link.highlight 
                                                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                                                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/80'
                                            }
                                        `}
                                    >
                                        {link.highlight && (
                                            <div className="absolute -top-1 -right-1">
                                                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                                                <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full" />
                                            </div>
                                        )}
                                        <span className={`group-hover:scale-110 transition-transform duration-200 ${link.highlight ? 'text-white' : ''}`}>
                                            {link.icon}
                                        </span>
                                        <span className={link.highlight ? 'font-semibold' : ''}>{link.label}</span>
                                        {link.highlight && (
                                            <Sparkles className="w-3 h-3 text-yellow-200 animate-pulse" />
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Authentication Section */}
                        {!user ? (
                            <div className='flex items-center gap-4'>
                                <Link to="/login">
                                    <Button 
                                        variant="outline" 
                                        className="border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium"
                                    >
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-gradient-to-r from-blue-500 via-purple-600 to-blue-600 hover:from-blue-600 hover:via-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold px-6">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                {/* Notifications */}
                                {/* <Button variant="ghost" size="sm" className="relative p-2 hover:bg-blue-50 rounded-full">
                                    <Bell className="w-5 h-5 text-gray-600" />
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                                </Button> */}

                                {/* User Profile Popover */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <div className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200 border border-transparent hover:border-gray-200">
                                            <Avatar className="w-9 h-9 ring-2 ring-blue-500/30 hover:ring-blue-500/50 transition-all duration-200">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                            </Avatar>
                                            <div className="hidden xl:block text-left">
                                                <p className="text-sm font-semibold text-gray-800">{user?.fullname}</p>
                                                <p className="text-xs text-gray-500 capitalize flex items-center gap-1">
                                                    <div className={`w-2 h-2 rounded-full ${
                                                        user?.role === 'admin' ? 'bg-red-500' :
                                                        user?.role === 'recruiter' ? 'bg-blue-500' : 'bg-green-500'
                                                    }`} />
                                                    {user?.role}
                                                </p>
                                            </div>
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 p-0 border-0 shadow-2xl rounded-2xl overflow-hidden">
                                        <div className={`p-6 rounded-t-2xl ${
                                            user?.role === 'admin' ? 'bg-gradient-to-r from-red-500 to-pink-600' :
                                            user?.role === 'recruiter' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 
                                            'bg-gradient-to-r from-green-500 to-emerald-600'
                                        }`}>
                                            <div className='flex gap-4 items-center'>
                                                <Avatar className="w-14 h-14 ring-3 ring-white/40 shadow-lg">
                                                    <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                                </Avatar>
                                                <div className="text-white flex-1">
                                                    <h4 className='font-bold text-xl'>{user?.fullname}</h4>
                                                    <p className='text-sm text-white/90 capitalize font-medium flex items-center gap-2'>
                                                        <div className="w-2 h-2 bg-white rounded-full" />
                                                        {user?.role}
                                                    </p>
                                                    {user?.profile?.bio && (
                                                        <p className='text-xs text-white/80 mt-2 line-clamp-2'>{user?.profile?.bio}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className='p-4 space-y-1'>
                                            <Link to="/profile">
                                                <Button 
                                                    variant="ghost" 
                                                    className='w-full justify-start gap-3 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-xl py-3'
                                                >
                                                    <User2 className="w-5 h-5" />
                                                    <span className="font-medium">View Profile</span>
                                                </Button>
                                            </Link>
                                            
                                            <Button 
                                                onClick={logoutHandler} 
                                                variant="ghost" 
                                                className='w-full justify-start gap-3 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 rounded-xl py-3'
                                            >
                                                <LogOut className="w-5 h-5" />
                                                <span className="font-medium">Logout</span>
                                            </Button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleMobileMenu}
                            className="p-2 rounded-xl hover:bg-gray-100"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/60">
                    <div className="px-4 py-6 space-y-6">
                        {/* Mobile Navigation Links */}
                        <div className="space-y-2">
                            {navLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    to={link.to}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`
                                        relative flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300
                                        ${link.highlight 
                                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                        }
                                    `}
                                >
                                    {link.highlight && (
                                        <div className="absolute -top-1 -right-1">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                                            <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full" />
                                        </div>
                                    )}
                                    <span className={link.highlight ? 'text-white' : ''}>{link.icon}</span>
                                    <span className={`font-medium ${link.highlight ? 'text-white' : ''}`}>{link.label}</span>
                                    {link.highlight && (
                                        <Sparkles className="w-4 h-4 text-yellow-200 animate-pulse ml-auto" />
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Authentication */}
                        {!user ? (
                            <div className='flex flex-col gap-3 pt-4 border-t border-gray-200'>
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button 
                                        variant="outline" 
                                        className="w-full border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 font-medium py-3"
                                    >
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-blue-600 hover:from-blue-600 hover:via-purple-700 hover:to-blue-700 text-white font-semibold py-3">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="pt-4 border-t border-gray-200 space-y-4">
                                <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 rounded-xl">
                                    <Avatar className="w-12 h-12 ring-2 ring-blue-500/30">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">{user?.fullname}</p>
                                        <p className="text-sm text-gray-500 capitalize flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${
                                                user?.role === 'admin' ? 'bg-red-500' :
                                                user?.role === 'recruiter' ? 'bg-blue-500' : 'bg-green-500'
                                            }`} />
                                            {user?.role}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="ghost" className='w-full justify-start gap-3 py-3 rounded-xl'>
                                            <User2 className="w-5 h-5" />
                                            <span className="font-medium">View Profile</span>
                                        </Button>
                                    </Link>
                                    
                                    <Button 
                                        onClick={() => {
                                            logoutHandler();
                                            setIsMobileMenuOpen(false);
                                        }} 
                                        variant="ghost" 
                                        className='w-full justify-start gap-3 hover:bg-red-50 hover:text-red-600 py-3 rounded-xl'
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="font-medium">Logout</span>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;