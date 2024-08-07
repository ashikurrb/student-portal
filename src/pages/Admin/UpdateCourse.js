import React from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from './AdminMenu';

const UpdateCourse = () => {
    return (
        <Layout title={"Admin - Create Links"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3"><AdminMenu /></div>
                   <div className="col-md-9">
                   <h2 className='text-center my-3'>Update Course Details</h2>

                   </div>
                </div>
            </div>
        </Layout>
    );
};

export default UpdateCourse;