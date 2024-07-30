import React from 'react';
import Layout from '../components/Layouts/Layout';
import { useAuth } from '../context/auth';

const HomePage = () => {
    const [auth] = useAuth();
    return (
        <Layout title={"5Points - Best Coaching"}>
            <div className="container">
                <div className="row m-5">
                    <div className="col-md-6">
                        <h4>Name: {auth?.user?.name}</h4>
                        <h6>Phone: {auth?.user?.phone} </h6>
                        <h6>Email: {auth?.user?.email} </h6>
                        <h6>Grade: {auth?.user?.grade?.name} </h6>
                    </div>

                    <div className="col-md-6 card" role="alert">
                        <p className='p-2'>Token: {auth?.token} </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;