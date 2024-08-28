import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import Spinner from '../../components/Spinner';
import moment from 'moment';
import axios from 'axios';
import { Modal } from 'antd';
import GoBackButton from '../../components/GoBackButton';

const ViewNotice = () => {
    const [notice, setNotice] = useState([]);
    const [spinnerLoading, setSpinnerLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [visible, setVisible] = useState(false);

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

    const openModal = (img) => {
        setVisible(true);
        setSelectedImage(img);
    };

    return (
        <Layout title={"Notice"}>
            <div className="container px-5 mb-3">
                <div className="row">
                <div className="row align-items-center mt-3">
                    <div className="col-auto">
                        <GoBackButton />
                    </div>
                </div>
                    <div className="col-md-12">
                        <h2 className='text-center'>Notice</h2>
                        {
                            spinnerLoading ? <div className="text-center m-5">
                                <Spinner /> <p>Loading Notice...</p>
                            </div> : <div className="row">
                                {
                                    notice.map((n, i) => {
                                        return (
                                            <div className="card me-5 my-2 ps-4 py-2 d-flex ">
                                                     <span className="text-secondary">
                                                    {moment(n.createdAt).fromNow()} | {n?.grade?.name}
                                                </span>
                                                <div className="row w-100">
                                                     <div className="col-md-6">
                                                        <h4>{n.title}</h4>
                                                        <p>{n.noticeInfo}</p>
                                                    </div>
                                                  
                                                    <div className="col-md-5 d-flex justify-content-center">
                                                        <img style={{ width: "200px" }} src={n.noticeImg} alt="notice" className="img-thumbnail" onClick={() => openModal(n.noticeImg)} />
                                                    </div>
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
            <Modal width={750} onCancel={() => setVisible(false)} visible={visible} footer={null}>
                <h5>Image Privew</h5>
                <img className='mt-2 rounded p-0' src={selectedImage} alt="Notice" style={{ width: '100%' }} />
            </Modal>
        </Layout>
    );
};

export default ViewNotice;
