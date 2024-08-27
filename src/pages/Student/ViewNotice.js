import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import Spinner from '../../components/Spinner';
import moment from 'moment';
import axios from 'axios';

const ViewNotice = () => {
    const [notice, setNotice] = useState([]);
    const [spinnerLoading, setSpinnerLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null); // State to hold the selected image

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

    // Function to handle image click
    const handleImageClick = (img) => {
        setSelectedImage(img);
    };

    // Function to close the modal
    const handleCloseModal = () => {
        setSelectedImage(null);
    };

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
                                            <div className="card me-5 my-2 ps-4 py-3" key={i}>
                                                <div className="d-flex">
                                                    <div className="col-md-6">
                                                        <figcaption className='blockquote-footer'>{moment(n.createdAt).fromNow()}</figcaption>
                                                        <h5>{n.title}</h5>
                                                        <span>Grade: {n?.grade?.name}</span>
                                                        <p>{n.noticeInfo}</p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className='mx-5 my-22'>
                                                            <img 
                                                                style={{ width: "150px", cursor: "pointer" }} 
                                                                src={n.noticeImg} 
                                                                alt="" 
                                                                onClick={() => handleImageClick(n.noticeImg)} 
                                                            />
                                                        </div>
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

            {/* Modal */}
            {selectedImage && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content shadow border border-3">
                            <div className="modal-header">
                                <h5 className="modal-title">Image Preview</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <img src={selectedImage} alt="Notice" style={{ width: '100%' }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ViewNotice;
