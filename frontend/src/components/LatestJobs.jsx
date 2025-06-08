import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight, Briefcase, TrendingUp, Star, Zap } from 'lucide-react';

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);
    const navigate = useNavigate();
   
    return (
        <div className='relative py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden'>
            {/* Animated Background Elements */}
            <div className='absolute inset-0'>
                {/* Floating Orbs */}
                <div className='absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-float'></div>
                <div className='absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-screen filter blur-xl opacity-15 animate-float-delayed'></div>
                <div className='absolute bottom-32 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-float-slow'></div>
                
                {/* Grid Pattern */}
                <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]'></div>
            </div>

            {/* Floating Particles */}
            <div className='absolute inset-0 overflow-hidden'>
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute w-1 h-1 bg-white/20 rounded-full animate-float-particle-${i % 3}`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 4}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }}
                    ></div>
                ))}
            </div>

            <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Premium Header Section */}
                <div className="text-center mb-16">
                    {/* Premium Badge */}
                    <div className='mb-8 flex justify-center'>
                        <div className='relative group'>
                            <div className='absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300 animate-pulse'></div>
                            <span className='relative inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 text-white font-bold text-sm shadow-2xl'>
                                <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-full'></div>
                                <TrendingUp className='w-4 h-4 mr-2 text-cyan-400' />
                                <span className='bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent'>
                                    🔥 Trending Opportunities
                                </span>
                            </span>
                        </div>
                    </div>

                    <h1 className='text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6'>
                        <span className='block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl'>
                            Latest &
                        </span>
                        <span 
                            className='block'
                            style={{
                                background: 'linear-gradient(45deg, #06b6d4, #8b5cf6, #ec4899)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.3))'
                            }}
                        >
                            Top Job Openings
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Discover the most 
                        <span className='bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold'> exclusive opportunities</span> from 
                        industry-leading companies worldwide
                    </p>
                </div>
                
                {/* Jobs Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {allJobs?.length <= 0 ? (
                        <div className="col-span-full text-center py-16">
                            <div className='relative mb-8'>
                                <div className='absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-20 animate-pulse'></div>
                                <div className='relative w-24 h-24 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto border border-white/10 shadow-2xl'>
                                    <Briefcase className="w-12 h-12 text-gray-400" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                                No Jobs Available
                            </h3>
                            <p className="text-gray-400 text-lg">
                                Check back later for new opportunities
                            </p>
                        </div>
                    ) : (
                        allJobs?.slice(0, 6).map((job) => (
                            <LatestJobCards key={job._id} job={job} />
                        ))
                    )}
                </div>
                
                {/* Premium CTA Button */}
                {allJobs?.length > 6 && (
                    <div className="text-center mt-16">
                        <div className='relative group inline-block'>
                            <div className='absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition-all duration-500 animate-gradient-x'></div>
                            <Button 
                                className="relative bg-gradient-to-r from-slate-800/90 via-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/10 hover:from-slate-700/90 hover:via-slate-800/90 hover:to-slate-700/90 px-10 py-4 font-bold text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                                onClick={() => navigate('/browse')}
                            >
                                <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10'></div>
                                <div className='absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                <span className='relative flex items-center text-white'>
                                    <Zap className="w-5 h-5 mr-3 text-cyan-400" />
                                    <span className='bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent'>
                                        Explore All Opportunities
                                    </span>
                                    <ArrowRight className="w-5 h-5 ml-3 text-purple-400 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-30px) rotate(-180deg); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(90deg); }
                }
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
                .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
                .animate-gradient-x { 
                    background-size: 200% 200%; 
                    animation: gradient-x 3s ease infinite; 
                }
                
                .animate-float-particle-0 { animation: float 3s ease-in-out infinite; }
                .animate-float-particle-1 { animation: float-delayed 4s ease-in-out infinite; }
                .animate-float-particle-2 { animation: float-slow 5s ease-in-out infinite; }
            `}</style>
        </div>
    )
}

export default LatestJobs