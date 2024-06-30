import React from 'react';
import Layout from '../../components/Layouts/Layout';
import '../../style/AuthStyle.css'
import { NavLink } from 'react-router-dom';

const Login = () => {
    return (
        <Layout title={"C-Lab - Login"}>
            <div className="form-container p-2">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="text-center">
                                <img src="/images/loginImg.png" style={{ width: "70%" }} alt="" />
                            </div>
                        </div>
                        <div className="col-md-6">

                            <form className='m-lg-5 mb-2'>
                                <h4 className="title"><i class="fa-solid fa-right-to-bracket"></i> &nbsp; Login Here</h4>                                
                                <div className="form-floating mb-3">
                                    <input type="email" className="form-control" id="exampleInputEmail" placeholder='Email' required />
                                    <label for="floatingInput">Email address</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder='Password' required />
                                    <label for="floatingInput">Password</label>
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary">Log In</button>
                                    <br /> <br />
                                    <NavLink to="/forget-password">Forget Password</NavLink>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Login;