import React from 'react';
import Layout from '../components/Layouts/Layout';
import { useAuth } from '../context/auth';

const HomePage = () => {
    const [auth, setAuth] = useAuth();
    return (
        <Layout title={"Home"}>
            <pre>
                {JSON.stringify(auth, null, 4)}
            </pre>
        </Layout>
    );
};

export default HomePage;