import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from './AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import dayjs from 'dayjs';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";


const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [failedRegistration, setFailedRegistration] = useState([]);
    const [grades, setGrades] = useState([]);
    const [courses, setCourses] = useState([]);
    const [payment, setPayment] = useState([]);
    const [orders, setOrders] = useState([]);
    const [spinnerLoading, setSpinnerLoading] = useState(true);
    const [visible, setVisible] = useState(false);

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

    // Get failed registration
    const getFailedRegistration = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/failed-user`);
            setFailedRegistration(data);
        } catch (error) {
            console.log(error);
        }
    };

    // Get failed registration
    const deleteFailedRegistration = async (uId) => {
        let answer = window.confirm("Are you sure want to delete?")
        if (!answer) return;
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/auth/delete-failed/${uId}`);
            if (data?.message) {
                toast.success(data?.message);
                getFailedRegistration();
            }
        } catch (error) {
            toast.error('Something wrong while delete');
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
        return users.filter((user) => user?.grade?._id === gradeId).length;
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
        getFailedRegistration();
    }, []);

    // Register required Chart.js components
    ChartJS.register(ArcElement, Tooltip, Legend);

    const chartData = {
        labels: grades.map(
            (grade) => `${grade.name} (${getStudentCountForGrade(grade._id)})` // Combine grade name and student count
        ),
        datasets: [
            {
                label: "Students",
                data: grades.map((grade) => getStudentCountForGrade(grade._id)),
                backgroundColor: ["blue", "green", "red", "orange", "purple", "yellow", "pink", "brown", "gray", "black"],
            },
        ],
    };

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
                                        <li className="py-1 h5">Total Grades: <u>{grades?.length}</u></li>
                                        <li className="py-1 h5">Total Students: <u>{users?.length}</u></li>
                                        {
                                            failedRegistration.length > 0 ?
                                                <li onClick={() => setVisible(true)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                                    className="py-1 h5 text-danger">Total Failed Registration:&nbsp;
                                                    <u>{failedRegistration.length}</u>
                                                </li> : ''}
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
                                        <Doughnut data={chartData} />
                                        {/* <ol style={{ maxHeight: 400, overflow: 'auto', listStyleType: 'decimal', padding: 0 }}>
                                            {grades?.filter((g) => getStudentCountForGrade(g?._id) > 0).map((g, i) => (
                                                <li key={g?._id}>
                                                    <b> {i + 1}. </b> {g?.name}: &nbsp;
                                                    <span className='badge text-bg-dark fs-5'>
                                                        {getStudentCountForGrade(g?._id)}
                                                    </span>
                                                    <hr />
                                                </li>
                                            ))}
                                        </ol> */}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                style={{ top: 30 }}
                onCancel={() => setVisible(false)}
                open={visible && failedRegistration.length > 0}
                footer={null}>
                <h5 className='text-center mb-3'>Failed Registration List</h5>
                <table className='table'>
                    <thead className='table-dark'>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Email</th>
                            <th scope="col">Tried At</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {failedRegistration.map((f, i) => (
                            <tr key={i}>
                                <th>{i + 1}</th>
                                <td>{f.email}</td>
                                <td>{dayjs(f.createdAt).format('DD-MMM-YYYY hh:mm A')}</td>
                                <td>
                                    <button className="btn btn-danger fw-bold ms-1" onClick={() => deleteFailedRegistration(f._id)}>
                                        <i className="fa-solid fa-trash-can" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Modal>
        </Layout>
    );
};

export default AdminDashboard;