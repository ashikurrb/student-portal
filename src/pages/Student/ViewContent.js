import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout'
import Spinner from '../../components/Spinner';
import StudentMenu from './StudentMenu';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ViewContent = () => {
    const [content, setContent] = useState([]);
    const [spinnerLoading, setSpinnerLoading] = useState(true);
    const types = [
        { name: "PDF", logo: <i className="fa-solid fa-file-pdf" /> },
        { name: "Doc", logo: <i className="fa-solid fa-file-word" /> },
        { name: "Slide", logo: <i className="fa-solid fa-file-powerpoint" /> },
        { name: "Spreadsheet", logo: <i className="fa-solid fa-file-excel" /> },
        { name: "Video", logo: <i className="fa-brands fa-youtube" /> },
        { name: "Audio", logo: <i className="fa-solid fa-volume-high" /> },
        { name: "Online Class", logo: <i className="fa-solid fa-video" /> },
    ];

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
        <Layout title={"Dashboard - Content Links"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <StudentMenu />
                    </div>
                    <div className="col-md-9">
                        <h3 className="text-center my-4">
                            <i class="fa-solid fa-link pe-2"></i> Content Links
                        </h3>
                        <div className="card mt-3 p-4 table-container">
                            {spinnerLoading ? <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "50vh" }}><Spinner /></div> : <table className="table table-striped">
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
                                    {
                                        content.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center">
                                                    <div className="my-5">
                                                        <h3 className='text-secondary'>No Content Found</h3>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            content.map((c, i) => {
                                                return (
                                                    <tr key={c._id}>
                                                        <th scope='row'>{i + 1}</th>
                                                        <td>{c.subject}</td>
                                                        <td>{c.remark}</td>
                                                        <td>
                                                            {types.map((t) =>
                                                                t.name === c.type ? (
                                                                    <div>
                                                                        <span> {t.logo}</span>
                                                                        <span className='ms-1'> {t.name}</span>
                                                                    </div>
                                                                ) : null
                                                            )}
                                                        </td>
                                                        <td>
                                                            <Link className='link' to={c.contentLink} target='_blank'>
                                                                <i className="fa-solid fa-up-right-from-square" /> Open
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        )
                                    }
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