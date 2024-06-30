import React from 'react';
import Layout from '../components/Layouts/Layout';
import GoBackButton from '../components/Layouts/GoBackButton';

const About = () => {
    return (
        <Layout title={"C-Lab - About US"}>
               <div className="container">
               <div className="row align-items-center">
                    <div className="col-auto">
                        <GoBackButton />
                    </div>
                    <div className="col">
                        <h3 className="mb-0 me-5 p-3 text-center">About Us</h3>
                    </div>
                </div>
               </div>
        </Layout>
    );
};


export default About;