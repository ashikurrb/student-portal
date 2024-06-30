import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className='footer'>
            <div className='container my-5'>
                <div className="row">
                    <div className="col-md-4">
                        <h4>We are: </h4>
                        <p className='d-flex'>
                            <Link to="/about">About Us</Link>
                            
                            <Link to="/contact">Contact</Link>
                            
                            <Link to="/policy">Privacy Policy</Link>
                        </p>
                    </div>
                    <div className="col-md-4">
                        <h5>Follow Us</h5>
                        <div className="d-flex">
                            <Link to="https://www.facebook.com/ashikurrb85" target='_blank'>
                                <i className="h3 fab fa-facebook-f"></i>
                            </Link>
                            <Link to="https://www.x.com/ashikurrb" target='_blank'>
                                <i className="h3 fab fa-twitter"></i>
                            </Link>
                            <Link to="https://www.instagram.com/ashikurrb" target='_blank'>
                                <i className="h3 fab fa-instagram"></i>
                            </Link>
                            <Link to="https://www.linkedin.com/in/ashikurrb" target='_blank'>
                                <i className="h3 fab fa-linkedin-in"></i>
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <h4>We Accept:</h4>
                        <div>
                            <i className="h2 mx-2 fa-brands fa-cc-visa" />
                            <i className="h2 mx-2 fa-brands fa-cc-jcb" />
                            <i className="h2 mx-2 fa-brands fa-cc-discover" />
                            <i className="h2 mx-2 fa-brands fa-cc-mastercard" />
                            <i className="h2 mx-2 fa-brands fa-cc-paypal" />
                        </div>
                    </div>
                </div>
            </div>
            <h4 className='text-center'>All Rights Reserved &copy; ashikurrb</h4>
        </div>
    );
};

export default Footer;