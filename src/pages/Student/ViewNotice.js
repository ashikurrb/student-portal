import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import Spinner from '../../components/Spinner';
import moment from 'moment';
import axios from 'axios';
import {
    DownloadOutlined,
    RotateLeftOutlined,
    RotateRightOutlined,
    SwapOutlined,
    UndoOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
} from '@ant-design/icons';
import { Image, Space } from 'antd';
import GoBackButton from '../../components/GoBackButton';

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

    const onDownload = (imgUrl) => {
        fetch(imgUrl)
            .then((response) => response.blob())
            .then((blob) => {
                const url = URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.download = 'image.png';
                document.body.appendChild(link);
                link.click();
                URL.revokeObjectURL(url);
                link.remove();
            });
    };

    const convertLinksToAnchorTags = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const textWithLinks = text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
        const textWithNewLines = textWithLinks.replace(/\n/g, '<br>'); // Replace newlines with <br>
        return textWithNewLines;
    };

    return (
        <Layout title={"Notice"}>
            <div className="container-fluid px-5 mb-3">
                <div className="d-flex align-items-center">
                    <div className="col-auto">
                        <GoBackButton />
                    </div>
                    <div className="col">
                        <h2 className="p-3 mt-3 me-5 text-center"><i class="fa-solid fa-bell pe-1"></i> Notice</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        {
                            spinnerLoading ? <div className="text-center m-5">
                                <Spinner /> <p>Loading Notice...</p>
                            </div> : <div className="row">
                                {
                                    notice.length === 0 ? <div className="card text-center h2 p-5 mt-5 text-secondary ">No Notice Found</div>
                                        :
                                        notice.map((n, i) => (
                                            <div className="card mx-auto my-2 px-4 py-2 d-flex col-12 col-md-8">
                                                <div className="row">
                                                    <span className="text-secondary d-flex justify-content-between">
                                                        <span>
                                                            {
                                                                n?.grade?.name ? n?.grade?.name : "Official Notice"
                                                            }
                                                        </span>
                                                        <span>
                                                            {moment(n.updatedAt).fromNow()}
                                                        </span>
                                                    </span>

                                                    <div className="col-md-6 mt-2 order-2 order-md-1">
                                                        <h4>{n.title}</h4>
                                                        <p style={{ textAlign: "justify" }}
                                                            dangerouslySetInnerHTML={{
                                                                __html: convertLinksToAnchorTags(n.noticeInfo)
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-md-6 mt-2 d-flex justify-content-center align-items-center order-1 order-md-2">
                                                        <Image
                                                            style={{ width: "auto", height: "150px" }}
                                                            src={n.noticeImg}
                                                            fallback="https://demofree.sirv.com/nope-not-here.jpg"
                                                            alt="notice"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
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