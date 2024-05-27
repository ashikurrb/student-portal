import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import About from './pages/About';
import PageNotFound from './pages/PageNotFound'
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import StudentDashboard from './pages/Student/StudentDashboard';



function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/admin' element={<AdminDashboard/>} />
        <Route path='/student' element={<StudentDashboard/>} />
        <Route path='/about' element={<About />} />
        <Route path='*' element={<PageNotFound />} />
      

      </Routes>
    </>
  );
}

export default App;
