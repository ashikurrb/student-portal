import React from 'react';
import Layout from '../../components/Layouts/Layout'
import StudentMenu from './StudentMenu';
import { useAuth } from '../../context/auth';
import { Image } from 'antd';

const StudentDashboard = () => {
    const [auth] = useAuth();

    return (
        <Layout title={"Dashboard - Profile"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <StudentMenu />
                    </div>
                    <div className="col-md-9">
                        <h3 className='text-center my-3'><i className="fa-solid fa-user pe-2" />Your Info</h3>
                        <div className="card px-4 py-2">
                            <div className="text-center m-3">
                                <Image style={{ width: "auto", height: "150px" }} className="border border-2 rounded" src={auth?.user?.avatar} alt="DP" />
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