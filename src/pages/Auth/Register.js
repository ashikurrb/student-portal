import React, { useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import '../../style/AuthStyle.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [grade, setGrade] = useState("");
    const [answer, setAnswer] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    //form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`, {
                name,
                email,
                password,
                phone,
                grade,
                answer
            });
            if (res && res.data.success) {
                toast.success(res.data.message)
                navigate("/login")
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong")
        }
    }

    return (
        <Layout title={"Register Now - C-Lab"}>
            <div className="form-container p-2">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <img className='pt-5 px-5' src="/images/registerImg.png" alt="" style={{ width: "100%" }} />
                        </div>
                        <div className="col-md-6 p-3">
                            <form className='m-lg-5' onSubmit={handleSubmit}>
                                <h4 className="title"><i class="fa-solid fa-user-plus"></i> &nbsp; REGISTER FORM</h4>
                                <div className="mb-3">
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" id="exampleInputName" placeholder='Name' required />
                                </div>
                                <div className="mb-3">
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="exampleInputEmail" placeholder='Email' required />
                                </div>
                                <div className="mb-3">
                                    <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" id="exampleInputPhone" placeholder='Phone Number' required />
                                </div>
                                <div className="mb-3">
                                    <input type="dropdown" value={grade} onChange={(e) => setGrade(e.target.value)} className="form-control" id="exampleInputGrade" placeholder='Grade' required />
                                </div>
                                <div className="mb-3">
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="exampleInputPassword1" placeholder='Password' required />
                                </div>
                                <div className="mb-3">
                                    <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} className="form-control" id="exampleInputAddress" placeholder='Security Answer' required />
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary">REGISTER</button>
                                </div>
                                <div className="text-center py-3">Already Registered? <Link to="/login">Log In</Link></div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </Layout>
    );
};

export default Register;