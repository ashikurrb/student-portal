import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout'
import Spinner from '../../components/Spinner';
import StudentMenu from './StudentMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { Modal } from 'antd';

const ViewResult = () => {
    const [results, setResults] = useState([]);
    const [spinnerLoading, setSpinnerLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);

    const getResult = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/result/user-result`);
            setResults(data);
        } catch (error) {
            console.log(error);
            toast.error("Error fetching Results");
        } finally {
            setSpinnerLoading(false);
        }
    };

    // Open modal with selected result data
    const openModal = (result) => {
        setVisible(true);
        setSelected(result);
    };

    useEffect(() => {
        getResult();
    }, []);

    return (
        <Layout title={"Dashboard - Result"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <StudentMenu />
                    </div>
                    <div className="col-md-9">
                        <h3 className="text-center my-4">
                            <i class="fa-solid fa-square-poll-vertical pe-1"></i> Result
                        </h3>
                        <div className="card mt-3 p-4 table-container">
                            {spinnerLoading ? <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "50vh" }}><Spinner /></div> : <table className="table table-striped">
                                <thead className='table-dark'>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Grade</th>
                                        <th scope="col">Exam</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Result</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        results.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center">
                                                    <div className="my-5">
                                                        <h3 className='text-secondary'>No Result Found</h3>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            results.map((r, i) => {
                                                return (
                                                    <tr key={r._id}>
                                                        <th scope='row'>{i + 1}</th>
                                                        <td>{r.grade.name}</td>
                                                        <td>{r.type}</td>
                                                        <td>{dayjs(r.examDate).format('MMM DD, YYYY')}</td>
                                                        <td>
                                                            <button className="btn btn-outline-primary" onClick={() => openModal(r)}>
                                                            <i className="fa-solid fa-square-poll-vertical" />
                                                            </button>
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
            <Modal open={visible} onCancel={() => setVisible(false)} footer={null}>
                <div>
                    <h5 className='text-center'>
                      Result
                    </h5>
                    <h6 className='text-center my-3'>
                          {selected?.type}: {selected?.examDate && dayjs(selected.examDate).format('MMM DD, YYYY')}
                    </h6>
                    <table className="table table-striped">
                        <thead className='table-dark'>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Subject</th>
                                <th scope="col">Marks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                selected && selected.subjects.map((s, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{s.subject}</td>
                                            <td>{s.marks}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </Modal>
        </Layout >
    );
};

export default ViewResult;