import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import About from './pages/About';
import PageNotFound from './pages/PageNotFound'
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import StudentDashboard from './pages/Student/StudentDashboard';
import ViewResult from './pages/Student/ViewResult';
import ViewPayment from './pages/Student/ViewPayment';
import ContentLink from './pages/Student/ContentLink';
import UpdateProfile from './pages/Student/UpdateProfile';
import ForgotPassword from './pages/Auth/ForgotPassword';
import AllUsers from './pages/Admin/AllUsers';
import { PrivateRoute } from './components/Routes/Private';
import { AdminRoute } from './components/Routes/AdminRoute';
import CreateGrade from './pages/Grade/CreateGrade';
import ContentLinks from './pages/Admin/ContentLinks';
import PublishResult from './pages/Admin/PublishResult';
import CreateCourse from './pages/Admin/CreateCoruse';
import AllCourses from './pages/Admin/AllCourses';
import UpdateCourse from './pages/Admin/UpdateCourse';
import SetPaymentStatus from './pages/Admin/SetPaymentStatus';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/dashboard' element={<PrivateRoute />}>
          <Route path='student' element={<StudentDashboard />} />
          <Route path='student/update-profile' element={<UpdateProfile />} />
          <Route path='student/view-result' element={<ViewResult />} />
          <Route path='student/view-payment' element={<ViewPayment />} />
          <Route path='student/content-link' element={<ContentLink />} />
        </Route>
        <Route path='/dashboard' element={<AdminRoute />}>
          <Route path='admin' element={<AdminDashboard />} />
          <Route path='admin/create-grade' element={<CreateGrade />} />
          <Route path='admin/create-link' element={<ContentLinks />} />
          <Route path='admin/create-course' element={<CreateCourse />} />
          <Route path='admin/all-courses' element={<AllCourses />} />
          <Route path="admin/course/:slug" element={<UpdateCourse />} />
          <Route path='admin/create-result' element={<PublishResult />} />
          <Route path='admin/create-payment' element={<SetPaymentStatus />} />
          <Route path='admin/all-users' element={<AllUsers />} />
        </Route>
        <Route path='/about' element={<About />} />
        <Route path='*' element={<PageNotFound />} />


      </Routes>
    </>
  );
}

export default App;
