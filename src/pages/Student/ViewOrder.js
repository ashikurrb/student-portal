import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import StudentMenu from './StudentMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';
import { Modal } from 'antd';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const ViewOrder = () => {
    const methods = [
        { name: "bKash", logo: "/images/paymentMethod/bKashLogo.png" },
        { name: "Rocket", logo: "/images/paymentMethod/rocketLogo.png" },
    ];
    const [orders, setOrders] = useState([]);
    const [spinnerLoading, setSpinnerLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const getOrder = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/order/user-order`);
            setOrders(data);
        } catch (error) {
            console.error("Error details:", error);
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("Something went wrong");
            }
        }
        finally {
            setSpinnerLoading(false);
        }
    };

    useEffect(() => {
        getOrder();
    }, []);

    const openModal = (order) => {
        setSelectedOrder(order);
        setVisible(true);
    };

    return (
        <Layout title={"Dashboard - Orders"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <StudentMenu />
                    </div>
                    <div className="col-md-9">
                        <h3 className="text-center my-4">
                            <i className="fa-solid fa-box"></i> Orders
                        </h3>
                        <div className="card mt-3 p-4 table-container">
                            {spinnerLoading ? (
                                <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "50vh" }}>
                                    <Spinner />
                                </div>
                            ) : (
                                <table className="table table-striped">
                                    <thead className='table-dark'>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Course</th>
                                            <th scope="col">Class Start</th>
                                            <th scope="col">Ordered On</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center">
                                                    <div className="my-5">
                                                        <h3 className='text-secondary'>
                                                            No Orders Found.
                                                            <br />
                                                            <p className='mt-3'>
                                                                Visit <Link to={"/view-courses"}><u>Courses</u></Link> to order.
                                                            </p>
                                                        </h3>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            orders.map((o, i) => {
                                                return (
                                                    <tr key={o._id}>
                                                        <th scope='row'>{i + 1}</th>
                                                        <td>
                                                            {o.status === 'Pending' ? (
                                                                <span className="badge bg-warning text-dark">{o?.status}</span>
                                                            ) : o?.status === 'Approved' ? (
                                                                <span className="badge bg-success">{o?.status}</span>
                                                            ) : o?.status === 'Canceled' ? (
                                                                <span className="badge bg-danger">{o?.status}</span>
                                                            ) : null}
                                                        </td>

                                                        <td>
                                                            <div style={{ cursor: "pointer" }} className='fw-bold text-primary' onClick={() => { openModal(o) }}>
                                                                {o?.course?.title}  <i className="fa-solid fa-arrow-right" />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {dayjs(o?.course?.dateRange).format("MMM DD, YYYY")}
                                                        </td>
                                                        <td>
                                                            {dayjs(o?.createdAt).format("MMM DD, YYYY hh:mm A")}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal style={{ top: 30 }} onCancel={() => setVisible(false)} open={visible} footer={null}>
                {selectedOrder && (
                    <>
                        <h5 className='text-center mb-3'>Course Details</h5>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">{selectedOrder?.course?.title}</h4>
                                        <p>Class Start: <b>{dayjs(selectedOrder?.course?.dateRange).format("MMM DD, YYYY")}</b></p>
                                        <p className="card-text">
                                            Price: <span className='fw-bold'>৳</span> {selectedOrder?.course?.price}
                                        </p>
                                        <p className="card-text">
                                            Payment Method:
                                            {methods.map((m) =>
                                                m.name === selectedOrder.method ? (
                                                    <div style={{ display: 'inline-flex', alignItems: 'center' }} key={m.name}>
                                                        <img
                                                            src={m.logo}
                                                            alt={m.name}
                                                            style={{ width: 20, height: 20, marginRight: 2 }}
                                                        />
                                                        {m.name}
                                                    </div>
                                                ) : null
                                            )}
                                        </p>

                                        <p className="card-text">Order Status: &nbsp;
                                            {selectedOrder.status === 'Pending' ? (
                                                <span className="badge bg-warning text-dark">{selectedOrder?.status}</span>
                                            ) : selectedOrder.status === 'Approved' ? (
                                                <span className="badge bg-success">{selectedOrder?.status}</span>
                                            ) : selectedOrder.status === 'Canceled' ? (
                                                <span className="badge bg-danger">{selectedOrder?.status}</span>
                                            ) : null}
                                        </p>
                                        <p className="card-text">Transaction ID: {selectedOrder?.trxId}</p>
                                        <p className="card-text">Account Number: {selectedOrder?.accNumber}</p>
                                        <p className="card-text">Ordered on: {dayjs(selectedOrder?.createdAt).format('MMM DD, YYYY hh:mm:ss A')}</p>
                                        {
                                            selectedOrder?.status === 'Approved' && (
                                                <div className='text-end'>
                                                    <Link className='fw-bold' to="/dashboard/student/view-payment">
                                                        <i className="fa-solid fa-file-invoice"></i> Check Invoice
                                                    </Link>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Modal>
        </Layout>
    );
};

export default ViewOrder;