import React from 'react';
import Layout from '../components/Layouts/Layout';

const HomePage = () => {
    return (
        <Layout title={"5points - Best Coaching"}>
            <div className="container">
                <div className="row">
                    <div>
                        <h1 className='text-center my-5'>Welcome to Bangladesh 2.0</h1>
                    </div>
                    <p>
                        শিক্ষার এক নতুন যুগে প্রতিযোগিতামূলক সফলতা অর্জনের জন্য আমরা 5points school আছি সবসময় আপনাদের পাশে।
                        শিক্ষার্থীর যেকোনো ক্লাসের যেকোনো subject এর হাজারো সব সমস্যার সমাধান পাবেন একই প্লাটফর্মে যা পাওয়া যাবে খুবই সাশ্রয়ী মূল্যে।
                        একই সাথে আমরা আছি শিক্ষার্থীর স্কুল জীবন থেকে শুরু করে জীবনের প্রতিটা অধ্যায়ের সফলতা অর্জনের সহযোগী হিসেবে।
                        এরকম আরো সুবিধা একই প্লাটফর্মে পেতে আজই সাইন আপ/রেজিস্টার করে আমাদের সাথে থাকুন
                    </p>
                    <div>
                        Call us for more information about admission and courses.
                        <br />
                        <i className='fa-solid fa-envelope'></i> : 5pointschool@gmail.com
                        <br />
                        <i className='fa-solid fa-phone-volume'></i> : +880 1794-744343
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;