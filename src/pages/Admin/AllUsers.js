import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from '../../pages/Admin/AdminMenu';
import { useAuth } from '../../context/auth';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from "moment";
import Spinner from '../../components/Spinner';


const Users = () => {
    const [auth, setAuth] = useAuth();
    const [users, setUsers] = useState([]);
    const [spinnerLoading, setSpinnerLoading] = useState(true);

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

    //delete users
    const handleDelete = async (uId) => {
        try {
            let answer = window.confirm("Are you sure want to delete this user?")
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
                                                    <td>{u.grade}</td>
                                                    <td>{u.email}</td>
                                                    <td>{u.phone}</td>
                                                    <td>{u.answer}</td>
                                                    <td >
                                                        {
                                                            u.role === 0 ? <span class="badge text-bg-success">Student</span> : u.role === 1 ? <span class="badge text-bg-warning">Admin</span> : <span class="badge text-bg-danger">{u.role}</span>
                                                        }

                                                    </td>
                                                    <td>{moment(u?.createdAt).fromNow()}</td>
                                                    <td>
                                                        {
                                                            u.role === 1 ? <span class="badge text-bg-info">Restricted</span> : (
                                                                <button className="btn btn-danger fw-bold ms-1" onClick={() => handleDelete(u._id)}>Delete</button>
                                                            )
                                                        }
                                                    </td>
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