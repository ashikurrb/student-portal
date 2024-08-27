import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import PageNotFound from './pages/PageNotFound';
import About from './pages/About';
import Contact from './pages/Contact';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import StudentDashboard from './pages/Student/StudentDashboard';
import ViewResult from './pages/Student/ViewResult';
import ViewPayment from './pages/Student/ViewPayment';
import ViewContent from './pages/Student/ViewContent';
import UpdateProfile from './pages/Student/UpdateProfile';
import ForgotPassword from './pages/Auth/ForgotPassword';
import AllUsers from './pages/Admin/AllUsers';
import { PrivateRoute } from './components/Routes/Private';
import { AdminRoute } from './components/Routes/AdminRoute';
import CreateGrade from './pages/Admin/CreateGrade';
import CreateContent from './pages/Admin/CreateContent';
import PublishResult from './pages/Admin/PublishResult';
import CreateCourse from './pages/Admin/CreateCourse';
import AllCourses from './pages/Admin/AllCourses';
import UpdateCourse from './pages/Admin/UpdateCourse';
import SetPaymentStatus from './pages/Admin/SetPaymentStatus';
import CreateNotice from './pages/Admin/CreateNotice';
import ViewNotice from './pages/Student/ViewNotice';

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
          <Route path='student/view-content' element={<ViewContent />} />
        </Route>
        <Route path='/dashboard' element={<AdminRoute />}>
          <Route path='admin' element={<AdminDashboard />} />
          <Route path='admin/create-grade' element={<CreateGrade />} />
          <Route path='admin/create-notice' element={<CreateNotice />} />
          <Route path='admin/create-link' element={<CreateContent />} />
          <Route path='admin/create-course' element={<CreateCourse />} />
          <Route path='admin/all-courses' element={<AllCourses />} />
          <Route path="admin/course/:slug" element={<UpdateCourse />} />
          <Route path='admin/create-result' element={<PublishResult />} />
          <Route path='admin/create-payment' element={<SetPaymentStatus />} />
          <Route path='admin/all-users' element={<AllUsers />} />
        </Route>
        <Route path='/view-notice' element={<ViewNotice />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='*' element={<PageNotFound />} />


      </Routes>
    </>
  );
}

export default App;
