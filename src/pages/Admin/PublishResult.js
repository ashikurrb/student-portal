import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from './AdminMenu';
import Spinner from '../../components/Spinner'
import axios from 'axios';
import { useAuth } from '../../context/auth';
import UpdateResult from './UpdateResult';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from 'antd';
import { DatePicker } from 'antd';
import { Select } from 'antd';

const { Option } = Select;

const PublishResult = () => {
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [listSpinnerLoading, setListSpinnerLoading] = useState(false);
    const [auth, setAuth] = useAuth();
    const [grades, setGrades] = useState([]);
    const [grade, setGrade] = useState("");
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState('');
    const [subject, setSubject] = useState('');
    const [marks, setMarks] = useState('');
    const [examDate, setExamDate] = useState('');
    const [result, setResult] = useState([]);
    const [updatedSubject, setUpdatedSubject] = useState('');
    const [updatedMarks, setUpdatedMarks] = useState('');
    const [updatedExamDate, setUpdatedExamDate] = useState('');
    const [selected, setSelected] = useState(null);
    const [visible, setVisible] = useState(false);
    const params = useParams();
    const id = params.id;
    console.log(id);


    //Get All Grades
    const getAllGrades = async (req, res) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/grade/all-grades`)
            if (data?.success) {
                setGrades(data?.grade);
            }
        } catch (error) {
            console.log(error);
            toast.error("Getting error while fetching Grade")
        }
    }
    useEffect(() => {
        getAllGrades();
    }, [])

    //Get all users
    const getAllUsers = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/all-users`)
            setUsers(data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (auth?.token) getAllUsers();
    }, [auth?.token])

    //publish result
    const handlePublish = async (e) => {
        e.preventDefault();
        setSpinnerLoading(true);
        try {
            const resultData = new FormData();
            resultData.append("subject", subject);
            resultData.append("marks", marks);
            resultData.append("examDate", examDate);
            resultData.append("user", user);
            resultData.append("grade", grade);

            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/result/create-result`, resultData);
            if (data?.success) {
                setSpinnerLoading(false);
                toast.success(data?.message);
                getAllResults();
                // Clear form fields
                setSubject('');
                setMarks('');
                setExamDate('');
                setUser('');
                setGrade('');
            } else {
                toast.success("Result Created Successfully");
            }

        } catch (error) {
            console.log(error);
            toast.error('Something went wrong')
            setSpinnerLoading(false)
        }
    }

    //get all result
    const getAllResults = async () => {
        setListSpinnerLoading(true)
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/result/all-result`)
            setResult(data)
        } catch (error) {
            console.log(error);
        } finally {
            setListSpinnerLoading(false)
        }
    }

    useEffect(() => {
        getAllResults();
    }, [])

    const handleUpdate = async ({e,rId}) => {
        e.preventDefault();
        try {
            const updateResultData = new FormData();
            updateResultData.append("subject", subject);
            updateResultData.append("marks", marks);
            updateResultData.append("examDate", examDate);

            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/result/update-result/${selected.rId}`, updateResultData);
            if (data?.success) {
                setSpinnerLoading(false);
                toast.success(data?.message);
                getAllResults();
                // Clear form fields
                setSubject('');
                setMarks('');
                setExamDate('');
                setUser('');
            } else {
                toast.success("Result Updated Successfully");
            }

        } catch (error) {
            console.log(error);
            toast.error('Something went wrong')
            setSpinnerLoading(false)
        }
    };

    //delete result
    const handleDelete = async (rId) => {
        try {
            let answer = window.confirm("Are you sure want to delete this result?")
            if (!answer) return;
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/result/delete-result/${rId}`);
            if (data.success) {
                toast.success(`Result deleted successfully`);
                getAllResults();
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Something wrong while Delete')
        }
    }


    return (
        <Layout title={"Admin - Publish Result"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3"><AdminMenu /></div>
                    <div className="col-md-9">
                        <h2 className='text-center my-3'>Publish Result</h2>
                        <div className="m-1  w-75">
                            <div className="mb-4 d-lg-flex">
                                <Select bordered={false}
                                    placeholder="Select Grade"
                                    size='large'
                                    className='form-select mb-1 mx-1'
                                    onChange={(value) => { setGrade(value) }}>
                                    {grades?.map(g => (
                                        <Option key={g._id} value={g._id}>{g.name}</Option>
                                    ))}
                                </Select>
                                <Select bordered={false}
                                    placeholder="Select Student"
                                    size='large'
                                    className='form-select mb-1 mx-1'
                                    onChange={(value) => { setUser(value) }} required>
                                    {users?.map(u => (
                                        <Option key={u._id} value={u._id}>{u.name}</Option>
                                    ))}
                                </Select>
                            </div>
                            <div className="mb-4 d-flex">
                                <input
                                    type="text"
                                    placeholder='Subject'
                                    className='form-control w-75 me-2'
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)} required
                                />
                                <DatePicker className='w-50' onChange={(date) => setExamDate(date)} required />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder='Marks'
                                    className='form-control'
                                    value={marks}
                                    onChange={(e) => setMarks(e.target.value)} required
                                />
                            </div>
                            <div className="mb-3 text-center">
                                {spinnerLoading ? <div className='my-2'><Spinner /> </div> : ""}
                                <button className="btn btn-warning fw-bold" onClick={handlePublish}>
                                    Create Result
                                </button>
                            </div>
                        </div>
                        <div className='table-container'>
                            <table className="table">
                                <thead className='table-dark'>
                                    <tr>
                                        <th>#</th>
                                        <th>Grade</th>
                                        <th>Name</th>
                                        <th>Subject</th>
                                        <th>Result</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                {
                                    listSpinnerLoading ? <Spinner /> :
                                        <tbody>
                                            {
                                                result.map((r, i) => {
                                                    return (
                                                        <tr>
                                                            <th scope="row">{i + 1}</th>
                                                            <td>{r?.grade?.name}</td>
                                                            <td>{r?.user?.name}</td>
                                                            <td>{r.subject}</td>
                                                            <td>{r.marks}</td>
                                                            <td>{r.examDate}</td>
                                                            <td className='d-flex'>
                                                                <button className='btn btn-primary mx-1' onClick={() => { setVisible(true); }}><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                                                                <button className="btn btn-danger fw-bold ms-1" onClick={() => handleDelete(r._id)}><i class="fa-solid fa-trash-can"></i>  Delete</button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                }
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PublishResult;