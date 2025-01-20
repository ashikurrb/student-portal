import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from './AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';
import { EyeOutlined } from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import { Image, Input, Modal, Select, Spin } from 'antd';
import dayjs from 'dayjs';
const { Option } = Select;

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [statuses] = useState(["Pending", "Approved", "Canceled"]);
    const [listSpinnerLoading, setListSpinnerLoading] = useState(true);
    const [statusUpdateLoading, setStatusUpdateLoading] = useState(null);
    const [visible, setVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalOrder, setModalOrder] = useState(null);
    const methods = [
        { name: "bKash", logo: "/images/paymentMethod/bKashLogo.png" },
        { name: "Rocket", logo: "/images/paymentMethod/rocketLogo.png" },
    ];

    //Get All Order
    const getOrderList = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/order/all-order`);
            setOrders(data);
            setListSpinnerLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Error fetching Grades");
            setListSpinnerLoading(false);
        }
    };
    useEffect(() => {
        getOrderList();
    }, []);

    //order status change
    const handleChange = async (oId, value) => {
        setStatusUpdateLoading(oId);
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/order/order-status/${oId}`, { status: value });
            toast.success(data.message)
            setStatusUpdateLoading(null);
            getOrderList();
        } catch (error) {
            console.error(error);
            toast.error("Error update status");
            setStatusUpdateLoading(null);
        }
    }

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
            toast.error('Something wrong during delete', { id: loadingToastId })
        }
    }

    // Filter order based on search query
    const filteredOrder = orders.filter(o =>
        o?.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o?.buyer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o?.course?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o?.accNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o?.trxId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o?.buyer?.grade?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    //total sell amount calculate
    const totalAmount = filteredOrder.reduce((sum, o) => sum + o?.course?.price, 0);

    //delete selected order
    const handleDeleteSelected = async (rId) => {
        let answer = window.confirm("Are you sure want to delete the selected order?")
        if (!answer) return;
        const loadingToastId = toast.loading('Deleting order...');
        try {
            await Promise.all(selectedOrder.map(async (rId) => {
                await axios.delete(`${process.env.REACT_APP_API}/api/v1/order/delete-order/${rId}`);
            }));
            toast.success('Selected order deleted successfully', { id: loadingToastId });
            setSelectedOrder([]);
            getOrderList();
        } catch (error) {
            toast.error('Something wrong while Delete', { id: loadingToastId })
        }
    }

    // Handle selecting all content
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allOrderIds = filteredOrder.map(r => r._id);
            setSelectedOrder(allOrderIds);
        } else {
            setSelectedOrder([]);
        }
    };

    // Handle selecting individual content
    const handleSelectOrder = (oId) => {
        if (selectedOrder.includes(oId)) {
            setSelectedOrder(selectedOrder.filter(id => id !== oId));
        } else {
            setSelectedOrder([...selectedOrder, oId]);
        }
    };

    // Handle Escape key functionality
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                // Clear search bar
                setSearchQuery('');
                // Clear selected content
                setSelectedOrder([]);
            }
        };
        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);

    const openModal = (order) => {
        setModalOrder(order);
        setVisible(true);
    };

    const handlePrint = () => {
        const content = document.getElementById('printable-content').innerHTML;
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .card { border: none; }
                        .badge { padding: 5px 10px; border-radius: 5px; }
                    </style>
                </head>
                <body>${content}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };


    return (
        <Layout title={"Admin - Orders List"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3"><AdminMenu /></div>
                    <div className="col-md-9">
                        <h2 className="text-center my-4 mb-md-5">
                            <i className="fa-solid fa-box" /> Order List ({orders.length})
                        </h2>
                        <div className="d-flex justify-content-end mb-3">
                            <Input
                                allowClear={true}
                                type="text"
                                prefix={
                                    <span style={{ paddingRight: '4px' }}>
                                        <SearchOutlined />
                                    </span>
                                }
                                placeholder='Search'
                                size='large'
                                style={{ flexBasis: '50%' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {selectedOrder.length > 0 && (
                            <button onClick={handleDeleteSelected} className="btn btn-danger fw-bold mx-1 py-2 floating-delete-button">
                                <i className="fa-solid fa-trash-can"></i> Delete Selected
                            </button>
                        )}
                        <h6 className='d-flex justify-content-between'>
                            <span>
                                {
                                    selectedOrder.length > 0 ?
                                        <h6 className='justify-content-start'> {selectedOrder.length} selected</h6> :
                                        <h6 className='justify-content-start'> Count: {filteredOrder.length}</h6>
                                }
                            </span>
                            <span>
                                <h6 className='justify-content-start'> Total: {totalAmount} TK</h6>
                            </span>
                        </h6>
                        <div className='table-container'>
                            {
                                listSpinnerLoading ? <div className="m-5 text-center">
                                    <Spinner /><p>Loading orders...</p>
                                </div> :
                                    <table className="table table-fixed-header table-hover">
                                        <thead className='table-dark'>
                                            <tr>
                                                <th className='ps-4'>
                                                    <input
                                                        className='form-check-input'
                                                        type="checkbox"
                                                        onChange={handleSelectAll}
                                                        checked={selectedOrder.length === filteredOrder.length && filteredOrder.length > 0}
                                                    />
                                                </th>
                                                <th scope='col' className='ps-3'>#</th>
                                                <th scope='col'>Status</th>
                                                <th scope='col'>User</th>
                                                <th scope='col'>Course</th>
                                                <th scope='col'>Price</th>
                                                <th scope='col'>Method</th>
                                                <th scope='col'>Trx Id</th>
                                                <th scope='col'>Account</th>
                                                <th scope='col'>Time</th>
                                                <th scope='col'>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                filteredOrder.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="11" className="text-center">
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
                                                    filteredOrder.map((o, i) => {
                                                        return (
                                                            <tr>
                                                                <td className='ps-4'>
                                                                    <input
                                                                        className='form-check-input'
                                                                        type="checkbox"
                                                                        checked={selectedOrder.includes(o._id)}
                                                                        onChange={() => handleSelectOrder(o._id)}
                                                                    />
                                                                </td>
                                                                <th scope='row' className='ps-3'>{i + 1}</th>
                                                                <td>
                                                                    <Select
                                                                        loading={statusUpdateLoading === o._id}
                                                                        size='large'
                                                                        className='mb-3 me-2'
                                                                        value={o?.status}
                                                                        onChange={(value) => handleChange(o._id, value)}
                                                                        required>
                                                                        {statuses.map((s, i) => (
                                                                            <Option key={i} value={s}>{s}</Option>
                                                                        ))}
                                                                    </Select>
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        <Image
                                                                            preview={{
                                                                                mask: <EyeOutlined />,
                                                                            }}
                                                                            style={{ width: "27px", height: "27px", borderRadius: "100%" }}
                                                                            src={o?.buyer?.avatar}
                                                                            alt="dp" />
                                                                        <span className='ms-2'>                                                      <div style={{ cursor: "pointer" }} className='fw-bold text-primary' onClick={() => { openModal(o) }}>
                                                                            {o?.buyer?.name}  <i className="fa-solid fa-arrow-right" />
                                                                        </div>
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td >{o?.course?.title} ({o?.course?.grade?.name})</td>
                                                                <td>৳{o?.course?.price}</td>
                                                                <td>
                                                                    {methods.map((m) =>
                                                                        m.name === o.method ? (
                                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                <img
                                                                                    src={m.logo}
                                                                                    alt={m.name}
                                                                                    style={{ width: 20, height: 20, marginRight: 8 }} // Adjust size as needed
                                                                                />
                                                                                {m.name}
                                                                            </div>
                                                                        ) : null
                                                                    )}
                                                                </td>
                                                                <td>{o.trxId}</td>
                                                                <td>{o.accNumber}</td>
                                                                <td>{dayjs(o.createdAt).format('MMM DD, YYYY')}</td>
                                                                <td>
                                                                    <button className="btn btn-danger fw-bold ms-1" onClick={() => handleDelete(o._id)}>
                                                                        <i className="fa-solid fa-trash-can" /> Delete
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                )}
                                        </tbody>
                                    </table>
                            }
                        </div>

                    </div>
                </div>
            </div>
            <Modal style={{ top: 30 }} onCancel={() => setVisible(false)} open={visible} footer={null}>
                {modalOrder && (
                    <>
                        <h5 className="text-center mb-3">Course Details</h5>
                        <div className="row" id="printable-content">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">{modalOrder?.course?.title}</h4>
                                        <p>Grade: {modalOrder?.course?.grade?.name}</p>
                                        <p>Class Start: {dayjs(modalOrder?.course?.dateRange).format("MMM DD, YYYY")}</p>
                                        <p className="card-text">
                                            Price: <span className="fw-bold">৳</span> {modalOrder?.course?.price}
                                        </p>
                                        <p className="card-text">
                                            Payment Method:
                                            {methods.map((m) =>
                                                m.name === modalOrder.method ? (
                                                    <div style={{ display: "inline-flex", alignItems: "center" }} key={m.name}>
                                                        <img
                                                            src={m.logo}
                                                            alt={m.name}
                                                            style={{ width: 20, height: 20, marginLeft: 4, marginRight: 2 }}
                                                        />
                                                        {m.name}
                                                    </div>
                                                ) : null
                                            )}
                                        </p>

                                        <p className="card-text">
                                            Order Status: &nbsp;
                                            {modalOrder.status === "Pending" ? (
                                                <span className="badge bg-warning text-dark">{modalOrder.status}</span>
                                            ) : modalOrder.status === "Approved" ? (
                                                <span className="badge bg-success">{modalOrder.status}</span>
                                            ) : modalOrder.status === "Canceled" ? (
                                                <span className="badge bg-danger">{modalOrder.status}</span>
                                            ) : null}
                                        </p>
                                        <p className="card-text">
                                            Transaction ID: <span className="text-primary fw-bold">{modalOrder.trxId}</span>
                                        </p>
                                        <p className="card-text">Account Number: {modalOrder.accNumber}</p>
                                        <p className="card-text">
                                            Ordered on: <b>{dayjs(modalOrder.createdAt).format("MMM DD, YYYY  h:mm:ss A")}</b>
                                        </p>
                                        <p className="card-text">
                                            Updated: <b>{dayjs(modalOrder.updatedAt).format("MMM DD, YYYY h:mm:ss A")}</b>
                                        </p>
                                        <p className="card-text">
                                            Buyer: &nbsp;
                                            <b>
                                                {modalOrder?.buyer?.name} ({modalOrder?.buyer?.grade?.name}) -{" "}
                                                {modalOrder?.buyer?.phone}
                                            </b>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-end mt-2">
                            <button className='btn' onClick={handlePrint}>
                                🖨️ Print
                            </button>
                        </div>
                    </>
                )}
            </Modal>
        </Layout>
    );
};

export default OrderList;