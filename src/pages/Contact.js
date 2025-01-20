import React from 'react';
import Layout from '../components/Layouts/Layout';
import GoBackButton from '../components/GoBackButton';

const Contact = () => {
    return (
        <Layout title={"Contact Us - 5points Academy"}>
            <div className="container">
                <div className="row">
                    <div className="d-flex align-items-center">
                        <div className="col-auto">
                            <GoBackButton />
                        </div>
                        <div className="col">
                            <h2 className="p-3 mt-3 text-center">Contact Us</h2>
                        </div>
                    </div>
                    <div className="row mx-1 mt-5">
                        <div className="col-md-5">
                            <img className='my-2' src="https://raw.githubusercontent.com/techinfo-youtube/ecommerce-app-2023/main/client/public/images/contactus.jpeg" alt="contact-us" style={{ width: "100%" }} />
                        </div>
                        <div className="col-md-7">
                            <h3 className="bg-dark my-2 p-2 text-white text-center"> CONTACT DETAILS </h3>
                            <p className="mt-5 mx-2">
                                Call us for more information about admission and courses.
                            </p>
                            <p className="mt-3">
                                <i className='fa-solid fa-envelope'></i> : 5pointschool@gmail.com
                            </p>
                            <p className="mt-3">
                                <i className='fa-solid fa-phone-volume'></i> : +880 1794-744343
                            </p>
                            <p className="mt-3">
                                <i className="fas fa-map-marker-alt"></i> : Tajmahal Road, Mohammadpur, Dhaka - 1207, Bangladesh
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    );
};

export default Contact;