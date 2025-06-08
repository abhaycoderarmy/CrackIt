import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { MapPin, Users, Clock, Star, ArrowRight, Building2, Zap } from 'lucide-react'

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();
    
    // Generate random company color theme
    const colorThemes = [
        { from: 'from-cyan-500', to: 'to-blue-500', accent: 'text-cyan-400', bg: 'from-cyan-500/10 to-blue-500/10' },
        { from: 'from-purple-500', to: 'to-pink-500', accent: 'text-purple-400', bg: 'from-purple-500/10 to-pink-500/10' },
        { from: 'from-green-500', to: 'to-teal-500', accent: 'text-green-400', bg: 'from-green-500/10 to-teal-500/10' },
        { from: 'from-orange-500', to: 'to-red-500', accent: 'text-orange-400', bg: 'from-orange-500/10 to-red-500/10' },
        { from: 'from-indigo-500', to: 'to-purple-500', accent: 'text-indigo-400', bg: 'from-indigo-500/10 to-purple-500/10' }
    ];
    
    const theme = colorThemes[Math.abs(job?.company?.name?.charCodeAt(0) || 0) % colorThemes.length];
    
    return (
        <div 
            onClick={() => navigate(`/description/${job._id}`)} 
            className='group relative cursor-pointer transform hover:scale-105 transition-all duration-500'
        >
            {/* Card Glow Effect */}
            <div className={`absolute -inset-1 bg-gradient-to-r ${theme.from} ${theme.to} rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500`}></div>
            
            <div className='relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden'>
                {/* Background Pattern */}
                <div className='absolute inset-0'>
                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full transform translate-x-8 -translate-y-8'></div>
                </div>

                <div className='relative p-6'>
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`w-12 h-12 bg-gradient-to-r ${theme.from} ${theme.to} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                                    <span className="text-white font-bold text-lg">
                                        {job?.company?.name?.charAt(0) || 'C'}
                                    </span>
                                </div>
                                <div>
                                    <h1 className='font-bold text-xl text-white group-hover:text-cyan-300 transition-colors duration-300'>
                                        {job?.company?.name}
                                    </h1>
                                    <div className='flex items-center gap-2 text-sm text-gray-400'>
                                        <MapPin className='w-3 h-3' />
                                        <span>India</span>
                                        <div className='w-1 h-1 bg-gray-500 rounded-full'></div>
                                        <Clock className='w-3 h-3' />
                                        <span>2 days ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Premium Badge */}
                        <div className='relative'>
                            <div className={`absolute inset-0 bg-gradient-to-r ${theme.from} ${theme.to} rounded-lg blur-md opacity-30`}></div>
                            <div className='relative px-3 py-1 bg-slate-800/80 backdrop-blur-sm rounded-lg border border-white/10'>
                                <div className='flex items-center gap-1'>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className='w-2.5 h-2.5 text-yellow-400 fill-current' />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Job Details */}
                    <div className="mb-6">
                        <h2 className={`font-bold text-xl mb-3 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-purple-300 transition-all duration-300`}>
                            {job?.title}
                        </h2>
                        <p className='text-sm text-gray-400 leading-relaxed line-clamp-3 group-hover:text-gray-300 transition-colors duration-300'>
                            {job?.description}
                        </p>
                    </div>
                    
                    {/* Dynamic Badges */}
                    <div className='flex flex-wrap gap-2 mb-6'>
                        <div className='relative group/badge'>
                            <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur-sm opacity-20 group-hover/badge:opacity-40 transition-opacity duration-300'></div>
                            <div className='relative px-3 py-1.5 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-lg'>
                                <div className='flex items-center gap-1.5'>
                                    <Users className='w-3 h-3 text-blue-400' />
                                    <span className='text-blue-300 font-semibold text-sm'>
                                        {job?.position} Positions
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className='relative group/badge'>
                            <div className='absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg blur-sm opacity-20 group-hover/badge:opacity-40 transition-opacity duration-300'></div>
                            <div className='relative px-3 py-1.5 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-lg'>
                                <div className='flex items-center gap-1.5'>
                                    <Building2 className='w-3 h-3 text-red-400' />
                                    <span className='text-red-300 font-semibold text-sm'>
                                        {job?.jobType}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className='relative group/badge'>
                            <div className='absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur-sm opacity-20 group-hover/badge:opacity-40 transition-opacity duration-300'></div>
                            <div className='relative px-3 py-1.5 bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 rounded-lg'>
                                <div className='flex items-center gap-1.5'>
                                    <Zap className='w-3 h-3 text-purple-400' />
                                    <span className='text-purple-300 font-semibold text-sm'>
                                        {job?.salary}LPA
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Section */}
                    <div className='flex items-center justify-between pt-4 border-t border-white/10'>
                        <div className='flex items-center gap-2 text-gray-400 text-sm'>
                            <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                            <span>Actively Hiring</span>
                        </div>
                        
                        <div className='flex items-center gap-2 text-cyan-400 font-semibold group-hover:text-cyan-300 transition-colors duration-300'>
                            <span className='text-sm'>View Details</span>
                            <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-300' />
                        </div>
                    </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className='absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'></div>
            </div>
        </div>
    )
}

export default LatestJobCards