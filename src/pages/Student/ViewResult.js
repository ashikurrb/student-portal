import React from 'react';
import Layout from '../../components/Layouts/Layout'
import StudentMenu from '../../components/Layouts/StudentMenu';

const ViewResult = () => {
    return (
        <Layout title={"Dashboard - Student"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <StudentMenu></StudentMenu>
                    </div>
                    <div className="col-md-9">
                    <h3 className='text-center pt-3'> Result</h3>
                    <div className="card mt-3 p-4">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">No</th>
                                        <th scope="col">Exam/Sub</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Result</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">1</th>
                                        <td>Math</td>
                                        <td>21/5/2020</td>
                                        <td>79</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ViewResult;