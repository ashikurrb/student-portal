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
    const [createModalVisible, setIsCreateModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPayment, setSelectedPayment] = useState([]);

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
            console.error("Error details:", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
                setSpinnerLoading(false);
            } else {
                toast.error("Something went wrong");
                setSpinnerLoading(false);
            }
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
            console.error("Error details:", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
                setUpdateSpinnerLoading(false);
            } else {
                toast.error("Something went wrong");
                setUpdateSpinnerLoading(false);
            }
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

    // Filter content based on search query
    const filteredPayment = payment.filter(p =>
        p.remark.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.trxId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.grade.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    //total payment amount calculate
    const totalAmount = filteredPayment.reduce((sum, p) => sum + p.amount, 0);
    // const totalAmountSelected = selectedPayment.amount.reduce((sum, p) => sum + p.amount, 0);
    console.log(selectedPayment);

    //delete individual payment status
    const handleDelete = async (pId) => {
        let answer = window.confirm("Are you sure want to delete this payment Status?");
        if (!answer) return;
        const loadingToastId = toast.loading('Deleting payment status...');
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/payment/delete-payment/${pId}`);
            if (data.success) {
                toast.success(data.message, { id: loadingToastId });
                getAllPayment();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Something went wrong', { id: loadingToastId });
        }
    };

    //delete selected payment status
    const handleDeleteSelected = async () => {
        let answer = window.confirm("Are you sure you want to delete the selected payment status?");
        if (!answer) return;
        const loadingToastId = toast.loading('Deleting payment status...');
        try {
            await Promise.all(selectedPayment.map(async (pId) => {
                await axios.delete(`${process.env.REACT_APP_API}/api/v1/payment/delete-payment/${pId}`);
            }));
            toast.success('Selected payment status deleted successfully', { id: loadingToastId });
            setSelectedPayment([]);
            getAllPayment();
        } catch (error) {
            toast.error('Something went wrong while deleting', { id: loadingToastId });
        }
    };

    // Handle selecting all content
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allPaymentIds = filteredPayment.map(p => p._id);
            setSelectedPayment(allPaymentIds);
        } else {
            setSelectedPayment([]);
        }
    };

    // Handle selecting individual content
    const handleSelectPayment = (pId) => {
        if (selectedPayment.includes(pId)) {
            setSelectedPayment(selectedPayment.filter(id => id !== pId));
        } else {
            setSelectedPayment([...selectedPayment, pId]);
        }
    };

    // Handle Escape key functionality
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                // Clear search bar
                setSearchQuery('');
                // Clear selected content
                setSelectedPayment([]);
            }
        };
        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);
    

    // Function to generate invoice PDF
    const generateInvoice = (payment) => {
        toast.success("Invoice created");
        // Set page size to A5
        const doc = new jsPDF({
            format: 'a5',
            unit: 'mm'
        });
        // Define margins
        const leftMargin = 7; // Adjust as needed
        const rightMargin = 7; // Adjust as needed

        // Add background watermark
        const logo = new Image();
        logo.src = "/images/brandWatermark.png"; // Adjust the path as needed
        logo.onload = () => {
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const imgWidth = pageWidth * 0.5; // Scale the logo to 50% of page width
            const imgHeight = (imgWidth * logo.height) / logo.width; // Maintain aspect ratio

            const imgX = (pageWidth - imgWidth) / 2; // Center horizontally
            const imgY = (pageHeight - imgHeight) / 2; // Center vertically

            // Add the watermark image with low opacity to simulate blur
            doc.addImage(logo, 'PNG', imgX, imgY, imgWidth, imgHeight, '', 'NONE');

            // Add text and other elements
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            const instituteName = '5points Academy';
            const titleWidth1 = doc.getTextWidth(instituteName);
            const titleX1 = (pageWidth - titleWidth1) / 2; // Center text horizontally
            doc.text(instituteName, titleX1, 13);

            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            const addressName = 'Tajmahal Road, Dhaka - 1207';
            const titleWidth2 = doc.getTextWidth(addressName);
            const titleX2 = (pageWidth - titleWidth2) / 2; // Center text horizontally
            doc.text(addressName, titleX2, 20);

            const mobile = 'Mobile: +880 1794-744343';
            const titleWidth3 = doc.getTextWidth(mobile);
            const titleX3 = (pageWidth - titleWidth3) / 2; // Center text horizontally
            doc.text(mobile, titleX3, 26);

            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            const title = 'Payment Invoice';
            const titleWidth = doc.getTextWidth(title);
            const titleX = (pageWidth - titleWidth) / 2; // Center text horizontally
            doc.text(title, titleX, 38);

            //Identify portion
            doc.setFontSize(10);
            const verticalSpacing = 8; // Adjust this value to reduce the spacing

            // Bold Date: and labels
            doc.setFont('helvetica', 'bold');
            const dateText = `${moment(payment.paymentDate).format('ll')}`;
            doc.text('Date:', pageWidth - rightMargin - doc.getTextWidth(dateText) - doc.getTextWidth('Date:'), 54);
            doc.text('Name:', leftMargin, 54 + verticalSpacing);
            doc.text('Grade:', leftMargin, 54 + 2 * verticalSpacing);
            doc.text('Email:', leftMargin, 54 + 3 * verticalSpacing);
            doc.text('Mobile:', leftMargin, 54 + 4 * verticalSpacing);

            // Normal text
            doc.setFont('helvetica', 'normal'); // Revert font to normal
            doc.text(dateText, pageWidth - rightMargin - doc.getTextWidth(dateText), 54); // Position date text
            doc.text(`${payment.user.name}`, leftMargin + doc.getTextWidth('Name:') + 2, 54 + verticalSpacing);
            doc.text(`${payment.grade.name}`, leftMargin + doc.getTextWidth('Grade:') + 2, 54 + 2 * verticalSpacing);
            doc.text(`${payment.user.email}`, leftMargin + doc.getTextWidth('Email:') + 2, 54 + 3 * verticalSpacing);
            doc.text(`${payment.user.phone}`, leftMargin + doc.getTextWidth('Mobile:') + 2, 54 + 4 * verticalSpacing);

            doc.autoTable({
                startY: 100,
                margin: { left: leftMargin, right: rightMargin },
                head: [['Remark', 'Amount', 'Method', 'Trx ID / Receipt No']],
                body: [
                    [`${payment.remark}`, `TK. ${payment.amount}`, `${payment.method}`, `${payment.trxId}`]
                ],
                styles: {
                    cellPadding: 2, // Adjust cell padding if needed
                    valign: 'middle',
                    halign: 'center', // Center-align text horizontally
                },
                columnStyles: {
                    0: { halign: 'center' }, // Center-align the first column
                    1: { halign: 'center' }, // Center-align the second column
                    2: { halign: 'center' }, // Center-align the third column
                    3: { halign: 'center' }  // Center-align the fourth column
                }
            });

            const img = new Image();
            img.src = "/images/authoritySign.png"; // Adjust the path as needed
            img.onload = () => {
                const finalY = doc.autoTable.previous.finalY;
                const imgWidth = 50;
                const imgHeight = 20;
                const marginRight = rightMargin;

                const imgX = pageWidth - imgWidth - marginRight;
                const imgY = finalY + 52;

                doc.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight);

                const lineY = imgY + imgHeight + 1;
                doc.line(imgX, lineY, imgX + imgWidth, lineY);

                const textX = imgX + imgWidth / 2;
                const textY = lineY + 5;
                doc.text('Authority', textX, textY, { align: 'center' });

                // Add footer text with date and time
                doc.setFontSize(8); // Adjust font size for footer
                doc.setTextColor(128, 128, 128); // Set text color to grey
                const currentDateTime = moment().format('MMMM D, YYYY h:mm A');
                const footerText1 = `This is a system generated Invoice | Generated on: ${currentDateTime}`;
                const footerText2 = `Created by Admin | System Entry: ${moment(payment.createdAt).format('MMMM D, YYYY h:mm A')} / ${moment(payment.updatedAt).format('MMMM D, YYYY h:mm A')}`;

                const footerWidth1 = doc.getTextWidth(footerText1);
                const footerWidth2 = doc.getTextWidth(footerText2);

                // Center both lines horizontally
                const footerX1 = (pageWidth - footerWidth1) / 2;
                const footerX2 = (pageWidth - footerWidth2) / 2;

                const footerY1 = pageHeight - 10; // Adjust this value to position the first line correctly
                const footerY2 = footerY1 + 5; // Add some space between the lines

                doc.text(footerText1, footerX1, footerY1);
                doc.text(footerText2, footerX2, footerY2);

                const blob = doc.output('blob');
                const url = URL.createObjectURL(blob);
                const printWindow = window.open(url, '_blank');
                if (printWindow) {
                    printWindow.focus();
                    printWindow.onload = function () {
                        printWindow.print();
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

        logo.onerror = (err) => {
            console.error('Logo loading error: ', err);
            toast.error('Failed to load logo image');
        };
    };

    return (
        <Layout title={"Admin - Set Payment Status"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3"><AdminMenu /></div>
                    <div className="col-md-9">
                        <h2 className='text-center my-4'><i class="fa-solid fa-credit-card"></i> Create Payment Status ({payment.length})</h2>
                        <div className='d-flex justify-content-between mb-3'>
                            <input
                                type="text"
                                placeholder='Search'
                                className='form-control mx-1'
                                style={{ flexBasis: '50%' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" onClick={() => setIsCreateModalVisible(true)} className="btn btn-success fw-bold mx-1 py-2 px-4">
                                <i class="fa-solid fa-plus"></i>  Set Payment
                            </button>
                            {selectedPayment.length > 0 && (
                                <button onClick={handleDeleteSelected} className="btn btn-danger fw-bold mx-1 py-2 floating-delete-button">
                                    <i className="fa-solid fa-trash-can"></i> Delete Selected
                                </button>
                            )}
                        </div>

                        <Modal width={650} visible={createModalVisible} onCancel={() => setIsCreateModalVisible(false)} footer={null}>
                            <form onSubmit={handleCreate}>
                                <h5 className='text-center'>Create Payment Status</h5>
                                <div className="mt-4 d-lg-flex">
                                    <Select bordered={false}
                                        placeholder="Select Grade"
                                        size='large'
                                        className='form-select mb-3 me-2'
                                        value={grade || undefined}
                                        onChange={(value) => { setGrade(value) }}>
                                        {grades?.map(g => (
                                            <Option key={g._id} value={g._id}>{g.name}</Option>
                                        ))}
                                    </Select>
                                    <Select bordered={false}
                                        placeholder="Select Student"
                                        size='large'
                                        className='form-select mb-3'
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
                                        className='form-control mb-3 me-2'
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)} required
                                    />
                                    <input
                                        type="number"
                                        placeholder='Amount'
                                        className='form-control mb-3 me-2'
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)} required
                                    />
                                    <DatePicker format={dateFormat} className='form-control w-100 mb-3' value={paymentDate} onChange={(date) => setPaymentDate(date)} required />
                                </div>
                                <div className="d-lg-flex">
                                    <Select bordered={false}
                                        placeholder="Select Method"
                                        size='large'
                                        className='form-select mb-3 me-2'
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
                                        className='form-control mb-3'
                                        value={trxId}
                                        onChange={(e) => setTrxId(e.target.value)} required
                                    />
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-warning fw-bold mt-2">
                                        {spinnerLoading ? <Spinner /> : "Create Payment Status"}
                                    </button>
                                </div>
                            </form>
                        </Modal>

                        <h6 className='d-flex justify-content-between'>
                            <span>
                                {
                                    selectedPayment.length > 0 ?
                                        <h6 className='justify-content-start'> {selectedPayment.length} selected</h6> :
                                        <h6 className='justify-content-start'> Count: {filteredPayment.length}</h6>
                                }
                            </span>
                            <span>
                                <h6 className='justify-content-start'> Total: {totalAmount} TK</h6>
                            </span>
                        </h6>
                        <div className='table-container'>
                            {
                                listSpinnerLoading ? <div className="m-5 text-center">
                                    <Spinner /><p>Loading payment status...</p>
                                </div> :
                                    <table className="table table-fixed-header">
                                        <thead className='table-dark'>
                                            <tr>
                                                <th className='ps-4'>
                                                    <input
                                                        type="checkbox"
                                                        onChange={handleSelectAll}
                                                        className='form-check-input'
                                                        checked={selectedPayment.length === filteredPayment.length && filteredPayment.length > 0}
                                                    />
                                                </th>
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
                                        <tbody>
                                            {filteredPayment.length === 0 ? (
                                                <tr>
                                                    <td colSpan="11" className="text-center">
                                                        <div className="my-5">
                                                            <h3 className='text-secondary'>No Payment Status Found</h3>
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
                                                filteredPayment.map((p, i) => (
                                                    <tr key={p._id}>
                                                        <td className='ps-4'>
                                                            <input
                                                                type="checkbox"
                                                                className='form-check-input'
                                                                checked={selectedPayment.includes(p._id)}
                                                                onChange={() => handleSelectPayment(p._id)}
                                                            />
                                                        </td>
                                                        <th scope="row">{i + 1}</th>
                                                        <td>{p?.grade?.name}</td>
                                                        <td>
                                                            {p?.user?.name}
                                                        </td>
                                                        <td>
                                                            <Tooltip title={`Created: ${moment(p.createdAt).format('llll')} Updated: ${moment(p.updatedAt).format('llll')}`}>
                                                                <span>{p.remark}</span>
                                                            </Tooltip>
                                                        </td>
                                                        <td>TK. {p.amount}</td>
                                                        <td>{p.method}</td>
                                                        <td>{p.trxId}</td>
                                                        <td>{moment(p?.paymentDate).format('ll')}</td>
                                                        <td className='text-center'>
                                                            <button className="btn btn-outline-dark" onClick={() => generateInvoice(p)}>
                                                                <i className="fa-solid fa-download"></i>
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <div className='d-flex'>
                                                                <button className='btn btn-primary mx-1' onClick={() => { openModal(p) }}>
                                                                    <i class="fa-solid fa-pen-to-square"></i> Edit
                                                                </button>
                                                                <button className="btn btn-danger fw-bold ms-1" onClick={() => handleDelete(p._id)}>
                                                                    <i className="fa-solid fa-trash-can"></i> Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Modal onCancel={() => setVisible(false)} visible={visible} footer={null}>
                <h5 className='text-center'>Update Payment Status</h5>
                <div className='text-center my-3'>
                    {
                        <span>
                            {selected?.user?.name} - {selected?.grade?.name} - {moment(selected?.paymentDate).format('ll')}
                        </span>
                    }
                </div>
                <form onSubmit={handleUpdate}>
                    <div className="mt-4 d-lg-flex">
                        <input
                            type="text"
                            placeholder='Remark'
                            className='form-control mb-3 me-2'
                            value={updatedRemark}
                            onChange={(e) => setUpdatedRemark(e.target.value)} required
                        />
                        <input
                            type="number"
                            placeholder='Amount'
                            className='form-control mb-3 me-2'
                            value={updatedAmount}
                            onChange={(e) => setUpdatedAmount(e.target.value)} required
                        />
                        <DatePicker format={dateFormat} value={updatedPaymentDate} className='form-control w-100 mb-3 me-2'
                            onChange={(date) => setUpdatedPaymentDate(date)} required />
                    </div>
                    <div className="mb-2 d-lg-flex">
                        <Select bordered={false}
                            placeholder="Select Method"
                            size='large'
                            className='form-select mb-3 me-2'
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
                            className='form-control mb-3 me-2'
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
