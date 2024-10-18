import React from 'react';
import Layout from '../components/Layouts/Layout';
import GoBackButton from '../components/GoBackButton';

const About = () => {
    return (
        <Layout title={"About Us - 5points Academy"}>
            <div className="container">
                <div className="row">
                    <div className="d-flex align-items-center">
                        <div className="col-auto">
                            <GoBackButton />
                        </div>
                        <div className="col">
                            <h2 className="p-3 mt-3 text-center">About Us</h2>
                        </div>
                    </div>
                    <div className="row mx-1 mt-5">
                        <div className="col-md-5">
                            <img src="https://raw.githubusercontent.com/techinfo-youtube/ecommerce-app-2023/main/client/public/images/contactus.jpeg" alt="about" style={{ width: "100%" }} />
                        </div>
                        <div className="col-md-7">
                            <p className='mt-5' style={{ textAlign: "justify" }}>
                                শিক্ষার এক নতুন যুগে প্রতিযোগিতামূলক সফলতা অর্জনের জন্য আমরা 5points school আছি সবসময় আপনাদের পাশে।
                                <br />
                                শিক্ষার্থীর যেকোনো ক্লাসের যেকোনো subject এর হাজারো সব সমস্যার সমাধান পাবেন একই প্লাটফর্মে যা পাওয়া যাবে খুবই সাশ্রয়ী মূল্যে।
                                <br />
                                একই সাথে আমরা আছি শিক্ষার্থীর স্কুল জীবন থেকে শুরু করে জীবনের প্রতিটা অধ্যায়ের সফলতা অর্জনের সহযোগী হিসেবে।
                                <br />
                                এরকম আরো সুবিধা একই প্লাটফর্মে পেতে আজই সাইন আপ/রেজিস্টার করে আমাদের সাথে থাকুন
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default About;