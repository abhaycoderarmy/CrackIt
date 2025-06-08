import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Search, Filter, Grid, List, SortAsc, SortDesc, Briefcase, MapPin, Clock, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import Footer from './shared/Footer';

const Browse = () => {
    useGetAllJobs();
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const dispatch = useDispatch();
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'salary'
    const [localSearch, setLocalSearch] = useState('');

    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        }
    }, [dispatch])

    // Filter and sort jobs
    const filteredAndSortedJobs = React.useMemo(() => {
        let filtered = allJobs;

        // Apply local search filter
        if (localSearch) {
            filtered = filtered.filter(job => 
                job.title?.toLowerCase().includes(localSearch.toLowerCase()) ||
                job.company?.name?.toLowerCase().includes(localSearch.toLowerCase()) ||
                job.location?.toLowerCase().includes(localSearch.toLowerCase())
            );
        }

        // Apply sorting
        switch (sortBy) {
            case 'oldest':
                return [...filtered].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'salary':
                return [...filtered].sort((a, b) => (b.salary || 0) - (a.salary || 0));
            case 'newest':
            default:
                return [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    }, [allJobs, localSearch, sortBy]);

    const handleSearch = (e) => {
        setLocalSearch(e.target.value);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Navbar />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-600/90"></div>
                
                {/* Animated background elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
                    <div className="absolute top-32 right-20 w-32 h-32 bg-white/5 rounded-full animate-bounce"></div>
                    <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Discover Your Next
                            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                Dream Job
                            </span>
                        </h1>
                        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                            Browse through thousands of opportunities from top companies worldwide. 
                            Your perfect career match is just a click away.
                        </p>
                        
                        {/* Search Stats */}
                        <div className="flex flex-wrap justify-center gap-6 text-white/90">
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5" />
                                <span className="text-lg font-semibold">{allJobs.length}</span>
                                <span>Jobs Available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                <span className="text-lg font-semibold">500+</span>
                                <span>Companies</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                <span className="text-lg font-semibold">50+</span>
                                <span>Locations</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Search and Filter Section */}
                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-2xl">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                type="text"
                                placeholder="Search jobs, companies, or locations..."
                                value={localSearch}
                                onChange={handleSearch}
                                className="pl-10 pr-4 py-3 w-full border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl text-lg"
                            />
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-3 flex-wrap">
                            {/* Sort Dropdown */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 bg-white"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="salary">Highest Salary</option>
                            </select>

                            {/* View Mode Toggle */}
                            <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className="px-3 py-2"
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className="px-3 py-2"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(searchedQuery || localSearch) && (
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                            <span className="text-sm text-gray-600">Active filters:</span>
                            {searchedQuery && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                    Global: {searchedQuery}
                                </Badge>
                            )}
                            {localSearch && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    Local: {localSearch}
                                </Badge>
                            )}
                        </div>
                    )}
                </div>

                {/* Results Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-2'>
                            {localSearch ? 'Search Results' : 'All Jobs'}
                        </h2>
                        <p className="text-gray-600">
                            Showing <span className="font-semibold text-blue-600">{filteredAndSortedJobs.length}</span> 
                            {localSearch ? ` results for "${localSearch}"` : ' available positions'}
                        </p>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{filteredAndSortedJobs.length}</div>
                            <div className="text-sm text-gray-500">Jobs</div>
                        </div>
                    </div>
                </div>

                {/* Jobs Grid/List */}
                {filteredAndSortedJobs.length > 0 ? (
                    <div className={`${
                        viewMode === 'grid' 
                            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                            : 'flex flex-col gap-4'
                    }`}>
                        {filteredAndSortedJobs.map((job) => (
                            <div key={job._id} className="group">
                                <Job 
                                    job={job} 
                                    viewMode={viewMode}
                                    className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16">
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-xl">
                            <div className="h-24 w-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="h-12 w-12 text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Jobs Found</h3>
                            <p className="text-gray-600 mb-6">
                                {localSearch 
                                    ? `No jobs match your search for "${localSearch}". Try different keywords or browse all jobs.`
                                    : "No jobs are currently available. Check back later for new opportunities!"
                                }
                            </p>
                            {localSearch && (
                                <Button 
                                    onClick={() => setLocalSearch('')}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                >
                                    Clear Search
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Load More Section (if needed) */}
                {filteredAndSortedJobs.length > 0 && (
                    <div className="text-center mt-12">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 inline-block">
                            <p className="text-gray-600 mb-4">
                                Showing all {filteredAndSortedJobs.length} available positions
                            </p>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                <span>Updated regularly with new opportunities</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default Browse