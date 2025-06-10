import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Eye,
  EyeOff,
  FileText,
  Tag,
  Calendar,
  Search,
  Filter,
  Users,
  UserCheck,
  UserX,
  Clock,
} from "lucide-react";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Replace with your axios call
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (userId) => {
    try {
      await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/admin/users/${userId}/visibility`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );
      fetchUsers(); // Refresh
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200";
      case "recruiter":
        return "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200";
      case "student":
        return "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200";
      default:
        return "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-500 shadow-green-500/50";
      case "inactive":
        return "bg-red-500 shadow-red-500/50";
      case "pending":
        return "bg-yellow-500 shadow-yellow-500/50";
      default:
        return "bg-gray-500 shadow-gray-500/50";
    }
  };

  const getStatsData = () => {
    const total = users.length;
    const active = users.filter((u) => u.status === "active").length;
    const pending = users.filter((u) => u.status === "blocked").length;
    const publicProfiles = users.filter((u) => u.isPublic).length;

    return { total, active, pending, publicProfiles };
  };

  const stats = getStatsData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
            </div>
            <p className="text-lg font-medium text-gray-600">
              Loading users...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                <Users className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              User Management Dashboard
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
              Manage and monitor all registered users with comprehensive
              controls and insights
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl lg:text-3xl font-bold text-green-600">
                  {stats.active}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Blocked</p>
                <p className="text-2xl lg:text-3xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Public</p>
                <p className="text-2xl lg:text-3xl font-bold text-purple-600">
                  {stats.publicProfiles}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:p-8 mb-8">
          <div className="flex items-center mb-6">
            <Filter className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              Filters & Search
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Search Users
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Filter by Role
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="recruiter">Recruiter</option>
                <option value="student">Student</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
                {/* <option value="pending">Pending</option> */}
              </select>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredUsers.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {users.length}
              </span>{" "}
              users
            </p>
          </div>
        </div>

        {/* Users Grid */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 max-w-md mx-auto">
              <User className="mx-auto h-16 w-16 text-gray-400 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No users found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria to find users.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Header with Profile Photo */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 relative">
                      {user.profile?.profilePhoto ? (
                        <img
                          src={user.profile.profilePhoto}
                          alt={user.fullname}
                          className="h-20 w-20 rounded-2xl object-cover border-4 border-white shadow-lg"
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-2xl">
                            {user.fullname?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                      )}
                      <div
                        className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white shadow-lg ${getStatusColor(
                          user.status
                        )}`}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 truncate mb-2">
                        {user.fullname || "N/A"}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role || "N/A"}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 capitalize">
                          {user.status || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Details */}
                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Mail className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-900 truncate font-medium">
                        {user.email || "N/A"}
                      </span>
                    </div>

                    {user.phoneNumber && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                        <Phone className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-900 font-medium">
                          {user.phoneNumber}
                        </span>
                      </div>
                    )}

                    {user.profile?.bio && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-start space-x-3">
                          <User className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {user.profile.bio}
                          </p>
                        </div>
                      </div>
                    )}

                    {user.profile?.skills && user.profile.skills.length > 0 && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-start space-x-3 mb-2">
                          <Tag className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm font-medium text-gray-700">
                            Skills
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 ml-8">
                          {user.profile.skills
                            .slice(0, 4)
                            .map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                              >
                                {skill}
                              </span>
                            ))}
                          {user.profile.skills.length > 4 && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-200 text-gray-800">
                              +{user.profile.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between space-x-4">
                      {user.profile?.resume && (
                        <a
                          href={user.profile.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                        >
                          <FileText className="h-4 w-4" />
                          <span>Resume</span>
                        </a>
                      )}

                      {user.createdAt && (
                        <div className="flex items-center space-x-2 text-gray-600 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Visibility Control */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      {user.isPublic ? (
                        <Eye className="h-5 w-5 text-green-500" />
                      ) : (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {user.isPublic ? "Public Profile" : "Private Profile"}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleVisibility(user._id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        user.isPublic
                          ? "bg-red-50 text-red-700 hover:bg-red-100 border-2 border-red-200 hover:border-red-300"
                          : "bg-green-50 text-green-700 hover:bg-green-100 border-2 border-green-200 hover:border-green-300"
                      }`}
                    >
                      {user.status.active ? "Make Public" : "Make Private"}
                    </button>
                  </div>
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

export default AdminUserManagement;
