import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from './AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';
import { Image } from 'antd';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [spinnerLoading, setSpinnerLoading] = useState(true);
    const [updateSpinnerLoading, setUpdateSpinnerLoading] = useState(false);
    const [selected, setSelected] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    //Get All Order
    const getOrderList = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/order/all-order`);
            setOrders(data);
            setSpinnerLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Error fetching Grades");
            setSpinnerLoading(false);
        }
    };
    useEffect(() => {
        getOrderList();
    }, []);

    //delete individual order
    const handleDelete = async (oId) => {
        let answer = window.confirm("Are you sure want to delete this order?")
        if (!answer) return;
        const loadingToastId = toast.loading('Deleting order...');
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/order/delete-order/${oId}`);
            if (data.success) {
                toast.success(data.message, { id: loadingToastId });
                getOrderList();
            } else {
                toast.error(data.message, { id: loadingToastId })
            }
        } catch (error) {
            toast.error('Something wrong while delete', { id: loadingToastId })
        }
    }


    return (
        <Layout title={"Admin - Orders List"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3"><AdminMenu /></div>
                    <div className="col-md-9">
                        <h2 className="text-center my-4 mb-md-5">
                            <i class="fa-solid fa-box"></i> Order List
                        </h2>
                        {spinnerLoading ? <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "50vh" }}><Spinner /></div> : <div className="table-container">
                            <table className='table table-fixed-header'>
                                <thead className='table-dark'>
                                    <tr>
                                        <th scope='col' className='ps-3'>#</th>
                                        <th scope='col'>Status</th>
                                        <th scope='col'>User</th>
                                        <th scope='col'>Course</th>
                                        <th scope='col'>Price</th>
                                        <th scope='col'>Method</th>
                                        <th scope='col'>Trx Id</th>
                                        <th scope='col'>Account</th>
                                        <th scope='col'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" className="text-center">
                                                <div className="my-5">
                                                    <h3 className='text-secondary'>No Order Found</h3>
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

                                        orders.map((o, i) => {
                                            return (
                                                <tr>
                                                    <th scope='row' className='ps-3'>{i + 1}</th>
                                                    <td>
                                                        {o.status}
                                                    </td>
                                                    <td>
                                                        {o.buyer.name}
                                                    </td>
                                                    <td >{o.course.title}</td>
                                                    <td>{o.course.price}</td>
                                                    <td>{o.method}</td>
                                                    <td>{o.trxId}</td>
                                                    <td>{o.accNumber}</td>
                                                    <td>
                                                        <button className="btn btn-danger fw-bold ms-1" onClick={() => handleDelete(o._id)}>
                                                            <i class="fa-solid fa-trash-can"></i>  Delete
                                                        </button>
                                                    </td>
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
        </Layout>
    );
};

export default OrderList;