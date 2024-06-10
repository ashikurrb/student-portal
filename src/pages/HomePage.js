import React from 'react';
import Layout from '../components/Layouts/Layout';

const HomePage = () => {
    return (
        <Layout  title={"Home"}>
            <img className='p-5 mx-auto d-block' src="/images/homepageImg.png" alt="HomePage" style={{width:"80%"}} />
        </Layout>
    );
};

export default HomePage;