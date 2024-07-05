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
import { PrivateRoute } from './components/Routes/Private';
import { AdminRoute } from './components/Routes/AdminRoute';

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
        </Route>
        <Route path='/about' element={<About />} />
        <Route path='*' element={<PageNotFound />} />


      </Routes>
    </>
  );
}

export default App;
