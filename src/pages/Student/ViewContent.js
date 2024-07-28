import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout'
import Spinner from '../../components/Spinner';
import StudentMenu from './StudentMenu';
import { useAuth } from '../../context/auth';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ViewContent = () => {
    const [auth, setAuth] = useAuth();
    const [content, setContent] = useState([]);
    const [spinnerLoading, setSpinnerLoading] = useState(true);

    const getContent = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/content/user-content`);
            setContent(data);
        } catch (error) {
            console.log(error);
        } finally {
            setSpinnerLoading(false);
        }
    };
    useEffect(() => {
        getContent();
    }, []);

    return (
        <Layout title={"Dashboard - Student"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <StudentMenu />
                    </div>
                    <div className="col-md-9">
                        <h3 className='text-center pt-3'> Content Links</h3>
                        <div className="card mt-3 p-4 table-container">
                            {spinnerLoading ? <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "50vh" }}><Spinner /></div> : <table className="table">
                                <thead className='table-dark'>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Subject</th>
                                        <th scope="col">Remark</th>
                                        <th scope="col">Type</th>
                                        <th scope="col">Link</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {content.map((c, i) => {
                                        return (
                                            <tr key={c._id}>
                                                <th scope='row'>{i + 1}</th>
                                                <td>{c.subject}</td>
                                                <td>{c.remark}</td>
                                                <td>{c.type}</td>
                                                <td>
                                                    <Link className='link' to={c.contentLink} target='_blank'>
                                                        <i class="fa-solid fa-up-right-from-square"></i> Open
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ViewContent;