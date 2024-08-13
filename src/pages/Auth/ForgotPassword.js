import Layout from '../../components/Layouts/Layout';
import { Link, useNavigate } from 'react-router-dom';
import '../../style/AuthStyle.css';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useState } from 'react';
import Spinner from '../../components/Spinner';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [answer, setAnswer] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    //form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToastId = toast.loading('Password resetting...');
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgot-password`, {
                email,
                newPassword,
                answer
            });
            if (res && res.data.success) {
                toast.success(res.data && res.data.message, { id: loadingToastId });
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
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="exampleInputEmail" placeholder='Email' required />
                    </div>
                    <div className="mb-3">
                        <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} className="form-control" id="exampleInputAddress" placeholder='Security Answer' required />
                    </div>
                    <div className="mb-4">
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control" id="exampleInputPassword1" placeholder='Password' required />
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