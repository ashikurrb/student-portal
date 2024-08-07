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

        // Set page size to A5
        const doc = new jsPDF({
            format: 'a5',
            unit: 'mm'
        });

        // Define margins
        const leftMargin = 10; // Adjust as needed
        const rightMargin = 10; // Adjust as needed

        // Add background watermark
        const logo = new Image();
        logo.src = "/images/logoBrand.png"; // Adjust the path as needed
        logo.onload = () => {
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const imgWidth = pageWidth * 0.5; // Scale the logo to 50% of page width
            const imgHeight = (imgWidth * logo.height) / logo.width; // Maintain aspect ratio

            const imgX = (pageWidth - imgWidth) / 2; // Center horizontally
            const imgY = (pageHeight - imgHeight) / 2; // Center vertically

            // Add the watermark image with low opacity to simulate blur
            doc.addImage(logo, 'PNG', imgX, imgY, imgWidth, imgHeight, '', 'NONE', 0.05); // Adjust opacity to 0.05 for a lighter watermark effect

            // Add text and other elements
            doc.setFontSize(22);
            const instituteName = '5points Academy';
            const titleWidth1 = doc.getTextWidth(instituteName);
            const titleX1 = (pageWidth - titleWidth1) / 2; // Center text horizontally
            doc.text(instituteName, titleX1, 12);

            doc.setFontSize(11);
            const addressName = 'Tajmahal Road, Dhaka - 1207';
            const titleWidth2 = doc.getTextWidth(addressName);
            const titleX2 = (pageWidth - titleWidth2) / 2; // Center text horizontally
            doc.text(addressName, titleX2, 19);

            const mobile = 'Mobile: +880 1794-744343';
            const titleWidth3 = doc.getTextWidth(mobile);
            const titleX3 = (pageWidth - titleWidth3) / 2; // Center text horizontally
            doc.text(mobile, titleX3, 25);

            doc.setFontSize(16);
            const title = 'Payment Invoice';
            const titleWidth = doc.getTextWidth(title);
            const titleX = (pageWidth - titleWidth) / 2; // Center text horizontally
            doc.text(title, titleX, 36);

            //Identify portion
            doc.setFontSize(10);
            const verticalSpacing = 8; // Adjust this value to reduce the spacing

            // Bold Date: and labels
            doc.setFont('helvetica', 'bold'); // Set font to bold
            const dateText = `${moment(payment.paymentDate).format('ll')}`;
            doc.text('Date:', pageWidth - rightMargin - doc.getTextWidth(dateText) - doc.getTextWidth('Date:'), 54);
            doc.text('Name:', leftMargin, 54 + verticalSpacing);
            doc.text('Grade:', leftMargin, 54 + 2 * verticalSpacing);
            doc.text('Email:', leftMargin, 54 + 3 * verticalSpacing);
            doc.text('Mobile:', leftMargin, 54 + 4 * verticalSpacing);

            // Normal text
            doc.setFont('helvetica', 'normal'); // Revert font to normal
            doc.text(dateText, pageWidth - rightMargin - doc.getTextWidth(dateText), 54); // Position date text
            doc.text(`${auth.user.name}`, leftMargin + doc.getTextWidth('Name:') + 2, 54 + verticalSpacing);
            doc.text(`${auth.user.grade.name}`, leftMargin + doc.getTextWidth('Grade:') + 2, 54 + 2 * verticalSpacing);
            doc.text(`${auth.user.email}`, leftMargin + doc.getTextWidth('Email:') + 2, 54 + 3 * verticalSpacing);
            doc.text(`${auth.user.phone}`, leftMargin + doc.getTextWidth('Mobile:') + 2, 54 + 4 * verticalSpacing);


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
                const imgY = finalY + 50;

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
                const footerText = `This is a system generated Invoice | Generated on: ${currentDateTime}`;
                const footerWidth = doc.getTextWidth(footerText);
                const footerX = (pageWidth - footerWidth) / 2; // Center text horizontally
                const footerY = pageHeight - 10; // Adjust this value to position the footer correctly
                doc.text(footerText, footerX, footerY);

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