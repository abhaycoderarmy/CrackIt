// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Fetching admin data...');
      
      // Optional: Check if user is authenticated and has admin role
      // You can uncomment this if you have the auth check endpoint
      // const authCheck = await axios.get('/api/auth/check', { withCredentials: true });
      // console.log('Auth check:', authCheck.data);
      // 
      // if (!authCheck.data.user || authCheck.data.user.role !== 'admin') {
      //   throw new Error('Not authorized as admin');
      // }

      // Make individual requests to better debug which one fails
      console.log('Making API requests...');
      
      let usersRes, newslettersRes, companiesRes, jobsRes;
      
      try {
        console.log('Fetching users...');
        usersRes = await axios.get('/api/admin/users', { withCredentials: true });
        console.log('Users response:', usersRes.status, usersRes.data);
      } catch (err) {
        console.error('Users request failed:', err.response?.status, err.response?.data);
        throw new Error(`Users API failed: ${err.response?.status} ${err.response?.statusText}`);
      }

      try {
        console.log('Fetching newsletters...');
        newslettersRes = await axios.get('/api/admin/newsletters', { withCredentials: true });
        console.log('Newsletters response:', newslettersRes.status, newslettersRes.data);
      } catch (err) {
        console.error('Newsletters request failed:', err.response?.status, err.response?.data);
        throw new Error(`Newsletters API failed: ${err.response?.status} ${err.response?.statusText}`);
      }

      try {
        console.log('Fetching companies...');
        companiesRes = await axios.get('/api/admin/companies', { withCredentials: true });
        console.log('Companies response:', companiesRes.status, companiesRes.data);
      } catch (err) {
        console.error('Companies request failed:', err.response?.status, err.response?.data);
        throw new Error(`Companies API failed: ${err.response?.status} ${err.response?.statusText}`);
      }

      try {
        console.log('Fetching jobs...');
        jobsRes = await axios.get('/api/admin/jobs', { withCredentials: true });
        console.log('Jobs response:', jobsRes.status, jobsRes.data);
      } catch (err) {
        console.error('Jobs request failed:', err.response?.status, err.response?.data);
        throw new Error(`Jobs API failed: ${err.response?.status} ${err.response?.statusText}`);
      }

      setUsers(usersRes.data.users || []);
      setNewsletters(newslettersRes.data.newsletters || []);
      setCompanies(companiesRes.data.companies || []);
      setJobs(jobsRes.data.jobs || []);
      
    } catch (err) {
      console.error("Fetch failed:", err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (id, status) => {
    try {
      await axios.put(`/api/admin/users/${id}/status`, { status }, { withCredentials: true });
      fetchData();
    } catch (err) {
      console.error('Update user status failed:', err);
      alert('Failed to update user status');
    }
  };

  const toggleNewsletter = async (id, status) => {
    try {
      await axios.put(`/api/admin/newsletters/${id}/status`, { status }, { withCredentials: true });
      fetchData();
    } catch (err) {
      console.error('Toggle newsletter failed:', err);
      alert('Failed to toggle newsletter status');
    }
  };

  const sendEmail = async () => {
    if (!selectedEmail || !emailContent) {
      alert('Please select a user and enter content');
      return;
    }

    try {
      await axios.post('/api/admin/send-email', {
        to: selectedEmail,
        content: emailContent,
      }, { withCredentials: true });

      alert('Email sent!');
      setEmailContent('');
      setSelectedEmail('');
    } catch (err) {
      console.error('Send email failed:', err);
      alert('Failed to send email');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading admin dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center bg-red-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchData}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen p-6 space-y-10 bg-gray-50">
        <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1>
        
        {/* Debug Info */}
        <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
          <h3 className="font-semibold text-yellow-800">Debug Info:</h3>
          <p className="text-sm text-yellow-700">
            Users: {users.length}, Newsletters: {newsletters.length}, 
            Companies: {companies.length}, Jobs: {jobs.length}
          </p>
        </div>

        {/* Email Sender */}
        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Send Email</h2>
          <select
            value={selectedEmail}
            onChange={e => setSelectedEmail(e.target.value)}
            className="border p-2 rounded mr-2"
          >
            <option value="">Select user</option>
            {users.map(u => (
              <option key={u._id} value={u.email}>{u.fullname} - {u.email}</option>
            ))}
          </select>
          <textarea
            value={emailContent}
            onChange={e => setEmailContent(e.target.value)}
            placeholder="Enter message"
            className="border p-2 rounded w-full mt-2"
            rows="4"
          />
          <button
            onClick={sendEmail}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Send Email
          </button>
        </section>

        {/* Users Table */}
        <section>
          <h2 className="text-xl font-semibold mb-2">All Users ({users.length})</h2>
          <div className="overflow-x-auto border rounded bg-white shadow">
            {users.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No users found</div>
            ) : (
              <table className="table-auto w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Change Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} className="border-t">
                      <td className="px-4 py-2">{user.fullname}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.role}</td>
                      <td className="px-4 py-2">{user.status}</td>
                      <td className="px-4 py-2">
                        <select
                          value={user.status}
                          onChange={(e) => updateUserStatus(user._id, e.target.value)}
                          className="border rounded p-1"
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
        </section>

        {/* Newsletters */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Newsletters ({newsletters.length})</h2>
          <div className="overflow-x-auto border rounded bg-white shadow">
            {newsletters.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No newsletters found</div>
            ) : (
              <table className="table-auto w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Toggle</th>
                  </tr>
                </thead>
                <tbody>
                  {newsletters.map(news => (
                    <tr key={news._id} className="border-t">
                      <td className="px-4 py-2">{news.title}</td>
                      <td className="px-4 py-2">{news.status}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => toggleNewsletter(news._id, news.status === 'published' ? 'private' : 'published')}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          {news.status === 'published' ? 'Make Private' : 'Publish'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Companies Table */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Companies ({companies.length})</h2>
          <div className="overflow-x-auto border rounded bg-white shadow">
            {companies.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No companies found</div>
            ) : (
              <table className="table-auto w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Location</th>
                    <th className="px-4 py-2 text-left">Website</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map(company => (
                    <tr key={company._id} className="border-t">
                      <td className="px-4 py-2">{company.name}</td>
                      <td className="px-4 py-2">{company.location || '-'}</td>
                      <td className="px-4 py-2">
                        <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                          {company.website}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Jobs Table */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Jobs ({jobs.length})</h2>
          <div className="overflow-x-auto border rounded bg-white shadow">
            {jobs.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No jobs found</div>
            ) : (
              <table className="table-auto w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Company</th>
                    <th className="px-4 py-2 text-left">Location</th>
                    <th className="px-4 py-2 text-left">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job._id} className="border-t">
                      <td className="px-4 py-2">{job.title}</td>
                      <td className="px-4 py-2">{job.company?.name}</td>
                      <td className="px-4 py-2">{job.location}</td>
                      <td className="px-4 py-2">{job.jobType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;