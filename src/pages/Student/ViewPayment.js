import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout'
import Spinner from '../../components/Spinner';
import StudentMenu from './StudentMenu';
import axios from 'axios';

const ViewPayment = () => {
    const [payment, setPayment] = useState([]);
    const [spinnerLoading, setSpinnerLoading] = useState(true);

    const getPayment = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/payment/user-payment`);
            setPayment(data);
        } catch (error) {
            console.log(error);
        } finally {
            setSpinnerLoading(false);
        }
    };
    useEffect(() => {
        getPayment();
    }, []);

 //total payment amount calculate
 const totalAmount = payment.reduce((sum, p) => sum + p.amount, 0);

    return (
        <Layout title={"Dashboard - Student"}>
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
                                                <td>{p.paymentDate}</td>
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