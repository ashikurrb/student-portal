import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import '../../style/AuthStyle.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';
import { LockOutlined, MailOutlined, PhoneOutlined, QuestionCircleOutlined, UserOutlined, BarcodeOutlined } from '@ant-design/icons';
import { Input, Select, Spin } from 'antd';
const { Option } = Select;

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [grades, setGrades] = useState([]);
    const [grade, setGrade] = useState("");
    const [answer, setAnswer] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);
    const [auth] = useAuth();
    const navigate = useNavigate();

    //Get All Grades
    const getAllGrades = async (req, res) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/grade/all-grades`)
            if (data?.success) {
                setGrades(data?.grade);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error fetching grades")
        }
    }
    useEffect(() => {
        getAllGrades();
    }, [])

    //send otp
    const handleOtp = async (e) => {
        e.preventDefault();
        const loadingToastId = toast.loading('Sending OTP...');
        setOtpLoading(true);
        // Create a FormData object
        const verifyEmailData = new FormData();
        verifyEmailData.append('name', name);
        verifyEmailData.append('email', email);
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/verify-otp`, verifyEmailData);
            if (res && res.data.success) {
                // Show success toast
                toast.success(res.data && res.data.message, { id: loadingToastId });
            } else {
                toast.error(res.data.message, { id: loadingToastId });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message, { id: loadingToastId });
        }finally {
            setOtpLoading(false);
        }
    }

    //form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToastId = toast.loading('Registering you...');
    
        const registerData = new FormData();
        registerData.append('name', name);
        registerData.append('email', email);
        registerData.append('phone', phone);
        registerData.append('grade', grade);
        registerData.append('password', password);
        registerData.append('answer', answer);
        registerData.append('otp', otp);
    
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`, registerData);
    
            if (res && res.data.success) {
                toast.success(res.data.message, { id: loadingToastId });
                navigate("/login");
            } else {
                toast.error(res.data.message, { id: loadingToastId });
            }
        } catch (error) {
            console.log(error);
            // Handle specific backend error messages
            const errorMessage = error.response?.data?.message || "An unexpected error occurred";
            toast.error(errorMessage, { id: loadingToastId });
        }
    };
    
    //redirect based on user auth
    if (auth.token) {
        auth.user.role === 1 ? navigate('/dashboard/admin') : navigate('/dashboard/student');
    }

    return (
        <Layout title={"Register Now - 5points Academy"}>
            <div className="form-container">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <img className='pt-5 px-5' src="/images/registerImg.png" alt="" style={{ width: "100%" }} />
                        </div>
                        <div className="col-md-6 p-3">
                            <form className='m-lg-5' onSubmit={handleSubmit}>
                                <h4 className="title"><i className="fa-solid fa-user-plus"></i> &nbsp; REGISTRATION FORM</h4>
                                <div className="mb-3">
                                    <Input
                                        prefix={
                                            <span style={{ paddingRight: '4px' }}>
                                                <UserOutlined />
                                            </span>
                                        }
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-100"
                                        size="large"
                                        placeholder='Name'
                                        minLength={4}
                                        maxLength={25}
                                        allowClear
                                        required />
                                </div>
                                <div className="mb-3">
                                    <Input
                                        prefix={
                                            <span style={{ paddingRight: '4px' }}>
                                                <MailOutlined />
                                            </span>
                                        }
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-100"
                                        size="large"
                                        placeholder='Email'
                                        allowClear
                                        required />
                                </div>
                                <div className="mb-3">
                                    <Input
                                        prefix={
                                            <span style={{ paddingRight: '4px' }}>
                                                <PhoneOutlined />
                                            </span>
                                        }
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-100"
                                        size="large"
                                        maxLength={11}
                                        placeholder='Phone Number'
                                        showCount
                                        allowClear
                                        required />
                                </div>
                                <div className="mb-3">
                                    <Select
                                        placeholder={
                                            <span>
                                                <i className="fa-solid fa-graduation-cap" style={{ marginRight: "8px" }} />
                                                Select Grade
                                            </span>
                                        }
                                        size='large'
                                        className='w-100'
                                        value={grade || undefined}
                                        onChange={(value) => { setGrade(value) }}
                                        allowClear
                                    >
                                        {grades
                                            ?.filter(g => g.name !== "Administration")
                                            .map(g => (
                                                <Option
                                                    key={g._id}
                                                    value={g._id}
                                                    hidden={g?.name === "Administration"}>
                                                    <i className="fa-solid fa-graduation-cap" style={{ marginRight: "8px" }} />
                                                    {g.name}
                                                </Option>
                                            ))}
                                    </Select>
                                </div>
                                <div className="mb-3">
                                    <Input.Password
                                        prefix={
                                            <span style={{ paddingRight: '4px' }}>
                                                <LockOutlined />
                                            </span>
                                        }
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-100"
                                        size="large"
                                        placeholder='Password'
                                        allowClear
                                        required />
                                </div>
                                <div className="mb-3">
                                    <Input
                                        prefix={
                                            <span style={{ paddingRight: '4px' }}>
                                                <QuestionCircleOutlined />
                                            </span>
                                        }
                                        type="text"
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                        className="w-100"
                                        size="large"
                                        placeholder='Your Address'
                                        minLength={3}
                                        maxLength={30}
                                        allowClear
                                        required />
                                </div>
                                <div className="mb-3">
                                    <Input
                                        prefix={
                                            <span style={{ paddingRight: '4px' }}>
                                                <BarcodeOutlined />
                                            </span>
                                        }
                                        addonAfter={
                                            otpLoading ? <Spin size="small" />
                                            : <span onClick={handleOtp} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                              Get OTP
                                            </span>
                                        }
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-100"
                                        size="large"
                                        placeholder='OTP'
                                        minLength={6}
                                        maxLength={6}
                                        allowClear
                                        required />
                                </div>
                                <div className="text-center mt-4">
                                    <button type="submit" className="btn btn-primary">
                                        REGISTER
                                    </button>
                                </div>
                                <div className="text-center pt-3">Have an account? <Link to="/login">Log in</Link></div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </Layout>
    );
};

export default Register;