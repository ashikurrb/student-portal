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

            </div>
        </Layout>
    );
};

export default HomePage;