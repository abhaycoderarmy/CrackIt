import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Briefcase } from 'lucide-react';
import Footer from './shared/Footer';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        if (searchedQuery) {
            const filteredJobs = allJobs.filter((job) => {
                return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchedQuery.toLowerCase())
            })
            setFilterJobs(filteredJobs)
        } else {
            setFilterJobs(allJobs)
        }
    }, [allJobs, searchedQuery]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Navbar />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                                <Briefcase className="w-8 h-8" />
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">
                            Find Your Dream Job
                        </h1>
                        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
                            Discover amazing opportunities and take the next step in your career journey
                        </p>
                        <div className="mt-8 flex justify-center items-center space-x-4">
                            <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                <Search className="w-4 h-4" />
                                <span className="text-sm">
                                    {filterJobs.length} {filterJobs.length === 1 ? 'Job' : 'Jobs'} Found
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                        >
                            <Filter className="w-4 h-4" />
                            <span>Filters</span>
                        </button>
                    </div>

                    {/* Sidebar - Filters */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className={`w-full lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}
                    >
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <Filter className="w-5 h-5 mr-2 text-blue-600" />
                                    Filter Jobs
                                </h3>
                            </div>
                            <div className="p-6">
                                <FilterCard />
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-h-0">
                        <AnimatePresence mode="wait">
                            {filterJobs.length <= 0 ? (
                                <motion.div
                                    key="no-jobs"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100"
                                >
                                    <div className="p-4 bg-gray-100 rounded-full mb-6">
                                        <Search className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Jobs Found</h3>
                                    <p className="text-gray-500 text-center max-w-md">
                                        We couldn't find any jobs matching your criteria. Try adjusting your filters or search terms.
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="jobs-grid"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="space-y-6"
                                >
                                    {/* Results Header */}
                                    <motion.div
                                        variants={itemVariants}
                                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-800">
                                                    Available Positions
                                                </h2>
                                                <p className="text-gray-600 mt-1">
                                                    {filterJobs.length} {filterJobs.length === 1 ? 'opportunity' : 'opportunities'} waiting for you
                                                </p>
                                            </div>
                                            <div className="mt-4 sm:mt-0">
                                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                    <span>Updated recently</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Jobs Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {filterJobs.map((job, index) => (
                                            <motion.div
                                                key={job?._id}
                                                variants={itemVariants}
                                                whileHover={{ 
                                                    y: -4,
                                                    transition: { duration: 0.2 }
                                                }}
                                                className="group"
                                            >
                                                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:border-blue-200">
                                                    <Job job={job} />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Load More Section (if needed) */}
                                    {filterJobs.length > 0 && (
                                        <motion.div
                                            variants={itemVariants}
                                            className="text-center py-8"
                                        >
                                            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
                                                <span className="font-medium">Showing all results</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Footer Gradient */}
            <Footer/>
        </div>

    )
}

export default Jobs