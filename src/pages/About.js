import React from 'react';
import Layout from '../components/Layouts/Layout';
import GoBackButton from '../components/Layouts/GoBackButton';

const About = () => {
    return (
        <Layout title={"C-Lab - About US"}>
            <h1 className='text-center mt-4'>About Us</h1>
            <h1 className="text-center"> <GoBackButton /></h1>
        </Layout>
    );
};


export default About;