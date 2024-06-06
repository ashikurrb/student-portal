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
                        <div className="row justify-content-center card m-3 p-3 shadow border border-3">
                            <div className="col-md-12">
                                <div className="d-flex justify-content-center">
                                    <div className='w-50'>
                                        <h5>Name: </h5>
                                        <p>Email: </p>
                                        <p> Phone: </p>
                                        <p>Address: </p>
                                        <h5>Role: </h5>
                                    </div>
                                    <div className="d-flex mx-5" style={{ height: 200 }}>
                                        <div className="vr" />
                                    </div>
                                    <div className='w-50 text text-wrap'>
                                        <p><b>Token:</b> </p>
                                    </div>
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