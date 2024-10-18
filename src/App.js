import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import PageNotFound from './pages/PageNotFound';
import About from './pages/About';
import Contact from './pages/Contact';
import ViewCourse from './pages/ViewCourse';
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
import SetPaymentStatus from './pages/Admin/SetPaymentStatus';
import CreateNotice from './pages/Admin/CreateNotice';
import ViewNotice from './pages/Student/ViewNotice';
import GradeCourse from './pages/GradeCourse';
import CourseDetails from './pages/Student/CourseDetails';
import ViewOrder from './pages/Student/ViewOrder';
import OrderList from './pages/Admin/OrderList';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/view-courses' element={<ViewCourse />} />
        <Route path='/view-courses/:slug' element={<GradeCourse />} />
        <Route path='/view-courses/:slug/:slug' element={<CourseDetails />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />

        {/* Private routes for students */}
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard/student' element={<StudentDashboard />} />
          <Route path='/dashboard/student/update-profile' element={<UpdateProfile />} />
          <Route path='/dashboard/student/view-result' element={<ViewResult />} />
          <Route path='/dashboard/student/view-payment' element={<ViewPayment />} />
          <Route path='/dashboard/student/view-content' element={<ViewContent />} />
          <Route path='/dashboard/student/view-order' element={<ViewOrder />} />
          <Route path='/view-notice' element={<ViewNotice />} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route path='/dashboard/admin' element={<AdminDashboard />} />
          <Route path='/dashboard/admin/create-grade' element={<CreateGrade />} />
          <Route path='/dashboard/admin/create-notice' element={<CreateNotice />} />
          <Route path='/dashboard/admin/create-link' element={<CreateContent />} />
          <Route path='/dashboard/admin/create-course' element={<CreateCourse />} />
          <Route path='/dashboard/admin/create-result' element={<PublishResult />} />
          <Route path='/dashboard/admin/create-payment' element={<SetPaymentStatus />} />
          <Route path='/dashboard/admin/order-list' element={<OrderList />} />
          <Route path='/dashboard/admin/all-users' element={<AllUsers />} />
        </Route>

        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;