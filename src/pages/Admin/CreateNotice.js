import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from './AdminMenu';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import moment from 'moment';
import toast from 'react-hot-toast';
import { Alert, Modal, Select, Tooltip } from 'antd';
const { Option } = Select;

const CreateNotice = () => {
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [updateSpinnerLoading, setUpdateSpinnerLoading] = useState(false);
    const [listSpinnerLoading, setListSpinnerLoading] = useState(false);
    const [grades, setGrades] = useState([]);
    const [grade, setGrade] = useState("");
    const [notice, setNotice] = useState([]);
    const [noticeId, setNoticeId] = useState([]);
    const [title, setTitle] = useState('');
    const [noticeInfo, setNoticeInfo] = useState('');
    const [noticeImg, setNoticeImg] = useState('');
    const [updatedTitle, setUpdatedTitle] = useState('');
    const [updatedNoticeInfo, setUpdatedNoticeInfo] = useState('');
    const [updatedNoticeImg, setUpdatedNoticeImg] = useState('');
    const [selected, setSelected] = useState(null);
    const [createModalVisible, setIsCreateModalVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNotice, setSelectedNotice] = useState([]);

    //Get All Grades
    const getAllGrades = async (req, res) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/grade/all-grades`);
            if (data?.success) {
                setGrades(data?.grade);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error fetching Grades");
        }
    };
    useEffect(() => {
        getAllGrades();
    }, []);

    //Get all notices
    const getAllNotices = async () => {
        setListSpinnerLoading(true);
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/notice/all-notices`);
            setNotice(data);
        } catch (error) {
            console.log(error);
            toast.error("Error fetching notices");
        } finally {
            setListSpinnerLoading(false);
        }
    };
    useEffect(() => {
        getAllNotices();
    }, []);


    //Create Notice
    const handleCreate = async (e) => {
        e.preventDefault();
        setSpinnerLoading(true);
        try {
            const noticeData = new FormData();
            noticeData.append("title", title);
            noticeData.append("noticeInfo", noticeInfo);
            if (grade) {
                noticeData.append("grade", grade);
            }
            if (noticeImg) {
                noticeData.append("photo", noticeImg);
            }

            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/notice/create-notice`, noticeData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (data?.success) {
                toast.success(data?.message);
                getAllNotices();
                // Clear form fields
                setGrade('');
                setTitle('');
                setNoticeInfo('');
                setNoticeImg('');
                setIsCreateModalVisible(false)
                setListSpinnerLoading(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error details:", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setSpinnerLoading(false);
        }
    };


    //update notice
    const handleUpdate = async (e) => {
        setUpdateSpinnerLoading(true);
        e.preventDefault();
        try {
            const updateNoticeData = new FormData();
            updateNoticeData.append("title", updatedTitle);
            updateNoticeData.append("noticeInfo", updatedNoticeInfo);
            if (updatedNoticeImg) {
                updateNoticeData.append("photo", updatedNoticeImg);
            }
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/notice/update-notice/${selected._id}`, updateNoticeData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
            setUpdateSpinnerLoading(false);
            if (data?.success) {
                toast.success(data?.message);
                getAllNotices();
                // Clear form fields after submit
                setUpdatedTitle('');
                setUpdatedNoticeInfo('');
                setUpdatedNoticeImg('');
                setVisible(false);
                setListSpinnerLoading(false);
            } else {
                toast.success(data.message);
                setUpdateSpinnerLoading(false);
            }
        } catch (error) {
            console.error("Error details:", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
                setUpdateSpinnerLoading(false);
            } else {
                toast.error("Something went wrong");
                setUpdateSpinnerLoading(false);
            }
        }
    };

    // Open modal with selected result data
    const openModal = (notice) => {
        setVisible(true);
        setSelected(notice);
        setNoticeId(notice._id);
        setUpdatedTitle(notice.title);
        setUpdatedNoticeInfo(notice.noticeInfo);
        setUpdatedNoticeImg(notice.noticeImg);
    };

    // Filter notice based on search query
    const filteredNotice = notice.filter(n =>
        n?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n?.grade?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    //delete individual notice
    const handleDelete = async (nId) => {
        let answer = window.confirm("Are you sure want to delete this notice?")
        if (!answer) return;
        const loadingToastId = toast.loading('Deleting notice...');
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/notice/delete-notice/${nId}`);
            if (data.success) {
                toast.success(data.message, { id: loadingToastId });
                getAllNotices();
            } else {
                toast.error(data.message, { id: loadingToastId })
            }
        } catch (error) {
            toast.error('Something wrong while delete', { id: loadingToastId })
        }
    }

    //delete selected notices
    const handleDeleteSelected = async () => {
        let answer = window.confirm("Are you sure you want to delete the selected notice?");
        if (!answer) return;
        const loadingToastId = toast.loading('Deleting notices...');
        try {
            await Promise.all(selectedNotice.map(async (nId) => {
                await axios.delete(`${process.env.REACT_APP_API}/api/v1/notice/delete-notice/${nId}`);
            }));
            toast.success('Selected notices deleted successfully', { id: loadingToastId });
            setSelectedNotice([]);
            getAllNotices();
        } catch (error) {
            toast.error('Something went wrong while deleting', { id: loadingToastId });
        }
    };

    // Handle selecting all notices
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allNoticeIds = filteredNotice.map(n => n._id);
            setSelectedNotice(allNoticeIds);
        } else {
            setSelectedNotice([]);
        }
    };

    // Handle selecting individual notice
    const handleSelectNotice = (nId) => {
        if (selectedNotice.includes(nId)) {
            setSelectedNotice(selectedNotice.filter(id => id !== nId));
        } else {
            setSelectedNotice([...selectedNotice, nId]);
        }
    };

    // Handle Escape key functionality
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                // Clear search bar
                setSearchQuery('');
                // Clear selected notice
                setSelectedNotice([]);
            }
        };
        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);


    return (
        <Layout title={"Admin - Create Notice"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3"><AdminMenu /></div>
                    <div className="col-md-9">
                        <h2 className='text-center my-3'>Create Notice</h2>
                        <div className='d-flex justify-content-between mb-3'>
                            <input
                                type="text"
                                placeholder='Search'
                                className='form-control mx-1'
                                style={{ flexBasis: '50%' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" onClick={() => setIsCreateModalVisible(true)} className="btn btn-success fw-bold mx-1 py-2 px-4">
                                <i className="fa-solid fa-plus"></i> Create Notice
                            </button>
                            {selectedNotice.length > 0 && (
                                <button onClick={handleDeleteSelected} className="btn btn-danger fw-bold mx-1 py-2 floating-delete-button">
                                    <i className="fa-solid fa-trash-can"></i> Delete Selected
                                </button>
                            )}

                            <Modal width={650} visible={createModalVisible} onCancel={() => setIsCreateModalVisible(false)} footer={null}>
                                <h5 className='text-center'>Create Notice</h5>
                                <form onSubmit={handleCreate}>
                                    <div>
                                        <div className="mb-3">
                                            <h6 className='text-center my-3'>Maximum Photo size is 3 MB</h6>
                                            {noticeImg && (
                                                <div className="text-center">
                                                    <img src={typeof noticeImg === 'string' ? noticeImg : URL.createObjectURL(noticeImg)} alt='profile-img' height={'200px'} className='img img-responsive' />
                                                    <h6 className='mt-3'>
                                                        {`${(noticeImg.size / 1048576).toFixed(2)} MB`}
                                                    </h6>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mb-3 text-center">
                                            <label className="btn btn-outline-secondary col-md-12">
                                                {noticeImg ? (typeof noticeImg === 'string' ? 'Change Photo' : noticeImg.name) : "Upload Photo"}
                                                <input
                                                    type="file"
                                                    name="photo"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        setNoticeImg(e.target.files[0]);
                                                    }}
                                                    hidden
                                                />

                                            </label>
                                        </div>
                                    </div>
                                    <Alert
                                        className='m-3'
                                        message={
                                            <>
                                                <span className='fw-bold'>Do not enter GRADE if you want to set Notice for ALL</span>
                                            </>
                                        }
                                        type="warning"
                                        showIcon
                                    />
                                    <div className="mt-4 d-lg-flex">
                                        <Select bordered={false}
                                            placeholder="Select Grade"
                                            size='large'
                                            className='form-select mb-3 me-2'
                                            value={grade || undefined}
                                            onChange={(value) => { setGrade(value) }}>
                                            {grades?.map(g => (
                                                <Option key={g._id} value={g._id}>{g.name}</Option>
                                            ))}
                                        </Select>
                                        <input
                                            type="text"
                                            placeholder='Title'
                                            className='form-control mb-3 me-2'
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)} required
                                        />
                                    </div>
                                    <div className="d-lg-flex">
                                        <textarea
                                            type="text"
                                            placeholder='Notice Message'
                                            className='form-control mb-3'
                                            value={noticeInfo}
                                            onChange={(e) => setNoticeInfo(e.target.value)} required
                                        />
                                    </div>
                                    <div>

                                    </div>
                                    <div className=" text-center">
                                        <button type="submit" className="btn btn-warning fw-bold mt-2">
                                            {spinnerLoading ? <Spinner /> : "Create Notice"}
                                        </button>
                                    </div>
                                </form>
                            </Modal>
                        </div>
                        {
                            selectedNotice.length > 0 ?
                                <h6 className='d-flex justify-content-start'>{selectedNotice.length} selected</h6> :
                                <h6 className='justify-content-start'> Count: {filteredNotice.length}</h6>
                        }
                        <div className='table-container'>
                            {
                                listSpinnerLoading ? <div className="text-center m-5">
                                    <Spinner /> <p>Loading notices...</p>
                                </div> :
                                    <table className="table table-fixed-header">
                                        <thead className='table-dark'>
                                            <tr>
                                                <th className='ps-4'>
                                                    <input
                                                        className='form-check-input'
                                                        type="checkbox"
                                                        onChange={handleSelectAll}
                                                        checked={selectedNotice.length === filteredNotice.length && filteredNotice.length > 0}
                                                    />
                                                </th>
                                                <th>#</th>
                                                <th>Grade</th>
                                                <th>Title</th>
                                                <th>Notice</th>
                                                <th>Img</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredNotice.length === 0 ? (
                                                <tr>
                                                    <td colSpan="8" className="text-center">
                                                        <div className="my-5">
                                                            <h3 className='text-secondary'>No Notice Found</h3>
                                                            {searchQuery && (
                                                                <button
                                                                    onClick={() => setSearchQuery('')}
                                                                    className="btn btn-warning mt-2 fw-bold"
                                                                >
                                                                    <i className="fa-solid fa-xmark"></i> Reset Search
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredNotice.map((n, i) => (
                                                    <tr key={n._id}>
                                                        <td className='ps-4'>
                                                            <input
                                                                className='form-check-input'
                                                                type="checkbox"
                                                                checked={selectedNotice.includes(n._id)}
                                                                onChange={() => handleSelectNotice(n._id)}
                                                            />
                                                        </td>
                                                        <th scope='row'>{i + 1}</th>
                                                        <td>
                                                            {
                                                                n.grade ? n.grade.name : "Global"
                                                            }
                                                        </td>
                                                        <td>
                                                            <Tooltip title={`Created: ${moment(n.createdAt).format('llll')} Updated: ${moment(n.updatedAt).format('llll')}`}>
                                                                <span>{n?.title}</span>
                                                            </Tooltip>
                                                        </td>
                                                        <td>{n.noticeInfo.substring(0, 50)}</td>
                                                        <td>
                                                            <img style={{ width: "30px" }} src={n.noticeImg} alt="notice" />
                                                        </td>
                                                        <td className='d-flex'>
                                                            <button className='btn btn-primary mx-1' onClick={() => { openModal(n) }}>
                                                                <i className="fa-solid fa-pen-to-square"></i> Edit
                                                            </button>
                                                            <button className="btn btn-danger fw-bold ms-1" onClick={() => handleDelete(n._id)}>
                                                                <i className="fa-solid fa-trash-can"></i> Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Modal onCancel={() => setVisible(false)} visible={visible} footer={null}>
                <h5 className='text-center'>Update Notice</h5>
                <form onSubmit={handleUpdate}>
                    <div>
                        <div className="mb-3">
                            <h6 className='text-center my-3'>Maximum Photo size is 3 MB</h6>
                            {updatedNoticeImg && (
                                <div className="text-center">
                                    <img src={typeof updatedNoticeImg === 'string' ? updatedNoticeImg : URL.createObjectURL(updatedNoticeImg)} alt='notice-img' height={'200px'} className='img img-responsive' />
                                    <h6 className='mt-3'>
                                        {updatedNoticeImg?.size && `${(updatedNoticeImg.size / 1048576).toFixed(2)} MB`}
                                    </h6>
                                </div>
                            )}
                        </div>
                        <div className="mb-3 text-center">
                            <label className="btn btn-outline-secondary col-md-12">
                                {updatedNoticeImg ? (typeof updatedNoticeImg === 'string' ? 'Change Photo' : updatedNoticeImg.name) : "Upload Photo"}
                                <input
                                    type="file"
                                    name="photo"
                                    accept="image/*"
                                    onChange={(e) => setUpdatedNoticeImg(e.target.files[0])}
                                    hidden
                                />
                            </label>
                        </div>
                    </div>
                    <div className='text-center my-3'>
                        {
                            <h6>
                                {
                                    selected?.grade ? selected?.grade?.name : "For all students"
                                }
                            </h6>
                        }
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            placeholder='Subject'
                            className='form-control mb-3 me-2'
                            value={updatedTitle}
                            onChange={(e) => setUpdatedTitle(e.target.value)} required
                        />
                    </div>
                    <div className='mb-3'>
                        <textarea
                            type="text"
                            placeholder='Remark'
                            className='form-control mb-3'
                            value={updatedNoticeInfo}
                            onChange={(e) => setUpdatedNoticeInfo(e.target.value)} required
                        />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-warning fw-bold">
                            {updateSpinnerLoading ? <Spinner /> : "Update Notice"}
                        </button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default CreateNotice;