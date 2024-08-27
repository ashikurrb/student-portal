import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import Spinner from '../../components/Spinner';
import moment from 'moment';
import axios from 'axios';

const ViewNotice = () => {
    const [notice, setNotice] = useState([]);
    const [spinnerLoading, setSpinnerLoading] = useState(true);

    const getContent = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/notice/get-notice`);
            setNotice(data);
        } catch (error) {
            console.log(error);
        } finally {
            setSpinnerLoading(false);
        }
    };
    useEffect(() => {
        getContent();
    }, []);
    return (
        <Layout title={"Notice"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                   <div className="col-md-12">
                   <h2 className='text-center my-3'>Notice</h2>
                   {
                    spinnerLoading ? <div className="text-center m-5">
                        <Spinner /> <p>Loading Notice...</p>
                    </div> : <div className="row">
                        {
                            notice.map((n, i) => {
                                return (
                                    <div className="card m-2 d-lg-flex">
                                       <div className="col-md-6">
                                       <h5>{n.title}</h5>
                                        <span>Created: {moment(n.createdAt).fromNow()}</span>
                                        <span>Grade: {n?.grade?.name}</span>
                                        <p>{n.noticeInfo}</p>
                                       </div>
                                       <div className="col-md-6">
                                       <span><img style={{width:"50px"}} src={n.noticeImg} alt="" /></span>
                                       </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                }
                   </div>
                </div>
            </div>
        </Layout>
    );
};

export default ViewNotice;