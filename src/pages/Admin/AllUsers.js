import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from '../../pages/Admin/AdminMenu';
import { useAuth } from '../../context/auth';
import Spinner from '../../components/Spinner'; import axios from 'axios';
import toast from 'react-hot-toast';
import moment from "moment";
import { SearchOutlined } from '@ant-design/icons';
import { Modal, Select, Alert, Tooltip, Input } from 'antd';
const { Option } = Select;

const AllUsers = () => {
    const [auth, setAuth] = useAuth();
    const [users, setUsers] = useState([]);
    const [grades, setGrades] = useState([]);
    const [updatedGrade, setUpdatedGrade] = useState('');
    const [spinnerLoading, setSpinnerLoading] = useState(true);
    const [updateSpinnerLoading, setUpdateSpinnerLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    //Get All Grades
    const getAllGrades = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/grade/all-grades`);
            if (data?.success) {
                setGrades(data?.grade);
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error("Error fetching Grades");
        }
    };
    useEffect(() => {
        getAllGrades();
    }, []);

    //get all users
    const getAllUsers = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/all-users`)
            setUsers(data)
        } catch (error) {
            console.log(error);
            toast.error("Error fetching Users");
        } finally {
            setSpinnerLoading(false)
        }
    }
    useEffect(() => {
        if (auth?.token) getAllUsers();
    }, [auth?.token])

    //update user grade
    const handleUpdate = async (e) => {
        setUpdateSpinnerLoading(true);
        e.preventDefault();
        try {
            const updatedGradeData = new FormData();
            updatedGradeData.append("grade", updatedGrade);
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/auth/user-grade/${selected._id}`, updatedGradeData);
            setUpdateSpinnerLoading(false);
            if (data?.success) {
                toast.success(data?.message);
                getAllUsers();
                // Clear form fields after submit
                setUpdatedGrade("");
                setVisible(false)
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
    const openModal = (users) => {
        setVisible(true);
        setSelected(users);
        setUpdatedGrade(users.grade.name);
    }

    //delete users
    const handleDelete = async (uId) => {
        let answer = window.confirm("Are you sure want to delete this user? Payment & Result Data of this user will also be deleted.")
        if (!answer) return;
        const loadingToastId = toast.loading('Deleting user...');
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/auth/delete-user/${uId}`);
            if (data.success) {
                toast.success(data.message, { id: loadingToastId });
                getAllUsers();
            } else {
                toast.error(data.message, { id: loadingToastId });
            }
        } catch (error) {
            toast.error('Something wrong while Delete', { id: loadingToastId })
        }
    }

    // Filter content based on search query
    const filteredUser = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.grade.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle Escape key functionality
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                // Clear search bar
                setSearchQuery('');
                // Clear selected content
                setSelected([]);
            }
        };
        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);

    return (
        <Layout title={"Admin - User's List"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3"><AdminMenu /></div>
                    <div className="col-md-9">
                        <h2 className='text-center my-4'>
                            <i class="fa-solid fa-users"></i> All User's List ({users?.length})
                        </h2>
                        <div className="d-flex justify-content-center">
                            <Alert
                                className='m-2 col-md-4'
                                message={
                                    <>
                                        <b>Click on Grade value to update user's grade</b>
                                    </>
                                }
                                type="info"
                                showIcon
                            />
                        </div>
                        <div className="d-flex justify-content-end">
                            <Input
                                allowClear={true}
                                type="text"
                                prefix={<SearchOutlined />}
                                placeholder='Search'
                                size='large'
                                style={{ flexBasis: '50%' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <h6 className='justify-content-start'> Count: {filteredUser.length}</h6>
                        {spinnerLoading ? <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "50vh" }}><Spinner /></div> : <div className="table-container">
                            <table className='table table-fixed-header'>
                                <thead className='table-dark'>
                                    <tr>
                                        <th scope='col' className='ps-3'>#</th>
                                        <th scope='col'>Name</th>
                                        <th scope='col'>Grade</th>
                                        <th scope='col'>Email</th>
                                        <th scope='col'>Phone</th>
                                        <th scope='col'>Answer</th>
                                        <th scope='col'>Role</th>
                                        <th scope='col'>Time</th>
                                        <th scope='col'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUser.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" className="text-center">
                                                <div className="my-5">
                                                    <h3 className='text-secondary'>No User Found</h3>
                                                    {searchQuery && (
                                                        <button
                                                            onClick={() => setSearchQuery('')}
                                                            className="btn btn-warning mt-2 fw-bold"
                                                        >
                                                            <i className="fa-solid fa-xmark"></i> Reset Search
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (

                                        filteredUser.map((u, i) => {
                                            return (
                                                <tr>
                                                    <th scope='row' className='ps-3'>{i + 1}</th>
                                                    <td className=''>
                                                        <div className="d-flex align-items-center">
                                                            <img style={{ width: "27px", height: "27px", borderRadius: "100%" }}
                                                                className='border mx-2' src={u?.avatar} alt="dp" />
                                                            {u.name}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <Tooltip title="Click here to update grade">
                                                            <button className="btn px-0 d-flex justify-content-between align-items-center w-100"
                                                                onClick={() => { openModal(u) }}
                                                                disabled={u?.grade?.name === "Administration"}>
                                                                <span className='text-start'>
                                                                    {u?.grade?.name}
                                                                </span>
                                                                <span className='text-end'>                                                <i className="fa-solid fa-caret-down"></i>
                                                                </span>
                                                            </button>
                                                        </Tooltip>
                                                    </td>
                                                    <td className='text-wrap'>{u.email}</td>
                                                    <td>{u.phone}</td>
                                                    <td>{u.answer}</td>
                                                    <td >
                                                        {
                                                            u.role === 0 ? <span class="badge text-bg-success">Student</span> : u.role === 1 ? <span class="badge text-bg-warning">Admin</span> : <span class="badge text-bg-danger">{u.role}</span>
                                                        }
                                                    </td>
                                                    <td>{moment(u?.createdAt).format('lll')}</td>
                                                    <td>
                                                        {
                                                            u.role === 1 ? <span class="badge text-bg-info">Restricted</span> : (
                                                                <button className="btn btn-danger fw-bold ms-1" onClick={() => handleDelete(u._id)}><i class="fa-solid fa-trash-can"></i>  Delete</button>
                                                            )
                                                        }
                                                    </td>
                                                    <Modal
                                                        visible={visible}
                                                        onCancel={() => setVisible(false)}
                                                        footer={null}>
                                                        <h5 className='text-center'>User Grade Upgrading</h5>
                                                        <Alert
                                                            className='m-3'
                                                            message={
                                                                <>
                                                                    <p>Changing users <b>Grade</b> will alter their access to the available content</p>
                                                                </>
                                                            }
                                                            type="warning"
                                                            showIcon
                                                        />
                                                        <div className='text-center my-2'>
                                                            {
                                                                <div className='text-center my-3'>
                                                                    <b>{selected?.name} - {selected?.grade?.name}</b>
                                                                </div>
                                                            }
                                                        </div>
                                                        <Select 
                                                        className='w-100 justify-content-center'
                                                            placeholder="Select Grade"
                                                            size='large'
                                                            value={updatedGrade}
                                                            onChange={(value) => { setUpdatedGrade(value) }}>
                                                            {grades?.map(g => (
                                                                <Option key={g._id}
                                                                    value={g._id}
                                                                    disabled={g?.name === "Administration"}>
                                                                    {g.name}
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                        <div className='text-center mt-3'>
                                                            <button onClick={handleUpdate} className="btn btn-warning fw-bold">
                                                                {updateSpinnerLoading ? <Spinner /> : "Update Grade"}
                                                            </button>
                                                        </div>
                                                    </Modal>
                                                </tr>
                                            )
                                        })
                                    )}
                                </tbody>
                            </table>

                        </div>}
                    </div>
                </div>
            </div>
        </Layout >
    );
};

export default AllUsers;