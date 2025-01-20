import React, { useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import '../../style/AuthStyle.css'
import { Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
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
        // Create a FormData
        const loginData = new FormData();
        loginData.append('email', email);
        loginData.append('phone', phone);
        loginData.append('password', password);
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/login`, loginData);
            if (res && res.data.success) {
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token
                })
                // Set login details in cookies
                Cookies.set("auth", JSON.stringify(res.data), { expires: 1 }); // expires in 1 day
                toast.success(res.data && res.data.message, { id: loadingToastId });
                const redirectTo = location.state?.from || "/";
                navigate(redirectTo);
            } else {
                toast.error(res.data.message, { id: loadingToastId });
            }
        } catch (error) {
            console.error("Error details:", error);
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error, { id: loadingToastId });
            } else {
                toast.error("Something went wrong", { id: loadingToastId });
            }
        }
    };

    //redirection based on auth
    if (auth.token) {
        auth.user.role === 1 ? navigate('/dashboard/admin') : navigate('/dashboard/student');
    }

    return (
        <Layout title={"Log In - 5points Academy"}>
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
                            <h4 className="title"><i className="fa-solid fa-right-to-bracket"></i> &nbsp; Login Here</h4>
                            <div className="mb-3">
                                <Input
                                    prefix={
                                        <span style={{ paddingRight: '4px' }}>
                                            <UserOutlined />
                                        </span>
                                    }
                                    className="w-100"
                                    size='large'
                                    placeholder='Email or Phone'
                                    value={email || phone}
                                    onChange={(e) => setEmail(e.target.value) || setPhone(e.target.value)}
                                    required />
                            </div>
                            <div className="mb-3">
                                <Input.Password
                                    prefix={
                                        <span style={{ paddingRight: '4px' }}>
                                            <LockOutlined/>
                                        </span>
                                    }
                                    type='password'
                                    className="w-100"
                                    size='large'
                                    placeholder='Password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required />
                                <div className="form-text text-end pt-1">
                                    <Link to="/forgot-password">Forgot Password?</Link>
                                </div>
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary">
                                    Login
                                </button>
                            </div>
                            <div className="text-center pt-3">Don't have an account? <Link to="/register">Register Here</Link></div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Login;