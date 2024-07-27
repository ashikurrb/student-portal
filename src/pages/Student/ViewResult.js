import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout'
import Spinner from '../../components/Spinner';
import StudentMenu from './StudentMenu';
import { useAuth } from '../../context/auth';
import axios from 'axios';

const ViewResult = () => {
    const [auth, setAuth] = useAuth();
    const [results, setResults] = useState([]);
    const [spinnerLoading, setSpinnerLoading] = useState(true);

    const getResult = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/result/user-result`);
            setResults(data);
        } catch (error) {
            console.log(error);
        } finally {
            setSpinnerLoading(false);
        }
    };

    useEffect(() => {
        getResult();
    }, []);


    return (
        <Layout title={"Dashboard - Student"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <StudentMenu />
                    </div>
                    <div className="col-md-9">
                        <h3 className='text-center pt-3'> Result</h3>
                        <div className="card mt-3 p-4 table-container">
                        {spinnerLoading ? <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "50vh" }}><Spinner /></div> :<table className="table">
                                <thead className='table-dark'>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Subject</th>
                                        <th scope="col">Marks</th>
                                        <th scope="col">Date</th>
                                    </tr>
                                </thead>
                               <tbody>
                                    {results.map((r, i) => {
                                        return (
                                            <tr key={r._id}>
                                                <th scope='row'>{i + 1}</th>
                                                <td>{r.subject}</td>
                                                <td>{r.marks}</td>
                                                <td>{r.examDate}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table> }
                            
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ViewResult;