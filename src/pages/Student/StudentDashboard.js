import React from 'react';
import Layout from '../../components/Layouts/Layout'
import StudentMenu from './StudentMenu';
import { useAuth } from '../../context/auth';

const StudentDashboard = () => {
    const [auth] = useAuth();
    return (
        <Layout title={"Dashboard - Student"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <StudentMenu/>
                    </div>
                    <div className="col-md-9">

                        <h3 className='text-center my-3'>Your Profile</h3>
                        <div className="card px-4 py-2">
                            <div className="text-center">
                                <img className='img img-fluid rounded' src="/images/TestUserImg.png" alt="" style={{ width: "20%" }} />
                            </div>
                            <h5>Name: {auth?.user?.name} </h5>
                            <p>Email: {auth?.user?.email} </p>
                            <p>Phone: {auth?.user?.phone}</p>
                            <p>Grade: {auth?.user?.grade?.name}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default StudentDashboard;