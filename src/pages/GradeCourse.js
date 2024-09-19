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
                <div className="mt-3 mb-0">
                    <GoBackButton />
                </div>
                {spinnerLoading ?
                    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "50vh" }}>
                        <Spinner /> <p>Loading courses...</p>
                    </div> :
                    <div className="row mt-5">
                        <h4 className='text-center'>{grade.name}</h4>
                        <h6 className='text-center'>{courses.length} courses found</h6>
                        {
                            courses.map((c, i) =>
                               <div className="d-flex flex-wrap justify-content-center">
                                 <div className="card m-2" style={{ width: '15rem' }} key={c._id}>
                                    <img src={c.courseImg}
                                        className="p-1 cardImg card-img-top h-75" alt={c.name} />
                                    <div className="card-body">
                                        <h4 className="card-title">{c.title}</h4>
                                        <h6 className="card-text">Price: {c.price} Tk</h6>
                                        <p className="card-text">Starting Date: {c.dateRange} </p>
                                    </div>
                                </div>
                               </div>
                            )
                        }
                    </div>}
            </div>
        </Layout>
    );
};

export default GradeCourse;