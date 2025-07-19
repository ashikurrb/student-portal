import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Helmet } from 'react-helmet';
import { Toaster } from 'react-hot-toast';
//children is coming from props

const Layout = ({ children, title, description, keywords, author }) => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta name="author" content={author} />
                <title>{title}</title>
            </Helmet>
            <Header />
            <main style={{ minHeight: "90vh" }}>
                <Toaster toastOptions={{
                    className: 'toast-root'
                }} />
                {children}
            </main>
            <Footer/>
        </div>
    );
};
Layout.defaultProps = {
    title: "Student Portal",
    description: "Best Coaching in Mohammadpur, Dhaka",
    keywords: "student, portal, education, dhaka, tajamahal road, mohammadpur, coaching,  class 6, class 7, class 8, class 9, class 10, hsc, ssc, admission coaching, admission preparation, job coaching, job preparation ",
    author: "@ashikurrb, ThoughtHub"
}
export default Layout;