import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Github,
  Heart,
  ArrowUp,
  Sparkles,
  Users,
  Building,
  Search,
  BookOpen,
  Briefcase,
  Globe,
  Home,
  LayoutDashboard,
  Newspaper,
  Send,
  Shield,
  FileText,
  Cookie
} from 'lucide-react';

const Footer = () => {
  const { user } = useSelector(store => store.auth);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubscribing(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubscribing(false);
      setEmail('');
      // You can add toast notification here
    }, 1000);
  };

  // Role-based navigation links
  const getFooterLinks = () => {
    const baseLinks = [
      { to: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    ];

    if (user?.role === 'admin') {
      return [
        ...baseLinks,
        // { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { to: '/admin/job-management', label: 'Manage Jobs', icon: <Search className="w-4 h-4" /> },
        // { to: '/admin/companies', label: 'Companies', icon: <Building className="w-4 h-4" /> },
        { to: '/admin/users', label: 'Users', icon: <Users className="w-4 h-4" /> },
      ];
    } else if (user?.role === 'recruiter') {
      return [
         {to: '/recruiter/dashboard', label: 'Home', icon: <Home className="w-4 h-4" /> },
        { to: '/admin/companies', label: 'My Companies', icon: <Briefcase className="w-4 h-4" /> },
        { to: '/admin/jobs', label: 'Post Jobs', icon: <Search className="w-4 h-4" /> },
      ];
    } else if (user?.role === 'student') {
      return [
        ...baseLinks,
        { to: '/jobs', label: 'Find Jobs', icon: <Search className="w-4 h-4" /> },
        // { to: '/browse', label: 'Browse', icon: <Globe className="w-4 h-4" /> },
        // { to: '/learn', label: 'Learn', icon: <BookOpen className="w-4 h-4" /> },
      ];
    } else {
      return [
        ...baseLinks,
        { to: '/jobs', label: 'Jobs', icon: <Search className="w-4 h-4" /> },
        { to: '/browse', label: 'Browse', icon: <Globe className="w-4 h-4" /> },
      ];
    }
  };

  const footerLinks = getFooterLinks();

  // Role-based gradient colors
  const getRoleGradient = () => {
    if (user?.role === 'admin') {
      return 'from-red-500/10 via-pink-500/5 to-orange-500/10';
    } else if (user?.role === 'recruiter') {
      return 'from-blue-500/10 via-indigo-500/5 to-purple-500/10';
    } else if (user?.role === 'student') {
      return 'from-green-500/10 via-emerald-500/5 to-teal-500/10';
    }
    return 'from-blue-500/10 via-purple-500/5 to-orange-500/10';
  };

  const getRoleAccentColor = () => {
    if (user?.role === 'admin') return 'text-red-600';
    if (user?.role === 'recruiter') return 'text-blue-600';
    if (user?.role === 'student') return 'text-green-600';
    return 'text-blue-600';
  };

  return (
    <footer className="relative bg-white/90 backdrop-blur-lg border-t border-gray-200/60 overflow-hidden">
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getRoleGradient()} pointer-events-none`} />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-gradient-to-r from-orange-400/10 to-pink-400/10 rounded-full blur-2xl" />
      
      <div className="relative">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transform group-hover:scale-105 transition-all duration-300">
                    <span className="text-white font-bold text-xl">C</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
                    Crack<span className="text-orange-500">It</span>
                  </h2>
                  <p className="text-xs text-gray-500 -mt-1">Career Platform</p>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                Your gateway to career success. Connect with top employers and discover amazing opportunities that match your skills and aspirations.
              </p>

              {user && (
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-red-100 text-red-700' :
                  user.role === 'recruiter' ? 'bg-blue-100 text-blue-700' : 
                  'bg-green-100 text-green-700'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    user.role === 'admin' ? 'bg-red-500' :
                    user.role === 'recruiter' ? 'bg-blue-500' : 'bg-green-500'
                  }`} />
                  Logged in as {user.role}
                </div>
              )}
              
              {/* Social Links */}
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, href: 'https://facebook.com', color: 'hover:text-blue-600' },
                  { icon: Twitter, href: 'https://twitter.com', color: 'hover:text-blue-400' },
                  { icon: Linkedin, href: 'https://linkedin.com', color: 'hover:text-blue-700' },
                  { icon: Instagram, href: 'https://instagram.com', color: 'hover:text-pink-600' },
                  { icon: Github, href: 'https://github.com', color: 'hover:text-gray-900' }
                ].map(({ icon: Icon, href, color }, index) => (
                  <a 
                    key={index}
                    href={href} 
                    className={`w-11 h-11 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 flex items-center justify-center text-gray-600 ${color} hover:shadow-lg hover:scale-110 transition-all duration-300 group`}
                    aria-label={`Visit our ${Icon.name}`}
                  >
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold text-gray-800 flex items-center gap-2`}>
                <Sparkles className={`w-5 h-5 ${getRoleAccentColor()}`} />
                Quick Links
              </h3>
              <ul className="space-y-3">
                {footerLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.to} 
                      className="text-gray-600 hover:text-blue-600 transition-all duration-200 flex items-center gap-3 group py-1"
                    >
                      <span className="text-gray-400 group-hover:text-blue-500 transition-colors duration-200">
                        {link.icon}
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform duration-200 font-medium">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link 
                    to="/newsletter" 
                    className="text-orange-600 hover:text-orange-700 transition-all duration-200 flex items-center gap-3 group py-1"
                  >
                    <span className="text-orange-500 group-hover:text-orange-600 transition-colors duration-200">
                      <Newspaper className="w-4 h-4" />
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 font-medium flex items-center gap-2">
                      Newsletter
                      <Sparkles className="w-3 h-3 text-orange-400 animate-pulse" />
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Mail className={`w-5 h-5 ${getRoleAccentColor()}`} />
                Get in Touch
              </h3>
              <div className="space-y-4">
                {[
                  { 
                    icon: Mail, 
                    text: 'crackit.company@gmail.com', 
                    bgColor: 'bg-blue-100', 
                    iconColor: 'text-blue-600' 
                  },
                  { 
                    icon: Phone, 
                    text: '+91 9554112334', 
                    bgColor: 'bg-green-100', 
                    iconColor: 'text-green-600' 
                  },
                  { 
                    icon: MapPin, 
                    text: 'MANIT, Bhopal', 
                    bgColor: 'bg-purple-100', 
                    iconColor: 'text-purple-600' 
                  }
                ].map(({ icon: Icon, text, bgColor, iconColor }, index) => (
                  <div key={index} className="flex items-center space-x-3 text-gray-600 group">
                    <div className={`w-10 h-10 ${bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <span className="text-sm font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Sparkles className={`w-5 h-5 ${getRoleAccentColor()}`} />
                Stay Updated
              </h3>
              <p className="text-gray-600 text-sm">
                Get the latest job opportunities and career tips delivered to your inbox.
              </p>
              
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 text-sm bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 via-purple-600 to-blue-600 hover:from-blue-600 hover:via-purple-700 hover:to-blue-700 text-white text-sm font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubscribing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Subscribe Now
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200/50 bg-white/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                <p className="text-sm text-gray-600 flex items-center font-medium">
                  © 2024 CrackIt. Made with 
                  <Heart className="w-4 h-4 text-red-500 mx-1 animate-pulse" fill="currentColor" />
                  for job seekers everywhere.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6">
                {/* Legal Links */}
                <div className="flex space-x-6 text-sm">
                  {[
                    { to: '/privacy', label: 'Privacy Policy', icon: Shield },
                    { to: '/terms', label: 'Terms of Service', icon: FileText },
                    { to: '/cookies', label: 'Cookie Policy', icon: Cookie }
                  ].map(({ to, label, icon: Icon }, index) => (
                    <Link 
                      key={index}
                      to={to} 
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1 group"
                    >
                      <Icon className="w-3 h-3 group-hover:scale-110 transition-transform duration-200" />
                      {label}
                    </Link>
                  ))}
                </div>

                {/* Back to Top Button */}
                <button
                  onClick={scrollToTop}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:shadow-lg hover:bg-white transition-all duration-300 group"
                  aria-label="Back to top"
                >
                  <span className="text-sm font-medium">Back to Top</span>
                  <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;