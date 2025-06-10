import React, { useEffect, useState } from "react";
import {
  Search,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Mail,
  Phone,
  Award,
  Briefcase,
  RefreshCw,
  Filter,
} from "lucide-react";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
const AdminJobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching admin jobs...");

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/job-management`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (data.success) {
        setJobs(data.jobs || []);
      } else {
        setError(data.message || "Failed to fetch jobs");
      }
    } catch (err) {
      console.error("Error fetching admin jobs:", err);

      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setError("Network Error: Cannot connect to server");
      } else {
        setError("Request Error: " + err.message);
      }
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "all" ||
      job.jobType.toLowerCase() === filterType.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const getJobTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "full-time":
        return "bg-green-100 text-green-800 border-green-200";
      case "part-time":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "contract":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "internship":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-700">Loading jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-2xl mx-auto pt-20">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Jobs
            </h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={fetchJobs}
              className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <Navbar />
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Job Management Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage job postings and review applicants
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm min-w-64"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm appearance-none"
                >
                  <option value="all">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              {/* Refresh Button */}
              <button
                onClick={fetchJobs}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No job postings available at the moment"}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Job Header */}
                <div className="p-8 border-b border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h2 className="text-2xl font-bold text-gray-800">
                          {job.title}
                        </h2>
                        <span
                          className={`px-4 py-1 rounded-full text-sm font-medium border ${getJobTypeColor(
                            job.jobType
                          )}`}
                        >
                          {job.jobType}
                        </span>
                      </div>

                      <p className="text-lg text-gray-600 mb-4">
                        <span className="font-semibold">
                          {job.company?.name || "Company Name"}
                        </span>
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          {/* <DollarSign className="w-4 h-4 text-green-500" /> */}
                          <span>
                            Rs {job.salary?.toLocaleString() || "Not specified"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-purple-500" />
                          <span>
                            Posted{" "}
                            {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          {job.applications?.length || 0}
                        </div>
                        <div className="text-sm text-gray-500">Applicants</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                {job.description && (
                  <div className="px-8 py-6 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-700 mb-3">
                      Job Description
                    </h3>
                    <p className="text-gray-600 line-clamp-3">
                      {job.description}
                    </p>
                  </div>
                )}

                {/* Applicants Section */}
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Users className="w-5 h-5 text-blue-500" />
                    <h3 className="text-xl font-semibold text-gray-800">
                      Applicants ({job.applications?.length || 0})
                    </h3>
                  </div>

                  {!job.applications || job.applications.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No applicants yet</p>
                      <p className="text-gray-400 text-sm mt-1">
                        Applications will appear here when candidates apply
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {job.applications.map((app) => {
                        const applicantId =
                          app.applicant?._id || app.user?._id || app.userId;
                        const applicantName =
                          app.applicant?.fullname ||
                          app.user?.name ||
                          app.user?.fullname ||
                          "Unknown User";
                        const applicantEmail =
                          app.applicant?.email || app.user?.email || "No email";
                        const applicantPhone =
                          app.applicant?.phoneNumber ||
                          app.user?.phoneNumber ||
                          "No phone";
                        const applicantPhoto =
                          app.applicant?.profile?.profilePhoto ||
                          app.user?.profile?.profilePhoto;
                        const applicantBio =
                          app.applicant?.profile?.bio || app.user?.profile?.bio;
                        const applicantSkills =
                          app.applicant?.profile?.skills ||
                          app.user?.profile?.skills ||
                          [];
                        const applicantResume =
                          app.applicant?.profile?.resume ||
                          app.user?.resume ||
                          app.user?.profile?.resume;
                        const applicantRole =
                          app.applicant?.role || app.user?.role || "Student";

                        return (
                          <div
                            key={app._id}
                            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300"
                          >
                            {/* Applicant Header */}
                            <div className="flex items-start gap-4 mb-4">
                              <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {applicantPhoto ? (
                                  <img
                                    src={applicantPhoto}
                                    alt={applicantName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  getInitials(applicantName)
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-bold text-gray-800 mb-1">
                                  {applicantName}
                                </h4>
                                <p className="text-sm text-blue-600 font-medium mb-2">
                                  {applicantRole}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                  <Mail className="w-4 h-4" />
                                  <span className="truncate">
                                    {applicantEmail}
                                  </span>
                                </div>
                                {applicantPhone !== "No phone" && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="w-4 h-4" />
                                    <span>{applicantPhone}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Bio */}
                            {applicantBio && (
                              <div className="mb-4">
                                <p className="text-sm text-gray-600 italic line-clamp-2">
                                  "{applicantBio}"
                                </p>
                              </div>
                            )}

                            {/* Skills */}
                            {applicantSkills.length > 0 && (
                              <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Award className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm font-medium text-gray-700">
                                    Skills
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {applicantSkills
                                    .slice(0, 4)
                                    .map((skill, index) => (
                                      <span
                                        key={index}
                                        className="px-3 py-1 bg-white text-blue-700 text-xs font-medium rounded-full border border-blue-200"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  {applicantSkills.length > 4 && (
                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                      +{applicantSkills.length - 4} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Application Date & Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-blue-200">
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  Applied{" "}
                                  {new Date(
                                    app.createdAt || app.appliedAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                {applicantResume && (
                                  <a
                                    href={applicantResume}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors shadow-sm"
                                  >
                                    <FileText className="w-4 h-4" />
                                    Resume
                                  </a>
                                )}
                                <a
                                  href={`mailto:${applicantEmail}`}
                                  className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm"
                                >
                                  <Mail className="w-4 h-4" />
                                  Email
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminJobManagement;
