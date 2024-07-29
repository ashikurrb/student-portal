import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import '../../style/AuthStyle.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';
import { Select } from 'antd';
const { Option } = Select;

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [grades, setGrades] = useState([]);
    const [grade, setGrade] = useState("");
    const [answer, setAnswer] = useState("");
    const [password, setPassword] = useState("");
    const [spinnerLoading, setSpinnerLoading] = useState(false);
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
            toast.error("Getting error while fetching Grade")
        }
    }
    useEffect(() => {
        getAllGrades();
    }, [])


    //form submission
    const handleSubmit = async (e) => {
        setSpinnerLoading(true);
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
                setSpinnerLoading(false);
                navigate("/login")
            } else {
                toast.error(res.data.message)
                setSpinnerLoading(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            setSpinnerLoading(false);
        }
    }

    return (
        <Layout title={"Register Now - C-LAB"}>
            <div className="form-container">
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
                                    {/* <Select bordered={false}
                                        placeholder="Select Grade"
                                        size='large' 
                                        className='form-select mb-3' onChange={(value) => { setGrade(value) }} required>
                                        {grades?.map(g => (
                                            <Option key={g._id} value={g._id}>{g.name}</Option>
                                        ))}
                                    </Select> */}
                                    <select className="form-select" aria-label="Default select example" onChange={(e) => { setGrade(e.target.value) }} required>
                                        <option selected disabled>Select Grade</option>
                                        {grades?.map(g => (
                                            <option key={g._id} value={g._id}>{g.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="exampleInputPassword1" placeholder='Password' required />
                                </div>
                                <div className="mb-3">
                                    <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} className="form-control" id="exampleInputAddress" placeholder='Security Answer' required />
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary">                                        {spinnerLoading ? <Spinner /> : "REGISTER"}
                                    </button>
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