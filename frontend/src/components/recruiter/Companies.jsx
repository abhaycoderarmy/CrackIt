import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'
import { Search, Plus, Building2, Filter, MapPin, Users, Calendar, Edit, Trash2, Eye } from 'lucide-react'
import Footer from '../shared/Footer'

const Companies = () => {
  useGetAllCompanies();
  const [input, setInput] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companies, searchCompanyByText } = useSelector(store => store.company);

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input, dispatch]);

  // Filter companies based on search text
  const filteredCompanies = Array.isArray(companies) ? companies.filter(company => 
    company?.name?.toLowerCase().includes((searchCompanyByText || "").toLowerCase())
  ) : [];

  const handleClearSearch = () => {
    setInput("");
  };

  // Logo component with fallback
  const CompanyLogo = ({ company }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageError = () => {
      setImageError(true);
      setImageLoading(false);
    };

    const handleImageLoad = () => {
      setImageLoading(false);
      setImageError(false);
    };

    // Check if company has a logo URL
    const hasLogo = company?.logo || company?.logoUrl || company?.image;

    if (!hasLogo || imageError) {
      // Fallback to initial letter
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {company?.name?.charAt(0)?.toUpperCase() || 'C'}
        </div>
      );
    }

    return (
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
        {imageLoading && (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-lg"></div>
        )}
        <img
          src={company.logo || company.logoUrl || company.image}
          alt={`${company?.name || 'Company'} logo`}
          className={`w-full h-full object-cover rounded-lg ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ display: imageLoading ? 'none' : 'block' }}
        />
      </div>
    );
  };

  const CompanyCard = ({ company }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {/* Company Header */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <CompanyLogo company={company} />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                {company?.name || 'Unnamed Company'}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{company?.location || 'Location not specified'}</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
              onClick={() => navigate(`/admin/companies/${company?._id}`)}
              title="View Company"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
              onClick={() => navigate(`/admin/companies/${company?._id}`)}
              title="Edit Company"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
              title="Delete Company"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Company Details */}
      <div className="px-6 pb-4">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {company?.description || 'No description available for this company.'}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-gray-500">
              <Users className="h-4 w-4" />
              <span>{company?.employeeCount || '0'} employees</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Est. {company?.foundedYear || new Date().getFullYear()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              company?.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {company?.status || 'Unknown'}
            </span>
          </div>
        </div>
      </div>

      {/* Company Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Updated {company?.updatedAt ? new Date(company.updatedAt).toLocaleDateString() : 'Recently'}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => navigate(`/admin/companies/${company?._id}`)}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
              <p className="text-gray-600 mt-1">Manage and organize your company listings</p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            {/* Search Section */}
            <div className="flex-1 max-w-md">
              <div className={`relative transition-all duration-200 ${
                isSearchFocused ? 'transform scale-105' : ''
              }`}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  className="pl-10 pr-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" 
                  placeholder="Search companies by name..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {input && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
              {input && (
                <p className="text-sm text-gray-500 mt-2">
                  Filtering by: <span className="font-medium text-gray-700">"{input}"</span>
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="border-gray-300 hover:bg-gray-50 transition-all duration-200 h-11"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button 
                onClick={() => navigate("/admin/companies/create")}
                className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-6 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Company
              </Button>
            </div>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredCompanies.length > 0 
                ? `${filteredCompanies.length} Companies Found` 
                : 'No Companies Found'
              }
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Live Data
            </div>
          </div>
          
          {filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company, index) => (
                <CompanyCard key={company?._id || index} company={company} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {input ? 'No companies found' : 'No companies yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {input 
                  ? `No companies match "${input}". Try adjusting your search.`
                  : 'Get started by adding your first company.'
                }
              </p>
              <Button 
                onClick={() => navigate("/admin/companies/create")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Company
              </Button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-200 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Total Companies</p>
                <p className="text-lg font-bold text-blue-900">{Array.isArray(companies) ? companies.length : 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-200 rounded-lg">
                <Plus className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-900">Quick Add</p>
                <p className="text-xs text-green-700">Register new companies easily</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-200 rounded-lg">
                <Search className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-900">Filtered Results</p>
                <p className="text-lg font-bold text-purple-900">{filteredCompanies.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  )
}

export default Companies