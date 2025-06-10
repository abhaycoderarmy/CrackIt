import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  Building2,
  Briefcase,
  Mail,
  Eye,
  UserCheck,
  UserX,
  TrendingUp,
  Activity,
  Send,
  RefreshCw,
  Sparkles,
  Globe,
  Clock,
  Star,
} from "lucide-react";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    };
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("Fetching admin data...");

      let usersRes, newslettersRes, companiesRes, jobsRes;

      try {
        console.log("Fetching users...");
        usersRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
          getAuthHeaders()
        );

        if (!usersRes.ok)
          throw new Error(`Users API failed: ${usersRes.status}`);
        usersRes = await usersRes.json();
        console.log("Users response:", usersRes);
      } catch (err) {
        console.error("Users request failed:", err);
        throw new Error(`Users API failed: ${err.message}`);
      }

      try {
        console.log("Fetching newsletters...");
        newslettersRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/newsletters`,
          getAuthHeaders()
        );
        if (!newslettersRes.ok)
          throw new Error(`Newsletters API failed: ${newslettersRes.status}`);
        newslettersRes = await newslettersRes.json();
        console.log("Newsletters response:", newslettersRes);
      } catch (err) {
        console.error("Newsletters request failed:", err);
        throw new Error(`Newsletters API failed: ${err.message}`);
      }

      try {
        console.log("Fetching companies...");
        companiesRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/companies`,
          getAuthHeaders()
        );
        if (!companiesRes.ok)
          throw new Error(`Companies API failed: ${companiesRes.status}`);
        companiesRes = await companiesRes.json();
        console.log("Companies response:", companiesRes);
      } catch (err) {
        console.error("Companies request failed:", err);
        throw new Error(`Companies API failed: ${err.message}`);
      }

      try {
        console.log("Fetching jobs...");
        jobsRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/jobs`,
          getAuthHeaders()
        );
        if (!jobsRes.ok) throw new Error(`Jobs API failed: ${jobsRes.status}`);
        jobsRes = await jobsRes.json();
        console.log("Jobs response:", jobsRes);
      } catch (err) {
        console.error("Jobs request failed:", err);
        throw new Error(`Jobs API failed: ${err.message}`);
      }

      setUsers(usersRes.users || []);
      setNewsletters(newslettersRes.newsletters || []);
      setCompanies(companiesRes.companies || []);
      setJobs(jobsRes.jobs || []);
    } catch (err) {
      console.error("Fetch failed:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };
  const openNewsletterModal = (newsletter) => {
    setSelectedNewsletter(newsletter);
    setShowNewsletterModal(true);
  };

  const closeNewsletterModal = () => {
    setSelectedNewsletter(null);
    setShowNewsletterModal(false);
  };
  const updateUserStatus = async (id, status) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) throw new Error("Failed to update user status");
      fetchData();
    } catch (err) {
      console.error("Update user status failed:", err);
      alert("Failed to update user status");
    }
  };

  const sendEmail = async () => {
    if (!selectedEmail || !emailContent) {
      alert("Please select a user and enter content");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/send-email`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            to: selectedEmail,
            content: emailContent,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to send email");
      alert("Email sent!");
      setEmailContent("");
      setSelectedEmail("");
    } catch (err) {
      console.error("Send email failed:", err);
      alert("Failed to send email");
    }
  };

  // Helper function to render user avatar
  const renderUserAvatar = (user, size = "w-12 h-12") => {
    const profilePhoto = user.profile?.profilePhoto || user.profilePhoto;

    if (profilePhoto) {
      return (
        <img
          src={profilePhoto}
          alt={user.fullname}
          className={`${size} rounded-full object-cover border-2 border-white shadow-lg`}
          onError={(e) => {
            // Fallback to initials if image fails to load
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      );
    }

    return (
      <div
        className={`${size} bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}
      >
        {user.fullname?.charAt(0)?.toUpperCase() || "U"}
      </div>
    );
  };

  // Helper function to render company logo
  const renderCompanyLogo = (company, size = "w-12 h-12") => {
    const logo = company.logo;

    if (logo) {
      return (
        <img
          src={logo}
          alt={company.name}
          className={`${size} rounded-xl object-cover border-2 border-white shadow-lg`}
          onError={(e) => {
            // Fallback to initials if image fails to load
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      );
    }

    return (
      <div
        className={`${size} bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg`}
      >
        {company.name?.charAt(0)?.toUpperCase() || "C"}
      </div>
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "active").length,
    blockedUsers: users.filter((u) => u.status === "blocked").length,
    totalJobs: jobs.length,
    totalCompanies: companies.length,
    totalNewsletters: newsletters.length,
    newsletterSubscribers: newsletters.reduce(
      (sum, n) => sum + (n.subscribers || 0),
      0
    ),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-white rounded-full mx-auto"></div>
          </div>
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
            <p className="text-white text-xl font-semibold mb-2">
              Loading Dashboard
            </p>
            <p className="text-purple-200">Fetching your data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-rose-900 to-red-900 flex items-center justify-center">
        <Navbar />
        <div className="text-center backdrop-blur-lg bg-white/10 p-10 rounded-3xl shadow-2xl max-w-md w-full mx-4 border border-white/20">
          <div className="text-red-400 mb-6">
            <Activity className="h-16 w-16 mx-auto animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Connection Error
          </h2>
          <p className="text-red-200 mb-8">{error}</p>
          <button
            onClick={fetchData}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="group relative bg-white/70 backdrop-blur-lg overflow-hidden shadow-2xl rounded-3xl border border-white/50 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.totalUsers}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    Total Users
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center text-green-600 font-semibold">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    {stats.activeUsers} Active
                  </span>
                  <span className="flex items-center text-red-600 font-semibold">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    {stats.blockedUsers} Blocked
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/70 backdrop-blur-lg overflow-hidden shadow-2xl rounded-3xl border border-white/50 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.totalJobs}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    Total Jobs
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-2xl p-4">
                <div className="flex items-center text-green-600 font-semibold text-sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Active Listings
                </div>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/70 backdrop-blur-lg overflow-hidden shadow-2xl rounded-3xl border border-white/50 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.totalCompanies}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    Companies
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl p-4">
                <div className="text-purple-600 font-semibold text-sm">
                  Registered Partners
                </div>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/70 backdrop-blur-lg overflow-hidden shadow-2xl rounded-3xl border border-white/50 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-lg">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.totalNewsletters}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    Newsletters
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-2xl p-4">
                <div className="text-orange-600 font-semibold text-sm">
                  {/* {stats.newsletterSubscribers}  */}
                  News Published
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email Sender */}
        <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl mb-12 border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <Send className="h-7 w-7 mr-3" />
              Send Email to Users
            </h3>
            <p className="text-indigo-100 mt-2">
              Communicate directly with your users
            </p>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-700">
                  Select User
                </label>
                <select
                  value={selectedEmail}
                  onChange={(e) => setSelectedEmail(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur text-lg"
                >
                  <option value="">Choose a user...</option>
                  {users.map((u) => (
                    <option key={u._id} value={u.email}>
                      {u.fullname} - {u.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-700">
                  Email Content
                </label>
                <textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Enter your message here..."
                  className="w-full border-2 border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur text-lg resize-none"
                  rows="5"
                />
                <button
                  onClick={sendEmail}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg font-semibold"
                >
                  <Send className="h-5 w-5 mr-3" />
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl mb-12 border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <Users className="h-7 w-7 mr-3" />
              Users Management
            </h3>
            <p className="text-blue-100 mt-2">
              Manage user accounts and their status
            </p>
          </div>
          <div className="overflow-x-auto">
            {users.length === 0 ? (
              <div className="text-center py-20">
                <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-fit mx-auto mb-6">
                  <Users className="h-16 w-16 text-white" />
                </div>
                <p className="text-gray-500 text-xl">No users found</p>
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <tr>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            {renderUserAvatar(user)}
                            {/* Fallback div that's initially hidden */}
                            <div
                              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                              style={{ display: "none" }}
                            >
                              {user.fullname?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-gray-900">
                              {user.fullname}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                            {user.profile?.bio && (
                              <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                                {user.profile.bio}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="inline-flex px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                            user.status === "active"
                              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200"
                              : "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200"
                          }`}
                        >
                          {user.status === "active" ? (
                            <UserCheck className="h-4 w-4 mr-2" />
                          ) : (
                            <UserX className="h-4 w-4 mr-2" />
                          )}
                          {user.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <select
                          value={user.status}
                          onChange={(e) =>
                            updateUserStatus(user._id, e.target.value)
                          }
                          className="border-2 border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 bg-white"
                        >
                          <option value="active">Active</option>
                          <option value="blocked">Blocked</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Newsletters Table */}
        {/* <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl mb-12 border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 px-8 py-6">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <Mail className="h-7 w-7 mr-3" />
              Newsletter Overview
            </h3>
            <p className="text-orange-100 mt-2">Monitor newsletter performance and reach</p>
          </div>
          <div className="overflow-x-auto">
            {newsletters.length === 0 ? (
              <div className="text-center py-20">
                <div className="p-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-full w-fit mx-auto mb-6">
                  <Mail className="h-16 w-16 text-white" />
                </div>
                <p className="text-gray-500 text-xl">No newsletters found</p>
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-orange-50">
                  <tr>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Newsletter</th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Subscribers</th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Engagement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {newsletters.map(newsletter => (
                    <tr key={newsletter._id} className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300">
                      <td className="px-8 py-6">
                        <div className="text-lg font-semibold text-gray-900">{newsletter.title}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${
                          newsletter.status === 'published' 
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' 
                            : 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200'
                        }`}>
                          {newsletter.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-2">
                          <Users className="h-5 w-5 text-gray-400" />
                          <span className="text-lg font-semibold text-gray-900">{newsletter.subscribers || 0}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <button className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300">
                          <Eye className="h-5 w-5 mr-2" />
                          <span className="font-medium">View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div> */}
        {/* Newsletter Section */}
        <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl mb-12 border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 px-8 py-6">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <Mail className="h-7 w-7 mr-3" />
              Newsletter Overview
            </h3>
            <p className="text-orange-100 mt-2">
              Monitor newsletter performance and reach
            </p>
          </div>
          <div className="overflow-x-auto">
            {newsletters.length === 0 ? (
              <div className="text-center py-20">
                <div className="p-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-full w-fit mx-auto mb-6">
                  <Mail className="h-16 w-16 text-white" />
                </div>
                <p className="text-gray-500 text-xl">No newsletters found</p>
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-orange-50">
                  <tr>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Newsletter
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Visibility
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {newsletters.map((newsletter) => (
                    <tr
                      key={newsletter._id}
                      className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300"
                    >
                      <td className="px-8 py-6">
                        <div>
                          <div className="text-lg font-semibold text-gray-900">
                            {newsletter.title}
                          </div>
                          <div className="text-sm text-gray-500 mt-1 max-w-md truncate">
                            {newsletter.content}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full ${
                            newsletter.isPrivate
                              ? "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200"
                              : "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200"
                          }`}
                        >
                          {newsletter.isPrivate ? (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Private
                            </>
                          ) : (
                            <>
                              <Globe className="h-4 w-4 mr-2" />
                              Public
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-2 text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">
                            {new Date(
                              newsletter.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <button
                          onClick={() => openNewsletterModal(newsletter)}
                          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300 font-medium hover:bg-blue-50 px-3 py-2 rounded-lg"
                        >
                          <Eye className="h-5 w-5 mr-2" />
                          View Content
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Newsletter Modal */}
        {showNewsletterModal && selectedNewsletter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 px-8 py-6 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedNewsletter.title}
                  </h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${
                        selectedNewsletter.isPrivate
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : "bg-green-100 text-green-800 border border-green-200"
                      }`}
                    >
                      {selectedNewsletter.isPrivate ? (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          Private
                        </>
                      ) : (
                        <>
                          <Globe className="h-4 w-4 mr-1" />
                          Public
                        </>
                      )}
                    </span>
                    <span className="text-orange-100 text-sm flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(
                        selectedNewsletter.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeNewsletterModal}
                  className="text-white hover:text-orange-200 transition-colors duration-300 p-2 hover:bg-white/10 rounded-full"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-8 max-h-[calc(90vh-120px)] overflow-y-auto">
                <div className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {selectedNewsletter.content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Companies and Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Companies */}
          <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl border border-white/50 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <Building2 className="h-7 w-7 mr-3" />
                Companies
              </h3>
              <p className="text-purple-100 mt-2">
                Registered company partners
              </p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {companies.length === 0 ? (
                <div className="text-center py-16">
                  <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full w-fit mx-auto mb-6">
                    <Building2 className="h-12 w-12 text-white" />
                  </div>
                  <p className="text-gray-500 text-lg">No companies found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {companies.map((company) => (
                    <div
                      key={company._id}
                      className="px-8 py-6 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold">
                            {renderCompanyLogo(company)}
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-gray-900">
                              {company.name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Globe className="h-4 w-4 mr-1" />
                              {company.location || "Location not specified"}
                            </div>
                          </div>
                        </div>
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-xl hover:from-purple-200 hover:to-pink-200 transition-all duration-300 font-medium border border-purple-200"
                          >
                            Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Jobs */}
          <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl border border-white/50 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <Briefcase className="h-7 w-7 mr-3" />
                Recent Jobs
              </h3>
              <p className="text-green-100 mt-2">Latest job postings</p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {jobs.length === 0 ? (
                <div className="text-center py-16">
                  <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full w-fit mx-auto mb-6">
                    <Briefcase className="h-12 w-12 text-white" />
                  </div>
                  <p className="text-gray-500 text-lg">No jobs found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {jobs.map((job) => (
                    <div
                      key={job._id}
                      className="px-8 py-6 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                          <Briefcase className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-lg font-semibold text-gray-900 mb-1">
                            {job.title}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            {job.company?.name}
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center text-gray-500">
                              <Globe className="h-4 w-4 mr-1" />
                              {job.location}
                            </span>
                            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                              {job.jobType}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer - keeping as predefined */}
      <Footer />
    </div>
  );
};

export default AdminDashboard;
