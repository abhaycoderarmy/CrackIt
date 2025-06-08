import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Code, Database, BarChart3, Palette, Rocket, Shield, Globe, Zap, Users, Target } from 'lucide-react';

const categories = [
    { 
        name: "Frontend Developer", 
        icon: Code, 
        gradient: "from-cyan-500 via-blue-500 to-indigo-600",
        bgGradient: "from-cyan-500/10 via-blue-500/10 to-indigo-600/10",
        jobs: "12.5K+",
        growth: "+15%"
    },
    { 
        name: "Backend Developer", 
        icon: Database, 
        gradient: "from-emerald-500 via-green-500 to-teal-600",
        bgGradient: "from-emerald-500/10 via-green-500/10 to-teal-600/10",
        jobs: "8.2K+",
        growth: "+20%"
    },
    { 
        name: "Data Science", 
        icon: BarChart3, 
        gradient: "from-purple-500 via-violet-500 to-indigo-600",
        bgGradient: "from-purple-500/10 via-violet-500/10 to-indigo-600/10",
        jobs: "6.8K+",
        growth: "+25%"
    },
    { 
        name: "UI/UX Designer", 
        icon: Palette, 
        gradient: "from-pink-500 via-rose-500 to-red-600",
        bgGradient: "from-pink-500/10 via-rose-500/10 to-red-600/10",
        jobs: "4.3K+",
        growth: "+18%"
    },
    { 
        name: "Full Stack Developer", 
        icon: Rocket, 
        gradient: "from-orange-500 via-amber-500 to-yellow-600",
        bgGradient: "from-orange-500/10 via-amber-500/10 to-yellow-600/10",
        jobs: "9.1K+",
        growth: "+22%"
    },
    { 
        name: "DevOps Engineer", 
        icon: Shield, 
        gradient: "from-slate-600 via-gray-600 to-zinc-700",
        bgGradient: "from-slate-600/10 via-gray-600/10 to-zinc-700/10",
        jobs: "3.7K+",
        growth: "+30%"
    },
    { 
        name: "Product Manager", 
        icon: Target, 
        gradient: "from-blue-600 via-purple-600 to-pink-600",
        bgGradient: "from-blue-600/10 via-purple-600/10 to-pink-600/10",
        jobs: "5.2K+",
        growth: "+12%"
    },
    { 
        name: "Marketing Specialist", 
        icon: Zap, 
        gradient: "from-green-600 via-lime-500 to-emerald-600",
        bgGradient: "from-green-600/10 via-lime-500/10 to-emerald-600/10",
        jobs: "7.4K+",
        growth: "+16%"
    }
];

const CategoryCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [visibleCards, setVisibleCards] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setVisibleCards(1);
            } else if (window.innerWidth < 1024) {
                setVisibleCards(2);
            } else {
                setVisibleCards(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!isAutoPlaying) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => 
                prev + visibleCards >= categories.length ? 0 : prev + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, visibleCards]);

    const searchJobHandler = (query) => {
        console.log('Searching for:', query);
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => 
            prev + visibleCards >= categories.length ? 0 : prev + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => 
            prev === 0 ? Math.max(0, categories.length - visibleCards) : prev - 1
        );
    };

    return (
        <div className="relative py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
            {/* Background Elements */}
            <div className='absolute inset-0'>
                <div className='absolute top-20 right-10 w-48 h-48 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full filter blur-3xl animate-pulse'></div>
                <div className='absolute bottom-20 left-10 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full filter blur-3xl animate-pulse delay-1000'></div>
                <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]'></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 text-white font-semibold text-sm shadow-2xl mb-6">
                        <Users className='w-4 h-4 mr-2 text-cyan-400' />
                        <span className='bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent'>
                            Popular Categories
                        </span>
                    </div>
                    
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
                        <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                            Explore Dream
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Career Paths
                        </span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Discover high-demand roles with competitive salaries and growth opportunities
                    </p>
                </div>

                {/* Carousel Container */}
                <div 
                    className="relative"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white hover:from-cyan-500/20 hover:to-purple-500/20 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 hover:scale-110 group"
                    >
                        <ChevronLeft className="w-6 h-6 group-hover:text-cyan-400 transition-colors duration-300" />
                    </button>
                    
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white hover:from-cyan-500/20 hover:to-purple-500/20 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 hover:scale-110 group"
                    >
                        <ChevronRight className="w-6 h-6 group-hover:text-cyan-400 transition-colors duration-300" />
                    </button>

                    {/* Cards Container */}
                    <div className="mx-12 overflow-hidden">
                        <div 
                            className="flex transition-transform duration-500 ease-out"
                            style={{ 
                                transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                            }}
                        >
                            {categories.map((category, index) => {
                                const IconComponent = category.icon;
                                return (
                                    <div
                                        key={index}
                                        className="flex-none px-3"
                                        style={{ width: `${100 / visibleCards}%` }}
                                    >
                                        <div 
                                            onClick={() => searchJobHandler(category.name)}
                                            className="group cursor-pointer h-full"
                                        >
                                            {/* Card */}
                                            <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 p-8 h-full overflow-hidden">
                                                {/* Animated Background */}
                                                <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}></div>
                                                
                                                {/* Glow Effect */}
                                                <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`}></div>
                                                
                                                <div className="relative z-10">
                                                    {/* Icon */}
                                                    <div className={`w-16 h-16 bg-gradient-to-r ${category.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                                                        <IconComponent className="h-8 w-8 text-white" />
                                                    </div>

                                                    {/* Content */}
                                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-purple-300 group-hover:bg-clip-text transition-all duration-300">
                                                        {category.name}
                                                    </h3>

                                                    {/* Stats */}
                                                    <div className="flex justify-between items-center mb-6">
                                                        <div>
                                                            <p className="text-2xl font-bold text-gray-200">{category.jobs}</p>
                                                            <p className="text-sm text-gray-400">Open Positions</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className={`text-lg font-bold bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}>
                                                                {category.growth}
                                                            </p>
                                                            <p className="text-sm text-gray-400">Growth</p>
                                                        </div>
                                                    </div>

                                                    {/* CTA */}
                                                    <div className="flex items-center text-gray-300 group-hover:text-white transition-colors duration-300">
                                                        <span className="font-medium">Explore Opportunities</span>
                                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                                                    </div>
                                                </div>

                                                {/* Decorative Elements */}
                                                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full"></div>
                                                <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-white/5 to-transparent rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex justify-center mt-12 space-x-2">
                        {Array.from({ length: Math.ceil(categories.length / visibleCards) }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index * visibleCards)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    Math.floor(currentIndex / visibleCards) === index
                                        ? 'bg-gradient-to-r from-cyan-400 to-purple-400 w-8'
                                        : 'bg-white/20 hover:bg-white/40'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 cursor-pointer group">
                        <Globe className="w-5 h-5 mr-3 text-cyan-400" />
                        <span className="text-white font-semibold mr-3">View All Categories</span>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryCarousel;