import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from './AdminMenu';
import Spinner from '../../components/Spinner'
import axios from 'axios';
import moment from 'moment'
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import { Modal, DatePicker, Select, Tooltip } from 'antd';
const dateFormat = 'DD-MM-YYYY';
const { Option } = Select;

const PublishResult = () => {
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [updateSpinnerLoading, setUpdateSpinnerLoading] = useState(false);
    const [listSpinnerLoading, setListSpinnerLoading] = useState(false);
    const [auth, setAuth] = useAuth();
    const [grades, setGrades] = useState([]);
    const [grade, setGrade] = useState("");
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [type, setType] = useState('');
    const [subject, setSubject] = useState('');
    const [marks, setMarks] = useState('');
    const [examDate, setExamDate] = useState('');
    const [result, setResult] = useState([]);
    const [resultId, setResultId] = useState([]);
    const [updatedType, setUpdatedType] = useState('');
    const [updatedSubject, setUpdatedSubject] = useState('');
    const [updatedMarks, setUpdatedMarks] = useState('');
    const [updatedExamDate, setUpdatedExamDate] = useState('');
    const [selected, setSelected] = useState(null);
    const [visible, setVisible] = useState(false);
    const [createModalVisible, setIsCreateModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    //Get All Grades
    const getAllGrades = async (req, res) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/grade/all-grades`)
            if (data?.success) {
                setGrades(data?.grade);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error fetching Grades")
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
            toast.error("Error fetching Users")
        }
    }
    useEffect(() => {
        if (auth?.token) getAllUsers();
    }, [auth?.token])

    // Filter users by grade
    useEffect(() => {
        if (grade) {
            const filtered = users.filter(user => user.grade._id === grade);
            setFilteredUsers(filtered);
            setUser('');
        } else {
            setFilteredUsers([]);
        }
    }, [grade, users]);

    //publish result
    const handlePublish = async (e) => {
        e.preventDefault();
        setSpinnerLoading(true);
        try {
            const resultData = new FormData();
            resultData.append("grade", grade);
            resultData.append("user", user);
            resultData.append("type", type);
            resultData.append("subject", subject);
            resultData.append("examDate", examDate);
            resultData.append("marks", marks);
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/result/create-result`, resultData);
            if (data?.success) {
                setSpinnerLoading(false);
                toast.success(data?.message);
                getAllResults();
                // Clear form fields
                setGrade(undefined);
                setUser(undefined);
                setType('');
                setSubject('');
                setExamDate(undefined);
                setMarks('');
                setListSpinnerLoading(false);
            } else {
                toast.success(data.message);
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
            toast.error("Error fetching Results")
        } finally {
            setListSpinnerLoading(false)
        }
    }
    useEffect(() => {
        getAllResults();
    }, [])


    //update result
    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateSpinnerLoading(true);
        try {
            const updateResultData = new FormData();
            updateResultData.append("type", updatedType);
            updateResultData.append("subject", updatedSubject);
            updateResultData.append("marks", updatedMarks);
            updateResultData.append("examDate", updatedExamDate);
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/result/update-result/${selected._id}`, updateResultData);
            if (data?.success) {
                setUpdateSpinnerLoading(false);
                toast.success(data?.message);
                getAllResults();
                // Clear form fields
                setUpdatedType('');
                setUpdatedSubject('');
                setUpdatedMarks('');
                setUpdatedExamDate(undefined);
                setVisible(false);
                setListSpinnerLoading(false);
            } else {
                toast.success(data.message);
                setUpdateSpinnerLoading(false);
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
            setUpdateSpinnerLoading(false);
        }
    };

    // Open modal with selected result data
    const openModal = (result) => {
        setVisible(true);
        setSelected(result);
        setResultId(result._id);
        setUpdatedType(result.type);
        setUpdatedSubject(result.subject);
        setUpdatedMarks(result.marks);
    };

    //delete result
    const handleDelete = async (rId) => {
        let answer = window.confirm("Are you sure want to delete this result?")
        if (!answer) return;
        const loadingToastId = toast.loading('Deleting result...');
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/result/delete-result/${rId}`);
            if (data.success) {
                toast.success(data.message, { id: loadingToastId });
                getAllResults();
            } else {
                toast.error(data.message, { id: loadingToastId })
            }
        } catch (error) {
            toast.error('Something wrong while Delete', { id: loadingToastId })
        }
    }

    // Filter content based on search query
    const filteredResult = result.filter(r =>
        r.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.grade.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout title={"Admin - Publish Result"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3"><AdminMenu /></div>
                    <div className="col-md-9">
                        <h2 className='text-center my-3'>Publish Result</h2>
                        <div className='d-flex justify-content-between mb-3'>
                            <input
                                type="text"
                                placeholder='Search'
                                className='form-control mx-1'
                                style={{ flexBasis: '50%' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" onClick={() => setIsCreateModalVisible(true)} className="btn btn-warning fw-bold mx-1 py-2">
                                <i class="fa-solid fa-plus"></i> Publish Result
                            </button>
                        </div>
                        <Modal width={650} visible={createModalVisible} onCancel={() => setIsCreateModalVisible(false)} footer={null}>
                            <h5 className='text-center mb-3'>Publish Result</h5>
                            <form onSubmit={handlePublish}>
                                <div className="mt-4 d-lg-flex">
                                    <Select bordered={false}
                                        placeholder="Select Grade"
                                        size='large'
                                        className='form-select mb-2 me-2'
                                        value={grade || undefined}
                                        onChange={(value) => { setGrade(value) }}>
                                        {grades?.map(g => (
                                            <Option key={g._id} value={g._id}>{g.name}</Option>
                                        ))}
                                    </Select>
                                    <Select bordered={false}
                                        placeholder="Select Student"
                                        size='large'
                                        className='form-select mb-2'
                                        value={user || undefined}
                                        onChange={(value) => { setUser(value) }}
                                        required>
                                        {filteredUsers?.map(u => (
                                            <Option key={u._id} value={u._id}>{u.name}</Option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="d-lg-flex">
                                    <input
                                        type="text"
                                        placeholder='Exam Type'
                                        className='form-control form-input mb-2 me-2'
                                        value={type}
                                        onChange={(e) => setType(e.target.value)} required
                                    />
                                    <input
                                        type="text"
                                        placeholder='Subject'
                                        className='form-control form-input mb-2'
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)} required
                                    />
                                </div>
                                <div className="d-lg-flex">
                                    <DatePicker format={dateFormat} className='w-100 mb-2 me-2 form-control' value={examDate} onChange={(date) => setExamDate(date)} required />
                                    <input
                                        type="text"
                                        placeholder='Marks'
                                        className='form-control mb-2'
                                        value={marks}
                                        onChange={(e) => setMarks(e.target.value)} required
                                    />
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-warning fw-bold mt-3">
                                        {spinnerLoading ? <div><Spinner /> </div> : "Create Result"}
                                    </button>
                                </div>
                            </form>
                        </Modal>
                        <h6 className='justify-content-start'> Count: {filteredResult.length}</h6>
                        <div className='table-container'>
                            <table className="table">
                                <thead className='table-dark'>
                                    <tr>
                                        <th>#</th>
                                        <th>Grade</th>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Subject</th>
                                        <th>Result</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                {
                                    listSpinnerLoading ? <div className="m-5"><Spinner /></div> :
                                        <tbody>
                                            {filteredResult.length === 0 ? (
                                                <tr>
                                                    <td colSpan="8" className="text-center">
                                                        <h3 className='mt-5 text-secondary'>No Result Found</h3>
                                                        <button onClick={() => { setSearchQuery('') }} className="btn btn-warning mt-2 mb-5 fw-bold">
                                                            Reset Search
                                                        </button>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredResult.map((r, i) => {
                                                    return (
                                                        <tr>
                                                            <th scope="row">{i + 1}</th>
                                                            <td>{r?.grade?.name}</td>
                                                            <td>
                                                                <Tooltip title={`Created: ${moment(r.createdAt).format('llll')} Updated: ${moment(r.updatedAt).format('llll')}`}>
                                                                    <span>{r?.user?.name}</span>
                                                                </Tooltip>
                                                            </td>
                                                            <td>{r.type}</td>
                                                            <td>{r.subject}</td>
                                                            <td>{r.marks}</td>
                                                            <td>{moment(r.examDate).format('ll')}</td>
                                                            <td className='d-flex'>
                                                                <button className='btn btn-primary mx-1' onClick={() => { openModal(r) }}>
                                                                    <i class="fa-solid fa-pen-to-square"></i> Edit
                                                                </button>
                                                                <button className="btn btn-danger fw-bold ms-1" onClick={() => handleDelete(r._id)}>
                                                                    <i class="fa-solid fa-trash-can"></i>  Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            )}
                                        </tbody>
                                }
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Modal onCancel={() => setVisible(false)} visible={visible} footer={null}>
                <h5 className='text-center'>Update Result</h5>
                <div className='text-center my-3'>
                    {
                        <p>
                            {selected?.user?.name} - {selected?.grade?.name}
                        </p>
                    }
                </div>
                <form onSubmit={handleUpdate}>
                    <div className="mt-4 d-lg-flex">
                        <input
                            type="text"
                            placeholder='Exam Type'
                            className='form-control form-input mb-2 me-2'
                            value={updatedType}
                            onChange={(e) => setUpdatedType(e.target.value)} required
                        />
                        <input
                            type="text"
                            placeholder='Subject'
                            className='form-control form-input mb-2'
                            value={updatedSubject}
                            onChange={(e) => setUpdatedSubject(e.target.value)} required
                        />
                    </div>
                    <div className='mb-3'>
                        <DatePicker format={dateFormat} value={updatedExamDate} className='w-100 mb-2 me-2 form-control' onChange={(date) => setUpdatedExamDate(date)} required />
                        <input
                            type="text"
                            placeholder='Marks'
                            className='form-control'
                            value={updatedMarks}
                            onChange={(e) => setUpdatedMarks(e.target.value)} required
                        />
                    </div>
                    <div className="text-center">
                        <button type='submit' className="btn btn-warning fw-bold" >
                            {updateSpinnerLoading ? <Spinner /> : "Update Result"}
                        </button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default PublishResult;