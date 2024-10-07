import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import '../../style/AuthStyle.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';
import { BookOutlined, LockOutlined, MailOutlined, PhoneOutlined, QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Input, Select } from 'antd';
const { Option } = Select;

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [grades, setGrades] = useState([]);
    const [grade, setGrade] = useState("");
    const [answer, setAnswer] = useState("");
    const [password, setPassword] = useState("");
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


    //form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToastId = toast.loading('Registering you...');
        // Create a FormData object
        const registerData = new FormData();
        registerData.append('name', name);
        registerData.append('email', email);
        registerData.append('phone', phone);
        registerData.append('grade', grade);
        registerData.append('password', password);
        registerData.append('answer', answer);
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`, registerData);

            if (res && res.data.success) {
                // Show success toast
                toast.success(res.data && res.data.message, { id: loadingToastId });
                navigate("/login");
            } else {
                toast.error(res.data.message, { id: loadingToastId });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message, { id: loadingToastId });
        }
    }

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
                                <h4 className="title"><i className="fa-solid fa-user-plus"></i> &nbsp; REGISTER FORM</h4>
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
                                        type="number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-100"
                                        size="large"
                                        maxLength={11}
                                        placeholder='Phone Number'
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
                                        placeholder='Security Answer'
                                        minLength={3}
                                        maxLength={10}
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