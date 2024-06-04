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

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/dashboard/admin' element={<AdminDashboard/>} />
        <Route path='/dashboard/student' element={<StudentDashboard/>} />
        <Route path='/dashboard/student/update-profile' element={<UpdateProfile/>} />
        <Route path='/dashboard/student/view-result' element={<ViewResult/>} />
        <Route path='/dashboard/student/view-payment' element={<ViewPayment/>} />
        <Route path='/dashboard/student/content-link' element={<ContentLink/>} />
        <Route path='/about' element={<About />} />
        <Route path='*' element={<PageNotFound />} />
      

      </Routes>
    </>
  );
}

export default App;
