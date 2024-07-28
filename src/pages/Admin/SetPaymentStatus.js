import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from './AdminMenu';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import { DatePicker } from 'antd';
import { Select } from 'antd';
const dateFormat = 'DD-MM-YYYY';
const { Option } = Select;

const SetPaymentStatus = () => {
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [listSpinnerLoading, setListSpinnerLoading] = useState(false);
    const [auth, setAuth] = useAuth();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [user, setUser] = useState('');
    const [grades, setGrades] = useState([]);
    const [grade, setGrade] = useState('');
    const [remark, setRemark] = useState('');
    const [trxId, setTrxId] = useState('');
    const [methods] = useState(["Cash", "bKash", "Nagad", "Upay", "Rocket", "Debit/Credit Card", "Bank Transfer"]);
    const [method, setMethod] = useState(null);
    const [amount, setAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [payment, setPayment] = useState([]);
    const [visible, setVisible] = useState(null);

    //Get All Grades
    const getAllGrades = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/grade/all-grades`);
            if (data?.success) {
                setGrades(data?.grade);
            }
        } catch (error) {
            console.log(error);
            toast.error("Getting error while fetching Grade");
        }
    };

    useEffect(() => {
        getAllGrades();
    }, []);

    //Get all users
    const getAllUsers = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/all-users`);
            setUsers(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (auth?.token) getAllUsers();
    }, [auth?.token]);

    // Filter users by grade
    useEffect(() => {
        if (grade) {
            const filtered = users.filter(user => user.grade._id === grade);
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, [grade, users]);

    //Create Payment Status
    const handleCreate = async (e) => {
        e.preventDefault();
        setSpinnerLoading(true);
        try {
            const paymentData = new FormData();
            paymentData.append("remark", remark);
            paymentData.append("trxId", trxId);
            paymentData.append("method", method);
            paymentData.append("amount", amount);
            paymentData.append("paymentDate", paymentDate);
            paymentData.append("user", user);
            paymentData.append("grade", grade);

            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/payment/create-payment`, paymentData);
            if (data?.success) {
                setSpinnerLoading(false);
                toast.success(data?.message);
                getAllPayment();
                // Clear form fields
                setMethod('');
                setAmount('');
                setRemark('');
                setTrxId('');
                setPaymentDate('');
                setUser('');
                setGrade('');
            } else {
                toast.success("Payment Status Created Successfully");
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
            setSpinnerLoading(false);
        }
    };

    //get all payment list
    const getAllPayment = async () => {
        setListSpinnerLoading(true);
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/payment/all-payment`);
            setPayment(data);
        } catch (error) {
            console.log(error);
        } finally {
            setListSpinnerLoading(false);
        }
    };

    useEffect(() => {
        getAllPayment();
    }, []);

    //delete payment status
    const handleDelete = async (rId) => {
        try {
            let answer = window.confirm("Are you sure want to delete this payment Status?");
            if (!answer) return;
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/payment/delete-payment/${rId}`);
            if (data.success) {
                toast.success(`Payment Status deleted successfully`);
                getAllPayment();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Something wrong while Delete');
        }
    };

    //total payment amount calculate
    const totalAmount = payment.reduce((sum, p) => sum + p.amount, 0);

    return (
        <Layout title={"Admin - Set Payment Status"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3"><AdminMenu /></div>
                    <div className="col-md-9">
                        <h2 className='text-center my-3'>Create Payment Status</h2>
                        <div className="m-1">
                            <div className="mb-4 d-lg-flex">
                                <Select bordered={false}
                                    placeholder="Select Grade"
                                    size='large'
                                    className='form-select mb-1 mx-1'
                                    onChange={(value) => { setGrade(value) }}>
                                    {grades?.map(g => (
                                        <Option key={g._id} value={g._id}>{g.name}</Option>
                                    ))}
                                </Select>
                                <Select bordered={false}
                                    placeholder="Select Student"
                                    size='large'
                                    className='form-select mb-1 mx-1'
                                    onChange={(value) => { setUser(value) }} required>
                                    {filteredUsers?.map(u => (
                                        <Option key={u._id} value={u._id}>{u.name}</Option>
                                    ))}
                                </Select>
                            </div>
                            <div className="mb-4 d-lg-flex">
                                <input
                                    type="text"
                                    placeholder='Remark'
                                    className='form-control mb-1 mx-1'
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)} required
                                />
                                <input
                                    type="number"
                                    placeholder='Amount'
                                    className='form-control mb-1 mx-1'
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)} required
                                />
                                <DatePicker format={dateFormat} className='form-control w-100 mx-1 mb-2' onChange={(date) => setPaymentDate(date)} required />
                            </div>
                            <div className="mb-4 d-lg-flex">
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
                                    type="text"
                                    placeholder='Transaction ID / Receipt No'
                                    className='form-control mb-2 mx-1'
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
                        <h6 className='text-end'>Total Received: TK. {totalAmount}</h6>
                        <div className='table-container'>
                            <table className="table">
                                <thead className='table-dark'>
                                    <tr>
                                        <th>#</th>
                                        <th>Grade</th>
                                        <th>Name</th>
                                        <th>Remark</th>
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
                                                        <tr key={p._id}>
                                                            <th scope="row">{i + 1}</th>
                                                            <td>{p?.grade?.name}</td>
                                                            <td>{p?.user?.name}</td>
                                                            <td>{p.remark}</td>
                                                            <td>TK. {p.amount}</td>
                                                            <td>{p.method}</td>
                                                            <td>{p.trxId}</td>
                                                            <td>{p.paymentDate}</td>
                                                            <td className='d-flex'>
                                                                <button className='btn btn-primary mx-1' onClick={() => { setVisible(true); }}><i className="fa-solid fa-pen-to-square"></i> Edit</button>
                                                                <button className="btn btn-danger fw-bold ms-1" onClick={() => handleDelete(p._id)}><i className="fa-solid fa-trash-can"></i> Delete</button>
                                                            </td>
                                                        </tr>
                                                    );
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
