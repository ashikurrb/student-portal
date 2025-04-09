import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className='footer'>
            <div className='container'>
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
                            <div className="d-md-flex justify-content-between">
                                <Link to="https://www.facebook.com/5pointsAcademy" target='_blank'>
                                    <i className="h3 fab fa-facebook-f"></i>
                                </Link>
                                <Link to="https://www.instagram.com/ashikurrb" target='_blank'>
                                    <i className="h3 fab fa-instagram"></i>
                                </Link> <Link to="https://www.youtube.com/@5pointsAcademy" target='_blank'>
                                    <i className="h3 fab fa-youtube"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <div className='text-center mb-3'>
                <span>Copyright &copy; 2024
                    <Link className='text-warning' to="https://ashikurrb.vercel.app" target='_blank'>
                        @ashikurrb
                    </Link>
                    All Rights Reserved
                </span>
            </div>
        </div>
    );
};

export default Footer;