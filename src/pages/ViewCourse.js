import React, { useEffect, useState } from 'react';
import Layout from '../components/Layouts/Layout';
import axios from 'axios';
import GoBackButton from '../components/GoBackButton';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';

const ViewCourse = () => {
    const [auth] = useAuth();
    const [grades, setGrades] = useState([]);
    const [spinnerLoading, setSpinnerLoading] = useState(true);

    //Get All Grades
    const getAllGrades = async (req, res) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/grade/all-grades`);
            if (data?.success) {
                setGrades(data?.grade);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setSpinnerLoading(false);
        }

    };
    useEffect(() => {
        getAllGrades();
    }, []);

    return (
        <Layout title={"View Courses - 5points Academy"}>
            <div className="container">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-auto">
                            <GoBackButton />
                        </div>
                        <div className="col">
                            <h2 className="text-center mt-4 me-5">
                                View Courses
                            </h2>
                            <p className="fw-bold form-text text-center me-5">Click on grade to find and enroll courses</p>
                        </div>
                    </div>
                    {spinnerLoading ?
                        <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "50vh" }}>
                            <Spinner /> <p>Loading grades...</p>
                        </div> :
                        <div className="row">
                            <div className="d-flex flex-wrap justify-content-center">
                                {grades.map(g => (
                                    (g.name !== "Administration" || auth?.user?.role === 1) && (
                                        <div className="col-md-2 card grade-btn border-dark p-3 m-2" key={g._id}>
                                            <Link className='grade-link' to={`/view-courses/${g.slug}`}>{g.name} </Link>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    }
                </div>
            </div>
        </Layout>
    );
};

export default ViewCourse;