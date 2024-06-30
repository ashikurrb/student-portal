import React from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from '../../components/Layouts/AdminMenu';

const AdminDashboard = () => {
    return (
        <Layout title={"Dashboard - Admin Panel"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu></AdminMenu>
                    </div>
                    <div className="col-md-9">
                            <h4 className='text-center my-3'>Admin Profile</h4>
                        <div className="row m-2">
                            <div className="col-md-6 mb-2">
                                <div className='card h-100 p-3'>
                                    <h5>Name: </h5>
                                    <p>Email: </p>
                                    <p> Phone: </p>
                                    <p>Address: </p>
                                    <h5>Role: </h5>
                                </div>
                            </div>
                            <div className="col-md-6 mb-2">
                                <div className='card h-100 p-3'>
                                    <p className='text text-wrap'><b>Token:</b> </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Layout>
    );
};

export default AdminDashboard;