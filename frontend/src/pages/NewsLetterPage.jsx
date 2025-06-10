


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { useSelector, useDispatch } from "react-redux";
import Navbar from '@/components/shared/Navbar';
import { 
  PlusCircle, 
  BookOpen, 
  Calendar, 
  User, 
  FileText, 
  Search,
  Filter,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  Send,
  X,
  Lock,
  Unlock,
  Globe,
  AlertCircle,
  EyeOff,
  Star,
  TrendingUp,
  Clock,
  Heart
} from 'lucide-react';
import Footer from '@/components/shared/Footer';

// Use your existing API configuration
const config = {
  development: {
    API_BASE_URL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`
  },
  production: {
    API_BASE_URL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`
  }
};

const currentConfig = config[process.env.NODE_ENV] || config.development;
const NEWSLETTER_API_ENDPOINT = `${currentConfig.API_BASE_URL}/newsletter`;

const NewsletterPage = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [myNewsletters, setMyNewsletters] = useState([]);
  const [allNewsletters, setAllNewsletters] = useState([]);
  const [filteredNewsletters, setFilteredNewsletters] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNewsletter, setEditingNewsletter] = useState(null);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPrivateNewsletters, setShowPrivateNewsletters] = useState(false);

  const isValidToken = (token) => {
    if (!token || typeof token !== 'string' || token === 'undefined' || token === 'null') {
      return false;
    }
    
    try {
      const parts = token.split('.');
      return parts.length === 3 && parts.every(part => part.length > 0);
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    fetchAllNewsletters();
    if (user && (user.id || user._id) && isValidToken(user.token)) {
      fetchMyNewsletters();
    }
  }, [user]);

  useEffect(() => {
    filterNewsletters();
  }, [allNewsletters, myNewsletters, searchTerm, filterBy, showPrivateNewsletters]);

  const fetchMyNewsletters = async () => {
    const userId = user?.id || user?._id;
    if (!userId || !isValidToken(user.token)) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      // Fetch all newsletters by the user (including private ones)
      const res = await axios.get(
        `${NEWSLETTER_API_ENDPOINT}/by-author?authorId=${userId}&includePrivate=true`,
        config
      );
      
      const newsletters = res.data.newsletters || res.data;
      setMyNewsletters(Array.isArray(newsletters) ? newsletters : []);
      console.log('My newsletters fetched:', newsletters); // Debug log
    } catch (err) {
      console.error('Fetch my newsletters error:', err);
      if (err.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
        handleInvalidAuth();
      } else {
        toast.error('Failed to fetch your newsletters');
      }
    }
  };

  const fetchAllNewsletters = async () => {
    try {
      const headers = {};
      if (user && isValidToken(user.token)) {
        headers.Authorization = `Bearer ${user.token}`;
      }

      // Fetch all newsletters (public + user's private ones if authenticated)
      const res = await axios.get(NEWSLETTER_API_ENDPOINT, { headers });
      const newsletters = res.data.newsletters || res.data;
      setAllNewsletters(Array.isArray(newsletters) ? newsletters : []);
      console.log('All newsletters fetched:', newsletters); // Debug log
    } catch (err) {
      console.error('Fetch all newsletters error:', err);
      toast.error('Failed to fetch newsletters');
    }
  };

  const filterNewsletters = () => {
    let filtered = [...allNewsletters];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(newsletter =>
        newsletter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        newsletter.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getAuthorName(newsletter).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filterBy === 'mine' && user) {
      filtered = filtered.filter(newsletter => isMyNewsletter(newsletter));
    } else if (filterBy === 'public') {
      filtered = filtered.filter(newsletter => !newsletter.isPrivate);
    } else if (filterBy === 'private' && user) {
      filtered = filtered.filter(newsletter => newsletter.isPrivate && isMyNewsletter(newsletter));
    } else if (filterBy === 'recent') {
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Apply privacy filter
    if (!showPrivateNewsletters && user) {
      filtered = filtered.filter(newsletter => !newsletter.isPrivate || !isMyNewsletter(newsletter));
    }

    setFilteredNewsletters(filtered);
  };

  const getAuthorName = (newsletter) => {
    if (!newsletter.createdBy) return 'Anonymous';
    return newsletter.createdBy.name || newsletter.createdBy.fullname || 'Anonymous';
  };

  const handleInvalidAuth = () => {
    localStorage.removeItem('auth');
    // You might want to dispatch a logout action here
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    if (!user || !isValidToken(user.token)) {
      toast.error('Please login to continue');
      return;
    }

    setLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
      };

      const payload = {
        title: title.trim(),
        content: content.trim(),
        isPrivate: editingNewsletter ? editingNewsletter.isPrivate : isPrivate
      };

      if (editingNewsletter) {
        await axios.put(
          `${NEWSLETTER_API_ENDPOINT}/${editingNewsletter._id}`,
          payload,
          config
        );
        toast.success('Newsletter updated successfully');
      } else {
        await axios.post(
          NEWSLETTER_API_ENDPOINT,
          payload,
          config
        );
        toast.success('Newsletter published successfully');
      }

      resetForm();
      await fetchMyNewsletters();
      await fetchAllNewsletters();
      
    } catch (err) {
      console.error('Submit newsletter error:', err);
      if (err.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
        handleInvalidAuth();
      } else if (err.response?.status === 403) {
        toast.error('You do not have permission to create newsletters.');
      } else {
        toast.error(err.response?.data?.message || 'Failed to save newsletter');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setIsPrivate(false);
    setShowCreateForm(false);
    setEditingNewsletter(null);
  };

  const handleEdit = (newsletter) => {
    setEditingNewsletter(newsletter);
    setTitle(newsletter.title);
    setContent(newsletter.content);
    setIsPrivate(newsletter.isPrivate || false);
    setShowCreateForm(true);
  };

  const handleDelete = async (newsletterId) => {
    if (!window.confirm('Are you sure you want to delete this newsletter? This action cannot be undone.')) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.delete(`${NEWSLETTER_API_ENDPOINT}/${newsletterId}`, config);
      toast.success('Newsletter deleted successfully');
      
      await fetchMyNewsletters();
      await fetchAllNewsletters();
      
      // Close modal if the deleted newsletter is currently being viewed
      if (selectedNewsletter && selectedNewsletter._id === newsletterId) {
        setShowDetailModal(false);
        setSelectedNewsletter(null);
      }
    } catch (err) {
      console.error('Delete newsletter error:', err);
      if (err.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
      } else if (err.response?.status === 403) {
        toast.error('You can only delete your own newsletters.');
      } else {
        toast.error('Failed to delete newsletter');
      }
    }
  };

  const handleTogglePrivacy = async (newsletterId, currentStatus) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
      };

      const response = await axios.patch(
        `${NEWSLETTER_API_ENDPOINT}/${newsletterId}/privacy`,
        { isPrivate: !currentStatus },
        config
      );
      
      const action = !currentStatus ? 'made private' : 'made public';
      toast.success(`Newsletter ${action} successfully`);
      
      await fetchMyNewsletters();
      await fetchAllNewsletters();
      
      // Update the selected newsletter if it's currently being viewed
      if (selectedNewsletter && selectedNewsletter._id === newsletterId) {
        setSelectedNewsletter({
          ...selectedNewsletter,
          isPrivate: !currentStatus
        });
      }
    } catch (err) {
      console.error('Toggle privacy error:', err);
      if (err.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
      } else if (err.response?.status === 403) {
        toast.error('You can only modify your own newsletters.');
      } else {
        toast.error('Failed to update newsletter privacy');
      }
    }
  };

  const handleViewDetails = (newsletter) => {
    setSelectedNewsletter(newsletter);
    setShowDetailModal(true);
  };

  const isMyNewsletter = (newsletter) => {
    if (!user || !newsletter.createdBy) return false;
    
    const userId = user.id || user._id;
    const authorId = newsletter.createdBy._id || newsletter.createdBy;
    
    return userId && authorId && userId.toString() === authorId.toString();
  };

  const canCreateNewsletter = user && 
    isValidToken(user.token) && 
    user.role && 
    (user.role === 'admin' || user.role === 'recruiter');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  // Get counts for different newsletter types
  const getNewsletterCounts = () => {
    const publicCount = myNewsletters.filter(n => !n.isPrivate).length;
    const privateCount = myNewsletters.filter(n => n.isPrivate).length;
    return { publicCount, privateCount };
  };

  const { publicCount, privateCount } = getNewsletterCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full mb-6 shadow-2xl">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
              Newsletter Hub
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover insights, stories, and updates from our vibrant community of writers and thinkers
            </p>
            
            {/* Stats Section */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-gray-900">{allNewsletters.length}</p>
                    <p className="text-sm text-gray-600">Total Articles</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-gray-900">{allNewsletters.filter(n => !n.isPrivate).length}</p>
                    <p className="text-sm text-gray-600">Public Stories</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-gray-900">{new Set(allNewsletters.map(n => n.createdBy?._id || n.createdBy)).size}</p>
                    <p className="text-sm text-gray-600">Contributors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Action Bar */}
          <div className="mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
                  {/* Enhanced Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search newsletters, authors, topics..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 pr-4 py-3 bg-white/90 shadow-lg border-0 focus:ring-2 focus:ring-blue-500 rounded-xl text-gray-900 placeholder-gray-500"
                    />
                  </div>

                  {/* Enhanced Filter */}
                  <div className="relative">
                    <select
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value)}
                      className="appearance-none bg-white/90 border-0 rounded-xl px-6 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg text-gray-900 font-medium min-w-48"
                    >
                      <option value="all">🌟 All Newsletters</option>
                      <option value="recent">🕒 Recent First</option>
                      <option value="public">🌍 Public Only</option>
                      {user && <option value="mine">✍️ My Newsletters</option>}
                      {user && <option value="private">🔒 My Private</option>}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Private Newsletter Toggle */}
                  {user && privateCount > 0 && (
                    <Button
                      variant={showPrivateNewsletters ? "default" : "outline"}
                      size="lg"
                      onClick={() => setShowPrivateNewsletters(!showPrivateNewsletters)}
                      className={`${showPrivateNewsletters 
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg" 
                        : "bg-white/90 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 shadow-lg"
                      } rounded-xl px-6 py-3 font-medium transition-all duration-200`}
                    >
                      {showPrivateNewsletters ? <Eye className="w-5 h-5 mr-2" /> : <EyeOff className="w-5 h-5 mr-2" />}
                      {showPrivateNewsletters ? 'Hide Private' : 'Show Private'}
                      <span className="ml-2 bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded-full">
                        {privateCount}
                      </span>
                    </Button>
                  )}
                </div>

                {/* Enhanced Create Button */}
                {canCreateNewsletter && (
                  <Button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 font-semibold text-lg"
                  >
                    <PlusCircle className="w-6 h-6 mr-2" />
                    Create Newsletter
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Create/Edit Form */}
          {showCreateForm && canCreateNewsletter && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                  <FileText className="w-8 h-8 mr-3 text-blue-500" />
                  {editingNewsletter ? 'Edit Newsletter' : 'Create New Newsletter'}
                </h2>
                <Button
                  variant="ghost"
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl p-2"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Newsletter Title
                  </label>
                  <Input
                    type="text"
                    placeholder="Craft an engaging title that captures attention..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                    className="w-full text-lg p-4 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white/80"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Content
                  </label>
                  <Textarea
                    placeholder="Share your insights, stories, and ideas with the community..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                    disabled={loading}
                    className="w-full text-lg p-4 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl resize-none bg-white/80"
                  />
                </div>

                {/* Enhanced Privacy Toggle */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      id="isPrivate"
                      checked={editingNewsletter ? editingNewsletter.isPrivate : isPrivate}
                      onChange={(e) => {
                        if (editingNewsletter) {
                          setEditingNewsletter({...editingNewsletter, isPrivate: e.target.checked});
                        } else {
                          setIsPrivate(e.target.checked);
                        }
                      }}
                      className="rounded-lg border-gray-300 text-purple-600 focus:ring-purple-500 w-5 h-5"
                    />
                    <label htmlFor="isPrivate" className="text-lg font-semibold text-gray-800 flex items-center">
                      <Lock className="w-5 h-5 mr-2 text-purple-600" />
                      Make this newsletter private
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 ml-9">
                    Private newsletters are only visible to you and won't appear in public listings.
                  </p>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !title.trim() || !content.trim()}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center text-lg font-semibold"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {loading ? 'Publishing...' : editingNewsletter ? 'Update Newsletter' : 'Publish Newsletter'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    disabled={loading}
                    className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-xl text-lg font-semibold"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Permission Notice for authenticated users who can't create
          {user && !canCreateNewsletter && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 mb-12 flex items-start shadow-lg">
              <AlertCircle className="w-6 h-6 text-amber-500 mt-1 mr-4 flex-shrink-0" />
              <div>
                <p className="text-amber-800 text-lg">
                  <span className="font-bold">Publishing restricted:</span> Only admins and recruiters can create newsletters. 
                  Your current role is <span className="font-bold bg-amber-100 px-2 py-1 rounded-lg">{user.role}</span>.
                </p>
                <p className="text-amber-700 mt-2">Contact an administrator to request publishing permissions.</p>
              </div>
            </div>
          )} */}

          {/* Private Newsletter Info */}
          {user && showPrivateNewsletters && privateCount > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 mb-12 flex items-start shadow-lg">
              <Lock className="w-6 h-6 text-purple-500 mt-1 mr-4 flex-shrink-0" />
              <div>
                <p className="text-purple-800 text-lg">
                  <span className="font-bold">Private newsletters visible:</span> You can see your {privateCount} private newsletter{privateCount !== 1 ? 's' : ''} below.
                </p>
                <p className="text-purple-700 mt-2">You can make them public by clicking the unlock icon.</p>
              </div>
            </div>
          )}
          {/* Enhanced My Newsletters Section */}
          {user && myNewsletters.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                  <User className="w-8 h-8 mr-3 text-blue-500" />
                  My Newsletters
                  <span className="ml-3 bg-blue-100 text-blue-800 text-lg font-bold px-3 py-1 rounded-full">
                    {myNewsletters.length}
                  </span>
                </h2>
                <div className="flex gap-2">
                  <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                    {publicCount} Public
                  </span>
                  {privateCount > 0 && (
                    <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                      {privateCount} Private
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {myNewsletters.map((newsletter) => (
                  <div
                    key={newsletter._id}
                    className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500 flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(newsletter.createdAt)}
                            </span>
                            <span className="text-xs text-gray-400">{getAuthorName(newsletter)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {newsletter.isPrivate ? (
                            <Lock className="w-5 h-5 text-purple-500" />
                          ) : (
                            <Globe className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {newsletter.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {truncateContent(newsletter.content)}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(newsletter)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(newsletter)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePrivacy(newsletter._id, newsletter.isPrivate)}
                            className={`${newsletter.isPrivate 
                              ? 'text-purple-600 hover:text-purple-700 hover:bg-purple-50' 
                              : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                            } rounded-lg`}
                          >
                            {newsletter.isPrivate ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(newsletter._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced All Newsletters Section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <BookOpen className="w-8 h-8 mr-3 text-purple-500" />
                {filterBy === 'mine' ? 'My Newsletters' : 
                 filterBy === 'public' ? 'Public Newsletters' :
                 filterBy === 'private' ? 'Private Newsletters' :
                 filterBy === 'recent' ? 'Recent Newsletters' : 'All Newsletters'}
                <span className="ml-3 bg-purple-100 text-purple-800 text-lg font-bold px-3 py-1 rounded-full">
                  {filteredNewsletters.length}
                </span>
              </h2>
              {searchTerm && (
                <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  Results for "{searchTerm}"
                </div>
              )}
            </div>

            {filteredNewsletters.length === 0 ? (
              <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {searchTerm ? 'No newsletters found' : 'No newsletters yet'}
                </h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
                  {searchTerm 
                    ? `No newsletters match your search for "${searchTerm}". Try different keywords.`
                    : 'Be the first to share your thoughts and insights with the community.'
                  }
                </p>
                {searchTerm && (
                  <Button
                    onClick={() => setSearchTerm('')}
                    variant="outline"
                    className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 px-6 py-2 rounded-xl"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNewsletters.map((newsletter) => (
                  <div
                    key={newsletter._id}
                    className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 overflow-hidden cursor-pointer"
                    onClick={() => handleViewDetails(newsletter)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{getAuthorName(newsletter)}</span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(newsletter.createdAt)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {newsletter.isPrivate ? (
                            <div className="flex items-center text-purple-600 bg-purple-100 px-2 py-1 rounded-full text-xs font-medium">
                              <Lock className="w-3 h-3 mr-1" />
                              Private
                            </div>
                          ) : (
                            <div className="flex items-center text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-medium">
                              <Globe className="w-3 h-3 mr-1" />
                              Public
                            </div>
                          )}
                          {isMyNewsletter(newsletter) && (
                            <Star className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {newsletter.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm line-clamp-4 mb-4">
                        {truncateContent(newsletter.content)}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {Math.ceil(newsletter.content.length / 200)} min read
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-3 h-3 mr-1" />
                            {Math.floor(Math.random() * 50)} likes
                          </span>
                        </div>
                        
                        {isMyNewsletter(newsletter) && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(newsletter);
                              }}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg p-1"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTogglePrivacy(newsletter._id, newsletter.isPrivate);
                              }}
                              className={`${newsletter.isPrivate 
                                ? 'text-purple-600 hover:text-purple-700 hover:bg-purple-50' 
                                : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                              } rounded-lg p-1`}
                            >
                              {newsletter.isPrivate ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(newsletter._id);
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Detail Modal */}
          {showDetailModal && selectedNewsletter && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedNewsletter.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {getAuthorName(selectedNewsletter)}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(selectedNewsletter.createdAt)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {Math.ceil(selectedNewsletter.content.length / 200)} min read
                        </span>
                        {selectedNewsletter.isPrivate ? (
                          <span className="flex items-center text-purple-600 bg-purple-100 px-2 py-1 rounded-full text-xs font-medium">
                            <Lock className="w-3 h-3 mr-1" />
                            Private
                          </span>
                        ) : (
                          <span className="flex items-center text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-medium">
                            <Globe className="w-3 h-3 mr-1" />
                            Public
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isMyNewsletter(selectedNewsletter) && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowDetailModal(false);
                            handleEdit(selectedNewsletter);
                          }}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePrivacy(selectedNewsletter._id, selectedNewsletter.isPrivate)}
                          className={`${selectedNewsletter.isPrivate 
                            ? 'text-purple-600 hover:text-purple-700 hover:bg-purple-50' 
                            : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                          } rounded-lg`}
                        >
                          {selectedNewsletter.isPrivate ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => setShowDetailModal(false)}
                      className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                  <div className="prose prose-lg max-w-none">
                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                      {selectedNewsletter.content}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewsletterPage;