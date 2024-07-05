import React from 'react';
import Layout from '../components/Layouts/Layout';
import { useAuth } from '../context/auth';

const HomePage = () => {
    const [auth, setAuth] = useAuth();
    return (
        <Layout title={"Home"}>
            <div className="container">
                <div className="row p-5">
                <h4>Name: {auth?.user?.name}</h4>
                <h6>Phone: {auth?.user?.phone} </h6>
                <h6>Email: {auth?.user?.email} </h6>
                <h6>Grade: {auth?.user?.grade} </h6>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;