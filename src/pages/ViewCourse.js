import React from 'react';
import Layout from '../components/Layouts/Layout';

const ViewCourse = () => {
    return (
        <Layout>
        <div className="container">
            <div className="row p-3">
            <h3 className='text-center my-3'>Available Course</h3>
            <div className="card text-center h2 p-5 mt-5 text-secondary ">No course available yet</div>
            </div>
        </div>
        </Layout>
    );
};

export default ViewCourse;