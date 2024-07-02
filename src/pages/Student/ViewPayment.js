import React from 'react';
import Layout from '../../components/Layouts/Layout'
import StudentMenu from '../../components/Layouts/StudentMenu';

const ViewPayment = () => {
    return (
        <Layout title={"Dashboard - Student"}>
            <div className="container-fluid mt-3 p-3 ">
                <div className="row">
                    <div className="col-md-3">
                        <StudentMenu></StudentMenu>
                    </div>
                    <div className="col-md-9 ">
                        <h3 className='text-center pt-3'> Payment Status</h3>
                        <div className="card mt-3 p-4 table-container">
                            <table className="table  ">
                            <thead className='table-dark'>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Trx ID</th>
                                        <th scope="col">Method</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">1</th>
                                        <td >75hgft9m</td>
                                        <td>bKash</td>
                                        <td>12200</td>
                                        <td>21/5/2024</td>
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

export default ViewPayment;