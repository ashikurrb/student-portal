import React from 'react';
import Layout from '../components/Layouts/Layout';

const HomePage = () => {
    return (
        <Layout title={"5points Academy - Best Coaching"}>
            <div className="container">
                <div id="carouselExampleAutoplaying" className="carousel slide mt-3" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src="/images/banner/carousel1.jpg" height={400} className="d-block w-100" alt="banner1" />
                        </div>
                        <div className="carousel-item">
                            <img src="/images/banner/carousel2.png" height={400} className="d-block w-100" alt="banner2" />
                        </div>
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

                <h2 className='text-center mt-5'>Our Teachers Panel</h2>
                <hr />
                <div className='d-flex flex-wrap justify-content-lg-between justify-content-center'>
                    <div className="card m-2" style={{ width: '16rem' }}>
                        <img
                            src="/images/teachers/rifat.jpg"
                            className="card-img-top"
                            style={{ height: '200px' }}
                            alt="rifat" />
                        <div className="card-body">
                            <h5 className='card-title'>MD Samiul Ferdous Rifat</h5>
                            <h4 className="form-text"> <b>CEO and Principle</b></h4>
                            <p className='fw-bold mt-4'>Department of Management</p>
                            <h6 className='fw-bold'> Univeristy of Dhaka</h6>
                        </div>
                    </div>
                    <div className="card m-2" style={{ width: '16rem' }}>
                        <img
                            src="/images/teachers/joy.jpg"
                            className="card-img-top"
                            style={{ height: '200px' }}
                            alt="joy" />
                        <div className="card-body">
                            <h5 className='card-title'>MD Azmal Hossain Joy</h5>
                            <h4 className="form-text"> <b>Teacher</b></h4>
                            <p className='fw-bold mt-4'>Department of Political Science</p>
                            <h6 className='fw-bold'> Univeristy of Dhaka</h6>
                        </div>
                    </div>
                    <div className="card m-2" style={{ width: '16rem' }}>
                        <img
                            src="/images/teachers/farhan.jpg"
                            className="card-img-top"
                            style={{ height: '200px' }}
                            alt="joy" />
                        <div className="card-body">
                            <h5 className='card-title'>Shah Ahmed Farhan</h5>
                            <h4 className="form-text"> <b>Teacher</b></h4>
                            <p className='fw-bold mt-4'>Department of Biochemistry and Molecular Biology </p>
                            <h6 className='fw-bold'> Univeristy of Dhaka</h6>
                        </div>
                    </div>
                    <div className="card m-2" style={{ width: '16rem' }}>
                        <img
                            src="/images/teachers/rafi.jpg"
                            className="card-img-top"
                            style={{ height: '200px' }}
                            alt="joy" />
                        <div className="card-body">
                            <h5 className='card-title'>Shayman Rafi </h5>
                            <h4 className="form-text"> <b>Teacher</b></h4>
                            <p className='fw-bold mt-4'>Department of Computer Science and Engineering </p>
                            <h6 className='fw-bold'> Univeristy of Dhaka</h6>
                        </div>
                    </div>
                </div>
                <hr />
            </div>
        </Layout>
    );
};

export default HomePage;