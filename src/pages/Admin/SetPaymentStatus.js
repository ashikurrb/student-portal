import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from './AdminMenu';
import Spinner from '../../components/Spinner'
import axios from 'axios';
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import { DatePicker } from 'antd';
import { Select } from 'antd';

const { Option } = Select;

const SetPaymentStatus = () => {
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [listSpinnerLoading, setListSpinnerLoading] = useState(false);
    const [auth, setAuth] = useAuth();
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState('');
    const [trxId, setTrxId] = useState('');
    const [methods] = useState(["Cash", "bKash", "Nagad", "Upay", "Rocket", "Debit/Credit Card", "Bank Transfer"]);
    const [method, setMethod] = useState(null);
    const [amount, setAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [payment, setPayment] = useState([]);
    const [visible, setVisible] = useState(null);

    //Get all users
    const getAllUsers = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/all-users`)
            setUsers(data)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (auth?.token) getAllUsers();
    }, [auth?.token])

    //Create Payment Status
    const handleCreate = async (e) => {
        e.preventDefault();
        setSpinnerLoading(true);
        try {
            const paymentData = new FormData();
            paymentData.append("trxId", trxId);
            paymentData.append("method", method);
            paymentData.append("amount", amount);
            paymentData.append("paymentDate", paymentDate);
            paymentData.append("user", user);

            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/payment/create-payment`, paymentData);
            if (data?.success) {
                setSpinnerLoading(false);
                toast.success(data?.message);
                getAllPayment();
                // Clear form fields
                setMethod('');
                setAmount('');
                setTrxId('');
                setPaymentDate('');
                setUser('');
            } else {
                toast.success("Payment Status Created Successfully");
            }

        } catch (error) {
            console.log(error);
            toast.error('Something went wrong')
            setSpinnerLoading(false)
        }
    }

    //get all payment list
    const getAllPayment = async () => {
        setListSpinnerLoading(true)
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/payment/all-payment`)
            setPayment(data)
            console.log(data);
        } catch (error) {
            console.log(error);
        } finally {
            setListSpinnerLoading(false)
        }
    }

    useEffect(() => {
        getAllPayment();
    }, [])

    //delete payment status
    const handleDelete = async (rId) => {
        try {
            let answer = window.confirm("Are you sure want to delete this payment Status?")
            if (!answer) return;
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/payment/delete-payment/${rId}`);
            if (data.success) {
                toast.success(`Payment Status deleted successfully`);
                getAllPayment();
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Something wrong while Delete')
        }
    }


    return (
        <Layout title={"Admin - Create Links"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3"><AdminMenu /></div>
                    <div className="col-md-9">
                        <h2 className='text-center my-3'>Create Payment Status</h2>
                        <div className="m-1  w-75">
                            <div className="mb-4">
                                <Select bordered={false}
                                    placeholder="Select Student"
                                    size='large'
                                    className='form-select mb-1 mx-1'
                                    onChange={(value) => { setUser(value) }} required>
                                    {users?.map(u => (
                                        <Option key={u._id} value={u._id}>{u.name}</Option>
                                    ))}
                                </Select>
                            </div>
                            <div className="mb-4 d-flex">
                                <Select bordered={false}
                                    placeholder="Select Method"
                                    size='large'
                                    className='form-select mb-1 mx-1'
                                    onChange={(value) => { setMethod(value) }}
                                    required>
                                    {methods.map((m, i) => (
                                        <Option key={i} value={m}>{m}</Option>
                                    ))}
                                </Select>
                                <input
                                    type="number"
                                    placeholder='Amount'
                                    className='form-control'
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)} required
                                />
                            </div>
                            <div className="mb-4 d-flex">
                                <DatePicker className='w-50' onChange={(date) => setPaymentDate(date)} required />
                                <input
                                    type="text"
                                    placeholder='Transaction ID / Receipt No'
                                    className='form-control ms-2'
                                    value={trxId}
                                    onChange={(e) => setTrxId(e.target.value)} required
                                />
                            </div>
                            <div className="mb-3 text-center">
                                {spinnerLoading ? <div className='my-2'><Spinner /> </div> : ""}
                                <button className="btn btn-warning fw-bold" onClick={handleCreate}>
                                    Create Payment Status
                                </button>
                            </div>
                        </div>
                        <div className='table-container'>
                            <table className="table">
                                <thead className='table-dark'>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Amount</th>
                                        <th>Method</th>
                                        <th>Trx ID</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                {
                                    listSpinnerLoading ? <Spinner /> :
                                        <tbody>
                                            {
                                                payment.map((p, i) => {
                                                    return (
                                                        <tr>
                                                            <td>{i + 1}</td>
                                                            <td>{p?.user?.name}</td>
                                                            <td>TK. {p.amount}</td>
                                                            <td>{p.method}</td>
                                                            <td>{p.trxId}</td>
                                                            <td>{p.paymentDate}</td>
                                                            <td className='d-flex'>
                                                                <button className='btn btn-primary mx-1' onClick={() => { setVisible(true); }}><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                                                                <button className="btn btn-danger fw-bold ms-1" onClick={() => handleDelete(p._id)}><i class="fa-solid fa-trash-can"></i>  Delete</button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                }
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SetPaymentStatus;