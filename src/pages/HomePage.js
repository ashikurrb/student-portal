import React from 'react';
import Layout from '../components/Layouts/Layout';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import "../index.css";

const HomePage = () => {
    const navigate = useNavigate();

    const teachers = [
        {
            img: "/images/teachers/rifat.jpg",
            name: "MD Samiul Ferdous Rifat",
            title: "CEO and Principal",
            department: "Department of Management",
            university: "University of Dhaka",
        },
        {
            img: "/images/teachers/joy.jpg",
            name: "MD Azmal Hossain Joy",
            title: "Teacher",
            department: "Department of Political Science",
            university: "University of Dhaka",
        },
        {
            img: "/images/teachers/farhan.jpg",
            name: "Shah Ahmed Farhan",
            title: "Teacher & Exam Co-Ordinator",
            department: "Department of Biochemistry and Molecular Biology",
            university: "University of Dhaka",
        },
        {
            img: "/images/teachers/rafi.jpg",
            name: "Shayman Rafi",
            title: "Teacher",
            department: "Department of Computer Science and Engineering",
            university: "University of Dhaka",
        },
        {
            img: "/images/teachers/ashik.jpg",
            name: "Ashikur Rahman Bhuiyan",
            title: "Teacher & Exam Co-Ordinator",
            department: "Department of Tourism and Hospitality Management",
            university: "Mohammadpur Kendriya College",
        },
    ];

    const banner = [
        {
            img: "/images/banner/ssc-25-com.jpg",
            title: "SSC 2025 Commerce",
            status: "active"
        },
        {
            img: "/images/banner/ssc-25-sci.jpg",
            title: "SSC 2025 Science",
            status: "active"
        },
        {
            img: "/images/banner/carousel1.jpg",
            title: "banner1",
            status: "active"
        },
        {
            img: "/images/banner/carousel2.jpg",
            title: "banner2",
            status: "active"
        },

    ]

    return (
        <Layout title={"5points Academy - Best Coaching"}>
            <div className="container">
                <div id="carouselExampleAutoplaying" className="carousel slide mt-3" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        {
                            banner.map((b, i) => (
                                <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
                                    <img src={b.img} className="d-block w-100 desktop-img" alt={b?.title} />
                                </div>
                            ))
                        }
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true" />
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true" />
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>

                <div className="text-center my-5">
                    <button className="btn grade-btn border-dark py-3 w-75 fw-bold fs-3" onClick={() => navigate(`/view-courses`)}>
                        <i className="fa-solid fa-book-open" />  &nbsp;
                        Check out our new courses &nbsp; <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
                <div>
                    <motion.h2
                        className="text-center mt-5"
                        initial={{ x: "-100%" }} // Start from the left
                        animate={{ x: 0 }} // Move to the center
                        transition={{ duration: 2, ease: "easeOut" }} // Smooth animation
                    >
                        Our Teachers Panel
                    </motion.h2>
                </div>
                <hr />
                <div className='d-flex flex-wrap justify-content-lg-between justify-content-center'>
                    {
                        teachers.map((t, i) => (
                            <motion.div
                                key={i}
                                className="card m-2"
                                style={{ width: '15rem' }}
                                whileHover={{ scale: 1.09, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" }}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }} // Trigger animation when visible
                                transition={{ duration: 0.5, delay: i * 0.2 }} // Staggered animation
                            >
                                <img
                                    src={t?.img}
                                    className="card-img-top"
                                    style={{ height: '14rem' }}
                                    alt={t?.name}
                                />
                                <div className="card-body">
                                    <h5 className='card-title' style={{ height: '3rem' }}>{t?.name}</h5>
                                    <p className="form-text"> <b>{t?.title}</b></p>
                                    <p className='fw-bold' style={{ height: '4rem' }}>{t?.department}</p>
                                    <h6 className='fw-bold'> {t?.university}</h6>
                                </div>
                            </motion.div>
                        ))
                    }
                </div>
                <hr />
            </div>
        </Layout>
    );
};

export default HomePage;