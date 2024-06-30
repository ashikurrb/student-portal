import React from 'react';
import Layout from '../../components/Layouts/Layout';
import '../../style/AuthStyle.css'
import { Link } from 'react-router-dom';

const Register = () => {
    return (
        <Layout title={"Register Now - C-Lab"}>
            <div className="form-container p-2">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <img className='pt-5 px-5' src="/images/registerImg.png" alt="" style={{ width: "100%" }} />
                        </div>
                        <div className="col-md-6">
                            <form className='m-lg-5 mb-2'>
                            <h4 className="title"><i class="fa-solid fa-user-plus"></i> &nbsp; REGISTER FORM</h4>

                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" id="exampleInputName" placeholder='Name' required />
                                    <label for="floatingInput">Name</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="email" className="form-control" id="exampleInputEmail" placeholder='Email' required />
                                    <label for="floatingInput">Email address</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="number" className="form-control" id="exampleInputPhone" placeholder='Phone Number' required />
                                    <label for="floatingInput">Phone Number</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" id="exampleInputStudentID" placeholder='StudentID' required />
                                    <label for="floatingInput">Student ID</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder='Password' required />
                                    <label for="floatingInput">Password</label>
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary">REGISTER</button>
                                </div>
                                <div className="text-center py-3">Already Registered? <Link to="/login">Log In</Link></div>
                            </form>
                        </div>
                    </div>
                </div></div>

        </Layout>
    );
};

export default Register;