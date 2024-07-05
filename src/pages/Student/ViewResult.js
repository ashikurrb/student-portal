import React from 'react';
import Layout from '../../components/Layouts/Layout'
import StudentMenu from './StudentMenu';

const ViewResult = () => {
    return (
        <Layout title={"Dashboard - Student"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <StudentMenu/>
                    </div>
                    <div className="col-md-9">
                        <h3 className='text-center pt-3'> Result</h3>
                        <div className="card mt-3 p-4 table-container">
                            <table className="table">
                                <thead className='table-dark'>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Exam/Sub</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Result</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr data-bs-toggle="modal" data-bs-target="#exampleModal">
                                        <th scope="row">1</th>
                                        <td>Math</td>
                                        <td>21/5/2020</td>
                                        <td>79</td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Modal Start Area */}
                            <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="exampleModalLabel">Result</h1>

                                        </div>
                                        <div className="modal-body">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti a facere hic eum minus fugiat cum quisquam culpa, atque, sit sed dolores fugit nesciunt error! Animi exercitationem excepturi commodi voluptas.
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Modal End Area */}


                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ViewResult;