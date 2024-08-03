import React, { useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import '../../style/AuthStyle.css'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

const Login = () => {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    //form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Show loading toast
        const loadingToastId = toast.loading('Logging in...');
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/login`, {
                email,
                phone,
                password,
            });
            if (res && res.data.success) {
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token
                });
                // Set login details in cookies
                Cookies.set("auth", JSON.stringify(res.data), { expires: 7 }); // expires in 7 days
                navigate(location.state || "/")
                // Show success toast
                toast.success(res.data && res.data.message, { id: loadingToastId });
            } else {
                toast.error(res.data.message, { id: loadingToastId });
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong", { id: loadingToastId });
        }
    }

    //redirection based on auth
    if (auth.token) {
        auth.user.role === 1 ? navigate('/dashboard/admin') : navigate('/dashboard/student');
    }

    return (
        <Layout title={"5Points - Log In"}>
            <div className="form-container">
                <div className="container d-md-flex">
                    <div className="row m-3">
                        <div className="col-md-7 mb-5 mx-md-5">
                            <div className="text-center">
                                <img src="/images/loginImg.png" style={{ width: "100%" }} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <form className='m-lg-5 mb-2' onSubmit={handleSubmit}>
                            <h4 className="title"><i class="fa-solid fa-right-to-bracket"></i> &nbsp; Login Here</h4>
                            <div className="mb-3">
                                <input type="text" value={email || phone} onChange={(e) => setEmail(e.target.value) || setPhone(e.target.value)} className="form-control" id="exampleInputEmail" placeholder='Email or Phone' required />
                            </div>
                            <div className="mb-3">
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="exampleInputPassword1" placeholder='Password' required />
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary">
                                    Login
                                </button>
                            </div>
                            <div className="text-center py-3">Forgot Password? <Link to="/forgot-password">Reset Here</Link></div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Login;