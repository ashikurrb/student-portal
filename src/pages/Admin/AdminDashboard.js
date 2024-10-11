import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from './AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import { List } from 'antd';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [grades, setGrades] = useState([]);

    // Get all grades
    const getAllGrades = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/grade/all-grades`);
            if (data?.success) {
                setGrades(data?.grade);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Error fetching Grades');
        }
    };

    // Get all users
    const getAllUsers = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/all-users`);
            setUsers(data);
        } catch (error) {
            console.log(error);
            toast.error('Error fetching Users');
        }
    };

      // Calculate the student count for each grade
      const getStudentCountForGrade = (gradeId) => {
        return users.filter((user) => user.grade._id === gradeId).length;
    };

    useEffect(() => {
        getAllUsers();
        getAllGrades();
    }, []);

    return (
        <Layout title={"Dashboard - Admin Panel"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h4 className='text-center my-3'>Admin Dashboard</h4>
                        <div className="row m-2 card">
                            <div className="col-md-6 p-2">
                                <h5 className='text-center'>
                                    Total Students: {users.length} | Total Grades: {grades.length}
                                </h5>
                                <List>
                                    {grades.map((g) => (
                                        <List.Item className='px-2' key={g._id}>
                                            {g.name} - {getStudentCountForGrade(g._id)} Students
                                        </List.Item>
                                    ))}
                                </List>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;