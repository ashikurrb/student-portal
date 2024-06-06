import React from 'react';
import Layout from '../../components/Layouts/Layout'
import StudentMenu from '../../components/Layouts/StudentMenu';
import { Link } from 'react-router-dom';

const ContentLink = () => {
    return (
        <Layout title={"Dashboard - Student"}>
        <div className="container-fluid mt-3 p-3">
            <div className="row">
                <div className="col-md-3">
                    <StudentMenu></StudentMenu>
                </div>
                <div className="col-md-9">
                <h3 className='text-center pt-3'> Content Link</h3>
                    <div className="card mt-3 p-4 table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">No</th>
                                    <th scope="col">Subject</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Link</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Math</td>
                                    <td>Video</td>
                                    <td><Link to="https://www.sample.com" target='_blank'>Click</Link></td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>Physics</td>
                                    <td>PDF</td>
                                    <td><Link to="https://www.pdf.com" target='_blank'>Click</Link></td>
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

export default ContentLink;