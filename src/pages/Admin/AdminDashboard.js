import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from './AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import { List } from 'antd';
import Spinner from '../../components/Spinner';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [grades, setGrades] = useState([]);
    const [courses, setCourses] = useState([]);
    const [payment, setPayment] = useState([]);
    const [spinnerLoading, setSpinnerLoading] = useState(true);

    // Get all grades
    const getAllGrades = async () => {
        setSpinnerLoading(true);
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/grade/all-grades`);
            if (data?.success) {
                setGrades(data?.grade);
                setSpinnerLoading(false);
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

    // Get all courses
    const getAllCourses = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/course/all-courses`);
            setCourses(data);
        } catch (error) {
            console.log(error);
            toast.error("Error fetching all courses");
        }
    };

    // Get all payment list
    const getAllPayment = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/payment/all-payment`);
            setPayment(data);
        } catch (error) {
            console.log(error);
            toast.error("Error fetching Payments");
        }
    };

    // Calculate the student count for each grade
    const getStudentCountForGrade = (gradeId) => {
        return users.filter((user) => user.grade._id === gradeId).length;
    };

    // Total payment amount calculation
    const totalAmount = payment.reduce((sum, p) => sum + p.amount, 0);

    // Calculate the total payment amount for the current month
    const getMonthlyPaymentTotal = () => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Filter payments created in the current month
        const monthlyPayments = payment.filter((p) => {
            const currentPay = new Date(p.paymentDate);
            return currentPay.getMonth() === currentMonth && currentPay.getFullYear() === currentYear;
        });

        // Sum up the total amount for the current month
        return monthlyPayments.reduce((sum, p) => sum + p.amount, 0);
    };

    // Fetch data on component mount
    useEffect(() => {
        getAllUsers();
        getAllGrades();
        getAllCourses();
        getAllPayment();
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
                        <div className="row m-2">
                            <div className="col-md-6 p-3 card">
                                <h5 className='py-1'>Total Grades: <u>{grades.length}</u></h5>
                                <h5 className='py-1'>Total Students: <u>{users.length}</u></h5>
                                <h5 className='py-1'>Total Courses: <u>{courses.length}</u></h5>
                                <h5 className='py-1'>Total Payment Received: {totalAmount} Tk</h5>
                                <h5 className='py-1'>This Month Payment: <u>{getMonthlyPaymentTotal()}</u> Tk</h5>
                            </div>
                            <div className="col-md-6 px-3 card">
                                {spinnerLoading ? (
                                    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "50vh" }}>
                                        <Spinner />
                                    </div>
                                ) : (
                                    <List>
                                    {grades.map((g) => {
                                      const studentCount = getStudentCountForGrade(g._id);
                                      return (
                                        <List.Item className="px-2" key={g._id}>
                                          {g.name} -{" "}
                                          <span
                                            style={{
                                              fontWeight: studentCount > 0 ? "bold" : "normal",
                                              textDecoration: studentCount > 0 ? "underline" : "none",
                                            }}
                                          >
                                            {studentCount}
                                          </span>{" "}
                                          Students
                                        </List.Item>
                                      );
                                    })}
                                  </List>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;