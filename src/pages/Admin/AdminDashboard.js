import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import { Doughnut } from 'react-chartjs-2';
import AdminMenu from './AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import dayjs from 'dayjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

const AdminDashboard = () => {
    const [failedRegistration, setFailedRegistration] = useState([]);
    const [dashboardData, setDashboardData] = useState({});
    const [spinnerLoading, setSpinnerLoading] = useState(true);
    const [visible, setVisible] = useState(false);

    // Get all data
    const getDashboardData = async () => {
        setSpinnerLoading(true);
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/dashboard-data`);
            if (data) {
                setDashboardData(data);
                setSpinnerLoading(false);
            } else {
                toast.error("Error! Please reload the page");
            }
        } catch (error) {
            console.log(error);
        }
    };
    console.log(dashboardData);
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



    // Fetch data on component mount
    useEffect(() => {
        getDashboardData();
        getFailedRegistration();
    }, []);

    // Register required Chart.js components
    ChartJS.register(ArcElement, Tooltip, Legend);

    const chartData = {
        labels: dashboardData?.totalUserbyGrade?.map(
            (grade) => `${grade._id} (${grade.total})` // Combine grade name and student count
        ),
        datasets: [
            {
                label: "Students",
                data: dashboardData?.totalUserbyGrade?.map((grade) => grade?.total), // Extract total count for each grade
                backgroundColor: [
                    "blue", "green", "red", "orange", "purple",
                    "yellow", "pink", "brown", "gray", "black"
                ], // Colors for each grade
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
                            <div class="col-md-6 p-3 card order-2 order-md-1">
                                <div className="d-flex">
                                    <div className='m-1 w-100'>
                                        {
                                            failedRegistration.length > 0 ?
                                                <div className="card shadow" onClick={() => setVisible(true)} style={{ cursor: 'pointer' }}>
                                                    <h4 className='text-success m-3 text-center'>
                                                        <i className="fa-solid fa-circle-exclamation" style={{ marginRight: "8px" }} />
                                                        Failed:&nbsp;
                                                        <span className='badge text-bg-danger'>
                                                            {failedRegistration?.length}
                                                        </span>
                                                    </h4>
                                                </div>
                                                : ''}
                                    </div>
                                    <div className='m-1 w-100'>
                                        <Link to={dashboardData?.totalPendingOrder > 0 ? '/dashboard/admin/order-list' : ''}>
                                            {
                                                dashboardData?.totalPendingOrder > 0 &&
                                                <div className="card shadow">
                                                    <h4 className='text-success m-3 text-center'>
                                                        <i className="fa-solid fa-clock" style={{ marginRight: "8px" }} />
                                                        Pending: &nbsp;
                                                        <span className='badge text-bg-danger'>
                                                            {dashboardData.totalPendingOrder}
                                                        </span>
                                                    </h4>
                                                </div>
                                            }
                                        </Link>
                                    </div>
                                </div>
                                <hr />
                                <div className="d-flex">
                                    <div className="card m-1 shadow w-100">
                                        <h4 className='text-success m-3 text-center'>
                                            <i className="fa-solid fa-graduation-cap" style={{ marginRight: "8px" }} />
                                            Grades</h4>
                                        <h2 className='mx- text-center'>{dashboardData.totalGrade}</h2>
                                    </div>
                                    <div className="card m-1 shadow w-100">
                                        <h4 className='text-success m-3 text-center'>
                                            <i className="fa-solid fa-users" style={{ marginRight: "8px" }} />
                                            Users</h4>
                                        <h2 className='mx- text-center'>{dashboardData.totalUser}</h2>
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <div className="card m-1 shadow w-100">
                                        <h4 className='text-success m-3 text-center'>
                                            <i className="fa-solid fa-credit-card" style={{ marginRight: "8px" }} />
                                            Total Payment</h4>
                                        <h2 className='mx- text-center'>{dashboardData.totalPaymentReceived} TK</h2>
                                    </div>
                                    <div className="card m-1 shadow w-100">
                                        <h4 className='text-success m-3 text-center'>
                                            <i className="fa-solid fa-credit-card" style={{ marginRight: "8px" }} />
                                            {dashboardData.currentMonth}</h4>
                                        <h2 className='mx- text-center'>{dashboardData.totalCurrentMonthPayment} TK</h2>
                                    </div>

                                </div>
                                <div className="d-flex">
                                    <div className="card m-1 shadow w-100">
                                        <h4 className='text-success m-3 text-center'>
                                            <i className="fa-solid fa-book" style={{ marginRight: "8px" }} />
                                            Courses</h4>
                                        <h2 className='mx- text-center'>{dashboardData.totalCourse}</h2>
                                    </div>
                                    <div className="card m-1 shadow w-100">
                                        <h4 className='text-success m-3 text-center'>
                                            <i className="fa-solid fa-credit-card" style={{ marginRight: "8px" }} />
                                            Sell</h4>
                                        <h2 className='mx- text-center'>{dashboardData.totalOrderSell} TK</h2>
                                    </div>

                                </div>
                                <hr />
                                <div className="d-flex">
                                    <div className="card m-1 shadow w-100">
                                        <h4 className='text-success m-3 text-center'>
                                            <i className="fa-solid fa-box" style={{ marginRight: "8px" }} />
                                            Orders</h4>
                                        <h2 className='text-center'>{dashboardData.totalOrder}</h2>
                                    </div>
                                    <div className="card m-1 shadow w-100">
                                        <h4 className='text-success m-3 text-center'>
                                            <i className="fa-brands fa-sellsy" style={{ marginRight: "8px" }} />
                                            Sell</h4>
                                        <h2 className='text-center'>{dashboardData.totalOrderSell} TK</h2>
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <div className="card m-1 shadow w-100">
                                        <h4 className='text-success m-3 text-center'>
                                            <i className="fa-solid fa-thumbs-up" style={{ marginRight: "8px" }} />
                                            Approved</h4>
                                        <h2 className='text-center'>{dashboardData.totalApprovedOrder}</h2>
                                    </div>
                                    <div className="card m-1 shadow w-100">
                                        <Link to={dashboardData?.totalPendingOrder > 0 ? '/dashboard/admin/order-list' : ''}>
                                            <h4 className='text-success m-3 text-center'>
                                                <i className="fa-solid fa-ban" style={{ marginRight: "8px" }} />
                                                Canceled</h4>
                                            <h2 className='text-center'>{dashboardData.totalCanceledOrder}</h2>
                                        </Link>
                                    </div>

                                </div>
                            </div>

                            <div className="col-md-6 p-3 card order-md-2 order-1">  
                                {spinnerLoading ? (
                                    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "50vh" }}>
                                        <Spinner />
                                    </div>
                                ) : (
                                    <>
                                        <h5 className='text-center'>Student Count</h5>
                                        <Doughnut data={chartData} />
                                        {/* <ol style={{ maxHeight: 400, overflow: 'auto', listStyleType: 'decimal', padding: 0 }}>
                                            {dashboardData.totalUserbyGrade.map((g, i) => (
                                                <li key={g?._id}>
                                                    <b> {i + 1}. </b> {g?._id}: &nbsp;
                                                    <span className='badge text-bg-dark fs-5'>
                                                        {g?.total}
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