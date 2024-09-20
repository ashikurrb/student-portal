import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import StudentMenu from './StudentMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';
import moment from 'moment';

const ViewOrder = () => {
    const [orders, setOrders] = useState([]);
    const [spinnerLoading, setSpinnerLoading] = useState(true);

    const getOrder = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/order/user-order`);
            setOrders(data);
        } catch (error) {
            console.log(error);
            toast.error("Error fetching orders");
        } finally {
            setSpinnerLoading(false);
        }
    };

    useEffect(() => {
        getOrder();
    }, []);
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
                            {spinnerLoading ? <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "50vh" }}><Spinner /></div> : <table className="table">
                                <thead className='table-dark'>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Course</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Method</th>
                                        <th scope="col">Trx Id</th>
                                        <th scope="col">Account</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        orders.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center">
                                                    <div className="my-5">
                                                        <h3 className='text-secondary'>No Orders Found</h3>
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
                                                                <span className="badge bg-warning text-dark">{o.status}</span>
                                                            ) : o.status === 'Approved' ? (
                                                                <span className="badge bg-success">{o.status}</span>
                                                            ) : o.status === 'Canceled' ? (
                                                                <span className="badge bg-danger">{o.status}</span>
                                                            ) : null}
                                                        </td>

                                                        <td>{o.course.title}</td>
                                                        <td>{o.course.price}</td>
                                                        <td>{o.method}</td>
                                                        <td>{o.trxId}</td>
                                                        <td>{o.accNumber}</td>
                                                    </tr>
                                                )
                                            })
                                        )
                                    }
                                </tbody>
                            </table>}

                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    );
};

export default ViewOrder;