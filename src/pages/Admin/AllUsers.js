import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from '../../pages/Admin/AdminMenu';
import { useAuth } from '../../context/auth';
import Spinner from '../../components/Spinner'; import axios from 'axios';
import toast from 'react-hot-toast';
import moment from "moment";
import { Modal, Select, Alert, Tooltip } from 'antd';
const { Option } = Select;



const Users = () => {
    const [auth, setAuth] = useAuth();
    const [users, setUsers] = useState([]);
    const [grades, setGrades] = useState([]);
    const [grade, setGrade] = useState('');
    const [updatedGrade, setUpdatedGrade] = useState('');
    const [spinnerLoading, setSpinnerLoading] = useState(true);
    const [updateSpinnerLoading, setUpdateSpinnerLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState({});
    const [user, setUser] = useState('');
    const [userId, setUserId] = ([]);

    //Get All Grades
    const getAllGrades = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/grade/all-grades`);
            if (data?.success) {
                setGrades(data?.grade);
            }
        } catch (error) {
            console.log(error);
            toast.error("Getting error while fetching Grade");
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
                toast.success("User's Grade Updated Successfully");
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
        setUpdatedGrade(users.grade.name)
    }

    //delete users
    const handleDelete = async (uId) => {
        try {
            let answer = window.confirm("Are you sure want to delete this user? Payment & Result Data of this user will also be deleted.")
            if (!answer) return;
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/auth/delete-user/${uId}`);
            if (data.success) {
                toast.success(`User deleted successfully`);
                getAllUsers();
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Something wrong while Delete')
        }
    }

    return (
        <Layout title={"Admin - User's List"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3"><AdminMenu /></div>
                    <div className="col-md-9">
                        <h2 className='text-center my-3'>All User's List ({users?.length})</h2>
                        <div className="w-50 align-items-center"><Alert
                            className='my-2 mx-4'
                            message="Click on Grade name to update user's grade."
                            type="info"
                            showIcon
                        /></div>
                        {spinnerLoading ? <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "50vh" }}><Spinner /></div> : <div className="table-container">
                            <table className='table'>
                                <thead className='table-dark'>
                                    <tr>
                                        <th scope='col'>#</th>
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

                                    {
                                        users.map((u, i) => {
                                            return (

                                                <tr>
                                                    <th scope='row'>{i + 1}</th>
                                                    <td>{u.name}</td>
                                                    <td>
                                                        <Tooltip title="Click here to update grade">
                                                            <button className='btn border' onClick={() => { openModal(u) }}>{u?.grade?.name}</button>
                                                        </Tooltip>
                                                    </td>
                                                    <td>{u.email}</td>
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
                                                    <Modal onCancel={() => setVisible(false)} onOk={handleUpdate} visible={visible}>
                                                        <h5 className='text-center'>User Grade Upgrading</h5>
                                                        <Alert
                                                            className='m-3'
                                                            message="Changing grade of user will change his access to the available content"
                                                            type="warning"
                                                            showIcon
                                                        />
                                                        <div className='text-center my-2'>
                                                            {selected && (
                                                                <div className='text-center my-3'>
                                                                    <p>Student Name: <b>{selected.name}</b></p>
                                                                    <p>Current Grade: <b>{selected?.grade?.name}</b></p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <Select bordered={false}
                                                            placeholder="Select Grade"
                                                            size='large'
                                                            className='form-select m-2'
                                                            value={updatedGrade}
                                                            onChange={(value) => { setUpdatedGrade(value) }}>
                                                            {grades?.map(g => (
                                                                <Option key={g._id} value={g._id}>{g.name}</Option>
                                                            ))}
                                                        </Select>
                                                    </Modal>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>

                        </div>}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Users;