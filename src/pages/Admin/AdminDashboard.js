import React from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from './AdminMenu';
import { useAuth } from '../../context/auth';

const AdminDashboard = () => {
    const [auth] = useAuth();
    return (
        <Layout title={"Dashboard - Admin Panel"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu/>
                    </div>
                    <div className="col-md-9">
                        <h4 className='text-center my-3'>Admin Profile</h4>
                        <div className="row m-2">
                            <div className="col-md-6 mb-2">
                                <div className='card h-100 p-3'>
                                    <h5>Name: {auth?.user?.name} </h5>
                                    <p>Email: {auth?.user?.email} </p>
                                    <p>Phone: {auth?.user?.phone}</p>
                                    <p>Grade: {auth?.user?.grade?.name}</p>
                                    <h5>Role: {auth?.user?.role} </h5>
                                </div>
                            </div>
                            <div className="col-md-6 mb-2">
                                <div className='card h-100 p-3'>
                                    <p className='text text-wrap'><b>Token:</b> {auth?.token}</p>
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