import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/recruiter/Companies'
import CompanyCreate from './components/recruiter/CompanyCreate'
import CompanySetup from './components/recruiter/CompanySetup'
import AdminJobs from "./components/recruiter/RecruiterJobs";
import PostJob from './components/recruiter/PostJob'
import Applicants from './components/recruiter/Applicants'
import ProtectedRoute from './components/recruiter/ProtectedRoute'
import EditJob from './components/recruiter/EditJob'
import AdminDashboard from './pages/AdminDashboard'
import AdminProtectedRoute from './pages/AdminProtectedRoute'
import NewsletterPage from './pages/NewsLetterPage'
import RecruiterDashboard from './components/recruiter/RecruiterDashboard'
import StudentDashboard from './pages/StudentDashboard'
import ForgotPassword from './components/auth/ForgotPassword'
import AdminUserManagement from './pages/AdminUserManagement'
import AdminJobManagement from './pages/AdminJobManagement'
// import EditJob from './pages/EditJob'



const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/description/:id",
    element: <JobDescription />
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/student/dashboard",
    element: <StudentDashboard />
  },
  // admin ke liye yha se start hoga
  {
    path:"/admin/companies",
    element: <ProtectedRoute><Companies/></ProtectedRoute>
  },
  {
    path:"/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate/></ProtectedRoute> 
  },
  {
    path:"/admin/companies/:id",
    element:<ProtectedRoute><CompanySetup/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs",
    element:<ProtectedRoute><AdminJobs/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/create",
    element:<ProtectedRoute><PostJob/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/:id/applicants",
    element:<ProtectedRoute><Applicants/></ProtectedRoute> 
  },
  {
  path:"/admin/jobs/edit/:id",
  element:<ProtectedRoute><EditJob/></ProtectedRoute> 
},
{
  path:"/newsletter",
  element:<NewsletterPage />
},
{
   path: "/recruiter/dashboard",
  element: <ProtectedRoute><RecruiterDashboard /> </ProtectedRoute> 
},
{
  path:"/admin/dashboard",
  element:<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>
},
{
  path: "/admin/users",
  element: <AdminProtectedRoute><AdminUserManagement /></AdminProtectedRoute>
},
{
  path: "/admin/job-management",
  element: <AdminJobManagement />
},
// {
//   path: "/admin/edit-job/:id",
//   element: <EditJob />
// }





])
function App() {

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App
