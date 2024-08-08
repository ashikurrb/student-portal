import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout'
import Spinner from '../../components/Spinner';
import StudentMenu from './StudentMenu';
import axios from 'axios';
import moment from 'moment'
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useAuth } from '../../context/auth';

const ViewPayment = () => {
    const [auth] = useAuth();
    const [payment, setPayment] = useState([]);
    const [spinnerLoading, setSpinnerLoading] = useState(true);

    const getPayment = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/payment/user-payment`);
            setPayment(data);
        } catch (error) {
            console.log(error);
            toast.error("Error fetching Payments");
        } finally {
            setSpinnerLoading(false);
        }
    };
    useEffect(() => {
        getPayment();
    }, []);

    //total payment amount calculate
    const totalAmount = payment.reduce((sum, p) => sum + p.amount, 0);

    // Function to generate invoice PDF
    const generateInvoice = (payment) => {
        toast.success("Invoice created");
        const doc = new jsPDF();
        doc.setFontSize(22);
        const instituteName = '5points Academy';
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
        doc.text(`Name: ${auth.user.name}`, 14, 64);
        doc.text(`Grade: ${auth.user.grade.name}`, 14, 74);
        doc.text(`Email: ${auth.user.email }`, 14, 84);
        doc.text(`Mobile: ${auth.user.phone}`, 14, 94);

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
    console.log(auth);
    console.log(payment);
    return (
        <Layout title={"Dashboard - Payment Status"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <StudentMenu />
                    </div>
                    <div className="col-md-9">
                        <h3 className='text-center pt-3'> Payment Status</h3>
                        <h6 className='text-end'>Total paid: TK. {totalAmount}</h6>
                        <div className="card mt-3 p-4 table-container">
                            {spinnerLoading ? <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "50vh" }}><Spinner /></div> : <table className="table">
                                <thead className='table-dark'>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Remark</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Method</th>
                                        <th scope="col">Trx ID</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Invoice</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payment.map((p, i) => {
                                        return (
                                            <tr key={p._id}>
                                                <th scope='row'>{i + 1}</th>
                                                <td>{p.remark}</td>
                                                <td>TK. {p.amount}</td>
                                                <td>{p.method}</td>
                                                <td>{p.trxId}</td>
                                                <td>{moment(p.paymentDate).format('ll')}</td>
                                                <td>
                                                    <button className="btn btn-secondary" onClick={() => generateInvoice(p)}>
                                                        <i className="fa-solid fa-download"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>}

                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ViewPayment;