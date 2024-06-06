import React from 'react';
import Layout from '../../components/Layouts/Layout'
import StudentMenu from '../../components/Layouts/StudentMenu';

const StudentDashboard = () => {
    return (
        <Layout title={"Dashboard - Student"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                    
                        <StudentMenu></StudentMenu>
                    </div>
                    <div className="col-md-9">
                        <div className="card p-4">
                            <div className="text-center">
                                <img className='img img-fluid rounded' src="/images/TestUserImg.png" alt="" style={{width:"10%"}}/>
                            </div>
                            <h5>Name: </h5>
                            <p>Email: </p>
                            <p>Phone: </p>
                            <p>Address: </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default StudentDashboard;