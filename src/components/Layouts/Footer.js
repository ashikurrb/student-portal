import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className='footer'>
            <div className='container mt-4'>
                <div className="row">
                    <div className='d-lg-flex justify-content-between'>
                        <div className='text-center'>
                            <h4>We are </h4>
                            <p className="d-md-flex justify-content-evenly">
                                <Link to="/about">About Us</Link>

                                <Link to="/contact">Contact</Link>

                                <Link to="/policy">Privacy Policy</Link>
                            </p>
                        </div>
                        <div className='text-center'>
                            <h5>Follow Us</h5>
                            <div className="d-md-flex justify-content-evenly">
                                <Link to="https://www.facebook.com/ashikurrb85" target='_blank'>
                                    <i className="h3 fab fa-facebook-f"></i>
                                </Link>
                                <Link to="https://www.x.com/ashikurrb" target='_blank'>
                                    <i className="h3 fab fa-x-twitter"></i>
                                </Link>
                                <Link to="https://www.instagram.com/ashikurrb" target='_blank'>
                                    <i className="h3 fab fa-instagram"></i>
                                </Link>
                                <Link to="https://www.linkedin.com/in/ashikurrb" target='_blank'>
                                    <i className="h3 fab fa-linkedin-in"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <div className='text-center'>
                <span className=''>Copyright &copy; 2024
                    <Link className='text-warning' to="https://www.facebook.com/ashikurrb85" target='_blank'>
                        ashikurrb
                    </Link>
                </span>
                <br />
                <p className='mt-2'> All Rights Reserved</p>
            </div>
        </div>
    );
};

export default Footer;