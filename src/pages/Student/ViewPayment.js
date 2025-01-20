import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout'
import Spinner from '../../components/Spinner';
import StudentMenu from './StudentMenu';
import axios from 'axios';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ViewPayment = () => {
    const methods = [
        { name: "Cash", logo: "/images/paymentMethod/cashLogo.png" },
        { name: "bKash", logo: "/images/paymentMethod/bKashLogo.png" },
        { name: "Nagad", logo: "/images/paymentMethod/nagadLogo.png" },
        { name: "Upay", logo: "/images/paymentMethod/upayLogo.png" },
        { name: "Rocket", logo: "/images/paymentMethod/rocketLogo.png" },
        { name: "Debit/Credit Card", logo: "/images/paymentMethod/cardLogo.png" },
        { name: "Bank Transfer", logo: "/images/paymentMethod/bankLogo.png" }
    ];
    const [payment, setPayment] = useState([]);
    const [spinnerLoading, setSpinnerLoading] = useState(true);

    const getPayment = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/payment/user-payment`);
            setPayment(data);
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
        getPayment();
    }, []);

    //total payment amount calculate
    const totalAmount = payment.reduce((sum, p) => sum + p.amount, 0);

    // Function to generate receipt PDF
    const generateReceipt = (payment) => {
        const loadingToastId = toast.loading('Generating Receipt...');

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
            const imgY = (pageHeight - imgHeight) / 2.2; // Center vertically

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

            const website = 'www.5points-academy.com';
            const titleWidth4 = doc.getTextWidth(website);
            const titleX4 = (pageWidth - titleWidth4) / 2; // Center text horizontally
            doc.text(website, titleX4, 32);

            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            const title = 'Payment Receipt';
            const titleWidth = doc.getTextWidth(title);
            const titleX = (pageWidth - titleWidth) / 2; // Center text horizontally
            doc.text(title, titleX, 44);

            //Identify portion
            doc.setFontSize(10);
            const verticalSpacing = 8; // Adjust this value to reduce the spacing

            // Bold Date: and labels
            doc.setFont('helvetica', 'bold');
            const dateText = `${dayjs(payment.paymentDate).format('DD-MM-YYYY')}`;
            doc.text('Date:', pageWidth - rightMargin - doc.getTextWidth(dateText) - doc.getTextWidth('Date: '), 57);
            doc.text('Name:', leftMargin, 57 + verticalSpacing);
            doc.text('Grade:', leftMargin, 57 + 2 * verticalSpacing);
            doc.text('Email:', leftMargin, 57 + 3 * verticalSpacing);
            doc.text('Mobile:', leftMargin, 57 + 4 * verticalSpacing);

            // Normal text
            doc.setFont('helvetica', 'normal'); // Revert font to normal
            doc.text(dateText, pageWidth - rightMargin - doc.getTextWidth(dateText), 57); // Position date text
            doc.text(`${payment.user.name}`, leftMargin + doc.getTextWidth('Name:') + 2, 57 + verticalSpacing);
            doc.text(`${payment.grade.name}`, leftMargin + doc.getTextWidth('Grade:') + 2, 57 + 2 * verticalSpacing);
            doc.text(`${payment.user.email}`, leftMargin + doc.getTextWidth('Email:') + 2, 57 + 3 * verticalSpacing);
            doc.text(`${payment.user.phone}`, leftMargin + doc.getTextWidth('Mobile:') + 2, 57 + 4 * verticalSpacing);


            doc.autoTable({
                startY: 100,
                margin: { left: leftMargin, right: rightMargin },
                head: [['Remark', 'Amount', 'Method', 'Trx ID']],
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
                const imgY = finalY + 55;

                doc.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight);

                const lineY = imgY + imgHeight + 1;
                doc.line(imgX, lineY, imgX + imgWidth, lineY);

                const textX = imgX + imgWidth / 2;
                const textY = lineY + 5;
                doc.text('Authority', textX, textY, { align: 'center' });

                // Add footer text with date and time
                doc.setFontSize(8); // Adjust font size for footer
                doc.setTextColor(128, 128, 128); // Set text color to grey
                const currentDateTime = dayjs().format('MMMM D, YYYY h:mm A');
                const footerText = `This is a system generated receipt | Generated on: ${currentDateTime}`;
                const footerWidth = doc.getTextWidth(footerText);
                const footerX = (pageWidth - footerWidth) / 2; // Center text horizontally
                const footerY = pageHeight - 5; // Adjust this value to position the footer correctly
                doc.text(footerText, footerX, footerY);

                const blob = doc.output('blob');
                const url = URL.createObjectURL(blob);
                toast.success("Receipt generated", { id: loadingToastId });
                const printWindow = window.open(url);
                if (printWindow) {
                    printWindow.focus();
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
                        <h3 className="text-center my-4">
                            <i className="fa-solid fa-credit-card pe-2" /> Payment Status
                        </h3>
                        <h6 className='text-end'>Total paid: TK. {totalAmount}</h6>
                        <div className="card mt-2 p-4 table-container">
                            {spinnerLoading ? <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "50vh" }}><Spinner /></div> : <table className="table table-striped">
                                <thead className='table-dark'>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Grade</th>
                                        <th scope="col">Remark</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Method</th>
                                        <th scope="col">Trx ID</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Receipt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        payment.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="text-center">
                                                    <div className="my-5">
                                                        <h3 className='text-secondary'>No Payment Status Found</h3>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            payment.map((p, i) => {
                                                return (
                                                    <tr key={p._id}>
                                                        <th scope='row'>{i + 1}</th>
                                                        <td>{p?.grade?.name}</td>
                                                        <td>{p.remark}</td>
                                                        <td>TK. {p.amount}</td>
                                                        <td>
                                                            {methods.map((m) =>
                                                                m.name === p.method ? (
                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <img
                                                                            src={m.logo}
                                                                            alt={m.name}
                                                                            style={{ width: 20, height: 20, marginRight: 5 }}
                                                                        />
                                                                        {m.name}
                                                                    </div>
                                                                ) : null
                                                            )}
                                                        </td>
                                                        <td>{p.trxId}</td>
                                                        <td>{dayjs(p.paymentDate).format('MMM DD, YYYY')}</td>
                                                        <td>
                                                            <button className="btn btn-secondary" onClick={() => generateReceipt(p)}>
                                                                <i className="fa-solid fa-download"></i>
                                                            </button>
                                                        </td>
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
        </Layout>
    );
};

export default ViewPayment;