import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  TrendingUp,
  Users,
  Briefcase,
  Star,
  ArrowRight,
  Zap,
  Globe,
  Award,
  Shield,
} from "lucide-react";

// Mock Button component for the demo
const Button = ({ children, onClick, className, ...props }) => (
  <button onClick={onClick} className={className} {...props}>
    {children}
  </button>
);

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const [currentText, setCurrentText] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const heroTexts = [
    { main: "Dream Career", sub: "Your perfect job awaits" },
    // { main: "Next Opportunity", sub: "Unlock your potential" },
    { main: "Future Success", sub: "Shape tomorrow today" },
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const searchJobHandler = () => {
    console.log("Searching for:", query);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchJobHandler();
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-float-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mix-blend-screen filter blur-xl opacity-25 animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-pulse"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Spotlight Effect */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-radial from-white/10 to-transparent rounded-full filter blur-3xl"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-white/20 rounded-full animate-float-particle-${
              i % 3
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex flex-col items-center justify-center min-h-screen text-center py-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Premium Badge */}
          <div className="mb-8 transform hover:scale-110 transition-all duration-500 cursor-pointer">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-pulse"></div>
              <span className="relative inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 text-white font-bold text-sm shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-full"></div>
                <Award className="w-5 h-5 mr-3 text-yellow-400" />
                <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  🏆 World's #1 Job Platform
                </span>
                <div className="ml-3 flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </span>
            </div>
          </div>

          {/* Dynamic Main Heading */}
          <div className="mb-8 max-w-6xl">
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black leading-tight mb-6 relative">
              <span className="block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                Discover Your
              </span>
              <div className="relative h-20 sm:h-24 lg:h-32 overflow-hidden">
                {heroTexts.map((text, index) => (
                  <span
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ${
                      index === currentText
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-10 scale-95"
                    }`}
                    style={{
                      background:
                        "linear-gradient(45deg, #06b6d4, #8b5cf6, #ec4899)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 30px rgba(139, 92, 246, 0.3))",
                    }}
                  >
                    {text.main}
                  </span>
                ))}
              </div>
            </h1>
            <div className="relative h-8 overflow-hidden">
              {heroTexts.map((text, index) => (
                <p
                  key={index}
                  className={`absolute inset-0 text-xl sm:text-2xl text-gray-300 transition-all duration-1000 ${
                    index === currentText
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  {text.sub}
                </p>
              ))}
            </div>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mt-6">
              Join millions of professionals who found their perfect career
              match.
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                {" "}
                AI-powered matching
              </span>
              , exclusive opportunities, and career growth acceleration.
            </p>
          </div>

          {/* Ultra-Premium Search Bar */}
          <div className="w-full max-w-4xl mb-16 group">
            <div className="relative">
              {/* Animated Border */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition-all duration-500 animate-gradient-x"></div>

              <div className="relative bg-gradient-to-r from-slate-800/90 via-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5"></div>

                <div className="relative flex items-center p-3">
                  <div className="flex-1 flex items-center px-6 py-4">
                    <div className="relative mr-4">
                      <Search className="h-6 w-6 text-gray-400 transition-colors duration-300 group-hover:text-cyan-400" />
                      <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <input
                      type="text"
                      placeholder="Search 50,000+ jobs, companies, skills..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full outline-none bg-transparent text-white placeholder-gray-400 text-lg font-medium"
                    />
                  </div>

                  <Link
                    to="/jobs"
                    className="relative group m-2 px-8 py-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 text-white rounded-2xl font-bold shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden inline-flex items-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center">
                      <Zap className="w-5 h-5 mr-2" />
                      Search Jobs
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Link>
                </div>

                {/* Search Suggestions */}
                <div className="px-6 pb-4">
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Remote Work",
                      "AI/ML Engineer",
                      "Product Manager",
                      "Data Scientist",
                      "UI/UX Designer",
                    ].map((tag, index) => (
                      <button
                        key={index}
                        className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full mb-16">
            {[
              {
                icon: Briefcase,
                number: "150K+",
                label: "Active Jobs",
                color: "from-cyan-500 to-blue-500",
                bgColor: "from-cyan-500/10 to-blue-500/10",
              },
              {
                icon: Users,
                number: "2M+",
                label: "Happy Users",
                color: "from-purple-500 to-pink-500",
                bgColor: "from-purple-500/10 to-pink-500/10",
              },
              {
                icon: Globe,
                number: "195",
                label: "Countries",
                color: "from-green-500 to-teal-500",
                bgColor: "from-green-500/10 to-teal-500/10",
              },
              {
                icon: Shield,
                number: "99.9%",
                label: "Success Rate",
                color: "from-orange-500 to-red-500",
                bgColor: "from-orange-500/10 to-red-500/10",
              },
            ].map((stat, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  ></div>

                  <div className="relative">
                    <div
                      className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <stat.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3
                      className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
                    >
                      {stat.number}
                    </h3>
                    <p className="text-gray-300 font-medium">{stat.label}</p>
                  </div>

                  {/* Hover Glow Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Premium CTA Section */}
          <div className="text-center max-w-4xl">
            <div className="bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">
                Trusted by Industry Leaders
              </h3>
              <p className="text-gray-400 mb-8">
                Join professionals from these amazing companies
              </p>

              {/* Company Logos Placeholder */}
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="h-12 bg-gradient-to-r from-white/10 to-white/5 rounded-lg border border-white/10 flex items-center justify-center transition-all duration-300 hover:from-white/20 hover:to-white/10 hover:scale-110"
                    style={{ width: `${80 + Math.random() * 60}px` }}
                  >
                    <div className="w-full h-4 bg-gradient-to-r from-gray-400 to-gray-500 rounded opacity-50"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-180deg);
          }
        }
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(90deg);
          }
        }
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .animate-float-particle-0 {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-particle-1 {
          animation: float-delayed 4s ease-in-out infinite;
        }
        .animate-float-particle-2 {
          animation: float-slow 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
