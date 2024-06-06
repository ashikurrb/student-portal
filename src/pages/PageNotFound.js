import React from 'react';
import Layout from '../components/Layouts/Layout';
import { Link, useNavigate } from 'react-router-dom';

const PageNotFound = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };
    return (
        <Layout title={"Page Not Found"}>
            <div className="pnf">
                <div className="pnf-title">404</div>
                <h2 className="pnf-heading"> Ooops! Page Not Found</h2>
                <button className='pnf-btn' onClick={handleGoBack}><b>Go Back</b></button>
                <Link to="/" className="pnf-btn"><b>Go to Home</b></Link>
            </div>
        </Layout>
    );
};

export default PageNotFound;