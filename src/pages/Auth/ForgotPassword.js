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
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const navigate = useNavigate();

    //form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSpinnerLoading(true);
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgot-password`, {
                email,
                newPassword,
                answer
            });
            setSpinnerLoading(false);
            if (res && res.data.success) {
                toast.success(res.data && res.data.message)
                navigate("/login")
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
            setSpinnerLoading(false);
        }
    }

    return (
        <Layout title={"Log In"}>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h4 className="title"> <i class="fa-solid fa-lock"></i> Reset Password</h4>
                    <div className="mb-3">
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="exampleInputEmail" placeholder='Email' required />
                    </div>
                    <div className="mb-3">
                        <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} className="form-control" id="exampleInputAddress" placeholder='Security Answer' required />
                    </div>
                    <div className="mb-3">
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control" id="exampleInputPassword1" placeholder='Password' required />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn">
                            {spinnerLoading ? <Spinner /> : "Reset Password"}
                        </button>
                    </div>
                    <div className="text-center mt-3">
                        <Link to="/login">Back to Log In</Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default ForgotPassword;