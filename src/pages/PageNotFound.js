import React from 'react';
import Layout from '../components/Layouts/Layout';
import { Link } from 'react-router-dom';
import GoBackButton from '../components/Layouts/GoBackButton';

const PageNotFound = () => {
    return (
        <Layout title={"Page Not Found"}>
            <div className="pnf">
                <div className="pnf-title">404</div>
                <h2 className="pnf-heading"> Ooops! Page Not Found</h2>
                <Link to="/" className="pnf-btn"><b>Go to Home</b></Link>
                <GoBackButton />
            </div>
        </Layout>
    );
};

export default PageNotFound;