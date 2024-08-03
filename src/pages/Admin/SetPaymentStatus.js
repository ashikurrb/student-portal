import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from './AdminMenu';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import moment from 'moment'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Modal, DatePicker, Select, Tooltip } from 'antd';
const dateFormat = 'DD-MM-YYYY';
const { Option } = Select;

const SetPaymentStatus = () => {
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [updateSpinnerLoading, setUpdateSpinnerLoading] = useState(false);
    const [listSpinnerLoading, setListSpinnerLoading] = useState(false);
    const [auth, setAuth] = useAuth();
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [grades, setGrades] = useState([]);
    const [grade, setGrade] = useState('');
    const [remark, setRemark] = useState('');
    const [trxId, setTrxId] = useState('');
    const [methods] = useState(["Cash", "bKash", "Nagad", "Upay", "Rocket", "Debit/Credit Card", "Bank Transfer"]);
    const [method, setMethod] = useState(null);
    const [amount, setAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [payment, setPayment] = useState([]);
    const [paymentId, setPaymentId] = useState([]);
    const [updatedRemark, setUpdatedRemark] = useState('');
    const [updatedTrxId, setUpdatedTrxId] = useState('');
    const [updatedMethod, setUpdatedMethod] = useState('');
    const [updatedAmount, setUpdatedAmount] = useState('');
    const [updatedPaymentDate, setUpdatedPaymentDate] = useState('');
    const [selected, setSelected] = useState(null);
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
            toast.error("Error fetching Grades");
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
            toast.error("Error fetching Users");
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
            setUser('');
        } else {
            setFilteredUsers([]);
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
                // Clear form fields after submit
                setGrade(undefined);
                setUser(undefined);
                setRemark('');
                setPaymentDate(undefined);
                setAmount('');
                setMethod(undefined);
                setTrxId('');
                setListSpinnerLoading(false);
            } else {
                toast.success(data.message);
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
            toast.error("Error fetching Payments");
        } finally {
            setListSpinnerLoading(false);
        }
    };
    useEffect(() => {
        getAllPayment();
    }, []);

    //update payment status
    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateSpinnerLoading(true);
        try {
            const updateResultData = new FormData();
            updateResultData.append("remark", updatedRemark);
            updateResultData.append("trxId", updatedTrxId);
            updateResultData.append("method", updatedMethod);
            updateResultData.append("amount", updatedAmount);
            updateResultData.append("paymentDate", updatedPaymentDate);
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/payment/update-payment/${selected._id}`, updateResultData);
            if (data?.success) {
                setUpdateSpinnerLoading(false);
                toast.success(data?.message);
                getAllPayment();

                // Clear form fields after submit
                setUpdatedRemark('');
                setUpdatedTrxId('');
                setUpdatedMethod(undefined);
                setUpdatedAmount('');
                setUpdatedPaymentDate(undefined);
                setVisible(false);
                setListSpinnerLoading(false);
            } else {
                toast.success(data.message);
                setUpdateSpinnerLoading(false);
            }

        } catch (error) {
            console.log(error);
            toast.error('Something went wrong')
            setUpdateSpinnerLoading(false)
        }
    };

    // Open modal with selected result data
    const openModal = (payment) => {
        setVisible(true);
        setSelected(payment);
        setPaymentId(payment._id);
        setUpdatedRemark(payment.remark);
        setUpdatedTrxId(payment.trxId);
        setUpdatedMethod(payment.method);
        setUpdatedAmount(payment.amount);
        // setUpdatedPaymentDate(payment.paymentDate);
    };

    //delete payment status
    const handleDelete = async (rId) => {
        try {
            let answer = window.confirm("Are you sure want to delete this payment Status?");
            if (!answer) return;
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/payment/delete-payment/${rId}`);
            if (data.success) {
                toast.success(data.message);
                getAllPayment();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    //total payment amount calculate
    const totalAmount = payment.reduce((sum, p) => sum + p.amount, 0);

    // Function to generate invoice PDF
    const generateInvoice = (payment) => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        const instituteName = '5Points Academy';
        const pageWidth1 = doc.internal.pageSize.getWidth();
        const titleWidth1 = doc.getTextWidth(instituteName);
        const titleX1 = (pageWidth1 - titleWidth1) / 2;
        doc.text(instituteName, titleX1, 12);
        doc.setFontSize(11);
        const addressName = 'Tajmahal Road, Dhaka - 1207';
        const pageWidth2 = doc.internal.pageSize.getWidth();
        const titleWidth2 = doc.getTextWidth(addressName);
        const titleX2 = (pageWidth2 - titleWidth2) / 2;
        doc.text(addressName, titleX2, 19);
        doc.setFontSize(11);
        const mobile = '+880 1853-660115';
        const pageWidth3 = doc.internal.pageSize.getWidth();
        const titleWidth3 = doc.getTextWidth(mobile);
        const titleX3 = (pageWidth3 - titleWidth3) / 2;
        doc.text(mobile, titleX3, 25);
        doc.setFontSize(16);
        const title = 'Payment Invoice';
        const pageWidth = doc.internal.pageSize.getWidth();
        const titleWidth = doc.getTextWidth(title);
        const titleX = (pageWidth - titleWidth) / 2; // Center the title
        doc.text(title, titleX, 36);
        doc.setFontSize(12);
        doc.text(`Date: ${moment(payment.paymentDate).format('ll')}`, 14, 54);
        doc.text(`Name: ${payment.user.name}`, 14, 64);
        doc.text(`Grade: ${payment.grade.name}`, 14, 74);
        doc.text(`Email: ${payment.user.email}`, 14, 84);
        doc.text(`Mobile: ${payment.user.phone}`, 14, 94);

        doc.autoTable({
            startY: 104,
            head: [['Remark', 'Amount', "Method", "Trx ID / Receipt No"]],
            body: [
                [`${payment.remark}`, `TK. ${payment.amount}`, `${payment.method}`, `${payment.trxId}`]
            ],
        });

        const img = new Image();
        img.src = "/images/authoritySign.png"; // Adjust the path as needed
        img.onload = () => {
            const finalY = doc.autoTable.previous.finalY;
            const pageWidth = doc.internal.pageSize.getWidth();
            const imgWidth = 50; // Width of the image
            const imgHeight = 20; // Height of the image
            const marginRight = 14; // Right margin

            const imgX = pageWidth - imgWidth - marginRight; // X coordinate to place the image on the right side
            const imgY = finalY + 10; // Y coordinate to place the image below the table

            // Add the signature image
            doc.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight);

            // Add a line below the image
            const lineY = imgY + imgHeight + 1; // Y coordinate for the line, a bit below the image
            doc.line(imgX, lineY, imgX + imgWidth, lineY);

            // Add the word "Authority" under the line
            const textX = imgX + imgWidth / 2; // Center text below the image
            const textY = lineY + 10; // Y coordinate for the text
            doc.text('Authority', textX, textY, { align: 'center' });

            // Create a Blob URL and open it in a new window for printing
            const blob = doc.output('blob');
            const url = URL.createObjectURL(blob);
            const printWindow = window.open(url, '_blank');
            if (printWindow) {
                printWindow.focus();
                printWindow.onload = function () {
                    printWindow.print();
                    toast.success("Invoice created.")
                };
            } else {
                toast.error('Failed to open the print window');
            }

        };
        img.onerror = (err) => {
            console.error('Image loading error: ', err);
            toast.error('Failed to load signature image');
        };
    };

    return (
        <Layout title={"Admin - Set Payment Status"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3"><AdminMenu /></div>
                    <div className="col-md-9">
                        <h2 className='text-center my-3'>Create Payment Status</h2>
                        <form className="m-1" onSubmit={handleCreate}>
                            <div className="d-lg-flex">
                                <Select bordered={false}
                                    placeholder="Select Grade"
                                    size='large'
                                    className='form-select m-2'
                                    value={grade || undefined}
                                    onChange={(value) => { setGrade(value) }}>
                                    {grades?.map(g => (
                                        <Option key={g._id} value={g._id}>{g.name}</Option>
                                    ))}
                                </Select>
                                <Select bordered={false}
                                    placeholder="Select Student"
                                    size='large'
                                    className='form-select m-2'
                                    value={user || undefined}
                                    onChange={(value) => { setUser(value) }} required>
                                    {filteredUsers?.map(u => (
                                        <Option key={u._id} value={u._id}>{u.name}</Option>
                                    ))}
                                </Select>
                            </div>
                            <div className="d-lg-flex">
                                <input
                                    type="text"
                                    placeholder='Remark'
                                    className='form-control m-2'
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)} required
                                />
                                <input
                                    type="number"
                                    placeholder='Amount'
                                    className='form-control m-2'
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)} required
                                />
                                <DatePicker format={dateFormat} className='form-control w-100 m-2' value={paymentDate} onChange={(date) => setPaymentDate(date)} required />
                            </div>
                            <div className="d-lg-flex">
                                <Select bordered={false}
                                    placeholder="Select Method"
                                    size='large'
                                    className='form-select m-2'
                                    value={method}
                                    onChange={(value) => { setMethod(value) }}
                                    required>
                                    {methods.map((m, i) => (
                                        <Option key={i} value={m}>{m}</Option>
                                    ))}
                                </Select>
                                <input
                                    type="text"
                                    placeholder='Transaction ID / Receipt No'
                                    className='form-control m-2'
                                    value={trxId}
                                    onChange={(e) => setTrxId(e.target.value)} required
                                />
                            </div>
                            <div className="m-3 text-center">
                                <button type='submit' className="btn btn-warning fw-bold">
                                    {spinnerLoading ? <Spinner /> : "Create Payment Status"}
                                </button>
                            </div>
                        </form>
                        <h6 className='d-flex justify-content-between'> <span>Payment Count: {payment.length}</span> <span>Total Received: TK. {totalAmount}</span></h6>
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
                                        <th>Invoice</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                {
                                    listSpinnerLoading ? <div className="m-5"><Spinner /></div> :
                                        <tbody>
                                            {
                                                payment.map((p, i) => {
                                                    return (
                                                        <tr key={p._id}>
                                                            <th scope="row">{i + 1}</th>
                                                            <td>{p?.grade?.name}</td>
                                                            <td>
                                                                <Tooltip title={`Created: ${moment(p.createdAt).format('llll')} Updated: ${moment(p.updatedAt).format('llll')}`}>
                                                                    <span>{p?.user?.name}</span>
                                                                </Tooltip>
                                                            </td>
                                                            <td>{p.remark}</td>
                                                            <td>TK. {p.amount}</td>
                                                            <td>{p.method}</td>
                                                            <td>{p.trxId}</td>
                                                            <td>{moment(p?.paymentDate).format('ll')}</td>
                                                            <td className='text-center'>
                                                                <button className="btn btn-outline-dark" onClick={() => generateInvoice(p)}>
                                                                    <i className="fa-solid fa-download"></i>
                                                                </button>
                                                            </td>
                                                            <td className='d-flex'>
                                                                <button className='btn btn-primary mx-1' onClick={() => { openModal(p) }}><i class="fa-solid fa-pen-to-square"></i> Edit</button>
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
            <Modal onCancel={() => setVisible(false)} visible={visible} footer={null}>
                <h5 className='text-center'>Update Payment Status</h5>
                <div className='text-center my-3'>
                    {
                        <p>
                            {selected?.user?.name} - {selected?.grade?.name}
                        </p>
                    }
                </div>
                <form onSubmit={handleUpdate}>
                    <div className="mt-4 d-lg-flex">
                        <input
                            type="text"
                            placeholder='Remark'
                            className='form-control mb-2 mx-1'
                            value={updatedRemark}
                            onChange={(e) => setUpdatedRemark(e.target.value)} required
                        />
                        <input
                            type="number"
                            placeholder='Amount'
                            className='form-control mb-2 mx-1'
                            value={updatedAmount}
                            onChange={(e) => setUpdatedAmount(e.target.value)} required
                        />
                        <DatePicker format={dateFormat} value={updatedPaymentDate} className='form-control w-100 mb-2 mx-1'
                            onChange={(date) => setUpdatedPaymentDate(date)} required />
                    </div>
                    <div className="mb-3 d-lg-flex">
                        <Select bordered={false}
                            placeholder="Select Method"
                            size='large'
                            className='form-select mb-2 mx-1'
                            value={updatedMethod}
                            onChange={(value) => { setUpdatedMethod(value) }}
                            required>
                            {methods.map((m, i) => (
                                <Option key={i} value={m}>{m}</Option>
                            ))}
                        </Select>
                        <input
                            type="text"
                            placeholder='Transaction ID / Receipt No'
                            className='form-control mb-2 mx-1'
                            value={updatedTrxId}
                            onChange={(e) => setUpdatedTrxId(e.target.value)} required
                        />
                    </div>
                    <div className="text-center">
                        <button type='submit' className="btn btn-warning fw-bold">
                            {updateSpinnerLoading ? <Spinner /> : "Update Payment Status"}
                        </button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default SetPaymentStatus;
