import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from './AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import { List } from 'antd';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [grades, setGrades] = useState([]);
    const [courses, setCourses] = useState([]);
    const [payment, setPayment] = useState([]);
    const [orders, setOrders] = useState([]);
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
                toast.error("Error! Please reload the page");
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Get all users
    const getAllUsers = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/all-users`);
            setUsers(data);
        } catch (error) {
            console.log(error);
        }
    };

    // Get all courses
    const getAllCourses = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/course/all-courses`);
            setCourses(data);
        } catch (error) {
            console.log(error);
        }
    };

    // Get all payment list
    const getAllPayment = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/payment/all-payment`);
            setPayment(data);
        } catch (error) {
            console.log(error);
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

    // Get current month name
    const getCurrentMonthName = () => {
        const currentDate = new Date();
        return currentDate.toLocaleString('default', { month: 'long' });
    };

    //Get All Order
    const getOrderList = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/order/all-order`);
            setOrders(data);
        } catch (error) {
            console.log(error);
        }
    };

    // Total sell
    const totalSellAmount = orders
        .filter((o) => o.status === 'Approved')
        .reduce((sum, o) => sum + (o?.course?.price || 0), 0);

    //get pending order count
    const getPendingOrderCount = () => {
        return orders.filter((order) => order.status === 'Pending').length;
    }

    //get approved order count
    const getApprovedOrderCount = () => {
        return orders.filter((order) => order.status === 'Approved').length;
    }

    //get canceled order count
    const getCanceledOrderCount = () => {
        return orders.filter((order) => order.status === 'Canceled').length;
    }

    // Fetch data on component mount
    useEffect(() => {
        getAllUsers();
        getAllGrades();
        getAllCourses();
        getAllPayment();
        getOrderList();
    }, []);

    return (
        <Layout title={"Dashboard - Admin Panel"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h4 className='text-center my-3'>
                            <i className="fa-solid fa-gauge" /> Dashboard
                        </h4>
                        <div className="row m-2">
                            <div class="col-md-6 p-3 card">
                                <div>
                                    <ul className="mb-3">
                                        <li className="py-1 h5">Total Grades: <u>{grades.length}</u></li>
                                        <li className="py-1 h5">Total Students: <u>{users.length}</u></li>
                                        <li className="py-1 h5">Total Courses: <u>{courses.length}</u></li>
                                    </ul>
                                    <ul className="mb-3">
                                        <li className="py-1 h5">Total Payment Received: {totalAmount} Tk</li>
                                        <li className="py-1 h5">{getCurrentMonthName()} Payment: <u>{getMonthlyPaymentTotal()}</u> Tk</li>
                                    </ul>
                                </div>


                                <div>
                                    <h5 className="py-1">Orders Summary</h5>
                                    <ul>
                                        <li>Total Orders: <u>{orders.length}</u></li>
                                        <Link to={getPendingOrderCount() > 0 ? '/dashboard/admin/order-list' : ''}>
                                            {
                                                getPendingOrderCount() > 0 &&
                                                <li> <span className='text-danger fw-bold fs-5'>
                                                    Pending: <span className='badge text-bg-danger'>{getPendingOrderCount()}</span>
                                                </span>
                                                </li>
                                            }
                                        </Link>
                                        <li className='text-info'>Canceled: <u>{getCanceledOrderCount()}</u></li>
                                        <li className='text-success'>Approved: <u>{getApprovedOrderCount()}</u></li>
                                        <li>Total Sell: <b><u>{totalSellAmount}</u></b> Tk</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-md-6 p-3 card">
                                {spinnerLoading ? (
                                    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "50vh" }}>
                                        <Spinner />
                                    </div>
                                ) : (
                                    <>
                                        <h5 className='text-center'>Student Count</h5>
                                        <ol style={{ maxHeight: 400, overflow: 'auto', listStyleType: 'decimal', padding: 0 }}>
                                            {grades.filter((g) => getStudentCountForGrade(g._id) > 0).map((g, i) => (
                                                <li key={g._id}>
                                                    <b> {i + 1}. </b> {g.name}: &nbsp;
                                                    <span className='badge text-bg-dark'>
                                                        {getStudentCountForGrade(g._id)}
                                                    </span>
                                                    <hr />
                                                </li>
                                            ))}
                                        </ol>
                                    </>
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