import Layout from '../../components/Layouts/Layout';
import { Link, useNavigate } from 'react-router-dom';
import '../../style/AuthStyle.css';
import { Input } from 'antd';
import { UserOutlined, KeyOutlined, InfoCircleOutlined, } from '@ant-design/icons';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useState } from 'react';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [answer, setAnswer] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToastId = toast.loading('Password resetting...');

        // Create a FormData object
        const forgotPasswordData = new FormData();
        forgotPasswordData.append('email', email);
        forgotPasswordData.append('newPassword', newPassword);
        forgotPasswordData.append('answer', answer);

        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgot-password`, forgotPasswordData);

            if (res && res.data.success) {
                toast.success(res.data.message, { id: loadingToastId });
                navigate("/login");
            } else {
                toast.error(res.data.message, { id: loadingToastId });
            }
        } catch (error) {
            console.error("Error details:", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message, { id: loadingToastId });
            } else {
                toast.error("Something went wrong", { id: loadingToastId });
            }
        }
    };

    return (
        <Layout title={"Forget Password - Reset"}>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-container">
                            <form onSubmit={handleSubmit}>
                                <h4 className="title"> <i class="fa-solid fa-lock"></i> Reset Password</h4>
                                <div className="mb-3">
                                    <Input
                                        prefix={
                                            <span style={{ paddingRight: '4px' }}>
                                                <UserOutlined />
                                            </span>
                                        }
                                        type='email'
                                        className="w-100"
                                        size='large'
                                        placeholder='Email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required />
                                </div>
                                <div className="mb-3">
                                    <Input
                                        prefix={
                                            <span style={{ paddingRight: '4px' }}>
                                                <InfoCircleOutlined />
                                            </span>
                                        }
                                        className="w-100"
                                        size='large'
                                        placeholder='Security Answer'
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                        required />
                                </div>
                                <div className="mb-4">
                                    <Input.Password
                                        prefix={
                                            <span style={{ paddingRight: '4px' }}>
                                                <KeyOutlined />
                                            </span>
                                        }
                                        className="w-100"
                                        size='large'
                                        placeholder='New Password'
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required />
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn">
                                        Reset Password
                                    </button>
                                </div>
                                <div className="text-center mt-3">
                                    <Link to="/login">Back to Login</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ForgotPassword;