import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import GoBackButton from '../../components/GoBackButton';
import Spinner from '../../components/Spinner';
import moment from 'moment';
import { useAuth } from '../../context/auth';
import { Image, Input, Modal, Select } from 'antd';
import toast from 'react-hot-toast';
const { Option } = Select;

const CourseDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const [auth] = useAuth();
    const [course, setCourse] = useState({});
    const [relatedCourse, setRelatedCourse] = useState([]);
    const methods = ['bKash', 'Rocket'];
    const [method, setMethod] = useState(null);
    const [accNumber, setAccNumber] = useState('');
    const [trxId, setTrxId] = useState('');
    const [spinnerLoading, setSpinnerLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [visibleOrderModal, setVisibleOrderModal] = useState(false);

    useEffect(() => {
        if (params?.slug) getCourse();
    }, [params?.slug])

    //get Course
    const getCourse = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/course/get-course/${params.slug}`);
            setCourse(data);
            // getRelatedCourse(data?.course?._id, data?.course?.grade?._id);
        } catch (error) {
            console.log(error);
        }
        finally {
            setSpinnerLoading(false)
        }
    }

    // //get similar course
    // const getRelatedCourse = async (cid, gid) => {
    //     try {
    //         const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/course/related-course/${cid}/${gid}`);
    //         setRelatedCourse(data?.course);
    //         console.log(data);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const openModal = () => {
        setVisible(true);
    };

    //handle create order
    const handleCreate = async (e) => {
        e.preventDefault();
        setSpinnerLoading(true);
        try {
            const courseId = course._id;
            console.log(courseId);
            const orderData = new FormData();
            orderData.append('course', courseId);
            orderData.append('method', method);
            orderData.append('accNumber', accNumber);
            orderData.append('trxId', trxId);
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/order/create-order`, orderData);
            if (data?.success) {
                setSpinnerLoading(false);
                setVisibleOrderModal(true);
                // Clear form fields
                setMethod(undefined);
                setAccNumber('');
                setTrxId('');
                setVisible(false);
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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [navigate]);

    const refinedDocView = (text) => {
        if (!text) {
            return ''; // Return an empty string or handle accordingly if text is undefined/null
        }
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const textWithLinks = text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
        const textWithNewLines = textWithLinks.replace(/\n/g, '<br>');
        return textWithNewLines;
    };

    return (
        <Layout title={"Course Details"}>
            <div className="container">
                <div className="row align-items-center mt-4">
                    <div className="col-auto">
                        <GoBackButton />
                    </div>
                    <div className="col">
                        <h4 className="mb-0 me-5 p-3 text-center">Course Details</h4>
                    </div>
                </div>
                {
                    spinnerLoading ?
                        <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "50vh" }}>
                            <Spinner />
                        </div> :
                        <div className="container">
                            <div className="row">
                                <div className="col-md-5">
                                    <div className="ms-md-5 mt-4">
                                        <Image className='border rounded' src={course.courseImg} alt={course.title} style={{ width: "100%" }} />
                                    </div>
                                </div>
                                <div className="col-md-7">
                                    <div className='ms-md-5 mt-4'>
                                        <div className="card-body">
                                            <h1>{course.title}</h1>
                                            <Link to={`/view-course/${course.grade.slug}`}><p className="card-text">Grade: <b>{course?.grade?.name}</b></p></Link>
                                            <h6 className="card-text">Class start: {moment(course.dateRange).format('ll')}</h6>
                                            <h4 className="card-text"> <span className='fs-2 fw-bold'>৳</span>{course.price}</h4>
                                            {
                                                course.status === "Active" ? (
                                                    auth.token ? (
                                                        <button className='btn btn-primary mb-3 fw-bold' onClick={openModal}>
                                                            <i className="fa-solid fa-plus"></i> Enroll Now
                                                        </button>
                                                    ) : (
                                                        <h5 className='my-3'>
                                                            Please <span style={{ cursor: 'pointer', textDecoration: 'underline', color: "blue" }} onClick={() => navigate("/login", { state: { from: location.pathname } })}>
                                                                <u>Login</u>
                                                            </span> to buy this course
                                                        </h5>
                                                    )
                                                ) : (
                                                    <h5 className='text-danger my-3'>Coming soon</h5>
                                                )
                                            }
                                            <p style={{ textAlign: "justify" }}
                                                dangerouslySetInnerHTML={{
                                                    __html: refinedDocView(course.description)
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
                <hr />
                <div className='col-md-12 my-4'>
                    <h5 className='text-center'><u>নিয়মাবলী</u></h5>
                    <ol className='list'>
                        <li> যেই কোর্স কিনতে চান সেটায় প্রবেশ করে বিস্তারিত পড়ুন</li>
                        <li>সবকিছু সম্মত থাকলে Enroll Now বাটনে ক্লিক করুন</li>
                        <li>Enroll Now বাটন না পেলে Login করুন। রেজিস্ট্রেশন করা না থাকলে আগে রেজিস্ট্রেশন করুন। রেজিস্ট্রেশনের সময় WhatsApp একাউন্ট আছে এরকম একটি নাম্বার ব্যাবহার করুন।</li>
                        <li>ওয়েবসাইটে Login করা হলে Enroll Now বাটন দেখাবে, সেটিতে ক্লিক করুন </li>
                        <li>একটা পপ-আপ ওপেন হবে। প্রদর্শনকৃত MFS (bKash: 01794-744343, Rocket: 01794-744343) নাম্বারে কোর্স এর সমপরিমান মূল্য পরিশোধ (Send Money) করুন</li>
                        <li>পেমেন্ট মেথড (bKash, Rocket), যেই MFS নাম্বার থেকে মূল্য পরিশোধ করেছেন সেটা এবং MFS থেকে প্রাপ্ত Transaction/Trx ID টি প্রবেশ করান এবং Sumbit Payment বাটনে ক্লিক করুন </li>
                        <li>এডমিন আপনার পেমেন্ট ভেরিফাই করে আপনাকে প্রাইভেট Messenger / WhatsApp গ্রুপে এড করবেন</li>
                        <li>পেমেন্ট ভেরিফাই সম্পন্ন হলে আপনি Dashboard এর <Link className='fw-bold' to="/dashboard/student/view-payment">Payment Status</Link> অপশন থেকে আপনার Invoice টি ডাউনলোড করতে পারবেন </li>
                    </ol>
                </div>
                {/*<div className="row">
                    <h4 className='text-center'>Similar Course</h4>
                    {spinnerLoading ? <div className='my-5'><Spinner /></div> : <>
                        {relatedCourse?.length < 1 && (<p className="text-center">No Similar Course Found</p>)}
                        <div className="d-flex flex-wrap justify-content-md-start justify-content-center">
                            {relatedCourse?.map(c => (
                                <div className="card m-2" style={{ width: '15rem' }} key={c._id}>
                                    <img src={c.courseImg}
                                        className="p-1 cardImg card-img-top h-75" alt={c.name} />
                                    <div className="card-body">
                                        <h4 className="card-title">{c.title}</h4>
                                        <h6 className="card-text"><span className='fs-3 fw-bold'>৳</span>{c.price}</h6>
                                        <p className="card-text">Start:  {moment(c.dateRange).format("ll")} </p>
                                        <button className="btn btn-primary w-100" onClick={() => navigate(`/view-course/${c.grade.slug}/${c.slug}`)}>Details</button>
                                    </div>
                                </div>
                            ))}
                        </div></>
                    }
                </div> */}
            </div>
            <Modal style={{ top: 30 }} width={800} onCancel={() => setVisible(false)} open={visible} footer={null} maskClosable={false}>
                <h5 className='text-center mb-3'>Payment Details</h5>
                <div>
                    <h6>আপনি কিনতে চাচ্ছেন:</h6>
                    <div className='text-center my-2 border border-2 rounded'>
                        <h6>Course: <b>{course.title}</b> ({course?.grade?.name})</h6>
                        <h6 className="">Price: <span className='fw-bold'>৳</span>{course.price}</h6>
                    </div>
                    <p className='text-center my-3'>
                        Send Money করুন <b>bKash/Rocket: </b>01794-744343 নাম্বারে
                    </p>
                </div>
                <div className="row">
                    <div className="d-flex justify-content-evenly">
                        <Image style={{ height: "200px", border: "1px solid black", borderRadius: "5px" }} src={"/images/bKashPayment.jpg"} alt={"bKashQR"} />
                        <Image style={{ height: "200px", border: "1px solid black", borderRadius: "5px" }} src={"/images/rocketPayment.jpg"} alt={"rocketQR"} />
                    </div>
                    <h6 className='text-primary text-center my-3'>Click QR to view large</h6>
                    <form onSubmit={handleCreate}>
                        <div className="d-flex">
                            <Select
                                placeholder="Method"
                                size='large'
                                className='mb-3 me-2 w-100'
                                value={method}
                                onChange={(value) => setMethod(value)}
                                required>
                                {methods.map((m, i) => (
                                    <Option key={i} value={m}>{m}</Option>
                                ))}
                            </Select>
                            <Input
                                showCount
                                type="number"
                                size='large'
                                placeholder='MFS Number'
                                className='mb-3 me-2'
                                value={accNumber}
                                onChange={(e) => setAccNumber(e.target.value)}
                                minLength={11} maxLength={11}
                                required
                            />
                        </div>
                        <Input
                            type="text"
                            size='large'
                            placeholder='Transaction ID'
                            className='mb-3 me-2'
                            value={trxId}
                            onChange={(e) => setTrxId(e.target.value)}
                            minLength={4} maxLength={25}
                            required
                        />
                        <div className="text-center">
                            <button type="submit" className="btn btn-warning fw-bold mt-2">
                                {spinnerLoading ? <div><Spinner /> </div> : "Submit Payment"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
            <Modal centered width={700} onCancel={() => setVisibleOrderModal(false)} open={visibleOrderModal} footer={null}>
                <h3 className='text-center mb-3'>Your order has been placed successfully</h3>
                <div className="d-flex justify-content-center align-items-center">
                    <img style={{ width: "40%" }} src="/images/success.gif" alt="success" />
                </div>
                <h6 className='text-center my-3'>Please check your email for the purchase details and further instructions</h6>
                <div className="text-center">
                    <button className="btn btn-primary fw-bold" onClick={() => navigate("/dashboard/student/view-order")}>View Order</button>
                </div>
            </Modal>
        </Layout>
    );
};

export default CourseDetails;