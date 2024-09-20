import React, { useEffect, useState } from 'react';
import Layout from '../components/Layouts/Layout';
import moment from 'moment';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import GoBackButton from '../components/GoBackButton';

const GradeCourse = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [grade, setGrade] = useState([]);

    //Get courses by grade
    const getGradeCourse = async () => {
        setSpinnerLoading(true);
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/course/grade-course/${params.slug}`);
            setCourses(data?.courses);
            setGrade(data?.grade);
        } catch (error) {
            console.log(error);
        } finally {
            setSpinnerLoading(false);
        }
    };

    useEffect(() => {
        if (params?.slug) getGradeCourse();
    }, [params?.slug])

    return (
        <Layout title={"View Courses"}>
            <div className="container">
                <div className="row align-items-center mt-4">
                    <div className="col-auto">
                        <GoBackButton />
                    </div>
                    <div className="col">
                        <h4 className="mb-0 me-5 p-3 text-center">{grade?.name} </h4>
                    </div>
                </div>
                {
                    spinnerLoading ?
                        <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "50vh" }}>
                            <Spinner /> <p>Loading courses...</p>
                        </div> :
                        <div className="row">
                            {
                                courses.length < 1 ?
                                    <div className="card text-center h2 p-5 mt-3 text-secondary">
                                        <h4>No courses available yet for this grade</h4>
                                    </div> : <h6 className='text-center'>{courses.length} courses found</h6>
                            }
                            <div className="d-flex flex-wrap justify-content-center">
                                {
                                    courses.map((c, i) =>
                                        <div className="card m-2" style={{ width: '15rem' }} key={c._id}>
                                            <img src={c.courseImg}
                                                className="p-1 cardImg card-img-top h-75" alt={c.name} />
                                            <div className="card-body">
                                                <h4 className="card-title">{c.title}</h4>
                                                <h6 className="card-text"><span className='fs-3 fw-bold'>৳</span>{c.price}</h6>
                                                <p className="card-text">Start:  {moment(c.dateRange).format("ll")} </p>
                                                <button className="btn btn-primary w-100" onClick={() => navigate(`/view-course/${grade.slug}/${c.slug}`)}>Details</button>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                }
            </div>
        </Layout>
    );
};

export default GradeCourse;